import os
from dotenv import load_dotenv

# Resolve paths
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BACKEND_DIR, ".env")
load_dotenv(dotenv_path)

class Config:
    """Centralized Configuration settings for the Flask backend."""
    
    # Environment mode
    DEBUG = os.getenv("FLASK_ENV") == "development"
    PORT = int(os.getenv("PORT", 5000))
    
    # Database Config
    MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI") or "mongodb://localhost:27017/smart_attendance"
    
    # Security Configurations
    JWT_SECRET = os.getenv("JWT_SECRET", "smart-attendance-super-secret-key-2026")
    JWT_ACCESS_TOKEN_EXPIRES_SECS = 86400  # 24 hours
    
    # CORS Origin Configuration
    FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
    ALLOWED_ORIGINS = [
        FRONTEND_URL, 
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:3000"
    ] if FRONTEND_URL != "*" else ["*"]
    
    # File Paths
    DATASET_DIR = os.path.join(PROJECT_DIR, "dataset")
    ENCODINGS_FILE = os.path.join(PROJECT_DIR, "models", "encodings.pickle")
    ATTENDANCE_DIR = os.path.join(PROJECT_DIR, "database")
    ATTENDANCE_FILE = os.path.join(ATTENDANCE_DIR, "attendance.csv")
