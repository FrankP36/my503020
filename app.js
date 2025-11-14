// ===== Firebase Setup =====
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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
const auth = getAuth();
const provider = new GoogleAuthProvider();

// ===== DOM Elements =====
const darkModeToggle = document.getElementById("darkModeToggle");
const logoutBtn = document.getElementById("logoutBtn");
const googleSignInBtn = document.getElementById("googleSignInBtn");
const budgetForm = document.getElementById("budgetForm");
const incomeInput = document.getElementById("income");
const needsList = document.getElementById("needsList");
const wantsList = document.getElementById("wantsList");
const savingsList = document.getElementById("savingsList");
const chartToggleBtn = document.getElementById("chartToggleBtn");
const chartCanvas = document.getElementById("budgetChart").getContext("2d");

// ===== Dark Mode Persistence =====
function applyDarkMode(isDark) {
  if (isDark) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
  localStorage.setItem("darkMode", isDark);
}

darkModeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  applyDarkMode(isDark);
});

// Load dark mode preference
const savedDarkMode = localStorage.getItem("darkMode") === "true";
applyDarkMode(savedDarkMode);

// ===== Firebase Authentication =====

// Google Sign-In
googleSignInBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(result => {
      alert(`Signed in as ${result.user.displayName}`);
    })
    .catch(err => alert(err.message));
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
});

// ===== Budget Calculation =====
function calculateBudget(income) {
  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;
  return { needs, wants, savings };
}

// ===== Chart.js Setup =====
let currentChartType = "pie";
let budgetChart;

function renderChart(data) {
  if (budgetChart) budgetChart.destroy();

  budgetChart = new Chart(chartCanvas, {
    type: currentChartType,
    data: {
      labels: ["Needs (50%)", "Wants (30%)", "Savings (20%)"],
      datasets: [{
        label: "Budget Breakdown",
        data: [data.needs, data.wants, data.savings],
        backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// Toggle chart type
chartToggleBtn.addEventListener("click", () => {
  currentChartType = currentChartType === "pie" ? "bar" : "pie";
  const income = parseFloat(incomeInput.value);
  if (!isNaN(income)) renderChart(calculateBudget(income));
});

// ===== Form Submit =====
budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const income = parseFloat(incomeInput.value);
  if (isNaN(income) || income <= 0) {
    alert("Please enter a valid income.");
    return;
  }

  const { needs, wants, savings } = calculateBudget(income);

  // Update lists
  needsList.innerHTML = `<li>$${needs.toFixed(2)}</li>`;
  wantsList.innerHTML = `<li>$${wants.toFixed(2)}</li>`;
  savingsList.innerHTML = `<li>$${savings.toFixed(2)}</li>`;

  // Render chart
  renderChart({ needs, wants, savings });
});
