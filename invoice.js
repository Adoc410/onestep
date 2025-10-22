
    document.addEventListener('DOMContentLoaded', function () {
      const dateInput = document.getElementById('date');
      let today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    });

    let items = [];
    let paidIn = 0;

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

    function addRow() {
      items.push({ desc: "", qty: 0, price: 0 });
      renderTable();
    }
    function removeRow(idx) {
      items.splice(idx, 1);
      renderTable();
    }
    function updateDesc(idx, val) {
      items[idx].desc = val;
      renderTable();
    }
    function updateQty(idx, val) {
      items[idx].qty = parseInt(val) || 0;
      renderTable();
    }
    function updatePrice(idx, val) {
      items[idx].price = parseInt(val) || 0;
      renderTable();
    }
    function updateSummary() {
      const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
      document.getElementById("summary-total").textContent = total.toLocaleString();
      document.getElementById("summary-paidin").textContent = paidIn.toLocaleString();
      document.getElementById("summary-balance").textContent = (total - paidIn).toLocaleString();
    }
    renderTable();
  