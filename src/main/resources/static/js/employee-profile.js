import { supabase } from "./supabase-client.js";

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching current user:", error.message);
    return null;
  }
  return user;
}

async function loadEmployeeProfile() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/html/employee-login.html"; // redirect if not logged in
    return;
  }

  try {
    const response = await fetch(
      `/api/employees/supabase/${user.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch employee profile");

    const employee = await response.json();

    //  Fill profile fields
    document.getElementById("empName").textContent = employee.fullName || "-";
    document.getElementById("empEmail").textContent = employee.email || "-";
    document.getElementById("empPhone").textContent =
      employee.phoneNumber || "-";
    document.getElementById("empCompany").textContent =
      employee.companyName || "-";
    document.getElementById("empDepartment").textContent =
      employee.department || "-";
    document.getElementById("empRole").textContent = employee.role || "-";
  } catch (err) {
    console.error("Error loading profile:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadEmployeeProfile);
