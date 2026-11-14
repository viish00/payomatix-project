const transactions = [
 {id:"TXN-2026-1106-1284",merchant:"Urban Cart",method:"UPI",amount:640,status:"Failed",time:"06 Nov · 21:02",utr:"627410583921",type:"UPI payment issue"},
 {id:"TXN-2026-1106-1281",merchant:"Mellow Wear",method:"Card",amount:2199,status:"Refunded",time:"06 Nov · 20:48",utr:"ARN 745812963014",type:"Card refund delay"},
 {id:"TXN-2026-1106-1278",merchant:"Daily Basket",method:"UPI",amount:1280,status:"Successful",time:"06 Nov · 20:31",utr:"627410583887"},
 {id:"TXN-2026-1106-1271",merchant:"Urban Cart",method:"Netbanking",amount:4250,status:"Pending",time:"06 Nov · 20:12",utr:"Pending"},
 {id:"TXN-2026-1106-1264",merchant:"Mellow Wear",method:"Card",amount:3599,status:"Successful",time:"06 Nov · 19:55",utr:"ARN 745812962998"},
 {id:"TXN-2026-1106-1259",merchant:"Daily Basket",method:"UPI",amount:850,status:"Successful",time:"06 Nov · 19:40",utr:"627410583801"}
];
let tickets = [
 {id:"SUP-1042",name:"Urban Cart",type:"UPI payment issue",amount:640,priority:"High",status:"Open",summary:"Customer debited ₹640 at 9 PM; order was not created.",ref:"UTR 627410583921",next:"Verify bank response and merchant callback."},
 {id:"SUP-1041",name:"Mellow Wear",type:"Card refund delay",amount:2199,priority:"Normal",status:"In progress",summary:"Jacket returned 10 days ago; card refund not visible.",ref:"ARN 745812963014",next:"Confirm ARN acceptance and ask issuer to trace."},
 {id:"SUP-1040",name:"Urban Cart",type:"Settlement mismatch",amount:4200,priority:"High",status:"Open",summary:"Settlement payout is ₹4,200 lower than sales report.",ref:"SET-2026-1105-014",next:"Reconcile deductions, cut-off and batch."}
];
let activeTicketFilter="all";
const money=n=>"₹"+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const statusClass=s=>({"Open":"open","In progress":"progress","Resolved":"resolved","Successful":"success","Failed":"failed","Pending":"pending","Refunded":"resolved"}[s]||"open");
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
function go(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));document.getElementById("pageCrumb").textContent=({overview:"Overview",transactions:"Transactions",tickets:"Support tickets",settlements:"Settlements",knowledge:"Help centre"})[page];document.getElementById("sidebar").classList.remove("open");}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.getElementById("mobileMenu").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.querySelector(".notice-close").onclick=e=>e.currentTarget.parentElement.remove();

