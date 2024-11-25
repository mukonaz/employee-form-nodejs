// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const LoginPage = async (email, password) => {
    const auth = getAuth();
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token); // Save token for subsequent requests
      console.log("Logged in successfully");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to login. Please check your credentials.");
    }
  };
// Firebase configuration (replace with your Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyABB64d9MeTUU6i5toKVsmlRM8av1QLLJo",
    authDomain: "employee-form-88b9a.firebaseapp.com",
    projectId: "employee-form-88b9a",
    storageBucket: "employee-form-88b9a.firebasestorage.app",
    messagingSenderId: "905178198504",
    appId: "1:905178198504:web:46827e68a128cbc757f45d",
    measurementId: "G-YLFVTXTH2N"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
