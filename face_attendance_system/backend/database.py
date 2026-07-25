import sqlite3
import os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(PROJECT_DIR, "database")
os.makedirs(DATABASE_DIR, exist_ok=True)
DATABASE = os.path.join(DATABASE_DIR, "students.db")

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Create students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        roll_no TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        semester TEXT NOT NULL,
        registered_on TEXT NOT NULL,
        image_folder TEXT NOT NULL
    )
    """)

    # Create attendance table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        roll_no TEXT NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL
    )
    """)

    # Create settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
    """)

    # Default Settings
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
        cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (k, v))

    # Create users table for role-based auth
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        employee_id TEXT,
        roll_no TEXT,
        department TEXT NOT NULL,
        semester TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        registered_on TEXT NOT NULL
    )
    """)

    # Create subjects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_code TEXT UNIQUE NOT NULL,
        subject_name TEXT NOT NULL,
        semester TEXT NOT NULL,
        department TEXT NOT NULL,
        faculty_id INTEGER
    )
    """)

    # Create student_subjects table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL
    )
    """)

    # Alter attendance table if subject_id or recognition_confidence missing
    cursor.execute("PRAGMA table_info(attendance)")
    columns = [col[1] for col in cursor.fetchall()]

    if "subject_id" not in columns:
        try:
            cursor.execute("ALTER TABLE attendance ADD COLUMN subject_id INTEGER")
        except Exception:
            pass

    if "recognition_confidence" not in columns:
        try:
            cursor.execute("ALTER TABLE attendance ADD COLUMN recognition_confidence TEXT")
        except Exception:
            pass

    # Seed Default Core Subjects if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM subjects")
    sub_cnt = cursor.fetchone()[0]

    if sub_cnt == 0:
        default_subs = [
            ("CS-501", "Data Structures & Algorithms", "7", "Computer Science & Engineering", 1),
            ("CS-502", "Operating Systems", "7", "Computer Science & Engineering", 1),
            ("CS-503", "Database Management Systems", "5", "Computer Science & Engineering", 1),
            ("AI-101", "Artificial Intelligence", "7", "Computer Science & Engineering", 1),
            ("CS-504", "Computer Networks", "7", "Computer Science & Engineering", 1),
            ("CS-505", "Software Engineering", "5", "Computer Science & Engineering", 1),
            ("EC-301", "Digital Signal Processing", "5", "Electronics & Communication", 1),
            ("ME-401", "Thermodynamics & Heat Transfer", "6", "Mechanical Engineering", 1),
            ("CE-201", "Structural Analysis & Design", "6", "Civil Engineering", 1),
        ]
        for code, name, sem, dept, fac in default_subs:
            cursor.execute("""
                INSERT OR IGNORE INTO subjects (subject_code, subject_name, semester, department, faculty_id)
                VALUES (?, ?, ?, ?, ?)
            """, (code, name, sem, dept, fac))

    conn.commit()
    conn.close()

init_db()

def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn