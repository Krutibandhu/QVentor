import { supabase } from "./supabase-client.js";

let currentAdmin;

//  Ensure user stays logged in
supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    window.location.href = "/html/login.html";
  }
});

// Logout handler
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
    alert("Failed to logout, please try again.");
  } else {
    localStorage.clear();
    window.location.href = "/html/login.html";
  }
});

//  Update dashboard UI
function updateDashboard(admin) {
  document.getElementById("adminDisplayName").textContent = admin.fullName;
  document.getElementById("adminImage").src =
    "https://i.pravatar.cc/150?u=" + admin.email;

  const warehouses = admin.warehouses || [];
  const activeCount = warehouses.filter((w) => w.enabled).length;
  const inactiveCount = warehouses.length - activeCount;

  document.querySelector(".stat-box.wh h2").textContent = warehouses.length;
  document.querySelector(".stat-box.active h2").textContent = activeCount;
  document.querySelector(".stat-box.inactive h2").textContent = inactiveCount;

  const items = admin.items || [];
  document.querySelector(".stat-box.items h2").textContent = items.length;
  document.querySelector(".stat-box.alert h2").textContent = items.filter(
    (i) => i.quantity <= 10
  ).length;
}

//  Fetch imports & exports and render combined chart
async function loadCharts(supabaseUserId) {
  try {
    const [importsRes, exportsRes] = await Promise.all([
      fetch(`/api/admins/${supabaseUserId}/imports`),
      fetch(`/api/admins/${supabaseUserId}/exports`),
    ]);

    const imports = importsRes.ok ? await importsRes.json() : [];
    const exports = exportsRes.ok ? await exportsRes.json() : [];

    renderCombinedChart(imports, exports);
  } catch (err) {
    console.error("Error fetching charts:", err.message);
  }
}

//  Render combined chart for imports & exports
function renderCombinedChart(imports, exports) {
  const ctx = document.getElementById("importExportChart").getContext("2d");

  // Group by month (YYYY-MM)
  const groupByMonth = (records) => {
    const grouped = {};
    records.forEach((r) => {
      const month = r.date?.substring(0, 7) || "Unknown";
      grouped[month] = (grouped[month] || 0) + r.quantityOrdered;
    });
    return grouped;
  };

  const importsGrouped = groupByMonth(imports);
  const exportsGrouped = groupByMonth(exports);

  // Merge labels
  const allMonths = Array.from(
    new Set([...Object.keys(importsGrouped), ...Object.keys(exportsGrouped)])
  ).sort();

  const importValues = allMonths.map((m) => importsGrouped[m] || 0);
  const exportValues = allMonths.map((m) => exportsGrouped[m] || 0);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: allMonths,
      datasets: [
        {
          label: "Imports",
          data: importValues,
          borderColor: "#b08a57",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Exports",
          data: exportValues,
          borderColor: "#5e5e5e",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#fff" } },
      },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } },
      },
    },
  });
}

//  Get current logged-in user
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
    window.location.href = "login.html";
    return null;
  }
  return user;
}

//  Load Admin data
async function loadAdminData() {
  const user = await getCurrentUser();
  if (!user) return;

  const supabaseUserId = user.id;

  try {
    const response = await fetch(`/api/admins/${supabaseUserId}`);
    if (!response.ok) throw new Error("Failed to fetch admin data");

    const admin = await response.json();
    currentAdmin = admin;

    updateDashboard(admin);
    loadCharts(supabaseUserId);
  } catch (err) {
    console.error(err.message);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadAdminData);
