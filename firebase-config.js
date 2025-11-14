// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtLg-93_BcASTg4E5oniGlMkGXQOAo94k",
  authDomain: "my503020.firebaseapp.com",
  projectId: "my503020",
  storageBucket: "my503020.firebasestorage.app",
  messagingSenderId: "612049785066",
  appId: "1:612049785066:web:ba85e8e2af24a05b894793",
  measurementId: "G-N31DMC43S9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
