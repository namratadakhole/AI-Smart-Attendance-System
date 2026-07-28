from flask import Blueprint, request, jsonify
from database import db, get_next_sequence_value
from utils import standard_response, validate_request_keys, token_required, role_required
from config import Config
import os
import io
import base64
from datetime import datetime
from PIL import Image, ImageDraw

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

    image_count = len([f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".png", ".jpeg"))])
    image_path = os.path.join(folder, f"{image_count + 1}.jpg")

    if image_b64:
        try:
            if "," in image_b64:
                image_b64 = image_b64.split(",")[1]
            image_bytes = base64.b64decode(image_b64)
            img = Image.open(io.BytesIO(image_bytes))
            
            # Center crop to square
            w_f, h_f = img.size
            size = min(w_f, h_f)
            left = (w_f - size) // 2
            top = (h_f - size) // 2
            right = (w_f + size) // 2
            bottom = (h_f + size) // 2
            img_cropped = img.crop((left, top, right, bottom))
            img_cropped = img_cropped.resize((200, 200), Image.Resampling.LANCZOS)
            img_cropped.save(image_path, "JPEG")
            
            return standard_response(True, f"Face sample {image_count + 1}/20 captured successfully.", {
                "count": image_count + 1
            })
        except Exception as e:
            return standard_response(False, f"Failed to process image payload: {str(e)}", status_code=400)
    else:
        # Save a simulated placeholder crop if no camera data was sent
        img = Image.new('RGB', (200, 200), color=(230, 210, 190))
        d = ImageDraw.Draw(img)
        d.ellipse([50, 70, 70, 90], fill=(60, 40, 20))
        d.ellipse([130, 70, 150, 90], fill=(60, 40, 20))
        d.arc([60, 110, 140, 150], start=0, end=180, fill=(20, 20, 180), width=3)
        img.save(image_path, "JPEG")
        
        return standard_response(True, f"[SIMULATED] Face sample {image_count + 1}/20 captured successfully.", {
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

        next_idx = image_count + 1
        image_path = os.path.join(folder, f"{next_idx}.jpg")

        if image_b64:
            try:
                if "," in image_b64:
                    image_b64 = image_b64.split(",")[1]
                image_bytes = base64.b64decode(image_b64)
                img = Image.open(io.BytesIO(image_bytes))
                
                # Center crop to square
                w_f, h_f = img.size
                size = min(w_f, h_f)
                left = (w_f - size) // 2
                top = (h_f - size) // 2
                right = (w_f + size) // 2
                bottom = (h_f + size) // 2
                img_cropped = img.crop((left, top, right, bottom))
                img_cropped = img_cropped.resize((200, 200), Image.Resampling.LANCZOS)
                img_cropped.save(image_path, "JPEG")
            except Exception as e:
                print(f"[Auto-Capture API] Error saving image: {e}")
                return standard_response(False, f"Image processing failed: {str(e)}", {"count": image_count})
        else:
            # Generate simulated crop
            img = Image.new('RGB', (200, 200), color=(230, 210, 190))
            d = ImageDraw.Draw(img)
            d.ellipse([50, 70, 70, 90], fill=(60, 40, 20))
            d.ellipse([130, 70, 150, 90], fill=(60, 40, 20))
            d.arc([60, 110, 140, 150], start=0, end=180, fill=(20, 20, 180), width=3)
            img.save(image_path, "JPEG")

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

        return standard_response(True, f"Student '{name}' updated successfully.")
    except Exception as e:
        return standard_response(False, str(e), status_code=500)
