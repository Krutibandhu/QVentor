import { supabase } from "./supabase-client.js";

const tbody = document.querySelector("#employeeTable tbody");

// Get logged-in admin
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

// Load employees from backend
async function loadEmployees() {
  const adminUser = await getCurrentUser();
  if (!adminUser) return;

  try {
    const res = await fetch(
      `/api/employees/admin/${adminUser.id}`
    );
    if (!res.ok) throw new Error("Failed to fetch employees");

    const employees = await res.json();
    renderTable(employees);
  } catch (err) {
    console.error("Error loading employees:", err.message);
    alert(" Could not load employees.");
  }
}

// Render table rows
function renderTable(employees) {
  tbody.innerHTML = "";

  employees.forEach((emp, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${emp.fullName}</td>
      <td>${emp.email}</td>
      <td>${emp.phoneNumber}</td>
      <td>${emp.department || "-"}</td>
      <td>${emp.role || "-"}</td>
      <td>${emp.status || "Active"}</td>
      <td>
        <button class="delete-btn" data-id="${emp.supabaseUserId}">
          🗑 Delete
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Attach delete listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteEmployee(btn.dataset.id));
  });
}

// Delete employee
async function deleteEmployee(employeeSupabaseId) {
  if (!confirm("⚠ Are you sure you want to delete this employee?")) return;

  try {
    const res = await fetch(
      `/api/employees/supabase/${employeeSupabaseId}`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error("Failed to delete employee");

    alert("Employee deleted successfully");
    loadEmployees(); // reload table
  } catch (err) {
    console.error("Error deleting employee:", err.message);
    alert(" Could not delete employee.");
  }
}

// Run on page load
loadEmployees();
