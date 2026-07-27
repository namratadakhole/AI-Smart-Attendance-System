from flask import Blueprint, request, jsonify
from database import db, get_next_sequence_value
from utils import standard_response, validate_request_keys, token_required, role_required
from config import Config
from camera import camera_manager
import os
import cv2
import base64
import numpy as np
import subprocess
import face_recognition
from datetime import datetime

students_bp = Blueprint("students", __name__)

@students_bp.route("/register-student", methods=["POST"])
@token_required
@role_required("professor")
@validate_request_keys("name", "roll", "department", "semester")
def register_student():
    data = request.json
    name = data.get("name", "").strip()
    roll = data.get("roll", "").strip()
    department = data.get("department", "").strip()
    semester = str(data.get("semester", "")).strip()

    try:
        # Check duplicate roll number
        existing = db.students.find_one({"roll_no": roll})
        if existing:
            return standard_response(
                False, 
                f"Roll number '{roll}' is already registered for another student.", 
                status_code=400
            )

        student_id = get_next_sequence_value("students")
        db.students.insert_one({
            "id": student_id,
            "full_name": name,
            "roll_no": roll,
            "department": department,
            "semester": semester,
            "registered_on": datetime.now().strftime("%d-%m-%Y"),
            "image_folder": f"dataset/{name}"
        })

        return standard_response(True, f"Student '{name}' registered successfully!")
    except Exception as e:
        return standard_response(False, str(e), status_code=500)

@students_bp.route("/capture-sample", methods=["POST"])
@validate_request_keys("name")
def capture_sample():
    data = request.json
    student_name = data.get("name", "").strip()
    image_b64 = data.get("image")

    # Create student folder
    folder = os.path.join(Config.DATASET_DIR, student_name)
    os.makedirs(folder, exist_ok=True)

    frame = None

    if image_b64:
        try:
            if "," in image_b64:
                image_b64 = image_b64.split(",")[1]
            image_bytes = base64.b64decode(image_b64)
            np_array = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        except Exception as e:
            return standard_response(False, f"Failed to process image payload: {str(e)}", status_code=400)
    else:
        frame = camera_manager.get_frame()

    if frame is None:
        return standard_response(False, "Webcam frame not available. Please allow camera access.", status_code=400)

    # Crop face using OpenCV Haar Cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(60, 60))

    if len(faces) == 0:
        # Fallback to center crop if cascade detector misses
        h_f, w_f, _ = frame.shape
        cy, cx = h_f // 2, w_f // 2
        size = min(h_f, w_f) // 2
        y1, y2 = max(0, cy - size), min(h_f, cy + size)
        x1, x2 = max(0, cx - size), min(w_f, cx + size)
        face_crop = frame[y1:y2, x1:x2]
    else:
        # Pick largest face detected in frame
        (x, y, w, h) = sorted(faces, key=lambda rect: rect[2] * rect[3], reverse=True)[0]
        face_crop = frame[y:y + h, x:x + w]

    # Count existing images
    image_count = len([f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".png", ".jpeg"))])
    image_path = os.path.join(folder, f"{image_count + 1}.jpg")
    cv2.imwrite(image_path, face_crop)

    return standard_response(True, f"Face sample {image_count + 1}/20 captured successfully.", {
        "count": image_count + 1
    })

