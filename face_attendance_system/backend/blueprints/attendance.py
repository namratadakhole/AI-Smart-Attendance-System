from flask import Blueprint, request, jsonify, Response, send_file
from database import db
from utils import standard_response, token_required, role_required, validate_request_keys
from config import Config
from camera import camera_manager
from recognizer import recognize_frame
import camera
import cv2
import os
import base64
import numpy as np
import subprocess
import csv
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

attendance_bp = Blueprint("attendance", __name__)

def generate_frames():
    while camera_manager.running:
        frame = camera_manager.get_frame()
        if frame is None:
            continue

        success, buffer = cv2.imencode(".jpg", frame)
        if not success:
            continue

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' +
            buffer.tobytes() +
            b'\r\n'
        )
    print("Video stream stopped.")

@attendance_bp.route("/start-attendance", methods=["POST"])
@token_required
@role_required("professor")
def start_attendance():
    if not camera_manager.running:
        camera_manager.start()
    return standard_response(True, "Attendance Started")

@attendance_bp.route("/stop-attendance", methods=["POST"])
@token_required
@role_required("professor")
def stop_attendance():
    camera_manager.stop()
    return standard_response(True, "Attendance Stopped")

@attendance_bp.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

@attendance_bp.route("/detected_students")
@token_required
def get_detected_students():
    return jsonify({
        "students": camera.detected_students,
        "records": camera.detected_records
    })

@attendance_bp.route("/attendance-records", methods=["GET"])
@token_required
def get_attendance_records():
    search = request.args.get("search", "").strip().lower()
    department = request.args.get("department", "all")
    semester = request.args.get("semester", "all")
    filter_date = request.args.get("date", "").strip()
    sort_order = request.args.get("sort", "desc").lower()

    # Query with lookup (left join on student_id)
    pipeline = []
    
    # 1. Join with students
    pipeline.append({
        "$lookup": {
            "from": "students",
            "localField": "student_id",
            "foreignField": "id",
            "as": "student"
        }
    })
    pipeline.append({
        "$unwind": {
            "path": "$student",
            "preserveNullAndEmptyArrays": True
        }
    })

    # 2. Build match conditions
    match = {}
    if department != "all" and department:
        match["department"] = department
    if semester != "all" and semester:
        match["student.semester"] = str(semester)
    if filter_date:
        match["date"] = filter_date
    if search:
        match["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"roll_no": {"$regex": search, "$options": "i"}}
        ]
    
    if match:
        pipeline.append({"$match": match})

    # 3. Project output fields
    pipeline.append({
        "$project": {
            "_id": 0,
            "id": "$id",
            "student_id": "$student_id",
            "roll_no": "$roll_no",
            "name": "$name",
            "department": "$department",
            "date": "$date",
            "time": "$time",
            "status": "$status",
            "subject_id": "$subject_id",
            "recognition_confidence": "$recognition_confidence",
            "semester": "$student.semester"
        }
    })

    # 4. Sort
    sort_dir = -1 if sort_order == "desc" else 1
    pipeline.append({"$sort": {"id": sort_dir}})

    records = list(db.attendance.aggregate(pipeline))

    # Calculate Total Unique Class Days
    unique_dates = db.attendance.distinct("date")
    total_dates = len(unique_dates) if len(unique_dates) > 0 else 1

    # Calculate Per-Student Attendance Summary & Percentages
    all_students = list(db.students.find({}, {"_id": 0}))

    student_summaries = []
    for st in all_students:
        s_id = st["id"]
        s_name = st["full_name"]
        s_roll = st["roll_no"]
        s_dept = st["department"]

        # History of attendance
        st_history = list(db.attendance.find({"name": s_name}, {"_id": 0}).sort("id", -1))
        present_days = len(st_history)
        pct = round((present_days / total_dates) * 100, 1)

        student_summaries.append({
            "id": s_id,
            "name": s_name,
            "roll": s_roll,
            "department": s_dept,
            "semester": st.get("semester"),
            "present_days": present_days,
            "total_days": total_dates,
            "percentage": f"{min(pct, 100.0)}%",
            "pct_number": min(pct, 100.0),
            "history": st_history
        })

    return jsonify({
        "records": records,
        "student_summaries": student_summaries
    })

@attendance_bp.route("/recognize", methods=["POST"])
@token_required
@validate_request_keys("image")
def recognize():
    try:
        data = request.json
        image_data = data["image"]

        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        np_array = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        results = recognize_frame(frame)
        return jsonify({
            "success": True,
            "faces": results
        })
    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "faces": []
        })

@attendance_bp.route("/train-model", methods=["POST"])
@token_required
@role_required("professor")
def train_model():
    try:
        subprocess.run(
            [
                "python",
                os.path.join(Config.PROJECT_DIR, "src", "train_encodings.py")
            ],
            check=True
        )

        return standard_response(True, "Model Trained Successfully")
    except Exception as e:
        return standard_response(False, str(e), status_code=500)

