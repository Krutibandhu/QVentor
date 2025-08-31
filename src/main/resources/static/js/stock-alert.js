import { supabase } from "./supabase-client.js";

const table = document.getElementById("stockTable");

// 🔹 Get logged-in admin
async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    alert("⚠ Please log in as Admin first.");
    window.location.href = "/html/login.html";
    return null;
  }
  return user;
}

// 🔹 Load items from backend
async function loadItems(adminId) {
  try {
    const res = await fetch(`/api/items/admin/${adminId}`);
    if (!res.ok) throw new Error("Failed to fetch items");

    const items = await res.json();
    renderTable(items);
  } catch (err) {
    console.error("Error loading items:", err.message);
    alert(" Could not load items.");
  }
}

// 🔹 Render items in table
function renderTable(items) {
  table.innerHTML = "";

  const lowStockItems = items.filter((item) => item.quantity <= 10);

  if (lowStockItems.length === 0) {
    table.innerHTML = `<tr><td colspan="5">All items are sufficiently stocked.</td></tr>`;
    return;
  }

  lowStockItems.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.description || "-"}</td>
      <td>${item.quantity}</td>
      <td class="low-stock">⚠ Low Stock</td>
    `;

    table.appendChild(row);
  });
}

// 🔹 Init
document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (user) {
    loadItems(user.id);
  }
});
