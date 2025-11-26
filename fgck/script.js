// =======================
// IMPORTS
// =======================
import { auth, db } from "./firebase.js";

import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import { 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// =======================
// CONFIG
// =======================
const adminEmails = ["janenjerishera@gmail.com"];
const currentPage = window.location.pathname.split("/").pop();

// =======================
// DASHBOARD PROTECTION
// =======================
if(currentPage === "admin-dashboard.html") {
  onAuthStateChanged(auth, user => {
    if(!user || !adminEmails.includes(user.email)) {
      alert("You must login as admin to access this page!");
      window.location.href = "admin.html";
    }
  });

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if(logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "index.html";
      } catch(err) {
        console.error(err);
        alert("Logout failed: " + err.message);
      }
    });
  }
}

// =======================
// ADMIN LOGIN
// =======================
if(currentPage === "admin.html") {
  const adminForm = document.getElementById("adminForm");

  if(adminForm) {
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("adminEmail").value.trim();
      const password = document.getElementById("adminPassword").value.trim();

      if(!email || !password){
        alert("Please enter both email and password.");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if(!adminEmails.includes(userCredential.user.email)){
          alert("You are not authorized as admin.");
          await signOut(auth);
          return;
        }

        // Login successful → redirect
        window.location.href = "admin-dashboard.html";

        
      } catch(err) {
        console.error(err);
        alert("Login failed: " + err.message);
      }
    });
  }
}

// =======================
// LOAD MEMBERS
// =======================
async function loadMembers(){
  const table = document.getElementById("memberTable");
  if(!table) return;

  table.innerHTML = `<tr><th>Name</th><th>Phone</th><th>Ministry</th><th>Status</th></tr>`;

  const snapshot = await getDocs(collection(db, "members"));
  snapshot.forEach(doc => {
    const m = doc.data();
    table.innerHTML += `<tr>
      <td>${m.name}</td>
      <td>${m.phone}</td>
      <td>${m.ministry}</td>
      <td>${m.status}</td>
    </tr>`;
  });
}
if(document.getElementById("memberTable")) loadMembers();

// =======================
// LOAD FINANCES
// =======================
async function loadFinances(){
  const table = document.getElementById("financeTable");
  if(!table) return;

  table.innerHTML = `<tr><th>Date</th><th>Category</th><th>Amount</th><th>Voucher</th></tr>`;

  const snapshot = await getDocs(collection(db, "finances"));
  const chartData = { labels: [], values: [] };

  snapshot.forEach(doc => {
    const f = doc.data();
    const date = f.date?.seconds ? new Date(f.date.seconds*1000).toLocaleDateString() : f.date;
    table.innerHTML += `<tr>
      <td>${date}</td>
      <td>${f.category}</td>
      <td>${f.amount}</td>
      <td>${f.voucher || ""}</td>
    </tr>`;

    // Chart data
    chartData.labels.push(f.category);
    chartData.values.push(f.amount);
  });

  renderFinanceChart(chartData);
}
if(document.getElementById("financeTable")) loadFinances();

// =======================
// LOAD ASSETS
// =======================
async function loadAssets(){
  const table = document.getElementById("assetsTable");
  if(!table) return;

  table.innerHTML = `<tr><th>Name</th><th>Category</th><th>Value</th><th>Status</th></tr>`;

  const snapshot = await getDocs(collection(db, "assets"));
  snapshot.forEach(doc => {
    const a = doc.data();
    table.innerHTML += `<tr>
      <td>${a.name}</td>
      <td>${a.category}</td>
      <td>${a.value}</td>
      <td>${a.status}</td>
    </tr>`;
  });
}
if(document.getElementById("assetsTable")) loadAssets();

// =======================
// EXPORT TABLE TO PDF
// =======================
function exportTablePdf(tableId, filename){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const table = document.getElementById(tableId);
  if(!table) return;

  let y = 10;
  Array.from(table.rows).forEach(row => {
    doc.text(Array.from(row.cells).map(c=>c.innerText).join(" | "), 10, y);
    y += 10;
  });

  doc.save(filename);
}

// =======================
// EXPORT TABLE TO EXCEL
// =======================
function exportTableExcel(tableId, filename){
  const table = document.getElementById(tableId);
  if(!table) return;
  const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
  XLSX.writeFile(wb, filename);
}

// =======================
// EXPORT BUTTONS
// =======================
document.getElementById("exportMembersPdf")?.addEventListener("click", () => exportTablePdf("memberTable", "Members_Report.pdf"));
document.getElementById("exportMembersExcel")?.addEventListener("click", () => exportTableExcel("memberTable", "Members_Report.xlsx"));

document.getElementById("exportFinancePdf")?.addEventListener("click", () => exportTablePdf("financeTable", "Finances_Report.pdf"));
document.getElementById("exportFinanceExcel")?.addEventListener("click", () => exportTableExcel("financeTable", "Finances_Report.xlsx"));

document.getElementById("exportAssetsPdf")?.addEventListener("click", () => exportTablePdf("assetsTable", "Assets_Report.pdf"));
document.getElementById("exportAssetsExcel")?.addEventListener("click", () => exportTableExcel("assetsTable", "Assets_Report.xlsx"));

// =======================
// FINANCE CHART
// =======================
function renderFinanceChart(data){
  const canvas = document.getElementById("financeChart");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Amount",
        data: data.values,
        backgroundColor: "rgba(128, 0, 128, 0.7)"
      }]
    },
    options: { responsive: true }
  });
}

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  // Currently just logs the message
  console.log("Contact Form Submission:", { name, email, phone, message });

  alert("Thank you for reaching out! We will get back to you soon.");

  contactForm.reset();
});


// =======================
// LOG
// =======================
document.addEventListener("DOMContentLoaded", () => {
  console.log("FGCK Nazareth Church admin loaded successfully!");
});



