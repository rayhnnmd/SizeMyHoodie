import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import {
    calculateMeasurements,
    classifyBodyType,
    recommendSize,
    getWarnings,
    getClothingDimensions
} from "../logic/analysis";

export default function Analyze() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [calibMode, setCalibMode] = useState("height");
    const [heightInput, setHeightInput] = useState("");
    const [heightUnit, setHeightUnit] = useState("cm");
    const [isCalibratingPaper, setIsCalibratingPaper] = useState(false);
    const [paperPoints, setPaperPoints] = useState([]);
    const [showA4Info, setShowA4Info] = useState(false);

    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const originalImageRef = useRef(null);
    const imageDisplayRef = useRef(null);

    const clothing = location.state?.clothing;
    const image = location.state?.image;

    useEffect(() => {
        if (!image) {
            navigate("/");
            return;
        }
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);

        const img = new Image();
        img.src = url;
        img.onload = () => {
            originalImageRef.current = img;
        };

        return () => URL.revokeObjectURL(url);
    }, [image, navigate]);

    const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
    const handleCrop = () => setScale(prev => prev === 1 ? 1.5 : 1);

    const handleImageClick = (e) => {
        if (!isCalibratingPaper) return;

        const rect = e.target.getBoundingClientRect();
        const y = e.clientY - rect.top;

        const yRatio = y / rect.height;

        const newPoints = [...paperPoints, yRatio];
        setPaperPoints(newPoints);

        if (newPoints.length === 2) {
            setIsCalibratingPaper(false);
            startAnalysis({ mode: 'paper', values: newPoints });
        }
    };

    const validateAndAnalyze = () => {
        if (calibMode === 'height') {
            let hVal = parseFloat(heightInput);
            if (!hVal || isNaN(hVal)) {
                alert("Please enter a valid height.");
                return;
            }
            if (heightUnit === 'ft') {
                if (hVal < 10) {
                    const ft = Math.floor(hVal);
                    const inch = (hVal - ft) * 10;
                    hVal = (ft * 30.48) + (inch * 2.54);
                } else {

                }
            }

            startAnalysis({ mode: 'height', value: hVal });

        } else {
            setPaperPoints([]);
            setIsCalibratingPaper(true);
        }
    };

    async function startAnalysis(calibrationData) {
        setLoading(true);

        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );

            const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "/models/pose_landmarker_lite.task",
                    delegate: "GPU",
                },
                runningMode: "IMAGE",
                numPoses: 1,
            });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = originalImageRef.current;

            if (rotation % 180 === 0) {
                canvas.width = img.width;
                canvas.height = img.height;
            } else {
                canvas.width = img.height;
                canvas.height = img.width;
            }

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const processedBlob = await new Promise(resolve => canvas.toBlob(resolve));
            const processedFile = new File([processedBlob], "processed.png", { type: "image/png" });

            const result = poseLandmarker.detect(canvas);

            if (!result.landmarks || result.landmarks.length === 0) {
                alert("No body detected. Please try again.");
                setLoading(false);
                return;
            }

            const landmarks = result.landmarks[0];

            let finalCalibration = {};
            if (calibrationData.mode === 'height') {
                finalCalibration = { mode: 'height', value: calibrationData.value };
            } else {

                const p1 = calibrationData.values[0] * canvas.height;
                const p2 = calibrationData.values[1] * canvas.height;
                const pixelHeight = Math.abs(p1 - p2);
                finalCalibration = { mode: 'paper', value: pixelHeight };
            }

            const measurements = calculateMeasurements(landmarks, finalCalibration);
            if (!measurements) {
                alert("Could not calculate measurements. Ensure full body is visible.");
                setLoading(false);
                return;
            }

            const bodyType = classifyBodyType(measurements);
            const size = recommendSize(measurements, clothing);
            const warnings = getWarnings(measurements, clothing);

            const comparison = {
                shoulder: measurements.shoulder,
                chest: measurements.chest,
                arm: measurements.arm,
                length: measurements.length
            };

            navigate("/result", {
                state: {
                    recommend_size: size,
                    body_type: bodyType,
                    measurements: comparison,
                    warnings: warnings,
                    image: processedFile
                }
            });

        } catch (error) {
            console.error(error);
            alert("Analysis error: " + error.message);
            setLoading(false);
        }
    }

    if (!image) return null;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-white">
            {/* Header omitted for brevity, same as original */}
            <header className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="material-symbols-outlined">arrow_back_ios</button>
                <h2 className="flex-1 text-center font-bold text-lg">Analysis Setup</h2>
                <div className="w-6"></div>
            </header>

            <main className="p-4 flex flex-col items-center">

                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden mb-6">
                    {previewUrl && (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                            <img
                                ref={imageDisplayRef}
                                onClick={handleImageClick}
                                src={previewUrl}
                                className={`object-contain max-h-full max-w-full transition-transform duration-300 ${isCalibratingPaper ? 'cursor-crosshair' : ''}`}
                                style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
                            />

                            {isCalibratingPaper && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold">
                                        {paperPoints.length === 0 ? "Tap TOP of Paper" : "Tap BOTTOM of Paper"}
                                    </div>
                                </div>
                            )}

                            {/* Visual Markers for Paper Clicks using absolute positioning if needed */}
                        </div>
                    )}
                </div>

                <div className="w-full max-w-sm space-y-6">

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-100 dark:bg-white/10 p-1 rounded-xl">
                        <button
                            onClick={() => setCalibMode('height')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calibMode === 'height' ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white' : 'text-slate-500'}`}
                        >
                            Enter Height
                        </button>
                        <button
                            onClick={() => setCalibMode('paper')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calibMode === 'paper' ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white' : 'text-slate-500'}`}
                        >
                            Use A4 Paper
                        </button>
                    </div>

                    {/* Dynamic Input Area */}
                    <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-lg relative">

                        {calibMode === 'height' ? (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Height</label>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        value={heightInput}
                                        onChange={(e) => setHeightInput(e.target.value)}
                                        placeholder="e.g. 175"
                                        className="flex-1 bg-slate-50 dark:bg-black/20 border-2 border-transparent focus:border-primary rounded-xl px-4 py-3 text-2xl font-black outline-none transition-colors"
                                    />
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/10 rounded-xl p-1">
                                        <button
                                            onClick={() => setHeightUnit('cm')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold ${heightUnit === 'cm' ? 'bg-white dark:bg-white/20 shadow' : 'opacity-50'}`}
                                        >CM</button>
                                        <button
                                            onClick={() => setHeightUnit('ft')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold ${heightUnit === 'ft' ? 'bg-white dark:bg-white/20 shadow' : 'opacity-50'}`}
                                        >FT</button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">Enter height to calibrate size accurately.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 text-center">
                                <button
                                    onClick={() => setShowA4Info(!showA4Info)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors p-1"
                                >
                                    <span className="material-symbols-outlined text-xl">info</span>
                                </button>

                                {showA4Info && (
                                    <div className="absolute z-10 top-8 left-0 right-0 bg-slate-900 text-white p-4 rounded-xl text-xs text-left shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                                        <p className="mb-2 font-bold text-primary">Why A4 Paper?</p>
                                        <p className="leading-relaxed opacity-90">A4 paper has a standard height of exactly 297mm. By measuring it in your photo, we can calculate your body measurements with millimeter precision.</p>
                                        {/* Arrow */}
                                        <div className="absolute top-[-6px] right-2 w-3 h-3 bg-slate-900 border-t border-l border-white/10 rotate-45"></div>
                                    </div>
                                )}

                                <div className="mx-auto w-12 h-16 border-2 border-slate-300 dark:border-white/20 rounded-sm bg-white dark:bg-white/5 flex items-center justify-center mt-2">
                                    <span className="text-xs font-bold text-slate-300">A4</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">A4 Calibration</h4>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Hold an A4 paper against your body. When you click Analyze, you'll be asked to tap the top and bottom of the paper.
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>

                    <button
                        onClick={validateAndAnalyze}
                        disabled={loading || isCalibratingPaper}
                        className={`w-full h-14 rounded-full bg-primary text-white text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2
                 ${(loading || isCalibratingPaper) ? 'opacity-70 cursor-not-allowed' : ''}
               `}
                    >
                        {loading ? 'Processing...' : isCalibratingPaper ? 'Tap Paper...' : 'Analyze Size'}
                        {!loading && !isCalibratingPaper && <span className="material-symbols-outlined">auto_awesome</span>}
                    </button>

                </div>
            </main>
        </div>
    );
}
