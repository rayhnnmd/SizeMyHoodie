def recommend_size(body_type, clothing_type):
    if clothing_type == "tshirt":
        if body_type == "Broad Shoulders":
            return "XL"
        elif  body_type == "Pear Shape":
            return "L"
        else:
            return "M"
        
    if clothing_type == "oversized hoodie":
        if body_type == "Broad Shoulders":
            return "XL"
        else: 
            return "L"

    if clothing_type == "jacket":
        if body_type == "Broad Shoulders":
            return "XXL"
        elif body_type == "Pear Shape":
            return "XL"
        else:
            return "L"
        
    return "M"
