import { auth, provider } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ---- EMAIL LOGIN ---- */
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "app.html";
  } catch (err) {
    document.getElementById("login-error").innerText = err.message;
  }
});

/* ---- GOOGLE LOGIN ---- */
const googleBtn = document.getElementById("google-login");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "app.html";
    } catch (err) {
      document.getElementById("login-error").innerText =
        "Google Sign-in failed: " + err.message;
    }
  });
}

/* ---- LOGOUT ---- */
export function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
