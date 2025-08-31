
import { supabase } from "./supabase-client.js";

// get the form element
const registrationForm = document.querySelector("#admin-registration-form");

// when the form is submitted
registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop page reload

  // collect values from input fields
  const fullName = document.querySelector("#admin-fullname").value;
  const email = document.querySelector("#admin-email").value;
  const phoneNumber = document.querySelector("#admin-phone").value;
  const password = document.querySelector("#admin-password").value;
  const confirmPassword = document.querySelector(
    "#admin-confirmpassword"
  ).value;
  const companyName = document.querySelector("#admin-companyname").value;
  const location = document.querySelector("#admin-whadress").value;
  const warehouseName =
    document.querySelector("#admin-whname").value || "Default Warehouse";

  // check if both passwords match
  if (password !== confirmPassword) {
    alert("Passwords don’t match");
    return;
  }

  try {
    // 1. create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: "admin" } },
    });

    if (error) throw error;

    // Supabase gives us a unique id for this user
    const supabaseUserId = data.user.id;

    // 2. prepare admin details to send to backend
    const adminPayload = {
      fullName,
      email,
      phoneNumber,
      companyName,
      supabaseUserId, // link Supabase auth with backend data
      warehouses: [{ warehouseName,  location, enabled:true}],
    };

    // 3. call backend API to save this admin
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminPayload),
    });

    if (!res.ok) throw new Error("Backend save failed");

    // 4. on success, good to go for login page
    window.location.href = "/html/login.html";
  } catch (err) {
    console.error(err.message);
    alert("Error: " + err.message);
  }
});
