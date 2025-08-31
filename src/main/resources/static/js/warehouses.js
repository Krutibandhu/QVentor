import { supabase } from "./supabase-client.js";

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  return user;
}

// Fetch all warehouses for logged-in admin
async function fetchWarehouses(userId) {
  try {
    const response = await fetch(`/api/admins/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch admin");

    const admin = await response.json();
    return admin.warehouses || [];
  } catch (err) {
    console.error(err);
    alert(" Error loading warehouses.");
    return [];
  }
}

// Toggle warehouse status
async function toggleWarehouseStatus(warehouseId, warehouseName) {
  try {
    const response = await fetch(
      `/api/admins/warehouse/status/id/${warehouseId}`,
      { method: "PUT" }
    );

    if (!response.ok) throw new Error("Failed to update status");

    alert(` Status updated for ${warehouseName}`);
    location.reload();
  } catch (err) {
    console.error(err);
    alert(" Error updating warehouse status.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert("You must be logged in.");
    window.location.href = "/HTML/login.html";
    return;
  }

  const warehouses = await fetchWarehouses(user.id);
  const list = document.getElementById("warehouseList");

  if (warehouses.length === 0) {
    list.innerHTML = "<p>No warehouses found.</p>";
    return;
  }

  warehouses.forEach(w => {
    const card = document.createElement("div");
    card.className = "warehouse-card";
    card.innerHTML = `
      <div class="warehouse-info">
        <p><strong>${w.warehouseName}</strong></p>
        <p>📍 ${w.location}</p>
      </div>
      <div class="warehouse-status">${w.enabled ? " Active" : " Inactive"}</div>
      <div class="warehouse-actions">
        <button class="toggle-btn">Toggle Status</button>
        <button class="update-btn">✏ Update</button>
      </div>
    `;

    // Toggle functionality
    card.querySelector(".toggle-btn").addEventListener("click", () => {
      toggleWarehouseStatus(w.id, w.warehouseName);
    });

    // Update functionality → redirect to update page
    card.querySelector(".update-btn").addEventListener("click", () => {
      window.location.href = `/html/update-warehouse.html?id=${w.id}`;
    });

    list.appendChild(card);
  });
});
