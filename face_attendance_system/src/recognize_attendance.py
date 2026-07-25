import csv
from datetime import datetime
import cv2
import pickle
import face_recognition
import os
import numpy as np

# ===========================
# Get project directory
# ===========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

# ===========================
# Paths
# ===========================

ENCODINGS_FILE = os.path.join(PROJECT_DIR, "models", "encodings.pickle")

ATTENDANCE_DIR = os.path.join(PROJECT_DIR, "database")
ATTENDANCE_FILE = os.path.join(ATTENDANCE_DIR, "attendance.csv")

os.makedirs(ATTENDANCE_DIR, exist_ok=True)

# ===========================
# Load trained face encodings
# ===========================

with open(ENCODINGS_FILE, "rb") as file:
    data = pickle.load(file)

known_face_encodings = data["encodings"]
known_face_names = data["names"]

# ===========================
# Create attendance.csv
# ===========================

if not os.path.exists(ATTENDANCE_FILE):

    with open(ATTENDANCE_FILE, "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow(["Name", "Date", "Time"])

# ===========================
# Keep track of attendance
# ===========================

marked_attendance = set()

print("====================================")
print(" Face Attendance System Started")
print("====================================")
print(f"Known Faces : {len(known_face_names)}")
print("Press 'q' to quit")
print("====================================")

# ===========================
# Start Webcam
# ===========================

video_capture = cv2.VideoCapture(0)

while True:

    ret, frame = video_capture.read()

    if not ret:
        print("Could not access webcam.")
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_frame)

    face_encodings = face_recognition.face_encodings(
        rgb_frame,
        face_locations
    )

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):

        name = "Unknown"

        matches = face_recognition.compare_faces(
            known_face_encodings,
            face_encoding,
            tolerance=0.5
        )

        face_distances = face_recognition.face_distance(
            known_face_encodings,
            face_encoding
        )

        if len(face_distances) > 0:

            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                name = known_face_names[best_match_index]

        # ===========================
        # Mark Attendance
        # ===========================

        if name != "Unknown" and name not in marked_attendance:

            now = datetime.now()

            date = now.strftime("%d-%m-%Y")
            time = now.strftime("%H:%M:%S")

            with open(ATTENDANCE_FILE, "a", newline="") as file:

                writer = csv.writer(file)

                writer.writerow([name, date, time])

            marked_attendance.add(name)

            print(f"✓ Attendance Marked : {name}")

        # ===========================
        # Draw Face Rectangle
        # ===========================

        cv2.rectangle(
            frame,
            (left, top),
            (right, bottom),
            (0, 255, 0),
            2
        )

        # Draw name background
        cv2.rectangle(
            frame,
            (left, bottom - 35),
            (right, bottom),
            (0, 255, 0),
            cv2.FILLED
        )

        # Display name
        cv2.putText(
            frame,
            name,
            (left + 6, bottom - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 0),
            2
        )

    cv2.imshow("Face Attendance System", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

video_capture.release()
cv2.destroyAllWindows()

print("\nProgram Closed Successfully.")