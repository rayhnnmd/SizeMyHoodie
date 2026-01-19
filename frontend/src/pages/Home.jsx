import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SideMenu from "../components/SideMenu";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  // Use the user's photo if available, otherwise use default
  const userPhoto = currentUser?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAyHf_T427AcTMDLin4OCLJa5_9D7O49hFeWrGkhpUhHcA91c5XSVKSIVLDSGvpL8iMolAorj30go0i743JEmzjZFkF2bhJbZpcZysm9zkYQE5pZlGMCSCUi3fJWpyu0SkTH8mcLOwkb5g6CRSFOycLU4nQ9catIdmJNyjsu2YIMKuN4OCUNUfwECk8j8aDz3f1raBTSMkHEvmTXsBPXG5xdD0Wabm88I-J3Sd4gRkS6Yjog2k7HcYvq81HUjoHtonAtvL2C9yq2Kc";

  return (
    <div className="bg-background-light dark:bg-background-dark font-display">
      <div className="relative flex h-screen w-full flex-col overflow-x-hidden bg-[radial-gradient(circle_at_top_right,#f2faf7_0%,#fcfaf8_70%)] dark:bg-[radial-gradient(circle_at_top_right,#2a3a35_0%,#1b130d_100%)] dark:bg-background-dark">
        <SideMenu open={open} onClose={() => setOpen(false)} />

        {/* TopAppBar */}
        <header className="flex items-center justify-between p-6 pt-8">
          <button
            onClick={() => setOpen(true)}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md transition-all active:scale-95 shadow-sm border border-white/20"
          >
            <span className="material-symbols-outlined text-[#1b130d] dark:text-white" style={{ fontSize: "24px" }}>menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9a6c4c] dark:text-[#cbb09d]">SizeMyHoodie</span>
          </div>
          <button className="relative size-12 shrink-0 items-center justify-center rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-md transition-all active:scale-95">
            <img
              alt="User Profile"
              className="h-full w-full object-cover"
              src={userPhoto}
            />
            <div className="absolute bottom-1 right-1 size-2.5 rounded-full bg-primary border border-white"></div>
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 border border-primary/20">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase">SPRING COLLECTION</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1b130d] dark:text-white mb-2">
              Effortless Fit.
            </h1>
            <p className="text-[#9a6c4c] dark:text-[#cbb09d] text-sm font-medium leading-relaxed max-w-[240px]">
              Experience high-fashion sizing with Ai.
            </p>
          </div>

          {/* SingleButton (Satin Pastel Version) */}
          <div className="w-full max-w-sm px-4 py-8">
            <button
              onClick={() => navigate("/apparel")}
              className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-full transition-all active:scale-[0.98] hover:shadow-lg bg-[linear-gradient(135deg,#ffd8be_0%,#ffccaa_100%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_10px_30px_-10px_rgba(236,109,19,0.3)]"
            >
              {/* Subtle Glow Overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative text-lg font-extrabold tracking-[0.1em] text-[#5e412d] uppercase">START FLEXING</span>
              <div className="absolute right-6 flex items-center justify-center size-10 rounded-full bg-white/30 backdrop-blur-sm border border-white/20">
                <span className="material-symbols-outlined text-[#5e412d]" style={{ fontSize: "20px" }}>arrow_forward</span>
              </div>
            </button>
          </div>

          {/* MetaText */}
          <div className="mt-4">
            <p className="text-[#9a6c4c] dark:text-[#cbb09d] text-[11px] font-semibold tracking-widest uppercase opacity-60">
              variant 2 of 6
            </p>
          </div>
        </main>

        {/* BottomNavBar */}
        <nav className="mt-auto px-6 pb-10">
          <div className="flex items-center justify-between rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 p-2 shadow-xl shadow-black/5">
            <a href="#" className="flex h-14 flex-1 flex-col items-center justify-center rounded-full bg-white dark:bg-white/10 text-primary shadow-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "26px" }}>house</span>
            </a>
            <a href="#" className="flex h-14 flex-1 flex-col items-center justify-center text-[#9a6c4c] dark:text-[#cbb09d] hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>straighten</span>
            </a>
            <a href="#" className="flex h-14 flex-1 flex-col items-center justify-center text-[#9a6c4c] dark:text-[#cbb09d] hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>shopping_bag</span>
            </a>
            <a href="#" className="flex h-14 flex-1 flex-col items-center justify-center text-[#9a6c4c] dark:text-[#cbb09d] hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>person</span>
            </a>
          </div>
        </nav>

        {/* iOS Indicator (Visual only) */}
        <div className="absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-black/10 dark:bg-white/10"></div>
      </div>
    </div>
  );
}
