// My50/30/20 - app.js (dark-mode starter)
// NOTE: Replace FIREBASE_CONFIG and STRIPE_LINK placeholders below.


const FIREBASE_CONFIG = {
apiKey: "REPLACE_API_KEY",
authDomain: "REPLACE_AUTH_DOMAIN",
projectId: "REPLACE_PROJECT_ID",
storageBucket: "REPLACE_STORAGE_BUCKET",
messagingSenderId: "REPLACE_MSG_ID",
appId: "REPLACE_APP_ID"
};
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_XXXX"; // replace


// Lightweight app packed into one file for GitHub Pages
(function(){
const LS_FX = 'bp_fx_rates_v1';
const LS_FX_TIME = 'bp_fx_time_v1';
const LS_LAST = 'bp_last_budget_v1';
const CUR = { USD:'$', KES:'KSh', EUR:'€', GBP:'£', NGN:'₦', ZAR:'R', TZS:'TSh', UGX:'USh', INR:'₹', JPY:'¥', CAD:'$', AUD:'$' };
let FX = { USD:1, KES:129, EUR:0.93, GBP:0.81, NGN:1600, ZAR:18.5, TZS:2590, UGX:3800, INR:84, JPY:153, CAD:1.38, AUD:1.52 };
try{ const s = JSON.parse(localStorage.getItem(LS_FX) || 'null'); if(s) FX = {...FX,...s}; }catch{}


const $ = id => document.getElementById(id);
const els = {
currency: $('currency'), period:$('period'), calcMode:$('calcMode'), income:$('income'), curSymbol1:$('curSymbol1'), catBody:$('catBody'),
addRow:$('addRow'), reset:$('reset'), exportCsv:$('exportCsv'), exportPdf:$('exportPdf'), copySnapshot:$('copySnapshot'),
saveCloud:$('saveCloud'), loadCloud:$('loadCloud'), authBtn:$('authBtn'), userInfoArea:$('userInfoArea'), stripeBtn:$('stripeBtn'),
incomeLabel:$('incomeVal'), incomeVal:$('incomeVal'), needsVal:$('needsVal'), wantsVal:$('wantsVal'), savingsVal:$('savingsVal'), totalVal:$('totalVal'), remainVal:$('remainVal'), allocChart:$('allocChart'), fxStatus:$('fxStatus'), advice:$('advice'), periodPill:$('periodPill')
};


const TYPES = ['Needs','Wants','Savings'];
let state = { currency:'USD', period:'monthly', calcMode:'auto', incomeUSD:3500, rows:[], user:null };


// Firebase optional init
let db=null, auth=null, firebaseEnabled=false;
try{
if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('REPLACE')){
firebase.i
