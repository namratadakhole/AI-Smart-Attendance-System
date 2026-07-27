import logging
from functools import wraps
from flask import request, jsonify
import jwt
import time
from config import Config

# ==========================================
# 1. Structured Logging Setup
# ==========================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] in %(module)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("smart_attendance_backend")

# ==========================================
# 2. Response Standardization Helper
# ==========================================
def standard_response(success: bool, message: str, data=None, status_code=200):
    """
    Consistently structures all REST API JSON outputs.
    """
    response_body = {
        "success": success,
        "message": message
    }
    if data is not None:
        if isinstance(data, dict):
            response_body.update(data)
        else:
            response_body["data"] = data
            
    return jsonify(response_body), status_code

# ==========================================
# 3. Request Body Keys Validation Helper
# ==========================================
def validate_request_keys(*required_keys):
    """
    Decorator/helper to validate that all required JSON body fields exist.
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return standard_response(False, "Request body must be a valid JSON", status_code=400)
            
            data = request.json or {}
            missing_keys = [k for k in required_keys if k not in data]
            if missing_keys:
                return standard_response(
                    False, 
                    f"Missing required parameters: {', '.join(missing_keys)}", 
                    status_code=400
                )
            return f(*args, **kwargs)
        return wrapper
    return decorator

# ==========================================
# 4. JWT Authorization Token Decorators
# ==========================================
def token_required(f):
    """
    Decorator to protect routes using standard Bearer JWT validation.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header:
            try:
                # Expect 'Bearer <token>' format
                token = auth_header.split(" ")[1]
            except IndexError:
                return standard_response(False, "Invalid Authorization Header format. Use Bearer <token>", status_code=401)
        
        # Fallback to query params or custom header
        if not token:
            token = request.headers.get("x-access-token") or request.args.get("token")
            
        if not token:
            return standard_response(False, "Authentication token is missing", status_code=401)
            
        try:
            # Decode token using configured secret
            decoded_data = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            # Check expiration
            if decoded_data.get("exp") and decoded_data["exp"] < time.time():
                return standard_response(False, "Authentication token has expired", status_code=401)
                
            request.current_user = decoded_data
        except jwt.ExpiredSignatureError:
            return standard_response(False, "Authentication token has expired", status_code=401)
        except jwt.InvalidTokenError:
            return standard_response(False, "Authentication token is invalid or malformed", status_code=401)
            
        return f(*args, **kwargs)
    return decorated

def role_required(*allowed_roles):
    """
    Enforces authorization roles (e.g., 'faculty' or 'student') on protected routes.
    Must be placed after @token_required.
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            current_user = getattr(request, "current_user", None)
            if not current_user:
                return standard_response(False, "Unauthorized access: session context missing", status_code=401)
                
            user_role = current_user.get("role")
            if user_role not in allowed_roles:
                return standard_response(
                    False, 
                    f"Forbidden access: required roles: {', '.join(allowed_roles)}", 
                    status_code=403
                )
            return f(*args, **kwargs)
        return wrapper
    return decorator
