import { auth, provider } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* -----------------------------
    DOM ELEMENTS
------------------------------ */
const loginForm = document.getElementById("login-form");
const googleBtn = document.getElementById("google-login");
const errorBox = document.getElementById("login-error");

/* -----------------------------
   EMAIL/PASSWORD LOGIN
------------------------------ */
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorBox.textContent = ""; // Clear previous error

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            errorBox.textContent = "Please enter both email and password.";
            return;
        }

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in:", userCred.user.email);

            window.location.href = "dashboard.html"; // redirect after login
        } catch (error) {
            console.error("Login failed:", error.message);
            errorBox.textContent = mapAuthError(error.code);
        }
    });
}

/* -----------------------------
    GOOGLE LOGIN
------------------------------ */
if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        errorBox.textContent = "";

        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Google login success:", result.user.email);

            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Google login failed:", error.message);
            errorBox.textContent = mapAuthError(error.code);
        }
    });
}

/* -----------------------------
    HELPER: Firebase Error Mapping
------------------------------ */
function mapAuthError(code) {
    switch (code) {
        case "auth/invalid-email":
            return "Invalid email format.";
        case "auth/user-not-found":
            return "No user found with this email.";
        case "auth/wrong-password":
            return "Incorrect password.";
        case "auth/popup-closed-by-user":
            return "Google login popup closed.";
        default:
            return "Login failed. Please try again.";
    }
}

/* -----------------------------
    AUTH STATE LISTENER
------------------------------ */
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User already logged in:", user.email);
        // You may redirect automatically if desired:
        // window.location.href = "dashboard.html";
    }
});
