import { supabase } from "./supabase-client.js";

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return data.user;
}

async function loadOrderHistory() {
  const user = await getCurrentUser();
  if (!user) {
    alert("Please log in again.");
    window.location.href = "/html/employee-login.html";
    return;
  }

  const adminId = user.user_metadata.adminId; //  Admin Supabase ID from metadata
  if (!adminId) {
    alert("No admin ID found for this employee.");
    return;
  }

  try {
    // Fetch imports
    const importRes = await fetch(`/api/admins/${adminId}/imports`);
    const imports = await importRes.json();

    // Fetch exports
    const exportRes = await fetch(`/api/admins/${adminId}/exports`);
    const exports = await exportRes.json();

    renderImports(imports);
    renderExports(exports);
  } catch (err) {
    console.error("Error loading order history:", err);
    alert("Failed to load order history.");
  }
}

function renderImports(imports) {
  const tbody = document.querySelector("#importTable tbody");
  tbody.innerHTML = "";

  if (!imports.length) {
    tbody.innerHTML = `<tr><td colspan="7">No Import records found.</td></tr>`;
    return;
  }

  imports.forEach((imp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${imp.item?.name || "-"}</td> <!--  Product Name -->
      <td>${imp.date}</td>
      <td>${imp.documentNumber}</td>
      <td>${imp.vendorName}</td>
      <td>${imp.quantityOrdered}</td>
      <td>${imp.quantityReceived}</td>
      <td class="${imp.status.toLowerCase()}">${imp.status}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderExports(exports) {
  const tbody = document.querySelector("#exportTable tbody");
  tbody.innerHTML = "";

  if (!exports.length) {
    tbody.innerHTML = `<tr><td colspan="7">No Export records found.</td></tr>`;
    return;
  }

  exports.forEach((exp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.item?.name || "-"}</td> <!--  Product Name -->
      <td>${exp.date}</td>
      <td>${exp.documentNumber}</td>
      <td>${exp.customerName}</td>
      <td>${exp.quantityOrdered}</td>
      <td>${exp.quantityShipped}</td>
      <td class="${exp.status.toLowerCase()}">${exp.status}</td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadOrderHistory);
