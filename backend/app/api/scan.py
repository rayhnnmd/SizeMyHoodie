from fastapi import APIRouter, UploadFile, File, Form
import cv2
import numpy as np

from camera.pose import get_landmarks
from app.services.analyzer import analyze_body

router = APIRouter()


@router.post("/analyze")
async def analyze(
    clothing: str = Form(...),
    image: UploadFile = File(...)
):
    contents = await image.read()
    np_img = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    result = get_landmarks(frame)

    if not result or not result.pose_landmarks:
        return {"error": "No body detected"}

    analysis = analyze_body(result, clothing)

    return analysis