function statusPill(s){return `<span class="status ${statusClass(s)}">${s}</span>`}
function renderRecent(){document.getElementById("recentTransactions").innerHTML=transactions.slice(0,5).map(t=>`<tr><td class="id-cell">${t.id.slice(-8)}</td><td>${t.merchant}</td><td>${t.method}</td><td class="amount-cell">${money(t.amount)}</td><td>${statusPill(t.status)}</td><td>${t.time}</td></tr>`).join("")}
function renderTransactions(){
 const q=(document.getElementById("transactionSearch").value||"").toLowerCase(),s=document.getElementById("statusFilter").value,m=document.getElementById("methodFilter").value;
 const rows=transactions.filter(t=>(s==="all"||t.status===s)&&(m==="all"||t.method===m)&&[t.id,t.merchant,t.amount,t.utr].join(" ").toLowerCase().includes(q));
 document.getElementById("transactionsBody").innerHTML=rows.length?rows.map(t=>`<tr><td class="id-cell">${t.id}</td><td>${t.merchant}</td><td>${t.method}</td><td class="amount-cell">${money(t.amount)}</td><td>${statusPill(t.status)}</td><td>${t.time}</td><td><button class="small-action" data-detail="${t.id}">Inspect</button></td></tr>`).join(""):`<tr><td colspan="7">No matching demo transactions.</td></tr>`;
 document.querySelectorAll("[data-detail]").forEach(b=>b.onclick=()=>{const t=transactions.find(x=>x.id===b.dataset.detail);toast(`${t.id} · ${t.status} · ${t.utr}`)});
}
["transactionSearch","statusFilter","methodFilter"].forEach(id=>document.getElementById(id).addEventListener("input",renderTransactions));
function renderTickets(){
 const list=tickets.filter(t=>activeTicketFilter==="all"||t.status===activeTicketFilter);
 document.getElementById("ticketList").innerHTML=list.length?list.map(t=>`<div class="ticket-row"><div class="ticket-type-icon ${t.type.includes("UPI")?"blue":t.type.includes("Card")?"violet":"amber"}">${t.type.includes("UPI")?"↗":t.type.includes("Card")?"↩":"₹"}</div><div class="ticket-info"><b>${t.id} · ${t.name}</b><p>${t.summary}</p><p style="margin-top:5px">${t.ref} · ${t.next}</p></div><div class="ticket-meta"><span class="ticket-ref">${t.priority} priority</span>${statusPill(t.status)}<button class="small-action" data-resolve="${t.id}">${t.status==="Resolved"?"Reopen":"Resolve"}</button></div></div>`).join(""):`<p class="muted">No tickets in this view.</p>`;
 document.querySelectorAll("[data-resolve]").forEach(b=>b.onclick=()=>{const t=tickets.find(x=>x.id===b.dataset.resolve);t.status=t.status==="Resolved"?"Open":"Resolved";renderTickets();renderPriority();updateCounts();toast(`${t.id} status updated to ${t.status}.`)});
}
function renderPriority(){const p=tickets.filter(t=>t.status!=="Resolved").slice(0,4);document.getElementById("priorityList").innerHTML=p.map(t=>`<div class="priority-item"><div class="priority-symbol ${t.type.includes("UPI")?"blue":t.type.includes("Card")?"violet":"amber"}">${t.type.includes("UPI")?"↗":t.type.includes("Card")?"↩":"₹"}</div><div class="priority-main"><b>${t.id} · ${t.name}</b><small>${t.type} · ${money(t.amount)}</small></div>${statusPill(t.status)}</div>`).join("")||'<p class="muted">No open cases. Nice work.</p>'}
function updateCounts(){const n=tickets.filter(t=>t.status!=="Resolved").length;document.getElementById("ticketCount").textContent=n;document.getElementById("openMetric").textContent=String(n).padStart(2,"0")}
document.querySelectorAll("[data-ticket-filter]").forEach(b=>b.onclick=()=>{activeTicketFilter=b.dataset.ticketFilter;document.querySelectorAll("[data-ticket-filter]").forEach(x=>x.classList.toggle("active",x===b));renderTickets()});
const backdrop=document.getElementById("modalBackdrop");
function openModal(){backdrop.classList.add("show");document.getElementById("formName").focus()}
function closeModal(){backdrop.classList.remove("show")}
document.getElementById("newTicket").onclick=openModal;document.getElementById("newTicketTop").onclick=openModal;document.getElementById("closeModal").onclick=closeModal;document.getElementById("cancelModal").onclick=closeModal;
backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal()});
document.getElementById("ticketForm").onsubmit=e=>{
 e.preventDefault();const type=document.getElementById("formType").value,amount=Number(document.getElementById("formAmount").value)||0;
 const t={id:"SUP-"+(1043+tickets.length-3),name:document.getElementById("formName").value.trim(),type,amount,priority:document.getElementById("formPriority").value,status:"Open",summary:document.getElementById("formSummary").value.trim(),ref:"Reference pending verification",next:"Collect transaction details and check the dashboard."};
 tickets.unshift(t);closeModal();e.target.reset();activeTicketFilter="all";document.querySelectorAll("[data-ticket-filter]").forEach(x=>x.classList.toggle("active",x.dataset.ticketFilter==="all"));renderTickets();renderPriority();updateCounts();toast("Ticket "+t.id+" created in this demo workspace.");go("tickets");
};
const settlement=[["Gross captured sales","Successful captured payments","₹28,640.00","Credit"],["Refunds","Customer refunds processed","− ₹1,800.00","Debit"],["Chargebacks / disputes","Dispute adjustments","− ₹400.00","Debit"],["Processing fees","Merchant processing charges","− ₹500.00","Debit"],["GST on fees","Tax on processing fees","− ₹90.00","Debit"],["Other adjustment","Reserve / timing adjustment (sample)","− ₹1,410.00","Debit"]];
document.getElementById("settlementRows").innerHTML=settlement.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="amount-cell">${r[2]}</td><td>${r[3]}</td></tr>`).join("");
function calculate(){const gross=Number(document.getElementById("grossInput").value)||0,refund=Number(document.getElementById("refundInput").value)||0,charge=Number(document.getElementById("chargeInput").value)||0,fees=Number(document.getElementById("feesInput").value)||0;document.getElementById("netResult").textContent=money(gross-refund-charge-fees)}
["grossInput","refundInput","chargeInput","feesInput"].forEach(id=>document.getElementById(id).addEventListener("input",calculate));
function csvDownload(name,rows){const csv=rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
document.getElementById("exportTransactions").onclick=()=>{csvDownload("payomatix-demo-transactions.csv",[["Transaction ID","Merchant","Method","Amount INR","Status","Time","Reference"],...transactions.map(t=>[t.id,t.merchant,t.method,t.amount,t.status,t.time,t.utr])]);toast("Transaction CSV exported.")};
document.getElementById("downloadSettlement").onclick=()=>{csvDownload("payomatix-settlement-breakdown.csv",[["Component","Description","Amount","Type"],...settlement]);toast("Settlement breakdown exported.")};
renderRecent();renderTransactions();renderTickets();renderPriority();updateCounts();calculate();
