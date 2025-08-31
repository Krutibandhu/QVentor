import { supabase } from "./supabase-client.js";

const updateForm = document.getElementById("updateAdminForm");

// Prefill admin data on page load
window.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    alert("⚠ Please log in first.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`/api/admins/${user.id}`);
    if (!res.ok) throw new Error("Failed to fetch admin details");

    const admin = await res.json();
    document.getElementById("adminFullName").value = admin.fullName || "";
    document.getElementById("adminPhone").value = admin.phoneNumber || "";
    document.getElementById("adminCompany").value = admin.companyName || "";
  } catch (err) {
    console.error(err.message);
    alert(" Could not load admin details.");
  }
});

// Handle update
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("adminFullName").value;
  const phoneNumber = document.getElementById("adminPhone").value;
  const companyName = document.getElementById("adminCompany").value;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    alert("⚠ Please log in first.");
    return;
  }

  try {
    const res = await fetch(`/api/admins/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phoneNumber, companyName }),
    });

    if (!res.ok) throw new Error("Update failed");

    alert("Profile updated successfully!");
    window.location.href = "profile.html"; // go back after update
  } catch (err) {
    console.error("Error updating admin:", err.message);
    alert("Could not update details.");
  }
});
