import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";

export default function SideMenu({ open, onClose }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [showAbout, setShowAbout] = useState(false);

  if (!open) return null;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleClose = () => {
    setShowAbout(false);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex font-display h-screen">
      {/* Drawer Surface */}
      <div
        className="h-full w-[85%] max-w-[340px] bg-background-light dark:bg-background-dark shadow-2xl flex flex-col border-r border-white/5 animate-slide-in-left overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {showAbout ? (
          // --- ABOUT US VIEW ---
          <div className="p-6 pt-12 flex flex-col h-full">
            <button
              onClick={() => setShowAbout(false)}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-6"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-bold uppercase tracking-wider">Back</span>
            </button>

            <h3 className="text-2xl font-bold text-white mb-4">About Us</h3>

            <div className="flex-1 overflow-y-auto pr-2 text-slate-300 space-y-4 text-sm leading-relaxed">
              <p>
                <strong className="text-primary">SizeMyHoodie</strong> is an AI-powered fashion assistant that helps you find the perfect clothing fit using just a photo.
              </p>
              <p>
                We believe that size charts are outdated. Everyone’s body is different — height, shoulders, arms, posture, and proportions all affect how clothes look and feel. That’s why we built SizeMyHoodie to analyze real body ratios instead of guessing based on age or weight.
              </p>
              <p>
                Using computer vision and machine learning, our system scans your body shape and recommends the best size for:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-white/90 font-medium">
                <li>T-shirts</li>
                <li>Oversized hoodies</li>
                <li>Jackets</li>
              </ul>
              <p>
                along with personalized warnings like: <br />
                <span className="italic text-white/80">“Sleeves may feel tight if you have broad shoulders.”</span>
              </p>
              <div className="my-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-bold text-white mb-2">Our goal is simple:</p>
                <p>No more wrong sizes. No more returns. Just clothes that fit.</p>
              </div>
              <p className="text-xs text-white/50 uppercase tracking-widest pt-4">
                We’re building the future of online shopping — where your camera replaces the trial room.
              </p>
            </div>
          </div>
        ) : (
          // --- MAIN MENU VIEW ---
          <div className="p-6 pt-12 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="size-16 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden shadow-lg shadow-primary/20">
                  {user?.photoURL ? (
                    <img
                      alt="User Profile"
                      className="w-full h-full object-cover"
                      src={user.photoURL}
                    />
                  ) : (
                    <img
                      alt="User Profile"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAIAfh96fsazZYIhwy0vAyGPo0oheDHiTAIdo7XyYZd-Vhea-fCiXqhISTU03tQilesxD6aLWPri6c75HnZpg5cGX0Va4794EF3u2dI40osIkng5J_hUTuLHi7C5ezcUdQcP6Qz-mio1-Ssf8DpfeUc7GRyQwdy5d3guuajuxNbXpVWXcgA9_vRdItMr2EjnljIOHyhvxU8NiWv8Q8ZtM5QfV54x6pytzmuucNZbA0dWXypgHBbaA0Ycfed424CFtINHECJekH6oc"
                    />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 size-4 rounded-full bg-green-500 border-2 border-background-dark"></div>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold leading-tight">
                  {user?.displayName || "Guest User"}
                </h3>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider">
                  Premium Member
                </p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-1">
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2">
                General
              </p>
              <button
                onClick={() => setShowAbout(true)}
                className="flex h-12 w-full items-center gap-4 rounded-full px-4 text-white hover:bg-primary/10 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[22px]">
                  info
                </span>
                <p className="text-base font-medium">About Us</p>
              </button>
              <a
                href="mailto:sizemyhoodie@gmail.com"
                className="flex h-14 items-center gap-4 rounded-full px-4 text-white hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">
                  headset_mic
                </span>
                <div className="flex flex-col items-start justify-center">
                  <p className="text-base font-medium leading-none">Contact for Query</p>
                  <p className="text-xs text-white/50 mt-1">sizemyhoodie@gmail.com</p>
                </div>
              </a>

            </div>

            <div className="h-[1px] bg-white/5 my-6 mx-4"></div>

            {/* External Links */}
            <div className="flex flex-col gap-1">
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2">
                Shopping Partners
              </p>
              <a
                href="https://amazon.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center gap-4 rounded-full px-4 text-white hover:bg-white/5 group transition-all"
              >
                <div className="size-8 rounded-lg bg-[#FF9900]/20 flex items-center justify-center text-[#FF9900]">
                  <span className="material-symbols-outlined text-[20px]">
                    shopping_cart
                  </span>
                </div>
                <p className="text-base font-medium flex-1">Amazon</p>
                <span className="material-symbols-outlined text-white/30 text-base group-hover:text-white group-hover:translate-x-1 transition-all">
                  open_in_new
                </span>
              </a>
              <a
                href="https://flipkart.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center gap-4 rounded-full px-4 text-white hover:bg-white/5 group transition-all"
              >
                <div className="size-8 rounded-lg bg-[#2874F0]/20 flex items-center justify-center text-[#2874F0]">
                  <span className="material-symbols-outlined text-[20px]">
                    local_mall
                  </span>
                </div>
                <p className="text-base font-medium flex-1">Flipkart</p>
                <span className="material-symbols-outlined text-white/30 text-base group-hover:text-white group-hover:translate-x-1 transition-all">
                  open_in_new
                </span>
              </a>
              <a
                href="https://myntra.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center gap-4 rounded-full px-4 text-white hover:bg-white/5 group transition-all"
              >
                <div className="size-8 rounded-lg bg-[#FF3F6C]/20 flex items-center justify-center text-[#FF3F6C]">
                  <span className="material-symbols-outlined text-[20px]">
                    apparel
                  </span>
                </div>
                <p className="text-base font-medium flex-1">Myntra</p>
                <span className="material-symbols-outlined text-white/30 text-base group-hover:text-white group-hover:translate-x-1 transition-all">
                  open_in_new
                </span>
              </a>
            </div>

            {/* Footer */}
            <div className="mt-auto p-6 border-t border-white/5">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="font-bold">Sign Out</span>
              </button>
              <p className="text-[10px] text-white/20 text-center mt-4 tracking-widest uppercase">
                Version 2.4.0 (iOS)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop Closer */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
      ></div>
    </div>
  );
}