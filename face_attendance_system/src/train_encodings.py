import os
import pickle
import face_recognition

# Get the folder where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Get the project folder
PROJECT_DIR = os.path.dirname(BASE_DIR)

# Paths
DATASET_DIR = os.path.join(PROJECT_DIR, "dataset")
ENCODINGS_FILE = os.path.join(PROJECT_DIR, "models", "encodings.pickle")

# Lists to store data
known_face_encodings = []
known_face_names = []

print("Face Encoding Training Started...")
print(f"Dataset path: {DATASET_DIR}")

# Get all student folders
student_folders = []

print("\nStudents found:")

for item in os.listdir(DATASET_DIR):
    item_path = os.path.join(DATASET_DIR, item)

    if os.path.isdir(item_path):
        student_folders.append(item)
        print(item)

# Read images of each student
for student in student_folders:

    student_path = os.path.join(DATASET_DIR, student)

    print(f"\nProcessing images of {student}")

    image_files = os.listdir(student_path)

    for image_name in image_files:

        image_path = os.path.join(student_path, image_name)

        print(f"Reading: {image_path}")

        # Load image
        image = face_recognition.load_image_file(image_path)

        # Detect face
        face_locations = face_recognition.face_locations(image)

        # Skip if not exactly one face
        if len(face_locations) != 1:
            print("Skipped (No face or multiple faces detected)")
            continue

        # Generate encoding
        face_encoding = face_recognition.face_encodings(image, face_locations)[0]

        # Store encoding and student name
        known_face_encodings.append(face_encoding)
        known_face_names.append(student)

        print(f"Encoding generated for {student}")

# Create models folder if it doesn't exist
os.makedirs(os.path.join(PROJECT_DIR, "models"), exist_ok=True)

# Save encodings
data = {
    "encodings": known_face_encodings,
    "names": known_face_names
}

with open(ENCODINGS_FILE, "wb") as file:
    pickle.dump(data, file)

print("\n===================================")
print("Training Completed Successfully!")
print(f"Total Encodings: {len(known_face_names)}")
print(f"Saved to: {ENCODINGS_FILE}")
print("===================================")