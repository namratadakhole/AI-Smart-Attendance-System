import cv2
import face_recognition
import pickle
import csv
import os
import numpy as np
from datetime import datetime

# ===========================
# Paths
# ===========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

ENCODINGS_FILE = os.path.join(
    PROJECT_DIR,
    "models",
    "encodings.pickle"
)

ATTENDANCE_FILE = os.path.join(
    PROJECT_DIR,
    "database",
    "attendance.csv"
)

# ===========================
# Load Encodings
# ===========================

with open(ENCODINGS_FILE, "rb") as f:
    data = pickle.load(f)

known_face_encodings = data["encodings"]
known_face_names = data["names"]

marked_attendance = set()

# ===========================
# Attendance File
# ===========================

if not os.path.exists(ATTENDANCE_FILE):

    with open(ATTENDANCE_FILE, "w", newline="") as f:

        writer = csv.writer(f)

        writer.writerow([
            "Name",
            "Date",
            "Time"
        ])


# ===========================
# Recognize Frame
# ===========================

def recognize_frame(frame):

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb)

    face_encodings = face_recognition.face_encodings(
        rgb,
        face_locations
    )

    results = []

    for (top, right, bottom, left), encoding in zip(
        face_locations,
        face_encodings
    ):

        name = "Unknown"

        matches = face_recognition.compare_faces(
            known_face_encodings,
            encoding,
            tolerance=0.5
        )

        distances = face_recognition.face_distance(
            known_face_encodings,
            encoding
        )

        if len(distances) > 0:

            best = np.argmin(distances)

            if matches[best]:

                name = known_face_names[best]

        if name != "Unknown" and name not in marked_attendance:

            now = datetime.now()

            with open(
                ATTENDANCE_FILE,
                "a",
                newline=""
            ) as f:

                writer = csv.writer(f)

                writer.writerow([
                    name,
                    now.strftime("%d-%m-%Y"),
                    now.strftime("%H:%M:%S")
                ])

            marked_attendance.add(name)

            print("Attendance:", name)

        results.append({

            "name": name,

            "left": left,
            "top": top,
            "right": right,
            "bottom": bottom

        })

    return results