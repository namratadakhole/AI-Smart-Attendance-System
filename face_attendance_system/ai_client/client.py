import os
import cv2
import time
import pickle
import requests
import numpy as np
from datetime import datetime

# Load face_recognition safely
try:
    import face_recognition
except ImportError:
    print("[ERROR] 'face_recognition' library not found. Please install face_recognition and dlib.")
    print("Command: pip install dlib face-recognition")
    input("\nPress Enter to exit...")
    exit(1)

def clear_console():
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    clear_console()
    print("==================================================")
    print("      SmartAttend AI - Local Webcam Terminal      ")
    print("==================================================")
    
    # Prompt for remote backend URL
    backend_url = input("\nEnter Backend URL (default: http://127.0.0.1:5000): ").strip()
    if not backend_url:
        backend_url = "http://127.0.0.1:5000"
    if backend_url.endswith("/"):
        backend_url = backend_url[:-1]

    # Authenticate Faculty
    print("\n--- Faculty Login Authentication ---")
    email = input("Email Address: ").strip()
    import getpass
    password = getpass.getpass("Password: ").strip()

    print(f"\nConnecting to backend at {backend_url}...")
    try:
        res = requests.post(f"{backend_url}/login", json={
            "email": email,
            "password": password,
            "role": "professor"
        }, timeout=10)
        
        login_data = res.json()
        if not login_data.get("success"):
            print(f"[AUTH FAILED] {login_data.get('message', 'Invalid credentials.')}")
            input("\nPress Enter to exit...")
            return
            
        token = login_data["data"]["token"]
        faculty_name = login_data["data"]["user"]["name"]
        print(f"[SUCCESS] Authenticated as {faculty_name}!")
    except Exception as e:
        print(f"[CONNECTION ERROR] Failed to connect: {e}")
        input("\nPress Enter to exit...")
        return

    # Check for encodings file
    # Paths relative to execution directory or parent root
    encodings_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "encodings.pickle"))
    if not os.path.exists(encodings_path):
        # Fallback to local execution directory
        encodings_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "encodings.pickle"))
        
    print(f"\nLoading facial encodings database from {encodings_path}...")
    known_encodings = []
    known_names = []
    
    if os.path.exists(encodings_path):
        try:
            with open(encodings_path, "rb") as f:
                data = pickle.load(f)
                known_encodings = data.get("encodings", [])
                known_names = data.get("names", [])
            print(f"[SUCCESS] Loaded {len(known_names)} trained face encodings.")
        except Exception as e:
            print(f"[WARNING] Failed to load local encodings pickle: {e}")
    else:
        print("[WARNING] models/encodings.pickle not found. Encodings database is currently empty.")
        print("Please train student faces locally or copy models/encodings.pickle to this folder.")

    # Caching check-ins locally to prevent HTTP request spamming
    # Maps student_name -> unix timestamp of last post
    local_checkin_cache = {}
    cache_expiry_seconds = 15

    print("\n==================================================")
    print(" AI Webcam Terminal Ready. Monitoring remote session status...")
    print(" Quit local camera window by pressing 'q' inside feed preview.")
    print("==================================================")

    session_active = False
    cap = None
    headers = {"Authorization": f"Bearer {token}"}

    try:
        while True:
            # Poll status endpoint
            try:
                status_res = requests.get(f"{backend_url}/status", headers=headers, timeout=5)
                status_data = status_res.json()
                active = status_data.get("running", False)
                subject_id = status_data.get("subject_id")
                department = status_data.get("department")
                semester = status_data.get("semester")
            except Exception as poll_err:
                print(f"[POLL ERROR] Status check failed: {poll_err}")
                time.sleep(3)
                continue

            if active:
                if not session_active:
                    print(f"\n[SESSION START] Active session detected on cloud backend!")
                    print(f"  Subject ID: {subject_id}")
                    print(f"  Department: {department}")
                    print(f"  Semester  : Sem {semester}")
                    print("Starting local camera capture stream...")
                    
                    cap = cv2.VideoCapture(0)
                    if not cap.isOpened():
                        print("[CAMERA ERROR] Local webcam device 0 could not be opened.")
                    session_active = True

                if cap and cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        print("[CAMERA ERROR] Failed to grab frame.")
                        time.sleep(0.5)
                        continue

                    # Process face recognition on frame
                    # Scale down for speed
                    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

                    # Locations and Encodings
                    face_locations = face_recognition.face_locations(rgb_small_frame)
                    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                        # Match face
                        name = "Unknown"
                        confidence_pct = 0.0

                        if len(known_encodings) > 0:
                            matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
                            distances = face_recognition.face_distance(known_encodings, face_encoding)

                            if len(distances) > 0:
                                best_match = np.argmin(distances)
                                if matches[best_match]:
                                    name = known_names[best_match]
                                    dist = distances[best_match]
                                    confidence_pct = round(max(0, (1.0 - dist)) * 100, 1)

                        # Draw bounding box (scaled back up)
                        top *= 4
                        right *= 4
                        bottom *= 4
                        left *= 4

                        # Set default colors
                        box_color = (0, 0, 255) # Red for unknown
                        label_text = "Unknown Face"

                        if name != "Unknown":
                            box_color = (0, 255, 0) # Green for match
                            label_text = f"{name} ({confidence_pct}%)"

                            # Rate-limited local post
                            now_ts = time.time()
                            last_post = local_checkin_cache.get(name, 0)
                            
                            if now_ts - last_post > cache_expiry_seconds:
                                # Mark present via Cloud API
                                local_checkin_cache[name] = now_ts
                                print(f"\n[RECOGNIZED] Student matched: {name} (confidence: {confidence_pct}%)")
                                print("Sending attendance post to Render cloud backend...")
                                
                                try:
                                    mark_res = requests.post(f"{backend_url}/api/attendance/mark", json={
                                        "student_id": name, # API supports fallback matching on full name
                                        "name": name,
                                        "confidence": confidence_pct,
                                        "subject_id": subject_id,
                                        "department": department,
                                        "semester": semester
                                    }, headers=headers, timeout=5)
                                    
                                    mark_data = mark_res.json()
                                    if mark_data.get("success"):
                                        if mark_data.get("duplicate"):
                                            print(f"  [DUPCHECK] Attendance already logged today.")
                                        else:
                                            print(f"  [SUCCESS] Marked present on cloud database.")
                                    else:
                                        print(f"  [API ERROR] {mark_data.get('message')}")
                                except Exception as post_err:
                                    print(f"  [POST FAILED] Connection timeout: {post_err}")

                        # Render GUI bounding overlays
                        cv2.rectangle(frame, (left, top), (right, bottom), box_color, 2)
                        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), box_color, cv2.FILLED)
                        cv2.putText(frame, label_text, (left + 6, bottom - 6), 
                                    cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)

                    # Add HUD Banner overlay locally
                    cv2.rectangle(frame, (0, 0), (frame.shape[1], 40), (15, 23, 42), cv2.FILLED)
                    cv2.putText(frame, f"Session Active | Subject ID: {subject_id} | Client Streaming...", 
                                (15, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 191, 255), 1)

                    cv2.imshow("SmartAttend AI Local Terminal", frame)

                    # Check key press 'q'
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        print("\nManual local stream close triggered.")
                        break
            else:
                if session_active:
                    print("\n[SESSION STOP] Session closed on cloud backend.")
                    print("Closing camera stream...")
                    if cap:
                        cap.release()
                        cap = None
                    cv2.destroyAllWindows()
                    session_active = False
                
                # Sleep between polling checks when idle
                time.sleep(2)

            time.sleep(0.01)

    except KeyboardInterrupt:
        print("\nShutdown signal received.")
    finally:
        if cap:
            cap.release()
        cv2.destroyAllWindows()
        print("\nWebcam terminal closed. Exiting application safely.")

if __name__ == "__main__":
    main()
