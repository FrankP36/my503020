// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Correct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtLg-93_BcASTg4E5oniGlMkGXQOAo94k",
  authDomain: "my503020.firebaseapp.com",
  projectId: "my503020",
  storageBucket: "my503020.appspot.com",   // FIXED
  messagingSenderId: "612049785066",
  appId: "1:612049785066:web:ba85e8e2af24a05b894793",
  measurementId: "G-N31DMC43S9"
};

// Initialize Firebase + Auth
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
