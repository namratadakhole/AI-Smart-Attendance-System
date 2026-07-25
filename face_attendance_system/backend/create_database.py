import sqlite3
import os

# Project path
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

# Database folder
db_folder = os.path.join(PROJECT_DIR, "database")
os.makedirs(db_folder, exist_ok=True)

# Database file
db_path = os.path.join(db_folder, "students.db")

# Connect
conn = sqlite3.connect(db_path)

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

conn.commit()
conn.close()

print("✅ students.db created/updated successfully with students, attendance, settings, & users tables!")
print("Location:", db_path)