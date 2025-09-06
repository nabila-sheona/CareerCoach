// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApo2-I7AZ_gTzt9O1XMv5_uqkx0lv4i0A",
  authDomain: "careercoach-426f4.firebaseapp.com",
  projectId: "careercoach-426f4",
  storageBucket: "careercoach-426f4.firebasestorage.app",
  messagingSenderId: "88234188752",
  appId: "1:88234188752:web:b01a3180b940d2f6e9a3d5",
  measurementId: "G-10ZDSCBDEH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
