document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.getElementById('date');
    let today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Load saved data from localStorage
    loadInvoiceData();
});

let items = [];
let paidIn = 0;

// --- LOCAL STORAGE FUNCTIONS ---
function saveInvoiceData() {
    const invoiceData = {
        to: document.getElementById('to').value,
        invno: document.getElementById('invno').value,
        date: document.getElementById('date').value,
        items: items,
        paidIn: paidIn
    };
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
}

function loadInvoiceData() {
    const saved = localStorage.getItem('invoiceData');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('to').value = data.to || '';
        document.getElementById('invno').value = data.invno || '';
        document.getElementById('date').value = data.date || new Date().toISOString().split('T')[0];
        items = data.items || [];
        paidIn = data.paidIn || 0;
        renderTable();
    }
}

// --- TABLE FUNCTIONS ---
function renderTable() {
    const tbody = document.getElementById("items-body");
    tbody.innerHTML = "";
    items.forEach((item, idx) => {
        tbody.innerHTML += `
          <tr>
            <td><input type="text" class="item-input" value="${item.desc}" onchange="updateDesc(${idx}, this.value)" /></td>
            <td><input type="number" class="item-input" min="0" value="${item.qty}" onchange="updateQty(${idx}, this.value)" style="width:40px;text-align:center;" /></td>
            <td><input type="number" class="item-input" min="0" value="${item.price}" onchange="updatePrice(${idx}, this.value)" style="width:85px;text-align:right;" /></td>
            <td style="text-align:right">${(item.qty * item.price).toLocaleString()}</td>
            <td><button class="action-btn" onclick="removeRow(${idx})">Delete</button></td>
          </tr>`;
    });
    for (let i = items.length; i < 7; i++) {
        tbody.innerHTML += `<tr class="blank-row"><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>`;
    }
    updateSummary();
}

// --- CRUD FUNCTIONS ---
function addRow() {
    items.push({ desc: "", qty: 0, price: 0 });
    renderTable();
    saveInvoiceData();
}

function removeRow(idx) {
    items.splice(idx, 1);
    renderTable();
    saveInvoiceData();
}

function updateDesc(idx, val) {
    items[idx].desc = val;
    renderTable();
    saveInvoiceData();
}

function updateQty(idx, val) {
    items[idx].qty = parseInt(val) || 0;
    renderTable();
    saveInvoiceData();
}

function updatePrice(idx, val) {
    items[idx].price = parseInt(val) || 0;
    renderTable();
    saveInvoiceData();
}

function updateSummary() {
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    document.getElementById("summary-total").textContent = total.toLocaleString();
    document.getElementById("summary-paidin").textContent = paidIn.toLocaleString();
    document.getElementById("summary-balance").textContent = (total - paidIn).toLocaleString();
    saveInvoiceData();
}

// Save invoice meta changes
document.getElementById('to').addEventListener('input', saveInvoiceData);
document.getElementById('invno').addEventListener('input', saveInvoiceData);
document.getElementById('date').addEventListener('input', saveInvoiceData);

renderTable();
