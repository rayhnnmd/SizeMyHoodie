import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Apparel() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const handleSelect = (item) => {
        setSelected(item);
        // You might want to save this choice to a context or state manager later
        console.log("Selected apparel:", item);
    };

    const handleContinue = () => {
        if (selected) {
            navigate("/photo");
        } else {
            alert("Please select an apparel type first.");
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
            <div className="relative flex h-full min-h-screen w-full flex-col max-w-[430px] mx-auto overflow-x-hidden border-x border-primary/10 shadow-2xl">
                {/* TopAppBar */}
                <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
                    <div
                        onClick={() => navigate(-1)}
                        className="text-primary dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer rounded-full active:bg-primary/10"
                    >
                        <span className="material-symbols-outlined">
                            arrow_back_ios_new
                        </span>
                    </div>
                    <h2 className="text-background-dark dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                        Select Apparel Type
                    </h2>
                </div>

                {/* ProgressBar Section */}
                <div className="flex flex-col gap-3 p-4">
                    <div className="flex gap-6 justify-between items-end">
                        <p className="text-background-dark dark:text-white text-base font-semibold leading-normal">
                            Virtual Fitting
                        </p>
                        <p className="text-primary dark:text-primary/80 text-sm font-medium leading-normal">
                            Step 1 of 3
                        </p>
                    </div>
                    <div className="rounded-full bg-primary/10 dark:bg-[#443267] overflow-hidden h-2.5">
                        <div className="h-full rounded-full bg-primary w-1/3"></div>
                    </div>
                </div>

                {/* Headline & Body Text */}
                <div className="px-4 pt-4">
                    <h2 className="text-background-dark dark:text-white tracking-tight text-3xl font-bold leading-tight text-left pb-2">
                        What are you wearing today?
                    </h2>
                    <p className="text-gray-600 dark:text-[#a492c9] text-base font-normal leading-relaxed">
                        Choose the category that best matches your item for an accurate size
                        analysis.
                    </p>
                </div>

                {/* Selection Cards */}
                {/* Selection Cards (Scattered Layout) */}
                <div className="relative w-full h-[450px] mt-4 select-none">

                    {/* T-SHIRTS Card - Top Left */}
                    <button
                        onClick={() => handleSelect("t-shirt")}
                        className={`absolute top-4 left-6 w-44 h-44 bg-[#29C5F6] rounded-[2rem] border-[6px] border-white shadow-xl flex flex-col items-center justify-center gap-1 transform -rotate-12 hover:rotate-0 hover:z-50 transition-all duration-300 z-10
                        ${selected === "t-shirt" ? "scale-110 ring-4 ring-[#29C5F6]/50 z-50" : "hover:scale-105"}`}
                    >
                        <span className="material-symbols-outlined text-white text-[64px] drop-shadow-sm">
                            apparel
                        </span>
                        <span className="text-white font-black tracking-wider text-lg">
                            T-SHIRTS
                        </span>
                    </button>

                    {/* HOODIE Card - Middle Right */}
                    <button
                        onClick={() => handleSelect("hoodie")}
                        className={`absolute top-40 right-4 w-44 h-44 bg-[#DCD0FF] rounded-[2rem] border-[6px] border-white shadow-xl flex flex-col items-center justify-center gap-1 transform rotate-[15deg] hover:rotate-0 hover:z-50 transition-all duration-300 z-0
                        ${selected === "hoodie" ? "scale-110 ring-4 ring-[#DCD0FF]/50 z-50" : "hover:scale-105"}`}
                    >
                        <span className="material-symbols-outlined text-[#5D4E7B] text-[64px]">
                            checkroom
                        </span>
                        <span className="text-[#5D4E7B] font-black tracking-wider text-lg">
                            HOODIE
                        </span>
                    </button>

                    {/* JACKET Card - Bottom Left */}
                    <button
                        onClick={() => handleSelect("jacket")}
                        className={`absolute bottom-6 left-8 w-44 h-44 bg-[#FFD6A5] rounded-[2rem] border-[6px] border-white shadow-xl flex flex-col items-center justify-center gap-1 transform -rotate-[5deg] hover:rotate-0 hover:z-50 transition-all duration-300 z-20
                        ${selected === "jacket" ? "scale-110 ring-4 ring-[#FFD6A5]/50 z-50" : "hover:scale-105"}`}
                    >
                        <span className="material-symbols-outlined text-[#8B5E3C] text-[64px]">
                            dry_cleaning
                        </span>
                        <span className="text-[#8B5E3C] font-black tracking-wider text-lg">
                            JACKET
                        </span>
                    </button>

                </div>

                {/* Fixed Bottom Action */}
                <div className="mt-auto p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky bottom-0">
                    <button
                        onClick={handleContinue}
                        className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all
              ${selected ? "bg-primary text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"}
             `}
                    >
                        Continue to Fitting
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
