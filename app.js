// Import Firebase auth
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { app } from './firebase-config.js'; // make sure firebase-config.js exports your app

// DOM Elements
const incomeInput = document.getElementById('income');
const calculateBtn = document.getElementById('calculate');
const needsEl = document.getElementById('needs');
const wantsEl = document.getElementById('wants');
const savingsEl = document.getElementById('savings');
const logoutBtn = document.getElementById('logout');
const toggleDarkBtn = document.getElementById('toggle-dark');
const toggleChartBtn = document.getElementById('toggleChart');
const chartCanvas = document.getElementById('budgetChart');

let currentChartType = 'pie';
let chartInstance = null;

// Firebase Auth
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("User signed out"); // just log, no redirect
  }
});

// Logout functionality (just sign out, no redirect)
logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    alert("You have signed out successfully");
  }).catch((error) => {
    console.error("Error logging out:", error);
  });
});

// Dark Mode: Load saved preference
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark');
}

toggleDarkBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
  } else {
    document.body.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
  }
});

// Calculate 50/30/20 budget
calculateBtn.addEventListener('click', () => {
  const income = parseFloat(incomeInput.value);
  if (isNaN(income) || income <= 0) {
    alert("Please enter a valid income amount");
    return;
  }

  const needs = (income * 0.5).toFixed(2);
  const wants = (income * 0.3).toFixed(2);
  const savings = (income * 0.2).toFixed(2);

  needsEl.textContent = needs;
  wantsEl.textContent = wants;
  savingsEl.textContent = savings;

  renderChart(needs, wants, savings);
});

// Render Chart
function renderChart(needs, wants, savings) {
  const data = {
    labels: ['Needs', 'Wants', 'Savings'],
    datasets: [{
      label: 'Budget Allocation',
      data: [needs, wants, savings],
      backgroundColor: ['#4caf50', '#ff9800', '#2196f3']
    }]
  };

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas, {
    type: currentChartType,
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Toggle between Pie and Bar chart
toggleChartBtn.addEventListener('click', () => {
  currentChartType = currentChartType === 'pie' ? 'bar' : 'pie';

  const needs = parseFloat(needsEl.textContent);
  const wants = parseFloat(wantsEl.textContent);
  const savings = parseFloat(savingsEl.textContent);

  renderChart(needs, wants, savings);
});
