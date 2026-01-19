import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "firebase/auth";
import { auth, provider, facebookProvider } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Access global auth state

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);
  const [view, setView] = useState("main"); // 'main', 'options', 'phone', 'otp'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);

  // --- GOOGLE LOGIN ---
  async function handleGoogleLogin() {
    try {
      setError("");
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    }
  }

  // --- FACEBOOK LOGIN ---
  async function handleFacebookLogin() {
    try {
      setError("");
      await signInWithPopup(auth, facebookProvider);
      navigate("/home");
    } catch (err) {
      console.error("Facebook Login failed:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Facebook Login is not enabled in the Firebase Console.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Login canceled.");
      } else {
        setError(err.message);
      }
    }
  }

  // --- PHONE AUTH HELPERS ---
  const setupRecaptcha = () => {
    // 1. Clear any existing verifier
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        // Ignore error if already cleared
      }
      window.recaptchaVerifier = null;
    }

    // 2. Force clear the DOM element to remove any lingering Google iframes
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = '';
    }

    // 3. Create a fresh verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
      }
    });
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number with country code (e.g., +15550000000)");
      return;
    }
    setError("");
    setLoading(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setView("otp");
    } catch (err) {
      console.error("SMS Start failed:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Phone authentication is not enabled in the Firebase Console.");
      } else if (err.code === 'auth/invalid-phone-number') {
        setError("The phone number entered is invalid.");
      } else if (err.code === 'auth/missing-phone-number') {
        setError("Please enter a phone number.");
      } else if (err.code === 'auth/billing-not-enabled') {
        setError("Phone Auth requires the Firebase Blaze (Pay-as-you-go) plan.");
      } else {
        setError(err.message);
      }
      // Reset recaptcha if it failed
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    setError("");
    try {
      await confirmationResult.confirm(otp);
      navigate("/home");
    } catch (err) {
      console.error("OTP Verification failed:", err);
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER HELPERS ---
  const goBack = () => {
    setError("");
    setView("main");
    setPhoneNumber("");
    setOtp("");
    // Clear recaptcha so it doesn't conflict next time
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark overflow-hidden min-h-screen">
      {/* Main Container with Vertical Gradient */}
      <div className="relative flex h-screen w-full flex-col bg-[linear-gradient(180deg,#f3e8ff_0%,#e0f2fe_100%)] items-center justify-center p-6">

        {/* Top Branding (Minimalist) */}
        <div className="absolute top-12 flex flex-col items-center">
          <span className="material-symbols-outlined text-deep-charcoal text-3xl mb-2 font-light">apparel</span>
          <div className="h-px w-8 bg-deep-charcoal/20"></div>
        </div>

        {/* Central Login Card (Glassmorphism) */}
        <div className="bg-white/40 backdrop-blur-[20px] border border-white/60 w-full max-w-[380px] rounded-xl p-10 flex flex-col items-center shadow-2xl">

          {/* Brand Logo Serif */}
          <h1 className="font-serif text-[32px] text-deep-charcoal tracking-tight font-light mb-2">SizeMyHoodie</h1>

          {/* Minimalist Tagline */}
          <p className="text-deep-charcoal/60 text-[10px] tracking-[0.3em] font-medium uppercase mb-12">
            Authentic Fit. Premium Comfort.
          </p>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 w-full bg-red-50/50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs text-center">
              {error}
            </div>
          )}

          {/* Decorative Visual Element */}
          <div
            className="w-full aspect-square mb-12 bg-cover bg-center rounded-lg shadow-sm"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAL1uxOMLYKsi0ZhgK-2-2KeLdAxUZpit0fdaYKn115oW7YTuiSA-HZHVCYZtFTBHITt9ZlPzpBXrajTcu6YBLtVY_mzEZdFf2vbFtinLgRR0F0fxrQ0U4wfwoifZGmobO_kd7nQq7loBdMh3GM83RW33ZQ1xGyUaqwTIPHNu0JbVejFtRiLntmTJ36hVFgfUFIMZpo65KV6Zp6eDgJW5VYLuUmRRz8RyxwOMlKMPmlEdWrpNJYNNcafAUb7JXTaAspjwL7rGLXEPc")'
            }}
          >
          </div>

          {/* Login with Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 bg-white hover:bg-white/90 transition-colors text-deep-charcoal border border-white/50 h-14 rounded-lg px-6 shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-sm font-semibold tracking-tight">Continue with Google</span>
          </button>

          {/* Secondary CTA */}
          <a className="mt-8 text-deep-charcoal/50 text-xs font-medium hover:text-primary transition-colors underline underline-offset-4 decoration-primary/20" href="#">
            Trouble signing in?
          </a>
        </div>

        {/* Footer Policy Links */}
        <div className="absolute bottom-10 flex gap-6">
          <a className="text-[10px] uppercase tracking-widest text-deep-charcoal/40 font-bold hover:text-deep-charcoal/60 transition-colors" href="#">Privacy</a>
          <a className="text-[10px] uppercase tracking-widest text-deep-charcoal/40 font-bold hover:text-deep-charcoal/60 transition-colors" href="#">Terms</a>
          <a className="text-[10px] uppercase tracking-widest text-deep-charcoal/40 font-bold hover:text-deep-charcoal/60 transition-colors" href="#">Support</a>
        </div>

        {/* iOS Home Indicator Simulation */}
        <div className="absolute bottom-2 w-32 h-1 bg-deep-charcoal/10 rounded-full"></div>
      </div>
    </div>
  );
}
