def get_warnings(body_type, clothing_type, arm_type=None):
    warnings = []
    
    # for shoulder fit
    if body_type == "Broad Shoulders":
        if clothing_type in ["tshirt", "jacket"]:
            warnings.append(
                "Shoulder area may feel tight. Consider relaxed or stretch fabric."
            )

    # for sleeve fit
    if arm_type == "Long Arms":
        warnings.append(
            "Sleeves may feel short. Consider sizing up or long-sleeve variants."
        )

    if arm_type == "Short Arms":
        warnings.append(
            "Sleeves may appear longer than usual."
        )

    # for length fit

    if clothing_type == "jacket" and body_type == "Pear Shape":
        warnings.append(
            "Jacket length may feel short around the hips."
        )
    return warnings