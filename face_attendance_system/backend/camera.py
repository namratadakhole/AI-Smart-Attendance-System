import cv2
import face_recognition
import pickle
import csv
import os
import numpy as np
from datetime import datetime
from database import get_connection

# ===========================
# Paths
# ===========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

ENCODINGS_FILE = os.path.join(PROJECT_DIR, "models", "encodings.pickle")
ATTENDANCE_FILE = os.path.join(PROJECT_DIR, "database", "attendance.csv")

# ===========================
# Load Encodings
# ===========================

known_face_encodings = []
known_face_names = []

def reload_encodings():
    global known_face_encodings, known_face_names
    if os.path.exists(ENCODINGS_FILE):
        try:
            with open(ENCODINGS_FILE, "rb") as f:
                data = pickle.load(f)
                known_face_encodings = data.get("encodings", [])
                known_face_names = data.get("names", [])
                print(f"Loaded {len(known_face_names)} encodings.")
        except Exception as e:
            print("Error loading encodings pickle:", e)
            known_face_encodings = []
            known_face_names = []

reload_encodings()

# ===========================
# Attendance CSV Setup
# ===========================

if not os.path.exists(ATTENDANCE_FILE):
    os.makedirs(os.path.dirname(ATTENDANCE_FILE), exist_ok=True)
    with open(ATTENDANCE_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Date", "Time"])

# ===========================
# Global Session Memory
# ===========================

marked_attendance = set()
detected_records = []
detected_students = []

print("Attendance System Ready")


class Camera:

    def __init__(self):
        self.camera = None
        self.running = False
        self.active_subject_id = None
        self.active_department = None
        self.active_semester = None

    # --------------------------
    # Start Camera
    # --------------------------
    def start(self, subject_id=None, department=None, semester=None):

        global marked_attendance, detected_records, detected_students

        reload_encodings()
        marked_attendance.clear()
        detected_records.clear()
        detected_students.clear()

        self.active_subject_id = subject_id
        self.active_department = department
        self.active_semester = semester

        print(f"Attendance Session Initialized (Subject ID: {subject_id}, Dept: {department}, Sem: {semester})")

        if self.running:
            return

        self.camera = cv2.VideoCapture(0)
        print("Camera opened successfully:", self.camera.isOpened())
        self.running = True

    # --------------------------
    # Stop Camera
    # --------------------------
    def stop(self):

        global detected_records, detected_students

        detected_records.clear()
        detected_students.clear()

        self.running = False

        if self.camera is not None:
            self.camera.release()
            self.camera = None

        print("Camera Released & Session Cleared")

    # --------------------------
    # Read Raw Frame (Non-Blocking)
    # --------------------------
    def get_raw_frame(self):
        if self.camera is None or not self.running:
            return None

        if hasattr(self, 'latest_raw_frame') and self.latest_raw_frame is not None:
            return self.latest_raw_frame.copy()

        success, frame = self.camera.read()
        if success and frame is not None:
            self.latest_raw_frame = frame.copy()
            return frame.copy()

        return None

    # --------------------------
    # Read Frame
    # --------------------------
    def get_frame(self):

        global detected_records, detected_students, marked_attendance

        if self.camera is None:
            return None

        success, frame = self.camera.read()

        if not success or frame is None:
            return None

        self.latest_raw_frame = frame.copy()

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb)

        face_encodings = face_recognition.face_encodings(
            rgb,
            face_locations
        )

        for (top, right, bottom, left), face_encoding in zip(
            face_locations,
            face_encodings
        ):

            name = "Unknown"
            confidence_pct = 0.0

            if len(known_face_encodings) > 0:
                matches = face_recognition.compare_faces(
                    known_face_encodings,
                    face_encoding,
                    tolerance=0.5
                )

                distances = face_recognition.face_distance(
                    known_face_encodings,
                    face_encoding
                )

                if len(distances) > 0:
                    best_match = np.argmin(distances)
                    dist = distances[best_match]

                    if matches[best_match]:
                        name = known_face_names[best_match]
                        # Confidence score calculation
                        confidence_pct = round(max(0, (1.0 - dist)) * 100, 1)

            # --------------------------
            # Attendance Marking Logic
            # --------------------------

            if name != "Unknown":
                now = datetime.now()
                today_date = now.strftime("%d-%m-%Y")
                time_str = now.strftime("%I:%M:%S %p")

                if name not in marked_attendance:
                    # Check SQLite database for duplicate today
                    conn = get_connection()
                    cursor = conn.cursor()

                    cursor.execute(
                        "SELECT id FROM attendance WHERE name = ? AND date = ?",
                        (name, today_date)
                    )
                    existing_db = cursor.fetchone()

                    # Query student metadata from DB
                    cursor.execute(
                        "SELECT id, roll_no, department FROM students WHERE full_name = ?",
                        (name,)
                    )
                    student_info = cursor.fetchone()

                    student_id = student_info["id"] if student_info else None
                    roll_no = student_info["roll_no"] if student_info else "N/A"
                    department = student_info["department"] if student_info else "General"

                    if not existing_db:
                        # Insert into SQLite attendance table
                        cursor.execute(
                            """
                            INSERT INTO attendance
                            (student_id, roll_no, name, department, date, time, status)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                            """,
                            (student_id, roll_no, name, department, today_date, time_str, "Present")
                        )
                        conn.commit()

                        # Append to attendance.csv for report compatibility
                        with open(ATTENDANCE_FILE, "a", newline="") as f:
                            writer = csv.writer(f)
                            writer.writerow([name, today_date, time_str])

                        print(f"✅ Attendance marked in SQLite & CSV for {name}")

                    conn.close()

                    marked_attendance.add(name)

                    if name not in detected_students:
                        detected_students.append(name)

                    # Update live panel records list
                    record_obj = {
                        "id": f"{roll_no}-{name}",
                        "roll": roll_no,
                        "name": name,
                        "department": department,
                        "time": time_str,
                        "status": "Present"
                    }

                    if not any(r["name"] == name for r in detected_records):
                        detected_records.append(record_obj)

            # --------------------------
            # Draw Face Box & Overlay
            # --------------------------

            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
            label = f"{name} ({confidence_pct}%)" if name != "Unknown" else "Unknown"

            cv2.rectangle(
                frame,
                (left, top),
                (right, bottom),
                color,
                2
            )

            # Draw label background box
            cv2.rectangle(
                frame,
                (left, bottom - 30),
                (right, bottom),
                color,
                cv2.FILLED
            )

            cv2.putText(
                frame,
                label,
                (left + 5, bottom - 8),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (255, 255, 255),
                2
            )

        return frame


camera_manager = Camera()