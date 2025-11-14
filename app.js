import { auth, signOut } from './firebase-config.js';

const CUR = {
  USD:"$", EUR:"€", GBP:"£", JPY:"¥", CAD:"$", AUD:"$", INR:"₹", NGN:"₦", ZAR:"R",
  KES:"KSh", TZS:"TSh", UGX:"USh"
};
let FX = { USD:1, EUR:0.93, GBP:0.81, JPY:153, CAD:1.38, AUD:1.52, INR:84, NGN:1600, ZAR:18.5, KES:129, TZS:2590, UGX:3800 };
const TYPES = ["Needs","Wants","Savings"];

const state = { currency:"USD", period:"monthly", calcMode:"auto", incomeUSD:3500, rows:[] };

const $ = (id)=>document.getElementById(id);

const els = {
  toggleDark:$("toggle-dark"), logoutBtn:$("logoutBtn"), income:$("income"),
  currency:$("currency"), period:$("period"), calcMode:$("calcMode"), calcBtn:$("calcBtn"),
  share:$("share"), catBody:$("catBody"),
  incomeVal:$("incomeVal"), needsVal:$("needsVal"), wantsVal:$("wantsVal"),
  savingsVal:$("savingsVal"), totalVal:$("totalVal"), remainVal:$("remainVal"),
  savingsPct:$("savingsPct"), fiveThreeTwo:$("fiveThreeTwo"), advice:$("advice"),
  fxStatus:$("fxStatus"), toggleChart:$("toggleChart"), budgetChart:$("budgetChart")
};

// Dark Mode
let darkMode = localStorage.getItem('darkMode') === 'true';
if(darkMode) document.body.classList.add('dark');
els.toggleDark.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Logout
els.logoutBtn.addEventListener('click', async ()=>{ await signOut(auth); window.location.href='index.html'; });

// FX Update
async function updateFX(){
  const url = "https://api.exchangerate.host/latest?base=USD";
  let ok=false;
  try{
    const res = await fetch(url,{cache:'no-store'});
    const data = await res.json();
    if(data && data.rates && data.rates.USD===1){
      FX = { USD:1, EUR:data.rates.EUR??FX.EUR, GBP:data.rates.GBP??FX.GBP, JPY:data.rates.JPY??FX.JPY,
             CAD:data.rates.CAD??FX.CAD, AUD:data.rates.AUD??FX.AUD, INR:data.rates.INR??FX.INR,
             NGN:data.rates.NGN??FX.NGN, ZAR:data.rates.ZAR??FX.ZAR, KES:data.rates.KES??FX.KES,
             TZS:data.rates.TZS??FX.TZS, UGX:data.rates.UGX??FX.UGX };
      localStorage.setItem("bp_fx_rates_v1", JSON.stringify(FX));
      localStorage.setItem("bp_fx_time_v1", String(Date.now()));
      ok=true;
    }
  }catch(e){ console.warn("FX fetch failed", e); }
  const last=Number(localStorage.getItem("bp_fx_time_v1")||0), agoMin=last?Math.round((Date.now()-last)/60000):null;
  els.fxStatus.textContent = ok?"Live rates updated": last?`Using cached rates ${agoMin} min ago`:"Using fallback rates";
  syncCurrencyUI(); triggerCompute();
}
updateFX(); setInterval(updateFX, 60*60*1000);

// Currency conversion
const toUSD=(val)=> val/(FX[state.currency]||1);
const fromUSD=(val)=> val*(FX[state.currency]||1);
const fmt=(n)=> { try{return n.toLocaleString(undefined,{style:"currency",currency:state.currency,maximumFractionDigits:0})}catch{return (CUR[state.currency]||"$")+Math.round(n)}}

// Period factor
const getPeriodFactor = ()=> state.period==="annual"?12:1;

// Rows
function addRow(data){
  const id=crypto.randomUUID?.()||String(Date.now()+Math.random());
  const tr=document.createElement("tr"); tr.dataset.id=id;

  const nameTd=document.createElement("td");
  const nameInput=document.createElement("input"); nameInput.type="text"; nameInput.placeholder="Category"; nameTd.appendChild(nameInput);

  const amtTd=document.createElement("td");
  const amtInput=document.createElement("input"); amtInput.type="number"; amtInput.min="0"; amtInput.value=0; amtTd.appendChild(amtInput);

  const typeTd=document.createElement("td");
  const typeSel=document.createElement("select");
  TYPES.forEach(t=>{const opt=document.createElement("option"); opt.value=t; opt.textContent=t; typeSel.appendChild(opt)});
  typeTd.appendChild(typeSel);

  const actTd=document.createElement("td");
  const delBtn=document.createElement("button"); delBtn.textContent="Delete"; delBtn.className="btn";
  delBtn.addEventListener("click", ()=>{ tr.remove(); state.rows=state.rows.filter(r=>r.id!==id); triggerCompute(); });
  actTd.appendChild(delBtn);

  tr.appendChild(nameTd); tr.appendChild(amtTd); tr.appendChild(typeTd); tr.appendChild(actTd);
  els.catBody.appendChild(tr);

  const row={id,
    get name(){return nameInput.value}, set name(v){nameInput.value=v},
    get amountUSD(){return toUSD(+amtInput.value||0)}, set amountUSD(v){amtInput.value=Math.round(fromUSD(v))},
    get type(){return typeSel.value}, set type(v){typeSel.value=v}
  };
  state.rows.push(row);
  [nameInput, amtInput].forEach(el=>el.addEventListener("input", triggerCompute));
  typeSel.addEventListener("change", triggerCompute);

  if(data){ nameInput.value=data.name||""; amtInput.value=Math.round(fromUSD(data.amountUSD||0)); typeSel.value=data.type||"Needs"; }

  return row;
}

