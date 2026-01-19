// Landmark indices
const NOSE = 0;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_ELBOW = 13;
const RIGHT_ELBOW = 14;
const LEFT_WRIST = 15;
const RIGHT_WRIST = 16;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;
const LEFT_HEEL = 29;
const RIGHT_HEEL = 30;

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// Estimate full body height in pixels (Nose to mid-point between heels)
// Note: This is an approximation. We add a factor for the head top above the nose.
function getBodyHeightPx(lm) {
    const midHeelX = (lm[LEFT_HEEL].x + lm[RIGHT_HEEL].x) / 2;
    const midHeelY = (lm[LEFT_HEEL].y + lm[RIGHT_HEEL].y) / 2;

    const noseToHeel = distance(lm[NOSE], { x: midHeelX, y: midHeelY });

    // Head is approx 1/7 to 1/8 of total height. Nose is roughly mid-head or lower depending on angle.
    // We'll add ~10% padding for top of head.
    return noseToHeel * 1.12;
}

export function calculateMeasurements(poseLandmarks, calibration) {
    // calibration: { mode: 'height' | 'paper', value: number }
    // value: userHeight in cm OR paperHeight in pixels

    if (!poseLandmarks || poseLandmarks.length === 0) return null;
    const lm = poseLandmarks;

    // 1. Determine Scale Factor (cm per pixel)
    let scale = 0; // cm per pixel

    if (calibration.mode === 'height') {
        const userHeightCm = calibration.value;
        const bodyHeightPx = getBodyHeightPx(lm);
        if (bodyHeightPx === 0) return null;
        scale = userHeightCm / bodyHeightPx;
    } else if (calibration.mode === 'paper') {
        const paperHeightPx = calibration.value;
        // A4 height is 29.7cm
        if (paperHeightPx === 0) return null;
        scale = 29.7 / paperHeightPx;
    } else {
        return null;
    }

    // 2. Calculate Raw Pixel Distances
    const shoulderPx = distance(lm[LEFT_SHOULDER], lm[RIGHT_SHOULDER]);
    const hipPx = distance(lm[LEFT_HIP], lm[RIGHT_HIP]);
    const torsoPx = distance(lm[LEFT_SHOULDER], lm[LEFT_HIP]); // Vertical torso approximation

    const leftArmPx = distance(lm[LEFT_SHOULDER], lm[LEFT_ELBOW]) + distance(lm[LEFT_ELBOW], lm[LEFT_WRIST]);
    const rightArmPx = distance(lm[RIGHT_SHOULDER], lm[RIGHT_ELBOW]) + distance(lm[RIGHT_ELBOW], lm[RIGHT_WRIST]);
    const avgArmPx = (leftArmPx + rightArmPx) / 2;

    // 3. Convert to Real Dimensions (in inches for clothing size charts)
    // 1 cm = 0.3937 inches
    const CM_TO_IN = 0.3937;

    // Shoulder Width (Linear distance)
    const shoulderWidthIn = (shoulderPx * scale) * CM_TO_IN;

    // Chest Circumference
    // Approximation: Chest Width is roughly shoulder width or slightly less/more depending on build.
    // Circumference ≈ Width * 2.2 (Standard oval approximation for torso)
    const chestCircIn = (shoulderPx * scale * 2.1) * CM_TO_IN;

    // Arm Length
    const armLenIn = (avgArmPx * scale) * CM_TO_IN;

    // Torso Length (Shoulder to Hip) - This is usually shirt length equivalent or close
    // Shirt length is usually neck to hem. Shoulder to hip is a good proxy for "fit" length.
    const torsoLenIn = (torsoPx * scale * 1.4) * CM_TO_IN; // 1.4 factor to account for neck-to-shoulder diff and hip-to-hem

    return {
        shoulder: Number(shoulderWidthIn.toFixed(1)),
        chest: Number(chestCircIn.toFixed(1)),
        arm: Number(armLenIn.toFixed(1)),
        length: Number(torsoLenIn.toFixed(1)),

        // Keep raw ratios for classification if needed
        ratios: {
            shoulder_to_torso: shoulderPx / torsoPx,
            arm_to_torso: avgArmPx / torsoPx
        }
    };
}

export function classifyBodyType(measurements) {
    if (!measurements) return "Unknown";
    // Updated to use measurements if desired, or stick to ratios
    // Using ratios from measurements
    const ratios = measurements.ratios;
    if (!ratios) return "Balanced";

    if (ratios.shoulder_to_torso > 0.95) return "Broad Shoulders";
    // Simplified logic
    return "Balanced";
}

export function recommendSize(measurements, clothingType) {
    if (!measurements) return "M";

    // Use Chest as primary driver for Tops
    // S: 36-38, M: 39-41, L: 42-44, XL: 45-47, XXL: 48+
    const chest = measurements.chest;

    if (clothingType === 'oversized hoodie') {
        if (chest < 38) return "S";
        if (chest < 41) return "M";
        if (chest < 45) return "L";
        if (chest < 49) return "XL";
        return "XXL";
    }

    // Standard T-Shirt
    if (chest < 37) return "S";
    if (chest < 40) return "M";
    if (chest < 43) return "L";
    if (chest < 47) return "XL";
    return "XXL";
}

export function getWarnings(measurements, clothingType) {
    const warnings = [];
    // Example logic
    if (measurements.arm > 26 && clothingType === 'jacket') {
        // Standard arm is ~25 for M
        warnings.push("Check sleeve length (You have long arms)");
    }
    return warnings;
}

export const SIZE_DIMENSIONS = {
    "S": { shoulder: 16.5, chest: 37, arm: 25, length: 27 },
    "M": { shoulder: 17.5, chest: 40, arm: 25.5, length: 28 },
    "L": { shoulder: 18.5, chest: 43, arm: 26, length: 29 },
    "XL": { shoulder: 19.5, chest: 47, arm: 26.5, length: 30 },
    "XXL": { shoulder: 20.5, chest: 51, arm: 27, length: 31 }
};

export function getClothingDimensions(size) {
    return SIZE_DIMENSIONS[size] || SIZE_DIMENSIONS["M"];
}
