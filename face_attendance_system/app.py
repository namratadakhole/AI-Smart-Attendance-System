import streamlit as st
import pandas as pd
import subprocess
import os
from datetime import datetime

# -------------------------------
# Page Configuration
# -------------------------------
st.set_page_config(
    page_title="AI Smart Attendance System",
    page_icon="🎓",
    layout="wide"
)

# -------------------------------
# Project Paths
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ATTENDANCE_FILE = os.path.join(
    BASE_DIR,
    "database",
    "attendance.csv"
)

DATASET_DIR = os.path.join(
    BASE_DIR,
    "dataset"
)

# -------------------------------
# Sidebar
# -------------------------------
st.sidebar.title("🎓 Teacher Panel")

menu = st.sidebar.radio(
    "Navigation",
    [
        "🏠 Dashboard",
        "📋 Attendance Records",
        "ℹ About"
    ]
)

# ===============================
# Dashboard
# ===============================
if menu == "🏠 Dashboard":

    st.title("🎓 AI Smart Attendance Management System")

    st.write("Welcome Teacher 👋")

    st.divider()

    # ---------------------------
    # Buttons
    # ---------------------------

    c1, c2, c3 = st.columns(3)

    with c1:

        if st.button("📷 Register Student", use_container_width=True):

            subprocess.run(["python", "src/register_face.py"])

    with c2:

        if st.button("🧠 Train Face Model", use_container_width=True):

            subprocess.run(["python", "src/train_encodings.py"])

    with c3:

        if st.button("🟢 Start Attendance", use_container_width=True):

            subprocess.run(["python", "src/recognize_attendance.py"])

    st.divider()

    st.subheader("📊 Live Statistics")

    # ---------------------------
    # Registered Students
    # ---------------------------

    total_students = 0

    if os.path.exists(DATASET_DIR):

        total_students = len([
            folder
            for folder in os.listdir(DATASET_DIR)
            if os.path.isdir(os.path.join(DATASET_DIR, folder))
        ])

    # ---------------------------
    # Attendance Statistics
    # ---------------------------

    present_today = 0
    total_records = 0

    today = datetime.now().strftime("%Y-%m-%d")

    if os.path.exists(ATTENDANCE_FILE):

        df = pd.read_csv(ATTENDANCE_FILE)

        total_records = len(df)

        if "Date" in df.columns:

            present_today = len(df[df["Date"] == today])

    absent_today = max(total_students - present_today, 0)

    # ---------------------------
    # Metrics
    # ---------------------------

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("👨‍🎓 Registered Students", total_students)

    with col2:
        st.metric("✅ Present Today", present_today)

    with col3:
        st.metric("❌ Absent Today", absent_today)

    with col4:
        st.metric("📝 Total Records", total_records)

    st.divider()

    if os.path.exists(ATTENDANCE_FILE):
        st.success("✅ Attendance database is ready.")
    else:
        st.error("❌ Attendance file not found.")

# ===============================
# Attendance Records
# ===============================

elif menu == "📋 Attendance Records":

    st.title("📋 Attendance Records")

    if os.path.exists(ATTENDANCE_FILE):

        df = pd.read_csv(ATTENDANCE_FILE)

        st.write(f"### Total Records : {len(df)}")

        st.dataframe(
            df,
            use_container_width=True
        )

        with open(ATTENDANCE_FILE, "rb") as file:

            st.download_button(
                "⬇ Download Attendance CSV",
                data=file,
                file_name="attendance.csv",
                mime="text/csv"
            )

    else:

        st.warning("No attendance records found.")

# ===============================
# About
# ===============================

else:

    st.title("ℹ About Project")

    st.markdown("""
## AI Smart Attendance Management System

This project uses **Artificial Intelligence** and **Computer Vision**
to automatically recognize students and mark attendance.

### Technologies Used

- Python
- OpenCV
- face_recognition
- Streamlit
- NumPy
- Pandas

### Features

- Face Registration
- Face Recognition
- Automatic Attendance
- CSV Report Generation
- Teacher Dashboard

**Developed as a Computer Vision Project**
""")