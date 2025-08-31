import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");

  // Store user globally
  let currentUser = null;

  //  Get logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    productList.innerHTML = `<p>⚠ Please login again.</p>`;
    return;
  }
  currentUser = user;

  async function loadItems(items) {
    if (!items.length) {
      productList.innerHTML = `<p>No products found.</p>`;
      return;
    }

    productList.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p><b>Description:</b> ${item.description || "-"}</p>
        <p><b>Price:</b> ₹${item.price}</p>
        <p><b>Quantity:</b> ${item.quantity}</p>
        <p><b>Warehouses:</b> ${
          item.warehouses?.map((w) => w.warehouseName).join(", ") || "-"
        }</p>
        <div class="buttons">
          <button class="btn import-btn" data-id="${item.id}">➕ Add Import</button>
          <button class="btn export-btn" data-id="${item.id}">📤 Add Export</button>
        </div>
      `;
      productList.appendChild(card);
    });

    //  Handle Add Import
    document.querySelectorAll(".import-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const itemId = btn.dataset.id;
        window.location.href = `/html/add-import.html?itemId=${itemId}`;
      });
    });

    //  Handle Add Export
    document.querySelectorAll(".export-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.currentTarget.dataset.id;
        window.location.href = `/html/add-export.html?itemId=${itemId}`;
      });
    });
  }

  // Load all items initially
  try {
    const adminId = currentUser.user_metadata?.adminId;
    const res = await fetch(`/api/items/admin/${adminId}`);
    if (!res.ok) throw new Error("Failed to fetch items");
    const items = await res.json();
    loadItems(items);
  } catch (err) {
    console.error(err);
    productList.innerHTML = `<p> Error loading products.</p>`;
  }

  // Search function
  window.searchProducts = async function () {
    const query = searchInput.value.trim();
    if (!query) return; // prevent empty search

    try {
      const adminId = currentUser.user_metadata?.adminId;
      const res = await fetch(`/api/items/search/${adminId}?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to search items");
      const results = await res.json();
      loadItems(results);
    } catch (err) {
      console.error("Search error:", err);
      productList.innerHTML = `<p>❌ Error searching products.</p>`;
    }
  };
});
