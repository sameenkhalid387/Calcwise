const params = new URLSearchParams(location.search);
const tool = params.get("tool") || "percentage";
const app = document.getElementById("app");

const money = n => "$" + Number(n).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const num = n => Number(n).toLocaleString("en-US", {
  maximumFractionDigits: 2
});

const tools = {

mortgage: {
title: "Mortgage Calculator",
intro: "Estimate your monthly mortgage payment.",
fields: [
["price","Home price ($)","400000"],
["down","Down payment ($)","80000"],
["rate","Annual interest rate (%)","6.5"],
["years","Loan term (years)","30"]
],
calc:v=>{
let P=Math.max(0,v.price-v.down);
let r=v.rate/100/12;
let n=v.years*12;
let m=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;
return `Estimated monthly payment: <strong>${money(m)}</strong><br>
Loan amount: ${money(P)}<br>
Total principal + interest: ${money(m*n)}`;
}
},

salary: {
title:"Salary Calculator",
intro:"Convert annual salary into monthly, weekly and hourly amounts.",
fields:[
["annual","Annual salary ($)","60000"],
["hours","Hours per week","40"],
["weeks","Paid weeks per year","52"]
],
calc:v=>{
let h=v.annual/(v.hours*v.weeks);
return `Hourly: <strong>${money(h)}</strong><br>
Monthly: ${money(v.annual/12)}<br>
Weekly: ${money(v.annual/v.weeks)}`;
}
},

concrete: {
title:"Concrete Slab Calculator",
intro:"Estimate concrete needed for a rectangular slab.",
fields:[
["length","Length (ft)","20"],
["width","Width (ft)","12"],
["depth","Depth (inches)","4"]
],
calc:v=>{
let yd=v.length*v.width*(v.depth/12)/27;
return `Concrete needed: <strong>${num(yd*1.10)} cubic yards</strong><br>
Base volume: ${num(yd)} yd³<br>
Includes 10% waste.`;
}
},

percentage: {
title:"Percentage Calculator",
intro:"Find a percentage of a number.",
fields:[
["percent","Percentage (%)","15"],
["number","Number","200"]
],
calc:v=>`${v.percent}% of ${num(v.number)} = <strong>${num(v.percent*v.number/100)}</strong>`
},

loan: {
title:"Loan Calculator",
intro:"Estimate a fixed monthly loan payment.",
fields:[
["amount","Loan amount ($)","20000"],
["rate","Annual interest rate (%)","8"],
["years","Loan term (years)","5"]
],
calc:v=>{
let P=v.amount;
let r=v.rate/100/12;
let n=v.years*12;
let m=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;
return `Monthly payment: <strong>${money(m)}</strong><br>
Total paid: ${money(m*n)}<br>
Total interest: ${money(m*n-P)}`;
}
},

profit: {
title:"Profit Margin Calculator",
intro:"Calculate profit and profit margin.",
fields:[
["revenue","Revenue ($)","10000"],
["cost","Total cost ($)","7000"]
],
calc:v=>{
let p=v.revenue-v.cost;
return `Profit: <strong>${money(p)}</strong><br>
Profit margin: <strong>${num(p/v.revenue*100)}%</strong>`;
}
},

markup: {
title:"Markup Calculator",
intro:"Calculate selling price from cost and markup.",
fields:[
["cost","Cost ($)","50"],
["markup","Markup (%)","40"]
],
calc:v=>{
let s=v.cost*(1+v.markup/100);
return `Selling price: <strong>${money(s)}</strong><br>
Gross profit: ${money(s-v.cost)}`;
}
},

tip: {
title:"Tip Calculator",
intro:"Calculate tip and split a bill.",
fields:[
["bill","Bill amount ($)","100"],
["tip","Tip (%)","18"],
["people","Number of people","2"]
],
calc:v=>{
let t=v.bill*v.tip/100;
let total=v.bill+t;
return `Tip: <strong>${money(t)}</strong><br>
Total: ${money(total)}<br>
Per person: ${money(total/v.people)}`;
}
},

fuel: {
title:"Fuel Cost Calculator",
intro:"Estimate the fuel cost of a road trip.",
fields:[
["distance","Trip distance (miles)","300"],
["mpg","Vehicle fuel economy (MPG)","30"],
["price","Fuel price per gallon ($)","3.50"]
],
calc:v=>{
let gallons=v.distance/v.mpg;
return `Estimated fuel cost: <strong>${money(gallons*v.price)}</strong><br>
Fuel needed: ${num(gallons)} gallons`;
}
},

roi: {
title:"ROI Calculator",
intro:"Calculate return on investment.",
fields:[
["gain","Final value ($)","12000"],
["cost","Initial investment ($)","10000"]
],
calc:v=>{
let roi=(v.gain-v.cost)/v.cost*100;
return `Profit: <strong>${money(v.gain-v.cost)}</strong><br>
ROI: <strong>${num(roi)}%</strong>`;
}
}

};

const t=tools[tool]||tools.percentage;

document.title=t.title+" | CalcWise";

app.innerHTML=`
<div class="calc-shell">
<h1>${t.title}</h1>
<p class="intro">${t.intro}</p>

<form id="calcForm">
<div class="form-grid">

${t.fields.map(f=>`
<div class="field">
<label for="${f[0]}">${f[1]}</label>
<input id="${f[0]}" type="number" step="any" min="0"
value="${f[2]}" required>
</div>
`).join("")}

</div>

<button class="calc-button">Calculate</button>
</form>

<div id="result" class="result">
Enter your numbers and click Calculate.
</div>

<div class="notes">
<h2>How it works</h2>
<p>
This calculator provides an estimate for informational purposes.
Check your inputs and assumptions before making important decisions.
</p>
<p>
<a href="index.html#calculators">See more free calculators</a>
</p>
</div>

</div>
`;

document.getElementById("calcForm").addEventListener("submit",e=>{
e.preventDefault();

const v={};

t.fields.forEach(f=>{
v[f[0]]=parseFloat(
document.getElementById(f[0]).value
)||0;
});

document.getElementById("result").innerHTML=t.calc(v);
});
