import { supabase } from "./supabase-client.js";

let currentAdmin;

//  Ensure user stays logged in
supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    window.location.href = "/html/login.html"; // Redirect if not logged in
  }
});

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }

  if (!user) {
    window.location.href = "login.html"; // Redirect if no user
    return null;
  }
  return user;
}

function updateDashboard(admin) {
  // Admin profile
  document.getElementById("name").textContent = admin.fullName;
  document.getElementById("email").textContent = admin.email;
}

//  Load Admin data from backend
async function loadAdminData() {
  const user = await getCurrentUser();
  if (!user) return;

  const supabaseUserId = user.id;

  try {
    const response = await fetch(
      `/api/admins/${supabaseUserId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch admin data");
    }

    const admin = await response.json();;
    currentAdmin = admin;

    updateDashboard(admin);
  } catch (err) {
    console.error(err.message);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadAdminData);
