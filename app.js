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
