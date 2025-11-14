let darkMode = localStorage.getItem('darkMode') === 'true';
if(darkMode) document.body.classList.add('dark');

const toggleDark = document.getElementById('toggle-dark');
toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

const incomeInput = document.getElementById('income');
const calculateBtn = document.getElementById('calculate');
const needsEl = document.getElementById('needs');
const wantsEl = document.getElementById('wants');
const savingsEl = document.getElementById('savings');
const ctx = document.getElementById('budgetChart').getContext('2d');

let chartType = localStorage.getItem('chartType') || 'pie';
let chart;

function updateChart(needs, wants, savings) {
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: ['Needs', 'Wants', 'Savings'],
      datasets: [{
        label: 'Budget Allocation',
        data: [needs, wants, savings],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      }
    }
  });
}

calculateBtn.addEventListener('click', () => {
  const income = parseFloat(incomeInput.value) || 0;
  const needs = (income * 0.5).toFixed(2);
  const wants = (income * 0.3).toFixed(2);
  const savings = (income * 0.2).toFixed(2);

  needsEl.textContent = needs;
  wantsEl.textContent = wants;
  savingsEl.textContent = savings;

  updateChart(needs, wants, savings);
});

const toggleChartBtn = document.getElementById('toggleChart');
toggleChartBtn.addEventListener('click', () => {
  chartType = chartType === 'pie' ? 'bar' : 'pie';
  localStorage.setItem('chartType', chartType);
  const income = parseFloat(incomeInput.value) || 0;
  updateChart((income*0.5).toFixed(2), (income*0.3).toFixed(2), (income*0.2).toFixed(2));
});
