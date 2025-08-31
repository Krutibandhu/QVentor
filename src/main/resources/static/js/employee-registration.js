import { supabase } from "./supabase-client.js";

const employeeForm = document.querySelector("#employee-registration-form");

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting current user:", error.message);
    return null;
  }
  return user;
}

employeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.querySelector("#employee-fullname").value.trim();
  const email = document.querySelector("#employee-email").value.trim();
  const phoneNumber = document.querySelector("#employee-phone").value.trim();
  const companyName = document
    .querySelector("#employee-companyname")
    .value.trim();
  const department = document.querySelector("#employee-department").value;
  const role = document.querySelector("#employee-role").value;
  const password = document.querySelector("#employee-password").value;
  const confirmPassword = document.querySelector(
    "#employee-confirmpassword"
  ).value;

  if (password !== confirmPassword) {
    alert("Passwords don’t match");
    return;
  }

  const adminUser = await getCurrentUser();
  if (!adminUser) {
    alert("Admin must be logged in to register employees.");
    return;
  }

  const adminSupabaseUserId = adminUser.id;

  try {
    // 1. Sign up employee in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "employee",
          adminId: adminSupabaseUserId,
        },
      },
    });
    if (error) throw error;

    const supabaseUserId = data.user.id;

    // 2. Backend call to save employee entity
    const employeePayload = {
      fullName,
      email,
      phoneNumber,
      companyName,
      department,
      role,
      supabaseUserId,
    };

    const res = await fetch(
      `/api/employees/${adminSupabaseUserId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeePayload),
      }
    );

    if (!res.ok) throw new Error("Backend save failed");

    // 3. Show success popup
    document.getElementById("popup").style.display = "flex";
    employeeForm.reset();
  } catch (err) {
    console.error("Error registering employee:", err.message);
    alert("Error: " + err.message);
  }
});
