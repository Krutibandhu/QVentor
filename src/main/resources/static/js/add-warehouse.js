import { supabase } from "./supabase-client.js";

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
  return user;
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form");

  // handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = await getCurrentUser();
    if (!user) {
      alert("You must be logged in to add a warehouse.");
      window.location.href = "/html/login.html";
      return;
    }

    // get form values
    const warehouseName = form.querySelector("input[placeholder='Enter Warehouse Name']").value;
    const location = form.querySelector("input[placeholder='Enter Location']").value;

    const warehouseData = {
      warehouseName,
      location,
      enabled: true
    };

    try {
      const response = await fetch(
        `/api/admins/${user.id}/warehouses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(warehouseData)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add warehouse");
      }

      const result = await response.json();
      alert(" Warehouse added successfully!");

      // redirect back to dashboard
      window.location.href = "/html/dashboard.html";

    } catch (err) {
      console.error(err);
      alert(" Error: " + err.message);
    }
  });
});
