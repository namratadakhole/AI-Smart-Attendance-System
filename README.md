# AI Smart Attendance System

An end-to-end, AI-powered facial recognition attendance system featuring secure role-based portals, automated face registration, live subject-wise session management, and real-time student analytics. Powered by MongoDB and OpenCV/dlib.

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
- **Backend**: Python Flask, OpenCV, `face_recognition` library (dlib), PyMongo (MongoDB Atlas), `openpyxl` (Excel reports)
- **Database**: MongoDB cloud schema for students, faculty, subjects, logs, and settings.

---

## 📁 Repository Structure

```
AI Smart Attendance System/
├── face_attendance_system/         # Backend Python Application
│   ├── backend/                    # Flask app, camera controls, database scripts
│   │   ├── app.py                  # Main Flask REST API server
│   │   ├── camera.py               # Video capture & database logging worker
│   │   ├── database.py             # MongoDB connection & collection seeding
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

## 💻 Installation & Setup (Local Development)

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
4. Set up your MongoDB Atlas connection string in `backend/.env`. If omitted, the app will fall back to your local MongoDB instance.
5. Initialize the MongoDB collections and seed initial subjects:
   ```bash
   python backend/database.py
   ```
6. Run the Flask API server:
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
3. Set your backend URL in `.env` (default is `http://127.0.0.1:5000`):
   ```env
   VITE_API_URL=http://127.0.0.1:5000
   ```
4. Run the Vite local development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🚀 Production Deployment Instructions

Deploying this hybrid AI facial recognition application requires understanding its runtime dependencies (e.g. CMake compilation for `dlib` and OpenCV camera hardware access). 

### 1. Deploying the Backend on Render (Web Service)
Because Render servers are headless and do not run on a physical user workstation, they lack direct camera hardware (`cv2.VideoCapture(0)`). There are two ways to deploy this backend:

#### Option A: Dedicated Server / Local Kiosk Setup (Recommended)
Run the backend locally on the workstation/workstation kiosk with webcam access, and expose the endpoint securely using a tunnel tool like **ngrok**:
```bash
ngrok http 5000
```
Point the frontend's `VITE_API_URL` to your ngrok URL (`https://xxxx.ngrok-free.app`).

#### Option B: Headless Deployment to Render (With Client-Side Postings)
If deploying the backend to Render:
1. Create a **Web Service** pointing to the repository.
2. Select the **Root Directory** as `face_attendance_system`.
3. Set the **Runtime** to `Python 3`.
4. Set the **Build Command** to:
   ```bash
   pip install -r requirements-prod.txt
   ```
5. Set the **Start Command** to:
   ```bash
   gunicorn --bind 0.0.0.0:$PORT --chdir backend app:app
   ```
6. Configure the following environment variables under **Environment**:
   - `MONGO_URI`: Your MongoDB Atlas Connection String
   - `JWT_SECRET`: A secure signing key for JWT tokens
   - `FRONTEND_URL`: The Vercel URL of your deployed frontend (for CORS restriction)
   - `PORT`: (Render sets this automatically)
7. *Note*: In a cloud-only deployment, the live video feed stream route (`/video_feed`) will not display local webcam feeds, but client-side photo registrations using the `/recognize` and `/auto-capture-sample` routes will work since they receive base64 photo payloads POSTed by the browser context.

### 2. Deploying the Frontend on Vercel
1. Log in to Vercel and import the project repository.
2. Set the **Framework Preset** to **Vite** or **Other**.
3. Set the **Root Directory** to `smart-attend-face-ui`.
4. Configure the **Build Command** as `npm run build` and **Output Directory** as `.output/public` or `dist`.
5. Under Environment Variables, add:
   - `VITE_API_URL`: The URL of your deployed backend service (e.g. `https://your-backend.onrender.com` or your `ngrok` tunnel URL).
6. Click **Deploy**. Note that because webcam feeds require high-level secure contexts, Chrome/Firefox will only allow camera permissions under `https://` production links or `localhost`.

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
