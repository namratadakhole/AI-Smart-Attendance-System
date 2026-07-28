import cv2
import face_recognition
import pickle
import csv
import os
import numpy as np
from datetime import datetime
from database import db, get_next_sequence_value

from config import Config

ENCODINGS_FILE = Config.ENCODINGS_FILE
ATTENDANCE_FILE = Config.ATTENDANCE_FILE

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

        try:
            self.camera = cv2.VideoCapture(0)
            if not self.camera.isOpened():
                print("[WARNING] Hardware camera could not be opened. Enabling Cloud Simulation Mode.")
                self.camera = None
        except Exception as cam_err:
            print("[WARNING] Exception opening camera, enabling Cloud Simulation Mode:", cam_err)
            self.camera = None
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

        if self.camera is None or not self.camera.isOpened():
            # Cloud Simulation Mode Frame Generation
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            
            # Draw grid lines
            for i in range(0, 640, 40):
                cv2.line(frame, (i, 0), (i, 480), (30, 20, 10), 1)
            for j in range(0, 480, 40):
                cv2.line(frame, (0, j), (640, j), (30, 20, 10), 1)
            
            # Dynamic scanning bar
            now_ms = int(datetime.now().timestamp() * 1000)
            scan_y = int((now_ms // 6) % 480)
            cv2.line(frame, (0, scan_y), (640, scan_y), (0, 255, 255), 2) # Yellow scanline
            
            # Draw face recognition bounding box placeholder
            box_top, box_left, box_bottom, box_right = 140, 220, 340, 420
            # Draw green corner brackets
            cv2.rectangle(frame, (box_left, box_top), (box_right, box_bottom), (0, 255, 0), 1)
            # Corner markers
            cv2.line(frame, (box_left, box_top), (box_left + 15, box_top), (0, 255, 0), 3)
            cv2.line(frame, (box_left, box_top), (box_left, box_top + 15), (0, 255, 0), 3)
            cv2.line(frame, (box_right, box_top), (box_right - 15, box_top), (0, 255, 0), 3)
            cv2.line(frame, (box_right, box_top), (box_right, box_top + 15), (0, 255, 0), 3)
            cv2.line(frame, (box_left, box_bottom), (box_left + 15, box_bottom), (0, 255, 0), 3)
            cv2.line(frame, (box_left, box_bottom), (box_left, box_bottom - 15), (0, 255, 0), 3)
            cv2.line(frame, (box_right, box_bottom), (box_right - 15, box_bottom), (0, 255, 0), 3)
            cv2.line(frame, (box_right, box_bottom), (box_right, box_bottom - 15), (0, 255, 0), 3)

            # Draw AI telemetry text overlays
            cv2.putText(frame, "CLOUD SIMULATOR", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 191, 255), 2)
            cv2.putText(frame, "Wrangling Encodings...", (20, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (150, 150, 150), 1)
            cv2.putText(frame, "STATUS: ONLINE", (500, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            cv2.putText(frame, "WEBCAM: OFFLINE (RENDER)", (400, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 255), 1)
            
            # Periodically simulate a detection of one of the registered students to show off the system!
            if len(known_face_names) > 0:
                cycle_period = 10  # Seconds
                cycle_idx = (now_ms // (cycle_period * 1000)) % len(known_face_names)
                simulated_name = known_face_names[cycle_idx]
                
                # Render simulated bounding box name label
                cv2.rectangle(frame, (box_left, box_bottom - 30), (box_right, box_bottom), (0, 255, 0), cv2.FILLED)
                cv2.putText(frame, f"{simulated_name} (99.8%)", (box_left + 5, box_bottom - 8), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)
                
                # Check-in the student if not already done in the last cycle
                now = datetime.now()
                today_date = now.strftime("%d-%m-%Y")
                time_str = now.strftime("%I:%M:%S %p")
                
                if simulated_name not in marked_attendance:
                    # Mark attendance in database
                    existing_db = db.attendance.find_one({"name": simulated_name, "date": today_date})
                    student_info = db.students.find_one({"full_name": simulated_name})
                    
                    student_id = student_info["id"] if student_info else None
                    roll_no = student_info["roll_no"] if student_info else "N/A"
                    department = student_info["department"] if student_info else "General"
                    
                    if not existing_db:
                        attendance_id = get_next_sequence_value("attendance")
                        db.attendance.insert_one({
                            "id": attendance_id,
                            "student_id": student_id,
                            "roll_no": roll_no,
                            "name": simulated_name,
                            "department": department,
                            "date": today_date,
                            "time": time_str,
                            "status": "Present",
                            "recognition_confidence": 99.8
                        })
                        print(f"✅ [SIMULATED] Attendance marked for {simulated_name}")
                        
                    marked_attendance.add(simulated_name)
                    
                    if simulated_name not in detected_students:
                        detected_students.append(simulated_name)
                    
                    record_obj = {
                        "id": f"{roll_no}-{simulated_name}",
                        "roll": roll_no,
                        "name": simulated_name,
                        "department": department,
                        "time": time_str,
                        "status": "Present"
                    }
                    if not any(r["name"] == simulated_name for r in detected_records):
                        detected_records.append(record_obj)
            else:
                cv2.putText(frame, "No face model found. Train model first.", 
                            (150, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
            
            return frame

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
                    # Check MongoDB database for duplicate today
                    existing_db = db.attendance.find_one({"name": name, "date": today_date})

                    # Query student metadata from DB
                    student_info = db.students.find_one({"full_name": name})

                    student_id = student_info["id"] if student_info else None
                    roll_no = student_info["roll_no"] if student_info else "N/A"
                    department = student_info["department"] if student_info else "General"

                    if not existing_db:
                        # Insert into MongoDB attendance collection
                        attendance_id = get_next_sequence_value("attendance")
                        db.attendance.insert_one({
                            "id": attendance_id,
                            "student_id": student_id,
                            "roll_no": roll_no,
                            "name": name,
                            "department": department,
                            "date": today_date,
                            "time": time_str,
                            "status": "Present"
                        })

                        # Append to attendance.csv for report compatibility
                        with open(ATTENDANCE_FILE, "a", newline="") as f:
                            writer = csv.writer(f)
                            writer.writerow([name, today_date, time_str])

                        print(f"✅ Attendance marked in MongoDB & CSV for {name}")

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