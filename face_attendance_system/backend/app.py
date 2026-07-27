from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from utils import logger, standard_response
from database import db

# Import Blueprints
from blueprints.auth import auth_bp
from blueprints.students import students_bp
from blueprints.subjects import subjects_bp
from blueprints.attendance import attendance_bp
from blueprints.settings import settings_bp

def create_app():
    """Application Factory to configure and instantiate the Flask app."""
    app = Flask(__name__)
    
    # Centralized configuration mapping
    app.config.from_object(Config)

    # Dynamic CORS Configuration
    if Config.FRONTEND_URL != "*":
        CORS(
            app, 
            resources={r"/*": {
                "origins": Config.ALLOWED_ORIGINS, 
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
            }}
        )
    else:
        CORS(app)

    # Register Blueprint Modules
    app.register_blueprint(auth_bp)
    app.register_blueprint(students_bp)
    app.register_blueprint(subjects_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(settings_bp)

    # Root status endpoint
    @app.route("/")
    def home():
        return jsonify({
            "success": True,
            "message": "AI Smart Attendance Production Backend Running",
            "database_status": "Connected" if db is not None else "Disconnected"
        })

    # Global Exception Handling
    @app.errorhandler(Exception)
    def handle_global_exception(e):
        logger.error(f"Global unhandled exception: {str(e)}", exc_info=True)
        return standard_response(
            False, 
            f"An unexpected internal error occurred: {str(e)}", 
            status_code=500
        )

    return app

# Instantiate Flask app
app = create_app()

if __name__ == "__main__":
    logger.info(f"Starting server on port {Config.PORT}...")
    app.run(
        host="0.0.0.0",
        port=Config.PORT,
        threaded=True,
        debug=Config.DEBUG
    )