const API = "http://localhost:8080/expenses";

let categoryChart;
let dailyChart;
let heatmap;


// NAVIGATION
function showSection(id){

document.querySelectorAll(".section").forEach(sec=>{
sec.classList.remove("active");
});

document.getElementById(id).classList.add("active");

// highlight sidebar
document.querySelectorAll(".sidebar li").forEach(li=>{
li.classList.remove("active");
});
event.target.classList.add("active");

}


// ADD EXPENSE
async function addExpense(){

const expense = {
amount: Number(document.getElementById("amount").value),
category: document.getElementById("category").value,
description: document.getElementById("description").value,
date: document.getElementById("date").value
};

await fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(expense)
});

loadExpenses();

}


// LOAD
async function loadExpenses(){

const res = await fetch(API);
const expenses = await res.json();

populateTable(expenses);
generateAnalytics(expenses);
generateHeatmap(expenses);

}


// TABLE
function populateTable(expenses){

const table = document.getElementById("expenseTable");
table.innerHTML="";

expenses.forEach(exp=>{

table.innerHTML += `
<tr>
<td>${exp.amount}</td>
<td>${exp.category}</td>
<td>${exp.description}</td>
<td>${exp.date}</td>
<td><button onclick="deleteExpense('${exp.id}')">Delete</button></td>
</tr>
`;

});

}


// DELETE
async function deleteExpense(id){
await fetch(API+"/"+id,{method:"DELETE"});
loadExpenses();
}


// ANALYTICS
function generateAnalytics(expenses){

let total=0;
let categoryMap={};
let dateMap={};

expenses.forEach(exp=>{

total += Number(exp.amount);

categoryMap[exp.category]=(categoryMap[exp.category]||0)+Number(exp.amount);
dateMap[exp.date]=(dateMap[exp.date]||0)+Number(exp.amount);

});

document.getElementById("totalSpent").innerText="₹"+total;

if(Object.keys(dateMap).length>0){
let maxDay=Object.keys(dateMap).reduce((a,b)=>dateMap[a]>dateMap[b]?a:b);
let minDay=Object.keys(dateMap).reduce((a,b)=>dateMap[a]<dateMap[b]?a:b);

document.getElementById("maxDay").innerText=maxDay;
document.getElementById("minDay").innerText=minDay;
}

if(categoryChart) categoryChart.destroy();
if(dailyChart) dailyChart.destroy();


// PIE
categoryChart=new Chart(document.getElementById("categoryChart"),{
type:"pie",
data:{
labels:Object.keys(categoryMap),
datasets:[{
data:Object.values(categoryMap)
}]
}
});


// BAR
dailyChart=new Chart(document.getElementById("dailyChart"),{
type:"bar",
data:{
labels:Object.keys(dateMap),
datasets:[{
label:"Daily",
data:Object.values(dateMap)
}]
}
});

}


// ✅ WORKING HEATMAP (FIXED)
function generateHeatmap(expenses){

const cal = new CalHeatmap();

const data = expenses.map(e=>({
date: e.date,
value: Number(e.amount)
}));

document.getElementById("spendHeatmap").innerHTML="";

cal.paint({
itemSelector:"#spendHeatmap",
range:6,
domain:{type:"month"},
subDomain:{type:"day"},
date:{start:new Date(new Date().getFullYear(),0,1)},
data:{
source:data,
x:"date",
y:"value"
}
});

}


loadExpenses();