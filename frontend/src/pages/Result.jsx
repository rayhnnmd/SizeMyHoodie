import { useLocation, useNavigate } from "react-router-dom";
import { getClothingDimensions } from "../logic/analysis";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  // Data from updated analysis
  const { recommend_size, measurements, warnings, image } = state;

  // Real measurements from the size chart for the recommended size
  const chartDimensions = getClothingDimensions(recommend_size);
  const imageUrl = image ? URL.createObjectURL(image) : null;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display pb-32">
      {/* Header */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#1a1625]/80 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
          arrow_back_ios
        </button>
        <span className="font-bold text-lg">Your Results</span>
        <div className="w-10"></div>
      </header>

      <main className="px-4 space-y-6">

        {/* Main Card */}
        <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#221933] shadow-xl border border-slate-100 dark:border-white/5">
          <div className="relative aspect-square w-full bg-slate-100 dark:bg-black/40">
            {imageUrl && <img src={imageUrl} className="w-full h-full object-cover" />}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-20">
              <div className="inline-block px-3 py-1 bg-primary rounded-full mb-2">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Best Fit</span>
              </div>
              <h1 className="text-4xl font-black text-white mb-1">Size {recommend_size}</h1>
              <p className="text-white/80 text-sm font-medium">Based on your absolute measurements</p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Measurement Comparison</h3>

            {/* Measurement Grid */}
            <div className="space-y-4">
              <MeasurementRow
                label="Shoulder Width"
                userVal={measurements?.shoulder}
                chartVal={chartDimensions.shoulder}
                unit="in"
              />
              <MeasurementRow
                label="Chest Circumference"
                userVal={measurements?.chest}
                chartVal={chartDimensions.chest}
                unit="in"
              />
              <MeasurementRow
                label="Arm Length"
                userVal={measurements?.arm}
                chartVal={chartDimensions.arm}
                unit="in"
              />
              <MeasurementRow
                label="Torso Length"
                userVal={measurements?.length}
                chartVal={chartDimensions.length}
                unit="in"
              />
            </div>

            {warnings && warnings.length > 0 && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20">
                <div className="flex gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm mb-1">
                  <span className="material-symbols-outlined text-lg">warning</span>
                  <span>Fit Notice</span>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200/80 leading-relaxed pl-7">
                  {warnings.join(". ")}
                </p>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Floating Action */}
      <div className="fixed bottom-6 left-6 right-6">
        <button
          onClick={() => navigate("/")}
          className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">restart_alt</span>
          Analyze Another
        </button>
      </div>
    </div>
  );
}

function MeasurementRow({ label, userVal, chartVal, unit }) {
  if (!userVal) return null;
  const diff = userVal - chartVal;
  // Simple tolerance check
  let statusColor = "text-emerald-500";
  let statusIcon = "check";

  if (diff > 2) { statusColor = "text-orange-500"; statusIcon = "add"; } // User is bigger
  if (diff < -2) { statusColor = "text-blue-500"; statusIcon = "remove"; } // User is smaller

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{label}</span>
        <span className="text-xl font-black text-slate-900 dark:text-white">{userVal}<small className="text-xs font-normal opacity-50 ml-0.5">{unit}</small></span>
      </div>
      <div className="text-right">
        <div className="text-[10px] font-bold text-slate-400 mb-1">Rec. {chartVal}{unit}</div>
        <div className={`flex items-center justify-end gap-1 font-bold text-xs ${statusColor}`}>
          <span className="material-symbols-outlined text-sm font-bold">{statusIcon}</span>
          {Math.abs(diff).toFixed(1)}{unit} {diff > 0 ? 'larger' : 'smaller'}
        </div>
      </div>
    </div>
  )
}
