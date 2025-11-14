// ===== Firebase Authentication =====
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase-config.js"; // your Firebase config file

const auth = getAuth(app);

// ===== DOM Elements =====
const incomeInput = document.getElementById("income");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const budgetList = document.getElementById("budgetList");
const chartCanvas = document.getElementById("budgetChart");
const toggleChartBtn = document.getElementById("toggleChartBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const logoutBtn = document.getElementById("logoutBtn");

// ===== Initialize Chart =====
let currentChartType = "pie";
let budgetChart;

function renderChart(labels, data) {
    if (budgetChart) budgetChart.destroy();

    const ctx = chartCanvas.getContext("2d");
    budgetChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: labels,
            datasets: [{
                label: "Budget Allocation",
                data: data,
                backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

// ===== Dark Mode Persistence =====
function loadDarkMode() {
    const dark = localStorage.getItem("darkMode");
    if (dark === "enabled") document.body.classList.add("dark");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// ===== Logout =====
function logoutUser() {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully!");
            // Stay on app.html (no redirect)
        })
        .catch(err => console.error(err));
}

// ===== Chart Toggle =====
function toggleChart() {
    currentChartType = currentChartType === "pie" ? "bar" : "pie";
    calculateBudget(); // re-render chart
}

// ===== 50/30/20 Budget Calculation =====
function calculateBudget() {
    const income = parseFloat(incomeInput.value);
    if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income!");
        return;
    }

    const needs = (income * 50) / 100;
    const wants = (income * 30) / 100;
    const savings = (income * 20) / 100;

    // Update list
    budgetList.innerHTML = `
        <li>Needs (50%): $${needs.toFixed(2)}</li>
        <li>Wants (30%): $${wants.toFixed(2)}</li>
        <li>Savings (20%): $${savings.toFixed(2)}</li>
    `;

    // Update chart
    renderChart(["Needs", "Wants", "Savings"], [needs, wants, savings]);
}

// ===== Reset =====
function resetBudget() {
    incomeInput.value = "";
    budgetList.innerHTML = "";
    if (budgetChart) budgetChart.destroy();
}

// ===== Event Listeners =====
calculateBtn.addEventListener("click", calculateBudget);
resetBtn.addEventListener("click", resetBudget);
toggleChartBtn.addEventListener("click", toggleChart);
darkModeToggle.addEventListener("click", toggleDarkMode);
logoutBtn.addEventListener("click", logoutUser);

// ===== Firebase Auth State =====
onAuthStateChanged(auth, user => {
    if (!user) {
        alert("Please login to use the budget app!");
        // Optionally: redirect to index.html
    }
});

// ===== Initialize =====
loadDarkMode();
