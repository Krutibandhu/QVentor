import { supabase } from "./supabase-client.js";

const form = document.getElementById("updateItemForm");
let itemId;

//  Extract itemId from query params
function getItemIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("itemId");
}

//  Load item data
async function loadItem() {
  itemId = getItemIdFromURL();
  if (!itemId) {
    alert(" No item selected for update.");
    window.location.href = "/html/all-items.html";
    return;
  }

  try {
    const res = await fetch(`/api/items/${itemId}`);
    if (!res.ok) throw new Error("Failed to fetch item");

    const item = await res.json();
    fillForm(item);
  } catch (err) {
    console.error("Error loading item:", err.message);
    alert(" Could not load item.");
  }
}

//  Pre-fill form
function fillForm(item) {
  document.getElementById("name").value = item.name || "";
  document.getElementById("description").value = item.description || "";
  document.getElementById("price").value = item.price || 0;
  document.getElementById("quantity").value = item.quantity || 0;
}

//  Submit updated data
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedItem = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    quantity: parseInt(document.getElementById("quantity").value, 10),
  };

  try {
    const res = await fetch(`/api/items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    if (!res.ok) throw new Error("Failed to update item");

    alert(" Item updated successfully!");
    window.location.href = "/html/all-items.html"; // redirect back
  } catch (err) {
    console.error("Error updating item:", err.message);
    alert(" Could not update item.");
  }
});

// Run on page load
document.addEventListener("DOMContentLoaded", loadItem);
