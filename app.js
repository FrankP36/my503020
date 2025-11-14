// Firebase imports
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from './firebase-config.js'; // your firebase-config.js
import Chart from 'chart.js/auto';

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const budgetForm = document.getElementById('budgetForm');
const incomeInput = document.getElementById('income');
const budgetList = document.getElementById('budgetList');
const chartToggle = document.getElementById('chartToggle');
const budgetChartCanvas = document.getElementById('budgetChart');

let currentChart;

// --- Authentication ---
loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(result => {
            console.log("Logged in as:", result.user.displayName);
            updateUI();
        })
        .catch(err => {
            alert(err.message);
        });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html'; // redirect after logout
    });
});

onAuthStateChanged(auth, user => {
    if (user) {
        updateUI();
    } else {
        // Optional: redirect to login if not logged in
        console.log("No user signed in");
    }
});

// --- Dark Mode ---
function setDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
}

darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setDarkMode(!isDark);
});

// Apply saved dark mode
setDarkMode(localStorage.getItem('darkMode') === 'true');

// --- Budget Calculation ---
budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const income = parseFloat(incomeInput.value);
    if (isNaN(income) || income <= 0) return alert("Please enter a valid income.");

    const needs = income * 0.5;
    const wants = income * 0.3;
    const savings = income * 0.2;

    // Update budget list
    budgetList.innerHTML = '';
    const items = [
        { category: 'Needs (50%)', amount: needs },
        { category: 'Wants (30%)', amount: wants },
        { category: 'Savings (20%)', amount: savings }
    ];

    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.category}: $${item.amount.toFixed(2)}`;
        budgetList.appendChild(li);
    });

    // Render chart
    renderChart(items, 'pie');
});

// --- Chart Rendering ---
function renderChart(dataItems, type) {
    const labels = dataItems.map(d => d.category);
    const data = dataItems.map(d => d.amount);

    if (currentChart) currentChart.destroy();

    currentChart = new Chart(budgetChartCanvas, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Budget Allocation',
                data: data,
                backgroundColor: ['#6200ee', '#03dac6', '#ff0266']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// --- Chart Toggle ---
chartToggle.addEventListener('click', () => {
    if (!currentChart) return;
    const newType = currentChart.config.type === 'pie' ? 'bar' : 'pie';
    currentChart.config.type = newType;
    currentChart.update();
});

// --- Update UI after login ---
function updateUI() {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    document.getElementById('mainContent').style.display = 'block';
}
