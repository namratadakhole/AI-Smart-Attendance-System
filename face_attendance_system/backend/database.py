from pymongo import MongoClient, ReturnDocument
from config import Config

# Connect to MongoDB with certifi CA bundle for secure SSL/TLS validation
try:
    import certifi
    tls_ca = certifi.where()
except ImportError:
    tls_ca = None

client = MongoClient(Config.MONGO_URI, tlsCAFile=tls_ca)
db = client.get_database()

def get_next_sequence_value(sequence_name):
    """
    Simulates auto-increment integer IDs using a counters collection in MongoDB.
    """
    sequence_document = db.counters.find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return sequence_document["sequence_value"]

def init_db():
    # Setup unique and sparse indexes
    db.students.create_index("roll_no", unique=True)
    db.students.create_index("email", unique=True, sparse=True)
    db.faculty.create_index("employee_id", unique=True)
    db.faculty.create_index("email", unique=True)
    db.subjects.create_index("subject_code", unique=True)
    db.settings.create_index("key", unique=True)

    # Seed Default Settings
    defaults = {
        "college_name": "Government Engineering College",
        "college_logo": "",
        "department": "Computer Science & Engineering",
        "faculty_name": "Professor Sharma",
        "subject": "CS-501 Advanced Algorithms",
        "semester": "7",
        "academic_year": "2025-2026",
        "attendance_threshold": "75"
    }
    for k, v in defaults.items():
        db.settings.update_one(
            {"key": k},
            {"$setOnInsert": {"key": k, "value": v}},
            upsert=True
        )

    # Seed Default Core Subjects if empty
    if db.subjects.count_documents({}) == 0:
        default_subs = [
            {"id": 1, "subject_code": "CS-501", "subject_name": "Data Structures & Algorithms", "semester": "7", "department": "Computer Science & Engineering", "faculty_id": 1},
            {"id": 2, "subject_code": "CS-502", "subject_name": "Operating Systems", "semester": "7", "department": "Computer Science & Engineering", "faculty_id": 1},
            {"id": 3, "subject_code": "CS-503", "subject_name": "Database Management Systems", "semester": "5", "department": "Computer Science & Engineering", "faculty_id": 1},
            {"id": 4, "subject_code": "AI-101", "subject_name": "Artificial Intelligence", "semester": "7", "department": "Computer Science & Engineering", "faculty_id": 1},
            {"id": 5, "subject_code": "CS-504", "subject_name": "Computer Networks", "semester": "7", "department": "Computer Science & Engineering", "faculty_id": 1},
            {"id": 6, "subject_code": "CS-505", "subject_name": "Software Engineering", "semester": "5", "department": "Computer Science & Engineering", "faculty_id": 1},
            {"id": 7, "subject_code": "EC-301", "subject_name": "Digital Signal Processing", "semester": "5", "department": "Electronics & Communication", "faculty_id": 1},
            {"id": 8, "subject_code": "ME-401", "subject_name": "Thermodynamics & Heat Transfer", "semester": "6", "department": "Mechanical Engineering", "faculty_id": 1},
            {"id": 9, "subject_code": "CE-201", "subject_name": "Structural Analysis & Design", "semester": "6", "department": "Civil Engineering", "faculty_id": 1},
        ]
        db.subjects.insert_many(default_subs)
        db.counters.update_one({"_id": "subjects"}, {"$set": {"sequence_value": 9}}, upsert=True)

    # Seed Default Professor Account if faculty table is empty
    if db.faculty.count_documents({}) == 0:
        import bcrypt
        default_pwd = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.faculty.insert_one({
            "id": 1,
            "full_name": "Professor Sharma",
            "employee_id": "EMP101",
            "department": "Computer Science & Engineering",
            "email": "faculty@university.edu",
            "password": default_pwd,
            "registered_on": "2026-07-20 12:00:00"
        })
        db.counters.update_one({"_id": "faculty"}, {"$set": {"sequence_value": 1}}, upsert=True)

# Run initialization
try:
    # Trigger connection to confirm credentials work
    client.server_info()
    print(f"[SUCCESS] MongoDB Atlas Connected! Database: '{db.name}'")
    init_db()
    print(f"[INFO] Seeding completed. Active collections: {db.list_collection_names()}")
except Exception as conn_err:
    print(f"[ERROR] Database connection failed: {conn_err}")
    raise conn_err