# AI Smart Attendance System

An end-to-end, AI-powered facial recognition attendance system featuring secure role-based portals, automated face registration, live subject-wise session management, and real-time student analytics.

## 🚀 Features

### 🔐 1. Welcome & Role-Based Auth Portal
- Separate login portals for **Professors** and **Students**.
- Unauthorized dashboard redirects are fully prevented; users only see dashboards after successful authentication.

### 📸 2. Automated Face Registration
- **Hands-Free Capture**: No manual clicks required per image. Captures exactly 20 high-quality face samples.
- **Smart Quality Control**: Captures only when exactly one face is detected, clearly visible, and well-lit. Pauses automatically if face is lost, multiple faces appear, or images are blurry.
- **Real-Time Pose Feedback**: Guides the student to look straight, turn left, turn right, or tilt head up.

### 🏫 3. Live Subject-Wise Session Management
- Faculty can configure and start live attendance sessions by selecting a **Subject**, **Department**, and **Semester**.
- Restricts marking to eligible students belonging only to the selected department and semester.
- Real-time video preview detects and highlights faces, showing immediate attendance confirmation toasts.

### 📊 4. Interactive Student Dashboard
- **Live Statistics**: Attendance percentage, classes attended/missed, and remaining classes needed to meet the 75% eligibility threshold.
- **Subject-Wise Attendance Table**: Color-coded eligibility indicators:
  - `Eligible (≥75%)` (Green)
  - `Warning (60-74%)` (Orange)
  - `Critical (<60%)` (Red)
- **AI Analytics & Suggestions**: Dynamic charts showing monthly trend and subject comparison. Suggests personalized actions (e.g. *"You need 2 more AI classes to reach 75%"*).
- **Digital Identity QR Code**: Rendered QR code pass encoding Student ID, Roll, and Department as a backup check-in.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TanStack Router, Recharts, Lucide React, TailwindCSS/Vanilla CSS
- **Backend**: Python Flask, OpenCV, `face_recognition` library (dlib), SQLite3, `openpyxl` (Excel reports)
- **Database**: SQLite3 relational schema for students, users, subjects, and logs.

---

## 📁 Repository Structure

```
AI Smart Attendance System/
├── face_attendance_system/         # Backend Python Application
│   ├── backend/                    # Flask app, camera controls, database scripts
│   │   ├── database/               # SQLite database storage (students.db)
│   │   ├── app.py                  # Main Flask REST API server
│   │   ├── camera.py               # Video capture & database logging worker
│   │   ├── database.py             # SQLite table initializations
│   │   └── recognizer.py           # Face recognition embedding engine
│   ├── src/                        # Secondary execution scripts
│   └── models/                     # Pickle models for trained faces
│
├── smart-attend-face-ui/           # Frontend React Application
│   ├── src/
│   │   ├── routes/                 # TanStack routes (Dashboard, Attendance, Register)
│   │   ├── components/             # Reusable UI elements (Sidebar, Layouts)
│   │   └── api/                    # Axios API request clients
│   ├── package.json                # Frontend package dependencies
│   └── vite.config.ts              # Vite bundle configuration
│
├── .gitignore                      # Git ignore file
├── LICENSE                         # MIT License
├── README.md                       # Documentation file
└── requirements.txt                # Unified Python requirements
```

---

## 💻 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Set Up the Python Backend
1. Navigate to the backend directory:
   ```bash
   cd face_attendance_system
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
   *Note: On Windows, you may need to install the precompiled `dlib` wheel matching your Python version.*
4. Initialize the SQLite database and seed initial subjects:
   ```bash
   python backend/database.py
   ```
5. Run the Flask API server:
   ```bash
   python backend/app.py
   ```

### 2. Set Up the React Frontend
1. Navigate to the frontend directory:
   ```bash
   cd smart-attend-face-ui
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the Vite local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🔮 Future Enhancements
- Mobile Application with geofencing check-ins.
- Push Notifications and SMS alert integration for low attendance.
- Multi-camera classroom streams support.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
