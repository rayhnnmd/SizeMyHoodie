import cv2

def get_camera():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise Exception("Camera not accessible")
    return cap
    