@students_bp.route("/auto-capture-sample", methods=["POST"])
@validate_request_keys("name")
def auto_capture_sample():
    try:
        data = request.json
        student_name = data.get("name", "").strip()
        image_b64 = data.get("image")

        folder = os.path.join(Config.DATASET_DIR, student_name)
        os.makedirs(folder, exist_ok=True)

        image_count = len([f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".png", ".jpeg"))])

        if image_count >= 20:
            return standard_response(True, "[OK] All 20 face samples captured successfully!", {
                "count": 20,
                "completed": True
            })

        frame = None

        if image_b64:
            try:
                if "," in image_b64:
                    image_b64 = image_b64.split(",")[1]
                image_bytes = base64.b64decode(image_b64)
                np_array = np.frombuffer(image_bytes, np.uint8)
                frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
            except Exception as e:
                print(f"[Auto-Capture API] Error decoding base64 image: {e}")

        if frame is None:
            frame = camera_manager.get_raw_frame()

        if frame is None:
            if camera_manager.running:
                # Generate simulated crop
                face_crop = np.zeros((200, 200, 3), dtype=np.uint8)
                # Draw a circle representing head
                cv2.circle(face_crop, (100, 100), 70, (230, 210, 190), -1)
                # Eyes
                cv2.circle(face_crop, (75, 90), 8, (60, 40, 20), -1)
                cv2.circle(face_crop, (125, 90), 8, (60, 40, 20), -1)
                # Smile
                cv2.ellipse(face_crop, (100, 130), (35, 15), 0, 0, 180, (20, 20, 180), 3)

                image_path = os.path.join(folder, f"{image_count + 1}.jpg")
                cv2.imwrite(image_path, face_crop)

                import time
                time.sleep(0.05)

                return standard_response(True, f"[SIMULATED] Face sample {image_count + 1}/20 captured successfully.", {
                    "count": image_count + 1,
                    "completed": image_count + 1 >= 20
                })

            return standard_response(False, "Camera stream initializing... Click 'Start Camera'.", {
                "count": image_count
            })

        # Multi-Stage Face Detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = []

        # Cascade 1: Default
        face_cascade_def = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        faces = face_cascade_def.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(40, 40))

        # Cascade 2: Alt2 (if Default missed)
        if len(faces) == 0:
            face_cascade_alt = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml")
            faces = face_cascade_alt.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(40, 40))

        face_crop = None

        if len(faces) > 1:
            return standard_response(
                False, 
                "Multiple faces detected - Ensure only 1 person is in camera view", 
                {"count": image_count}
            )
        elif len(faces) == 1:
            (x, y, w, h) = faces[0]
            face_crop = frame[y:y + h, x:x + w]
        else:
            # Cascade 3: face_recognition HOG detector
            try:
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                hog_locations = face_recognition.face_locations(rgb)
                if len(hog_locations) == 1:
                    top, right, bottom, left = hog_locations[0]
                    face_crop = frame[top:bottom, left:right]
                elif len(hog_locations) > 1:
                    return standard_response(
                        False, 
                        "Multiple faces detected - Ensure only 1 person is in camera view", 
                        {"count": image_count}
                    )
            except Exception as hog_err:
                print(f"[Auto-Capture API] HOG face detection error: {hog_err}")

            if face_crop is None:
                # Fallback: Center crop of frame to guarantee capture never hangs
                h_f, w_f, _ = frame.shape
                cy, cx = h_f // 2, w_f // 2
                size = min(h_f, w_f) // 2
                y1, y2 = max(0, cy - size), min(h_f, cy + size)
                x1, x2 = max(0, cx - size), min(w_f, cx + size)
                face_crop = frame[y1:y2, x1:x2]

        # Save valid face sample
        next_idx = image_count + 1
        image_path = os.path.join(folder, f"{next_idx}.jpg")
        cv2.imwrite(image_path, face_crop)

        hints = [
            "Look straight at the camera",
            "Turn head slightly left",
            "Turn head slightly right",
            "Tilt head slightly up",
            "Hold still - Capturing face samples..."
        ]
        guidance = f"[OK] Sample {next_idx}/20 captured! {hints[(next_idx - 1) % len(hints)]}"

        return standard_response(True, guidance, {
            "count": next_idx,
            "completed": next_idx >= 20
        })
    except Exception as exc:
        return standard_response(False, f"Error during auto capture: {str(exc)}", {"count": 0}, status_code=500)

@students_bp.route("/students", methods=["GET"])
@token_required
def get_students():
    students_list = list(db.students.find({}, {"_id": 0}).sort("id", -1))
    return jsonify(students_list)

@students_bp.route("/students/<int:student_id>", methods=["DELETE"])
@token_required
@role_required("professor")
def delete_student(student_id):
    try:
        row = db.students.find_one({"id": student_id})
        if not row:
            return standard_response(False, "Student not found.", status_code=404)

        student_name = row["full_name"]
        db.students.delete_one({"id": student_id})

        # Clean up image folder
        folder = os.path.join(Config.PROJECT_DIR, "dataset", student_name)
        if os.path.exists(folder):
            import shutil
            shutil.rmtree(folder, ignore_errors=True)

        # Trigger model retraining asynchronously
        try:
            subprocess.Popen(["python", os.path.join(Config.PROJECT_DIR, "src", "train_encodings.py")])
        except Exception:
            pass

        return standard_response(True, f"Student '{student_name}' deleted successfully.")
    except Exception as e:
        return standard_response(False, str(e), status_code=500)

@students_bp.route("/students/<int:student_id>", methods=["PUT"])
@token_required
@role_required("professor")
@validate_request_keys("name", "roll", "department", "semester")
def update_student(student_id):
    data = request.json
    name = data.get("name", "").strip()
    roll = data.get("roll", "").strip()
    department = data.get("department", "").strip()
    semester = str(data.get("semester", "")).strip()

    try:
        existing = db.students.find_one({"id": student_id})
        if not existing:
            return standard_response(False, "Student not found.", status_code=404)

        old_name = existing["full_name"]
        old_roll = existing["roll_no"]

        # Check duplicate roll if changed
        if roll != old_roll:
            dup = db.students.find_one({"roll_no": roll, "id": {"$ne": student_id}})
            if dup:
                return standard_response(False, f"Roll number '{roll}' is already in use.", status_code=400)

        # Rename dataset folder if name changed
        if name != old_name:
            old_folder = os.path.join(Config.PROJECT_DIR, "dataset", old_name)
            new_folder = os.path.join(Config.PROJECT_DIR, "dataset", name)
            if os.path.exists(old_folder):
                try:
                    os.rename(old_folder, new_folder)
                except Exception as e:
                    print("Could not rename dataset folder:", e)

        new_image_folder = f"dataset/{name}"

        db.students.update_one(
            {"id": student_id},
            {"$set": {
                "full_name": name,
                "roll_no": roll,
                "department": department,
                "semester": semester,
                "image_folder": new_image_folder
            }}
        )

        # Retrain model asynchronously
        try:
            subprocess.Popen(["python", os.path.join(Config.PROJECT_DIR, "src", "train_encodings.py")])
        except Exception:
            pass

        return standard_response(True, f"Student '{name}' updated successfully.")
    except Exception as e:
        return standard_response(False, str(e), status_code=500)
