import { supabase } from "./supabase-client.js";

const poTableBody = document.getElementById("poTableBody");

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    alert("Please log in as Admin first.");
    window.location.href = "/html/login.html";
    return null;
  }
  return data.user;
}

async function loadPurchaseOrders() {
  const user = await getCurrentUser();
  if (!user) return;

  const supabaseUserId = user.id;

  try {
    //  Fetch items (with imports)
    const res = await fetch(`/api/items/admin/${supabaseUserId}`);
    if (!res.ok) throw new Error("Failed to fetch items");
    const items = await res.json();

    poTableBody.innerHTML = "";

    items.forEach((item, idx) => {
      if (item.quantity <= 10) {
        const imports = item.imports || [];
        const latestImport = imports.length
          ? imports[imports.length - 1]
          : null;

        const vendorName = latestImport?.vendorName || "Unknown";
        const vendorId = latestImport?.vendorEntityId || "-";
        const vendorEmail = latestImport?.vendorEmail || "no-vendor@email.com";

        // Random reorder qty 11–30
        const reorderQty =latestImport?.quantityOrdered || Math.floor(Math.random() * (30 - 11 + 1)) + 11;
        const amount = reorderQty * item.price;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td data-label="PO ID">#PO-${idx + 1001}</td>
          <td data-label="Item">${item.name}</td>
          <td data-label="Supplier">${vendorName} (${vendorId})</td>
          <td data-label="Items">${reorderQty}</td>
          <td data-label="Amount">₹${amount}</td>
          <td data-label="Status" class="status-pending">Pending</td>
          <td data-label="Action" class="actions">
            <button class="view-btn" data-itemid = ${item.id}>View</button>
            <button class="approve-btn"
              data-id="${idx + 1001}"
              data-itemid="${item.id}"
            >Approve</button>
            <button class="reject-btn">Reject</button>
          </td>
        `;
        poTableBody.appendChild(row);
      }
    });

    //  Approve button
    document.querySelectorAll(".approve-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const poId = e.target.dataset.id;
        const itemId = e.target.dataset.itemid;

        try {
          const res = await fetch(
            `/api/purchase-orders/${poId}/approve?` +
              new URLSearchParams({
                itemId,
              }),
            { method: "POST" }
          );

          if (!res.ok) throw new Error("Approval request failed");

          const msg = await res.text();
          alert(msg);

          //  Update row to Approved
          const row = e.target.closest("tr");
          const statusCell = row.querySelector("[data-label='Status']");
          statusCell.textContent = "Approved";
          statusCell.className = "status-approved";

          // Remove buttons except View
          const actionCell = row.querySelector("[data-label='Action']");
          actionCell.innerHTML = `<button class="view-btn">View</button>`;
        } catch (err) {
          console.error("Error approving PO:", err.message);
          alert(" Failed to approve purchase order.");
        }
      });
    });

    //  Reject button
    document.querySelectorAll(".reject-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");

        // Update status
        const statusCell = row.querySelector("[data-label='Status']");
        statusCell.textContent = "Rejected";
        statusCell.className = "status-rejected";

        // // Clear action buttons
        // const actionCell = row.querySelector("[data-label='Action']");
        // actionCell.innerHTML = `<button class="view-btn">View</button>`;
      });
    });

    //View Button
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const itemId = e.target.dataset.itemid;

        try {
          const res = await fetch(
            `/api/purchase-orders/view?` +
              new URLSearchParams({
                itemId,
              }),
            { method: "GET" }
          );

          if (!res.ok) throw new Error("Approval request failed");

          const gmailUrl = await res.text();

          window.open(gmailUrl, "_blank");
        } catch (error) {
          console.error("Error Viewing PO:", err.message);
          alert(" Failed to view purchase order.");
        }
      });
    });
  } catch (err) {
    console.error("Error loading purchase orders:", err.message);
    poTableBody.innerHTML = `<tr><td colspan="7"> Failed to load purchase orders.</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", loadPurchaseOrders);
