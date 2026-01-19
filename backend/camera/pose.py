import os
import time
import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_tasks
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.vision import pose_landmarker as pl
from mediapipe.tasks.python.vision.core import image as mp_image


MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'models', 'pose_landmarker_lite.task')
)

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(
        f"Pose landmarker model not found at {MODEL_PATH}.\n"
        "Run the downloader or place a .task model at backend/models/pose_landmarker_lite.task"
    )


_base_options = mp_tasks.BaseOptions(model_asset_path=MODEL_PATH)
_options = vision.PoseLandmarkerOptions(
    base_options=_base_options,
    running_mode=vision.RunningMode.VIDEO,
    num_poses=1,
)

_detector = vision.PoseLandmarker.create_from_options(_options)

def get_landmarks(frame, timestamp_ms: int | None = None):
    
# runs pose detection on a frame
# frame for BGR OpenCV images
# need timestamp_ms for video, it uses current time if None mentioned

    if timestamp_ms is None:
        timestamp_ms = int(time.time() * 1000)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = mp_image.Image(mp_image.ImageFormat.SRGB, rgb)

    result = _detector.detect_for_video(image, int(timestamp_ms))
    return result


def draw_landmarks(frame, detection_result):
    
# draws the detected pose on the frame.

    if not detection_result or not getattr(detection_result, 'pose_landmarks', None):
        return frame

    h, w = frame.shape[:2]
    connections = pl.PoseLandmarksConnections.POSE_LANDMARKS

    for pose_landmarks in detection_result.pose_landmarks:
        for conn in connections:
            s_idx, e_idx = int(conn.start), int(conn.end)
            if s_idx >= len(pose_landmarks) or e_idx >= len(pose_landmarks):
                continue
            s = pose_landmarks[s_idx]
            e = pose_landmarks[e_idx]
            sx, sy = int(max(0, min(1, s.x)) * w), int(max(0, min(1, s.y)) * h)
            ex, ey = int(max(0, min(1, e.x)) * w), int(max(0, min(1, e.y)) * h)
            cv2.line(frame, (sx, sy), (ex, ey), (0, 255, 0), 2)

        for lm in pose_landmarks:
            x, y = int(max(0, min(1, lm.x)) * w), int(max(0, min(1, lm.y)) * h)
            cv2.circle(frame, (x, y), 3, (0, 0, 255), -1)

    return frame