import math


LEFT_SHOULDER = 11
RIGHT_SHOULDER = 12
LEFT_ELBOW = 13
RIGHT_ELBOW = 14
LEFT_WRIST = 15
RIGHT_WRIST = 16
LEFT_HIP = 23
RIGHT_HIP = 24


def distance(a, b):
    return math.sqrt(
        (a.x - b.x) ** 2 +
        (a.y - b.y) ** 2
    )

def calculate_ratios(pose_result):
    
    if not pose_result.pose_landmarks:
        return None
    
    lm = pose_result.pose_landmarks[0]


    shoulder_width = distance(lm[LEFT_SHOULDER], lm[RIGHT_SHOULDER])
    hip_width = distance(lm[LEFT_HIP], lm[RIGHT_HIP])

    torso_height = distance(lm[LEFT_SHOULDER], lm[LEFT_HIP])

    if torso_height == 0:
        return None
    

    left_arm = (
        distance(lm[LEFT_SHOULDER], lm[LEFT_ELBOW]) +
        distance(lm[RIGHT_ELBOW], lm[RIGHT_WRIST])
    )

    right_arm = (
        distance(lm[RIGHT_SHOULDER], lm[RIGHT_ELBOW])+
        distance(lm[RIGHT_ELBOW], lm[RIGHT_WRIST])
                 
    )


    avg_arm_length = (left_arm + right_arm) / 2


    return {
        "shoulder_to_torso": round(shoulder_width / torso_height, 3),
        "hip_to_torso": round(hip_width / torso_height, 3),
        "arm_to_torso": round(avg_arm_length / torso_height, 3),

    }
                              