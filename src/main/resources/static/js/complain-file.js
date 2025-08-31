import { supabase } from "./supabase-client.js";

const form = document.getElementById("complaintForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //  get current logged-in employee
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    alert("Please login again.");
    return;
  }

  const employeeSupabaseUserId = user.id;

  const complaint = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
  };

  try {
    const res = await fetch(`/api/issues/employee/${employeeSupabaseUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaint),
    });

    if (!res.ok) throw new Error("Failed to submit complaint");
    const saved = await res.json();

    document.getElementById("compID").textContent = saved.id;
    document.getElementById("idModal").style.display = "block";
    form.reset();
  } catch (err) {
    console.error(err);
    alert(" Error submitting complaint");
  }
});

export function closeModal() {
  document.getElementById("idModal").style.display = "none";
}
window.closeModal = closeModal;
