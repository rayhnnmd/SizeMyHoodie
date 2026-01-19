def classify_arm_length(ratios):
    if ratios is None:
        return "Unknown"
    
    arm_ratio = ratios["arm_to_torso"]

    if arm_ratio > 1.15:
        return "Long Arms"
    elif arm_ratio < 0.95:
        return "Short Arms"
    else: 
        return "Average Arms"