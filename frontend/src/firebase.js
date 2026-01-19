import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ275DlFD_YoS4IzU-nxYIVo4ZHo5M-pk",
  authDomain: "sizemyhoodie.firebaseapp.com",
  projectId: "sizemyhoodie",
  storageBucket: "sizemyhoodie.firebasestorage.app",
  messagingSenderId: "155713541848",
  appId: "1:155713541848:web:e87e70d79e38586beca9ad"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