function presetExample(){
  els.catBody.innerHTML=""; state.rows=[];
  addRow({name:"Housing", amountUSD:1200, type:"Needs"});
  addRow({name:"Transportation", amountUSD:225, type:"Needs"});
  addRow({name:"Groceries", amountUSD:400, type:"Needs"});
  addRow({name:"Savings Goal", amountUSD:500, type:"Savings"});
  addRow({name:"Entertainment", amountUSD:200, type:"Wants"});
}

// Compute logic
function compute(){
  const factor=getPeriodFactor();
  const incomePeriod=state.incomeUSD*factor;
  let needsUSD=0, wantsUSD=0, savingsUSD=0, totalUSD=0;
  state.rows.forEach(r=>{ const amt=r.amountUSD*factor; totalUSD+=amt; if(r.type==="Needs") needsUSD+=amt; else if(r.type==="Wants") wantsUSD+=amt; else savingsUSD+=amt });
  const remaining=incomePeriod-totalUSD;
  els.incomeVal.textContent=fmt(fromUSD(incomePeriod));
  els.needsVal.textContent=fmt(fromUSD(needsUSD));
  els.wantsVal.textContent=fmt(fromUSD(wantsUSD));
  els.savingsVal.textContent=fmt(fromUSD(savingsUSD));
  els.totalVal.textContent=fmt(fromUSD(totalUSD));
  els.remainVal.textContent=fmt(fromUSD(remaining));
  const sp=(incomePeriod>0?100*savingsUSD/incomePeriod:0).toFixed(2)+"%"; els.savingsPct.textContent=sp;
  const tgt=[0.5,0.3,0.2].map(p=>p*incomePeriod);
  els.fiveThreeTwo.textContent=`Needs ${needsUSD-tgt[0]>=0?"+":""}${fmt(fromUSD(needsUSD-tgt[0]))}, Wants ${wantsUSD-tgt[1]>=0?"+":""}${fmt(fromUSD(wantsUSD-tgt[1]))}, Savings ${savingsUSD-tgt[2]>=0?"+":""}${fmt(fromUSD(savingsUSD-tgt[2]))}`;
  let msg=remaining<0?"Over budget!":sp<10?"Increase savings":sp>=20?"Excellent savings":"Solid savings";
  els.advice.textContent=msg;

  updateChart(needsUSD,wantsUSD,savingsUSD);
}

function triggerCompute(){ if(state.calcMode==="auto") compute(); }

// Currency sync
function syncCurrencyUI(){ [...els.catBody.querySelectorAll("td:nth-child(2) input")].forEach(inp=>inp.previousSibling?null:null); }
els.currency.addEventListener("change", ()=>{ state.currency=els.currency.value; syncCurrencyUI(); triggerCompute(); });
els.period.addEventListener("change", ()=>{ state.period=els.period.value; triggerCompute(); });
els.calcMode.addEventListener("change", ()=>{ state.calcMode=els.calcMode.value; els.calcBtn.style.display=state.calcMode==="manual"?"inline-block":"none"; });
els.calcBtn.addEventListener("click", compute);

// Income
els.income.addEventListener("input", ()=>{ state.incomeUSD=toUSD(+els.income.value||0)/getPeriodFactor(); triggerCompute(); });

// Add/reset
els.addRow.addEventListener("click", ()=>addRow({name:"", amountUSD:0, type:"Needs"}));
els.reset.addEventListener("click", ()=>{ els.currency.value="USD"; state.currency="USD"; els.period.value="monthly"; state.period="monthly"; els.calcMode.value="auto"; state.calcMode="auto"; els.calcBtn.style.display="none"; els.income.value=3500; state.incomeUSD=3500; presetExample(); syncCurrencyUI(); compute(); });

// Snapshot
els.share.addEventListener("click", async ()=>{
  const factor=getPeriodFactor();
  let lines=["Budget Snapshot","----------------",`Currency: ${state.currency}`,`Period: ${state.period}`,`Income: ${fmt(fromUSD(state.incomeUSD*factor))}`,"Categories:"];
  state.rows.forEach(r=>lines.push(`- ${r.name||"Untitled"} (${r.type}): ${fmt(fromUSD(r.amountUSD*factor))}`));
  const totalUSD=state.rows.reduce((s,r)=>s+r.amountUSD,0)*factor;
  const remaining=state.incomeUSD*factor-totalUSD;
  lines.push(`Total Expenses: ${fmt(fromUSD(totalUSD))}`); lines.push(`Remaining: ${fmt(fromUSD(remaining))}`);
  try{ await navigator.clipboard.writeText(lines.join("\n")); alert("Snapshot copied!") }catch{ alert(lines.join("\n")) }
});

// Chart
let chartType=localStorage.getItem("chartType")||'pie';
let chart;
function updateChart(needs,wants,savings){
  if(chart) chart.destroy();
  chart=new Chart(els.budgetChart.getContext('2d'),{ type:chartType, data:{ labels:["Needs","Wants","Savings"], datasets:[{label:"Budget",data:[needs,wants,savings], backgroundColor:['#FF6384','#36A2EB','#FFCE56']}] }, options:{responsive:true, plugins:{legend:{position:'top'}}}});
}
els.toggleChart.addEventListener("click", ()=>{ chartType=chartType==='pie'?'bar':'pie'; localStorage.setItem("chartType",chartType); compute(); });

// Initialize
presetExample(); compute();
