from analysis.ratios import calculate_ratios
from analysis.body_type import classify_body_type
from analysis.arm_type import classify_arm_length
from clothing.rules import recommend_size
from clothing.warnings import get_warnings
from clothing.size_compare import compare_size


def analyze_body(pose_result, clothing_type):
    ratios = calculate_ratios(pose_result)

    body_type = classify_body_type(ratios)
    arm_type = classify_arm_length(ratios)

    size = recommend_size(body_type, clothing_type)
    warnings = get_warnings(body_type, clothing_type, size)

    comparison = compare_size(ratios, clothing_type, size)

    return {
        "body_type": body_type,
        "arm_type": arm_type,
        "recommend_size": size,
        "warnings": warnings,
        "comparison": comparison
    }