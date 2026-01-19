import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Photo() {
  const navigate = useNavigate();
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Helper handling file selection
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Navigate to /analyze with the image file in state
      navigate("/analyze", { state: { image: file } });
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300 font-display">
      <div className="relative flex h-auto min-h-screen w-full max-w-[480px] mx-auto flex-col overflow-x-hidden border-x border-primary/10 shadow-2xl">
        {/* Header Section */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <div
            onClick={() => navigate(-1)}
            className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer rounded-full active:bg-primary/10"
          >
            <span className="material-symbols-outlined text-[28px]">
              chevron_left
            </span>
          </div>
          <div className="flex-1 flex justify-center pr-12">
            <div className="flex gap-1.5 items-center">
              <div className="h-1 w-6 rounded-full bg-primary/30"></div>
              <div className="h-1 w-6 rounded-full bg-primary"></div>
              <div className="h-1 w-6 rounded-full bg-primary/30"></div>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="px-4 pt-6 pb-2">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">
            Upload Method
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal mt-2">
            To start your virtual fitting, we need a clear photo of your
            silhouette.
          </p>
        </div>
        <div className="h-4"></div>

        {/* Camera Card */}
        <div className="px-4 mb-4">
          <div
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#221933] p-4 shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-transform cursor-pointer group"
          >
            <div className="flex flex-[2_2_0px] flex-col justify-between py-1">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                  Open Camera
                </p>
                <p className="text-slate-500 dark:text-[#a492c9] text-sm font-normal leading-normal">
                  Take a live photo now.
                </p>
              </div>
              <button className="mt-4 flex min-w-[100px] items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-white gap-2 text-sm font-semibold leading-normal w-fit shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">
                  photo_camera
                </span>
                <span className="truncate">Select</span>
              </button>
            </div>
            <div
              className="w-32 h-32 bg-center bg-no-repeat bg-cover rounded-xl flex-shrink-0 bg-slate-100 dark:bg-[#2f2348] flex items-center justify-center"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #5b13ec 0%, #a492c9 100%)",
                opacity: 0.9,
              }}
            >
              <span className="material-symbols-outlined text-white text-5xl opacity-40">
                camera
              </span>
            </div>
          </div>
          {/* Hidden Input for Camera */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>

        {/* Gallery Card */}
        <div className="px-4">
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#221933] p-4 shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-transform cursor-pointer group"
          >
            <div className="flex flex-[2_2_0px] flex-col justify-between py-1">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                  Select from Gallery
                </p>
                <p className="text-slate-500 dark:text-[#a492c9] text-sm font-normal leading-normal">
                  Choose an existing photo.
                </p>
              </div>
              <button className="mt-4 flex min-w-[100px] items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-slate-100 dark:bg-[#2f2348] text-slate-900 dark:text-white gap-2 text-sm font-semibold leading-normal w-fit group-hover:bg-slate-200 dark:group-hover:bg-[#3d2e5e] transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  image
                </span>
                <span className="truncate">Browse</span>
              </button>
            </div>
            <div
              className="w-32 h-32 bg-center bg-no-repeat bg-cover rounded-xl flex-shrink-0 bg-slate-100 dark:bg-[#2f2348] flex items-center justify-center"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #221933 0%, #5b13ec 100%)",
                opacity: 0.9,
              }}
            >
              <span className="material-symbols-outlined text-white text-5xl opacity-40">
                gallery_thumbnail
              </span>
            </div>
          </div>
          {/* Hidden Input for Gallery */}
          <input
            type="file"
            accept="image/*"
            ref={galleryInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>

        {/* Info/Tip Section */}
        <div className="mt-auto p-4 mb-6">
          <div className="bg-primary/10 dark:bg-primary/5 rounded-2xl p-4 border border-primary/20 flex gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <div>
              <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">
                Pro Tip
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs font-normal leading-relaxed">
                Wear form-fitting clothes and stand in a well-lit area for the
                most accurate size analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Spacer for mobile safe area */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
