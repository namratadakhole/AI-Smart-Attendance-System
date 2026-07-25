import cv2
import os

# Ask the user for the name of the person being registered
person_name = input("Enter the name of the person: ").strip()

# Build the folder path where this person's photos will be saved
dataset_path = os.path.join("dataset", person_name)

# Create the folder if it doesn't already exist
os.makedirs(dataset_path, exist_ok=True)

# Load OpenCV's built-in face detector (Haar Cascade)
# This just finds "where is a face in this frame" - it does NOT identify who it is
face_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# Start capturing video from the default webcam (0 = first connected camera)
video_capture = cv2.VideoCapture(0)

print("Look at the camera. Capturing images... Press 'q' to stop early.")

image_count = 0
max_images = 20  # how many photos we want to collect

while image_count < max_images:
    # Read a single frame from the webcam
    # ret = True/False (did it succeed?), frame = the actual image
    ret, frame = video_capture.read()

    if not ret:
        print("Failed to grab frame from webcam.")
        break

    # Convert the frame to grayscale - face detection works on grayscale images
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale frame
    # Returns a list of rectangles (x, y, width, height) - one per detected face
    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.1,   # how much the image size is reduced at each scale check
        minNeighbors=5,    # how strict the detector is (higher = fewer false positives)
        minSize=(100, 100) # ignore anything smaller than 100x100 pixels
    )

    for (x, y, w, h) in faces:
        # Draw a rectangle around the detected face (for visual feedback only)
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Crop just the face region out of the full frame
        face_crop = frame[y:y + h, x:x + w]

        # Build the filename and save this face image
        image_count += 1
        file_path = os.path.join(dataset_path, f"{image_count}.jpg")
        cv2.imwrite(file_path, face_crop)

        print(f"Captured image {image_count}/{max_images}")

    # Show the live webcam feed with rectangles drawn, in a window
    cv2.imshow("Registering Face - Press 'q' to quit", frame)

    # Wait 1 millisecond for a key press; if it's 'q', stop the loop early
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam so other programs can use it
video_capture.release()

# Close all OpenCV windows
cv2.destroyAllWindows()

print(f"Done. Saved {image_count} images to '{dataset_path}'.")
