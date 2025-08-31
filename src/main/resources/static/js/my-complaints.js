import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("complaintTableBody");

  //  Get current employee
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    tbody.innerHTML = `<tr><td colspan="5">⚠ Please login again</td></tr>`;
    return;
  }

  try {
    // Fetch complaints for employee
    const res = await fetch(`/api/issues/employee/${user.id}`);
    if (!res.ok) throw new Error("Failed to fetch complaints");

    const complaints = await res.json();
    if (complaints.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No complaints found</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    complaints.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.title}</td>
        <td>${c.description}</td>
        <td>${new Date(c.createdAt).toLocaleString()}</td>
        <td class="${
          c.status.toLowerCase() === "resolved"
            ? "status-resolved"
            : "status-pending"
        }">${c.status}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="5"> Error loading complaints</td></tr>`;
  }
});
