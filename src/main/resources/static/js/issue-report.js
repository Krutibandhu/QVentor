import { supabase } from "./supabase-client.js";

const table = document.getElementById("complaintsTable");

//  Get logged-in admin
async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    alert("⚠ Please log in as Admin first.");
    window.location.href = "/html/login.html";
    return null;
  }
  return user;
}

//  Fetch issues for this admin
async function loadIssues(adminId) {
  try {
    const res = await fetch(
      `/api/issues/admin/${adminId}`
    );
    if (!res.ok) throw new Error("Failed to fetch issues");

    const issues = await res.json();
    renderTable(issues);
  } catch (err) {
    console.error("Error loading issues:", err.message);
    alert(" Could not load issues.");
  }
}

//  Render table
function renderTable(issues) {
  table.innerHTML = "";
  if (issues.length === 0) {
    table.innerHTML = `<tr><td colspan="5">No complaints filed yet.</td></tr>`;
    return;
  }

  issues.forEach((issue, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${issue.title}</td>
      <td>${issue.description}</td>
      <td>
        <select class="status-select" data-id="${issue.id}">
          <option value="OPEN" ${
            issue.status === "OPEN" ? "selected" : ""
          }>OPEN</option>
          <option value="IN_PROGRESS" ${
            issue.status === "IN_PROGRESS" ? "selected" : ""
          }>IN PROGRESS</option>
          <option value="RESOLVED" ${
            issue.status === "RESOLVED" ? "selected" : ""
          }>RESOLVED</option>
        </select>
      </td>
      <td>
        <button class="update-btn" data-id="${issue.id}">Update</button>
      </td>
    `;

    table.appendChild(row);
  });

  // Attach update listeners
  document.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const issueId = btn.dataset.id;
      const newStatus = document.querySelector(
        `.status-select[data-id="${issueId}"]`
      ).value;
      updateIssueStatus(issueId, newStatus);
    });
  });
}

//  Update issue status
async function updateIssueStatus(issueId, status) {
  try {
    const res = await fetch(
      `/api/issues/${issueId}/status?status=${status}`,
      {
        method: "PUT",
      }
    );

    if (!res.ok) throw new Error("Failed to update issue");
    alert(" Issue status updated successfully");
    const user = await getCurrentUser();
    loadIssues(user.id);
  } catch (err) {
    console.error("Error updating issue:", err.message);
    alert(" Could not update issue status.");
  }
}

//  Init
document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (user) {
    loadIssues(user.id);
  }
});
