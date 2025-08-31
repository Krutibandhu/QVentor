import { supabase } from "./supabase-client.js";

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    // if needed, fetch role info from Supabase user metadata
    const role = data.user.user_metadata.role;

    // redirect based on role
    if (role === "admin") {
      window.location.href = "/html/dashboard.html";
    } else {
      window.location.href = "/employee-dashboard.html";
    }
  } catch (err) {
    console.error(err.message);
    alert("Login failed: " + err.message);
  }
});


