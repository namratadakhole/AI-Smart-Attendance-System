import sqlite3
import os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(PROJECT_DIR, "database")
os.makedirs(DATABASE_DIR, exist_ok=True)
DATABASE = os.path.join(DATABASE_DIR, "students.db")

def init_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
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
        image_folder TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    # Alter students table if email or password missing (in case table already existed without them)
    cursor.execute("PRAGMA table_info(students)")
    student_cols = [col[1] for col in cursor.fetchall()]
    if "email" not in student_cols:
        try:
            cursor.execute("ALTER TABLE students ADD COLUMN email TEXT")
        except Exception:
            pass
    if "password" not in student_cols:
        try:
            cursor.execute("ALTER TABLE students ADD COLUMN password TEXT")
        except Exception:
            pass

    # Create faculty table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS faculty (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        employee_id TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        registered_on TEXT NOT NULL
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

    # ==========================================
    # DATA MIGRATION SECTION
    # ==========================================
    import bcrypt

    # 1. Migrate student credentials from users table to students table
    cursor.execute("SELECT * FROM users WHERE role = 'student'")
    existing_users_students = cursor.fetchall()
    for row in existing_users_students:
        pwd = row["password"]
        # Hash if plain text
        if not pwd.startswith("$2b$"):
            pwd = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Check if student exists in students table
        cursor.execute("SELECT id FROM students WHERE LOWER(roll_no) = LOWER(?)", (row["roll_no"],))
        student_match = cursor.fetchone()
        if student_match:
            cursor.execute("UPDATE students SET email = ?, password = ? WHERE id = ?", (row["email"], pwd, student_match[0]))
        else:
            # Insert full student record if missing
            cursor.execute("""
                INSERT INTO students (full_name, roll_no, department, semester, email, password, registered_on, image_folder)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (row["full_name"], row["roll_no"], row["department"], row["semester"] or "7", row["email"], pwd, row["registered_on"], f"dataset/{row['full_name']}"))

    # 2. Migrate faculty credentials from users table to faculty table
    cursor.execute("SELECT * FROM users WHERE role = 'professor' OR role = 'faculty'")
    existing_users_faculty = cursor.fetchall()
    for row in existing_users_faculty:
        pwd = row["password"]
        if not pwd.startswith("$2b$"):
            pwd = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        emp_id = row["employee_id"] or f"EMP_{row['id']}"
        cursor.execute("SELECT id FROM faculty WHERE LOWER(employee_id) = LOWER(?)", (emp_id,))
        faculty_match = cursor.fetchone()
        if not faculty_match:
            cursor.execute("""
                INSERT INTO faculty (full_name, employee_id, department, email, password, registered_on)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (row["full_name"], emp_id, row["department"], row["email"], pwd, row["registered_on"]))

    # 3. Seed default Professor account if faculty table is empty
    cursor.execute("SELECT COUNT(*) FROM faculty")
    fac_cnt = cursor.fetchone()[0]
    if fac_cnt == 0:
        default_pwd = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute("""
            INSERT INTO faculty (full_name, employee_id, department, email, password, registered_on)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("Professor Sharma", "EMP101", "Computer Science & Engineering", "faculty@university.edu", default_pwd, "2026-07-20 12:00:00"))

    conn.commit()
    conn.close()

init_db()

def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn