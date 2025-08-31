import { supabase } from "./supabase-client.js";

// Employee login form
const loginForm = document.querySelector("#employee-login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#employee-email").value.trim();
  const password = document.querySelector("#employee-password").value.trim();

  try {
    // 1️⃣ Login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;
    console.log("Employee logged in:", user);

    // 2️⃣ Fetch employee data from backend (to verify existence & get details)
    const res = await fetch(
      `/api/employees/supabase/${user.id}`
    );

    if (!res.ok) {
      throw new Error("Employee not found in backend");
    }

    const employee = await res.json();
    console.log("Employee backend data:", employee);

    // 3️⃣ Store employee info in localStorage
    localStorage.setItem("employeeName", employee.fullName);
    localStorage.setItem("employeeEmail", employee.email);
    localStorage.setItem("employeeId", employee.id);

    // 4️⃣ Redirect to employee dashboard
    window.location.href = "/html/employee-dashboard.html";

  } catch (err) {
    console.error("Login error:", err.message);
    alert(" " + err.message);
  }
});
