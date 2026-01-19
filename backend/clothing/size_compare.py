from clothing.size_charts import SIZE_CHARTS

def compare_size(body_ratios, clothing_type, size):
# it compares the ratio of user body with the ratio of garment size
    garment = SIZE_CHARTS.get(clothing_type, {}).get(size)

    if garment is None:
        return None
    comparison = {}

    for key in garment:
        user_value = body_ratios.get(key)
        ideal_value = garment.get(key)

        diff = round(user_value - ideal_value, 3)

        if diff > 0.05:
            status = "tight"
        elif diff < -0.05:
            status = "loose"
        else:
            status = "good"
        
        comparison[key] = {
            "user": user_value,
            "ideal": ideal_value,
            "difference": diff,
            "status": status
        }
    return comparison
