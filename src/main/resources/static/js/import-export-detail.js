import { supabase } from "./supabase-client.js";

const importsTable = document.getElementById("importsTable");
const exportsTable = document.getElementById("exportsTable");

//  Get current logged-in Supabase user
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

//  Load all imports & exports for admin
async function loadImportExportDetails() {
  const user = await getCurrentUser();
  if (!user) return;

  const supabaseUserId = user.id;

  try {
    // Fetch Imports
    const importRes = await fetch(`/api/admins/${supabaseUserId}/imports`);
    const imports = importRes.ok ? await importRes.json() : [];
    renderImports(imports);

    // Fetch Exports
    const exportRes = await fetch(`/api/admins/${supabaseUserId}/exports`);
    const exports = exportRes.ok ? await exportRes.json() : [];
    renderExports(exports);
  } catch (err) {
    console.error("Error loading import/export:", err.message);
    alert(" Could not load Import/Export records.");
  }
}

//  Render Imports
function renderImports(imports) {
  importsTable.innerHTML = "";
  if (imports.length === 0) {
    importsTable.innerHTML = `<tr><td colspan="9">No Import records found.</td></tr>`;
    return;
  }

  imports.forEach((imp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${imp.id}</td>
      <td>${imp.item?.name || "-"}</td> <!--  Product Name -->
      <td>${imp.date}</td>
      <td>${imp.documentNumber}</td>
      <td>${imp.vendorName || "-"}</td>
      <td>${imp.quantityOrdered}</td>
      <td>${imp.quantityBilled}</td>
      <td>${imp.quantityReceived}</td>
      <td>${imp.status}</td>
    `;
    importsTable.appendChild(row);
  });
}

//  Render Exports
function renderExports(exports) {
  exportsTable.innerHTML = "";
  if (exports.length === 0) {
    exportsTable.innerHTML = `<tr><td colspan="9">No Export records found.</td></tr>`;
    return;
  }

  exports.forEach((exp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.id}</td>
      <td>${exp.item?.name || "-"}</td> <!--  Product Name -->
      <td>${exp.date}</td>
      <td>${exp.documentNumber}</td>
      <td>${exp.customerName || "-"}</td>
      <td>${exp.quantityOrdered}</td>
      <td>${exp.quantityBilled}</td>
      <td>${exp.quantityShipped}</td>
      <td>${exp.status}</td>
    `;
    exportsTable.appendChild(row);
  });
}

// Run on load
document.addEventListener("DOMContentLoaded", loadImportExportDetails);
