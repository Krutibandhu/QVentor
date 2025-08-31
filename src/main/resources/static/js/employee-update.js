import { supabase } from "./supabase-client.js";

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting current user:", error.message);
    return null;
  }
  return user;
}

async function loadEmployeeDetails() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/html/employee-login.html";
    return;
  }

  try {
    const response = await fetch(
      `/api/employees/supabase/${user.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch employee");

    const employee = await response.json();

    // Pre-fill form
    document.getElementById("empName").value = employee.fullName || "";
    document.getElementById("empPhone").value = employee.phoneNumber || "";
    document.getElementById("empCompany").value = employee.companyName || "";
    document.getElementById("empDepartment").value = employee.department || "";
    document.getElementById("empRole").value = employee.role || "";
  } catch (err) {
    console.error("Error loading employee:", err.message);
  }
}

document
  .getElementById("employee-update-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = await getCurrentUser();
    if (!user) return;

    const updatedEmployee = {
      fullName: document.getElementById("empName").value.trim(),
      phoneNumber: document.getElementById("empPhone").value.trim(),
      companyName: document.getElementById("empCompany").value.trim(),
      department: document.getElementById("empDepartment").value.trim(),
      role: document.getElementById("empRole").value.trim(),
    };

    try {
      const res = await fetch(
        `/api/employees/supabase/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEmployee),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      alert("Employee details updated successfully!");
      window.location.href = "/html/employee-profile.html";
    } catch (err) {
      console.error("Error updating employee:", err.message);
      alert("Error updating details: " + err.message);
    }
  });

document.addEventListener("DOMContentLoaded", loadEmployeeDetails);
