import cv2
import dlib

print("dlib version:", dlib.__version__)

image = cv2.imread("dataset/Namrata/1.jpg")

print("Image dtype:", image.dtype)
print("Image shape:", image.shape)

rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

detector = dlib.get_frontal_face_detector()

faces = detector(rgb)

print("Faces detected:", len(faces))