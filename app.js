// -------------------- Firebase Config --------------------
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtLg-93_BcASTg4E5oniGlMkGXQOAo94k",
  authDomain: "my503020.firebaseapp.com",
  projectId: "my503020",
  storageBucket: "my503020.appspot.com",
  messagingSenderId: "612049785066",
  appId: "1:612049785066:web:ba85e8e2af24a05b894793",
  measurementId: "G-N31DMC43S9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// -------------------- DOM Elements --------------------
const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleBtn");
const logoutBtn = document.getElementById("logoutBtn");
const darkToggleBtn = document.getElementById("darkToggle");
const budgetForm = document.getElementById("budgetForm");
const incomeInput = document.getElementById("income");
const needsList = document.getElementById("needsList");
const wantsList = document.getElementById("wantsList");
const savingsList = document.getElementById("savingsList");
const chartCanvas = document.getElementById("budgetChart");
const chartToggleBtn = document.getElementById("chartToggle");

// -------------------- Dark Mode --------------------
function applyDarkMode(isDark) {
  if (isDark) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
  localStorage.setItem("darkMode", isDark);
}

const savedDarkMode = localStorage.getItem("darkMode") === "true";
applyDarkMode(savedDarkMode);

darkToggleBtn.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  applyDarkMode(isDark);
});

// -------------------- Google Sign-In --------------------
googleBtn?.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Signed in as:", result.user.displayName);
    })
    .catch((error) => {
      console.error("Google sign-in error:", error.message);
      alert("Sign-in failed: " + error.message);
    });
});

// -------------------- Logout --------------------
logoutBtn?.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Sign-out error:", error.message);
    });
});

// -------------------- Auth State --------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("No user logged in");
  }
});

// -------------------- Budget Calculation --------------------
let currentChartType = "pie";
let budgetChart;

budgetForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const income = parseFloat(incomeInput.value);
  if (isNaN(income) || income <= 0) {
    alert("Please enter a valid income amount.");
    return;
  }

  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  needsList.innerHTML = `<li>Needs (50%): $${needs.toFixed(2)}</li>`;
  wantsList.innerHTML = `<li>Wants (30%): $${wants.toFixed(2)}</li>`;
  savingsList.innerHTML = `<li>Savings (20%): $${savings.toFixed(2)}</li>`;

  // Update Chart
  const chartData = {
    labels: ["Needs", "Wants", "Savings"],
    datasets: [{
      label: "Budget Distribution",
      data: [needs, wants, savings],
      backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"]
    }]
  };

  if (budgetChart) budgetChart.destroy();
  budgetChart = new Chart(chartCanvas, {
    type: currentChartType,
    data: chartData
  });
});

// -------------------- Chart Toggle --------------------
chartToggleBtn?.addEventListener("click", () => {
  currentChartType = currentChartType === "pie" ? "bar" : "pie";
  budgetForm.dispatchEvent(new Event("submit")); // Refresh chart
});
