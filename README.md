# SizeMyHoodie 👕 
**AI-Powered Clothing Size & Fit Assistant**

SizeMyHoodie is a mobile-first, AI-powered web application that helps users find the **perfect clothing size** using a photo.  
Instead of relying on outdated size charts, it analyzes real body proportions and provides **size recommendations, fit warnings, and body measurements**.

---

## 🚀 Features

### 🔐 Authentication
- Google Sign-In using Firebase Authentication
- Secure and seamless login experience


## 🌐 Live Application URL

🔗 **Website:**  
https://sizemyhoodie.vercel.app/

> The application is optimized for mobile devices for the best experience.

### 🧠 AI Body Analysis
- Uses MediaPipe Pose Landmarker for body detection
- Extracts body ratios (shoulders, arms, torso)
- Classifies body type and arm type

### 📏 Accuracy Calibration (Key Feature)
Users can improve accuracy using:
- **Height Input** (quick & easy)
- **A4 Sheet Reference** (high precision)

This converts pixel measurements into **real-world centimeters**.

### 👕 Clothing Support
- T-Shirts
- Oversized Hoodies
- Jackets

### 📊 Smart Results
- Recommended size (S / M / L / XL)
- Estimated body measurements:
  - Chest
  - Shoulder width
  - Arm length
  - Front length
- Fit analysis bars (tight / good / loose)
- Personalized warnings (e.g. *“Sleeves may feel tight for broad shoulders”*)

### 🎨 Premium UI
- Mobile-first design
- Pastel, product-grade theme
- Smooth navigation flow like Swiggy / Flipkart
- Image preview with rotate & fit tools

### 🛒 Shopping Integration
- Quick links to Amazon, Flipkart, and Myntra
- Built to reduce wrong size orders and returns

### 🧭 App Flow
- Google Login
- Home (Start Flexing)
- Select Apparel
- Camera / Gallery
- Preview + Accuracy Calibration
- Analyze
- Results (Size, Measurements, Warnings)

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Firebase Authentication
- MediaPipe Tasks (Vision)

### Backend / Logic
- MediaPipe Pose Landmarker
- Custom ratio & sizing logic
- Calibration-based scaling (Height / A4)

### Deployment
- Frontend: **Vercel**
- AI inference: **Client-side (MediaPipe WASM)**

---
👨‍💻 Author

Rayhan
- Built with a focus on AI, product design, and real-world usability.

📜 License

- This project is for educational and experimental purposes.
- Commercial use requires further validation and testing.




