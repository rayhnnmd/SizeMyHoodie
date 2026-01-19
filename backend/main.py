import time
import cv2

from camera.camera import get_camera
from camera.pose import get_landmarks, draw_landmarks

from analysis.ratios import calculate_ratios
from analysis.body_type import classify_body_type
from analysis.frame_buffer import FrameAverager
from analysis.arm_type import classify_arm_length 

from clothing.rules import recommend_size
from clothing.warnings import get_warnings
from clothing.size_compare import compare_size

selected_clothing = "tshirt"

cap = get_camera()

averager = FrameAverager(max_frames=30)

final_ratios = None
final_body_type = None
final_size = None
final_warnings = None
final_arm_type = None

locked = False

while True:
    ret, frame = cap.read()
    if not ret:
        break

    timestamp_ms = int(time.time() * 1000)
    result = get_landmarks(frame, timestamp_ms=timestamp_ms)

    if result and result.pose_landmarks and not locked:

        draw_landmarks(frame, result)

        ratios = calculate_ratios(result)
        averager.add(ratios)

        cv2.putText(
            frame,
            f"Scanning... {len(averager.buffer)}/{averager.max_frames}",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 255),
            2
        )

       
        if averager.is_ready():
            final_ratios = averager.average()

            final_body_type = classify_body_type(final_ratios)
            final_arm_type = classify_arm_length(final_ratios)

            final_size = recommend_size(final_body_type, selected_clothing)
            final_warnings = get_warnings(final_body_type, selected_clothing, arm_type=final_arm_type)


            size_comparison = compare_size(
                final_ratios,
                selected_clothing,
                final_size
            )

            final_comparison = size_comparison


            locked = True


    if locked:
        y = 30


        cv2.putText(
            frame,
            "SCAN COMPLETE",
            (10, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 255, 0),
            2
        )
        y += 35

        cv2.putText(
            frame,
            f"Body Type: {final_body_type}",
            (10,y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (255, 255, 255),
            2
        )
        y += 30
        
        cv2.putText(
            frame,
            f"Arm Type: {final_arm_type}",
            (10, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (200, 200, 255),
            2
        )
        y += 30

        cv2.putText(
            frame,
            f"Recommend Size: {final_size}",
            (10, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.75,
            (0, 255, 0),
            2
        )
        y += 30
        for warning in final_warnings:
            cv2.putText(
                frame,
                f"Warning: {warning}",
                (10, y),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2
            )
            y += 25
        cv2.putText(
            frame,
            f"Clothing: {selected_clothing}",
            (10, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (180, 255, 180),
            2
        )
        y += 30
        y += 10
        for part, data in final_comparison.items():
            text = f"{part}: {data['status']}"
            color = (0, 255, 0) if data["status"] == "good" else (0, 0, 255)

            cv2.putText(
                frame,
                text,
                (10, y),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2
            )
            y += 22
    

    cv2.imshow("Body Scan", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break



cap.release()
cv2.destroyAllWindows
