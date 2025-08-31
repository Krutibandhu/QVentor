import { supabase } from "./supabase-client.js";

let currentEmployee;

//  Ensure user stays logged in
supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    window.location.href = "/html/employee-login.html";
  }
});

//  Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
    alert("Failed to logout. Try again.");
  } else {
    localStorage.clear();
    window.location.href = "/html/employee-login.html";
  }
});

//  Fetch current user
async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return user;
}

//  Load Employee data
async function loadEmployeeData() {
  const user = await getCurrentUser();
  if (!user) return;

  const supabaseUserId = user.id;
  try {
    const res = await fetch(`/api/employees/supabase/${supabaseUserId}`);
    if (!res.ok) throw new Error("Failed to fetch employee data");
    const employee = await res.json();
    console.log("Employee data:", employee);

    currentEmployee = employee;

    // Update UI
    document.getElementById("employeeDisplayName").textContent =
      employee.fullName;
    document.getElementById("employeeImage").src =
      "https://i.pravatar.cc/150?u=" + employee.email;

    //  Get adminId from Supabase user metadata
    const adminId = user.user_metadata.adminId;
    console.log(adminId);
    if (adminId) {
      await loadOrderStats(adminId);
    } else {
      console.warn("⚠ No adminId found in user metadata");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

//  Load Import/Export Orders and update cards
async function loadOrderStats(adminId) {
  try {
    const res = await fetch(`/api/items/admin/${adminId}`);
    if (!res.ok) throw new Error("Failed to fetch items");
    const items = await res.json();
    console.log("Items:", items);

    let orderDone = 0;
    let orderPending = 0;

    items.forEach((item) => {
      // Imports
      if (item.imports && item.imports.length) {
        item.imports.forEach((imp) => {
          if (
            imp.status?.toLowerCase() === "received" ||
            imp.status?.toLowerCase() === "done"
          ) {
            orderDone++;
          } else {
            orderPending++;
          }
        });
      }

      // Exports
      if (item.exports && item.exports.length) {
        item.exports.forEach((exp) => {
          if (
            exp.status?.toLowerCase() === "shipped" ||
            exp.status?.toLowerCase() === "done"
          ) {
            orderDone++;
          } else {
            orderPending++;
          }
        });
      }
    });

    //  Calculate total
    const totalOrders = orderDone + orderPending;

    //  Update UI cards
    document.querySelector(".status-card.done .card-value").textContent =
      orderDone;
    document.querySelector(".status-card.pending .card-value").textContent =
      orderPending;
    document.querySelector(".status-card.product .card-value").textContent =
      items.length;
    document.querySelector(".status-card.total .card-value").textContent =
      totalOrders;
  } catch (err) {
    console.error("Error loading order stats:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadEmployeeData);
