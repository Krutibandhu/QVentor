import { supabase } from "./supabase-client.js";

const totalProductsEl = document.getElementById("totalProducts");
const totalSoldEl = document.getElementById("totalSold");
const pendingOrdersEl = document.getElementById("pendingOrders");
const totalRevenueEl = document.getElementById("totalRevenue");

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    alert("⚠ Please login again.");
    window.location.href = "/html/employee-login.html";
    return null;
  }
  return data.user;
}

async function loadReport() {
  const user = await getCurrentUser();
  if (!user) return;

  const adminId = user.user_metadata?.adminId;
  if (!adminId) {
    alert("No adminId found for this employee.");
    return;
  }

  try {
    //  Fetch items
    const itemsRes = await fetch(`/api/items/admin/${adminId}`);
    const items = await itemsRes.json();

    //  Fetch exports
    const exportsRes = await fetch(`/api/admins/${adminId}/exports`);
    const exports = await exportsRes.json();

    // ---- Calculations ----
    const totalProducts = items.length;

    const totalSold = exports.reduce((sum, exp) => sum + exp.quantityShipped, 0);

    const pendingOrders = exports.filter(
      (exp) => exp.status?.toLowerCase() === "pending"
    ).length;

    const totalRevenue = exports.reduce((sum, exp) => {
      // find item price
      const item = items.find((i) => i.id === exp.item.id);
      return sum + (exp.quantityShipped * (item?.price || 0));
    }, 0);

    // ---- Update UI ----
    totalProductsEl.textContent = totalProducts;
    totalSoldEl.textContent = totalSold;
    pendingOrdersEl.textContent = pendingOrders;
    totalRevenueEl.textContent = `₹${totalRevenue.toFixed(2)}`;
  } catch (err) {
    console.error("Error loading report:", err);
    alert(" Could not load report data.");
  }
}

// GSAP animations
document.addEventListener("DOMContentLoaded", () => {
  loadReport();

  gsap.to(".navbar", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
  gsap.to(".report-card", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.5,
  });
});