@attendance_bp.route("/status")
def status():
    return jsonify({
        "running": camera_manager.running,
        "detected_students": camera.detected_students
    })

@attendance_bp.route("/debug")
def debug():
    return jsonify({
        "running": camera_manager.running,
        "detected_students": camera.detected_students
    })

@attendance_bp.route("/export-attendance", methods=["POST"])
@token_required
@role_required("professor")
def export_attendance():
    wb = Workbook()
    ws = wb.active
    ws.title = "Attendance Report"

    ws.append([
        "Roll No",
        "Student Name",
        "Department",
        "Status"
    ])

    # Dynamic student list from MongoDB
    db_students = [{"roll": s["roll_no"], "name": s["full_name"], "department": s["department"]} for s in db.students.find()]

    # Students who attended
    present = set(camera.marked_attendance)

    for student in db_students:
        status_val = "Present" if student["name"] in present else "Absent"
        ws.append([
            student["roll"],
            student["name"],
            student["department"],
            status_val
        ])

    filename = os.path.join(
        Config.PROJECT_DIR,
        "database",
        "Attendance_Report.xlsx"
    )

    wb.save(filename)
    return jsonify({
        "status": "success",
        "file": filename
    })

@attendance_bp.route("/download-attendance")
def download_attendance():
    attendance_file = Config.ATTENDANCE_FILE
    present_students = set()

    if os.path.exists(attendance_file):
        with open(attendance_file, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                present_students.add(row["Name"])

    db_students = [{"roll": s["roll_no"], "name": s["full_name"], "department": s["department"]} for s in db.students.find()]

    wb = Workbook()
    ws = wb.active
    ws.title = "Attendance Report"

    # Styles
    title_font = Font(size=18, bold=True)
    subtitle_font = Font(size=14, bold=True)
    heading_font = Font(size=12, bold=True)
    header_font = Font(bold=True, color="FFFFFF")

    header_fill = PatternFill(
        fill_type="solid",
        start_color="1F4E78",
        end_color="1F4E78"
    )

    green_fill = PatternFill(
        fill_type="solid",
        start_color="C6EFCE",
        end_color="C6EFCE"
    )

    red_fill = PatternFill(
        fill_type="solid",
        start_color="FFC7CE",
        end_color="FFC7CE"
    )

    center = Alignment(horizontal="center")
    thin = Side(style="thin")
    border = Border(
        left=thin,
        right=thin,
        top=thin,
        bottom=thin
    )

    # Title
    ws.merge_cells("A1:F1")
    ws["A1"] = "GOVERNMENT COLLEGE OF ENGINEERING NAGPUR"
    ws["A1"].font = title_font
    ws["A1"].alignment = center

    ws.merge_cells("A2:F2")
    ws["A2"] = "AI SMART ATTENDANCE SYSTEM"
    ws["A2"].font = subtitle_font
    ws["A2"].alignment = center

    # Report Details
    now = datetime.now()

    ws["A4"] = "Department"
    ws["B4"] = "Computer Science Engineering"
    ws["D4"] = "Faculty"
    ws["E4"] = "Dr. A. Sharma"

    ws["A5"] = "Subject"
    ws["B5"] = "Artificial Intelligence"
    ws["D5"] = "Semester"
    ws["E5"] = "VII"

    ws["A6"] = "Date"
    ws["B6"] = now.strftime("%d-%m-%Y")
    ws["D6"] = "Time"
    ws["E6"] = now.strftime("%H:%M:%S")

    for cell in ["A4","D4","A5","D5","A6","D6"]:
        ws[cell].font = heading_font

    # Summary
    total_students = len(db_students)
    present_count = len(present_students)
    absent_count = max(total_students - present_count, 0)

    attendance_percentage = (
        round((present_count / total_students) * 100, 2)
        if total_students > 0
        else 0
    )

    ws["A8"] = "Total Students"
    ws["B8"] = total_students
    ws["C8"] = "Present"
    ws["D8"] = present_count
    ws["E8"] = "Absent"
    ws["F8"] = absent_count
    ws["A9"] = "Attendance %"
    ws["B9"] = f"{attendance_percentage}%"

    for cell in ["A8","C8","E8","A9"]:
        ws[cell].font = heading_font

    # Table Header
    headers = ["Roll No", "Student Name", "Department", "Status"]
    row_number = 11

    for col, text in enumerate(headers, start=1):
        cell = ws.cell(row=row_number, column=col)
        cell.value = text
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center
        cell.border = border

    # Student Records
    row = 12
    for student in db_students:
        status_val = "Present" if student["name"] in present_students else "Absent"

        ws.cell(row=row, column=1).value = student["roll"]
        ws.cell(row=row, column=2).value = student["name"]
        ws.cell(row=row, column=3).value = student["department"]
        ws.cell(row=row, column=4).value = status_val

        fill = green_fill if status_val == "Present" else red_fill

        for col in range(1, 5):
            cell = ws.cell(row=row, column=col)
            cell.fill = fill
            cell.border = border
            cell.alignment = center
        row += 1

    # Column Widths
    ws.column_dimensions["A"].width = 15
    ws.column_dimensions["B"].width = 35
    ws.column_dimensions["C"].width = 30
    ws.column_dimensions["D"].width = 18
    ws.column_dimensions["E"].width = 18
    ws.column_dimensions["F"].width = 18

    # Footer
    row += 2
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=6)
    footer = ws.cell(row=row, column=1)
    footer.value = "Generated by AI Smart Attendance System"
    footer.font = Font(italic=True)
    footer.alignment = center

    report_path = os.path.join(
        Config.PROJECT_DIR,
        "database",
        "Attendance_Report.xlsx"
    )

    wb.save(report_path)
    return send_file(report_path, as_attachment=True)

