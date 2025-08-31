import { supabase } from "./supabase-client.js";

const tbody = document.getElementById("itemsTable");
let currentUser = null;

//  Get logged-in admin user
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

//  Load all items
async function loadItems() {
  const adminUser = await getCurrentUser();
  if (!adminUser) return;
  currentUser = adminUser;
  try {
    const res = await fetch(`/api/items/admin/${adminUser.id}`);
    if (!res.ok) throw new Error("Failed to fetch items");

    const items = await res.json();
    renderTable(items);
  } catch (err) {
    console.error("Error loading items:", err.message);
    alert(" Could not load items.");
  }
}

//  Render table rows
function renderTable(items) {
  tbody.innerHTML = "";

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No items found.</td></tr>`;
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.description || "-"}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>${item.quantity}</td>
      <td>
        <button class="btn btn-update" data-id="${item.id}">Update</button>
        <button class="btn btn-delete" data-id="${item.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Attach event listeners
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteItem(btn.dataset.id));
  });

  document.querySelectorAll(".btn-update").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = `/html/update-item.html?itemId=${btn.dataset.id}`;
    });
  });
}

//  Delete item
async function deleteItem(itemId) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    const res = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete item");

    alert(" Item deleted successfully!");
    loadItems(); // refresh
  } catch (err) {
    console.error("Error deleting item:", err.message);
    alert(" Could not delete item.");
  }
}

window.searchProducts = async function () {
  const query = searchInput.value.trim();
  if (!query){
    loadItems();
    return; // prevent empty search
  }

  try {
    const adminId = currentUser.id;
    const res = await fetch(
      `/api/items/search/${adminId}?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Failed to search items");
    const results = await res.json();
    renderTable(results);
  } catch (err) {
    console.error("Search error:", err);
    productList.innerHTML = `<p>❌ Error searching products.</p>`;
  }
};

// Run on page load
document.addEventListener("DOMContentLoaded", loadItems);
