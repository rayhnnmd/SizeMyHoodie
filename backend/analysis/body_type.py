def classify_body_type(ratios):
    if ratios is None:
        return "Unknown"
    
    s_ratio = ratios["shoulder_to_torso"]
    h_ratio = ratios["hip_to_torso"]


    if s_ratio > 0.95:
        return "Broad Shoulders"
    elif h_ratio > s_ratio + 0.1:
        return "Pear Shape"
    else:
        return "Balanced"