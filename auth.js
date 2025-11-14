// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// 🔹 Firebase config
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const googleBtn = document.getElementById("googleBtn");
const messageDiv = document.getElementById("message");

// 🔹 Register
registerBtn.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(() => {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Registered successfully!";
    })
    .catch(error => {
      messageDiv.style.color = "red";
      messageDiv.textContent = error.message;
    });
});

// 🔹 Login
loginBtn.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(() => {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Logged in successfully!";
      window.location.href = "chat.html"; // redirect
    })
    .catch(error => {
      messageDiv.style.color = "red";
      messageDiv.textContent = error.message;
    });
});

// 🔹 Google Sign-In
googleBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Google Sign-In successful!";
      window.location.href = "chat.html";
    })
    .catch(error => {
      messageDiv.style.color = "red";
      messageDiv.textContent = error.message;
    });
});

// 🔹 Persist login
onAuthStateChanged(auth, user => {
  if(user){
    window.location.href = "chat.html";
  }
});
