import { supabase } from "./supabase-client.js";

const updateForm = document.getElementById("updateWarehouseForm");

// Extract warehouseId from query string (e.g., update-warehouse.html?id=123)
const urlParams = new URLSearchParams(window.location.search);
const warehouseId = urlParams.get("id");

if (!warehouseId) {
  alert("⚠ No warehouse ID provided!");
  window.location.href = "dashboard.html";
}

// Prefill form with warehouse data
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`/api/admins/warehouse/${warehouseId}`);
    if (!res.ok) throw new Error("Failed to fetch warehouse details");

    const warehouse = await res.json();
    document.getElementById("warehouseName").value = warehouse.warehouseName || "";
    document.getElementById("warehouseLocation").value = warehouse.location || "";
    document.getElementById("warehouseStatus").value = warehouse.enabled ? "true" : "false";
  } catch (err) {
    console.error(err.message);
    alert(" Could not load warehouse details.");
  }
});

// Handle update
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const warehouseName = document.getElementById("warehouseName").value;
  const location = document.getElementById("warehouseLocation").value;
  const enabled = document.getElementById("warehouseStatus").value === "true";

  try {
    const res = await fetch(`/api/admins/warehouse/${warehouseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ warehouseName, location, enabled })
    });

    if (!res.ok) throw new Error("Update failed");

    alert(" Warehouse updated successfully!");
    window.location.href = "/html/dashboard.html"; // go back after update
  } catch (err) {
    console.error("Error updating warehouse:", err.message);
    alert(" Could not update warehouse.");
  }
});