@attendance_bp.route("/attendance/start-session", methods=["POST"])
@token_required
@role_required("professor")
@validate_request_keys("subject_id")
def start_attendance_session():
    data = request.json
    subject_id = data.get("subject_id")
    department = data.get("department", "Computer Science & Engineering")
    semester = data.get("semester", "7")

    if not camera_manager.running:
        camera_manager.start(subject_id=subject_id, department=department, semester=semester)

    return jsonify({
        "status": "success",
        "message": f"Attendance Session Started for Subject ID: {subject_id}",
        "session": {
            "subject_id": subject_id,
            "department": department,
            "semester": semester
        }
    })

@attendance_bp.route("/recognize-upload", methods=["POST"])
@token_required
def recognize_upload():
    if "image" not in request.files:
        return standard_response(False, "No image file uploaded")

    file = request.files["image"]
    subject_id = request.form.get("subject_id")
    department = request.form.get("department", "Computer Science & Engineering")
    semester = request.form.get("semester", "7")

    try:
        # Decode image
        file_bytes = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if frame is None:
            return standard_response(False, "Failed to decode uploaded image")

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        import face_recognition
        face_locations = face_recognition.face_locations(rgb)
        face_encodings = face_recognition.face_encodings(rgb, face_locations)

        if len(face_encodings) == 0:
            return standard_response(False, "No faces detected in the uploaded photo.")

        camera.reload_encodings()

        results = []
        for face_encoding in face_encodings:
            name = "Unknown"
            confidence_pct = 0.0

            if len(camera.known_face_encodings) > 0:
                matches = face_recognition.compare_faces(camera.known_face_encodings, face_encoding, tolerance=0.5)
                distances = face_recognition.face_distance(camera.known_face_encodings, face_encoding)

                if len(distances) > 0:
                    best_match = np.argmin(distances)
                    if matches[best_match]:
                        name = camera.known_face_names[best_match]
                        dist = distances[best_match]
                        confidence_pct = round(max(0, (1.0 - dist)) * 100, 1)

            if name != "Unknown":
                now = datetime.now()
                today_date = now.strftime("%d-%m-%Y")
                time_str = now.strftime("%I:%M:%S %p")

                # Check duplicate
                existing_db = db.attendance.find_one({"name": name, "date": today_date})
                student_info = db.students.find_one({"full_name": name})

                student_id = student_info["id"] if student_info else None
                roll_no = student_info["roll_no"] if student_info else "N/A"
                dept = student_info["department"] if student_info else department

                if not existing_db:
                    from database import get_next_sequence_value
                    attendance_id = get_next_sequence_value("attendance")
                    db.attendance.insert_one({
                        "id": attendance_id,
                        "student_id": student_id,
                        "roll_no": roll_no,
                        "name": name,
                        "department": dept,
                        "date": today_date,
                        "time": time_str,
                        "status": "Present",
                        "recognition_confidence": confidence_pct
                    })

                results.append({
                    "name": name,
                    "roll": roll_no,
                    "department": dept,
                    "time": time_str,
                    "confidence": confidence_pct,
                    "status": "Present",
                    "duplicate": existing_db is not None
                })
            else:
                results.append({
                    "name": "Unknown",
                    "roll": "N/A",
                    "confidence": 0.0,
                    "status": "Unknown",
                    "duplicate": False
                })

        return jsonify({
            "status": "success",
            "message": f"Processed {len(face_encodings)} face(s) in uploaded photo.",
            "results": results
        })
    except Exception as e:
        print("Error processing upload recognition:", e)
        return standard_response(False, f"Face recognition error: {str(e)}")
