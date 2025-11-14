import { auth } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const logoutBtn = document.getElementById("logout");
const toggleDark = document.getElementById("toggle-dark");
const incomeInput = document.getElementById("income");
const calculateBtn = document.getElementById("calculate");
const toggleChartBtn = document.getElementById("toggleChart");

const needsEl = document.getElementById("needs");
const wantsEl = document.getElementById("wants");
const savingsEl = document.getElementById("savings");
const ctx = document.getElementById("budgetChart").getContext("2d");

/* AUTH PROTECTION */
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
});

/* LOGOUT */
logoutBtn.onclick = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

/* DARK MODE */
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

toggleDark.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
};

/* CALCULATOR + CHART */
let chartType = localStorage.getItem("chartType") || "pie";
let chart;

function updateChart(needs, wants, savings) {
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: ["Needs", "Wants", "Savings"],
      datasets: [{
        data: [needs, wants, savings],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }]
    }
  });
}

calculateBtn.onclick = () => {
  let income = Number(incomeInput.value) || 0;

  let needs = income * 0.5;
  let wants = income * 0.3;
  let savings = income * 0.2;

  needsEl.textContent = needs.toFixed(2);
  wantsEl.textContent = wants.toFixed(2);
  savingsEl.textContent = savings.toFixed(2);

  updateChart(needs, wants, savings);
};

toggleChartBtn.onclick = () => {
  chartType = chartType === "pie" ? "bar" : "pie";
  localStorage.setItem("chartType", chartType);

  let income = Number(incomeInput.value) || 0;
  updateChart(income * 0.5, income * 0.3, income * 0.2);
};
