
import sys
import os
import cv2
import numpy as np

# Add backend to path so imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

try:
    print("Checking imports...")
    from camera.pose import get_landmarks
    from analysis.ratios import calculate_ratios
    from analysis.body_type import classify_body_type
    from analysis.frame_buffer import FrameAverager
    from clothing.rules import recommend_size
    print("Imports successful.")

    print("Checking model loading...")
    # Create a dummy blank image to test the pipeline (it won't find landmarks, but ensures code runs)
    dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    
    # Test get_landmarks (will initialize model)
    result = get_landmarks(dummy_frame)
    print("Model loaded and inference ran successfully (no landmarks expected on blank image).")

    print("Checking logic components...")
    averager = FrameAverager(max_frames=30)
    print("FrameAverager initialized.")
    
    print("\nSUCCESS: All components initialized and basic library checks passed.")
    print("You can now run 'python backend/main.py' to start the application with the webcam.")

except Exception as e:
    print(f"\nFAILURE: An error occurred during the check:\n{e}")
    import traceback
    traceback.print_exc()
