document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("importForm");
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("itemId");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const importData = {
      documentNumber: document.getElementById("documentNumber").value,
      date: document.getElementById("importDate").value,
      status: document.getElementById("status").value,
      quantityOrdered: parseInt(
        document.getElementById("quantityOrdered").value
      ),
      vendorEntityId: document.getElementById("vendorEntityId").value,
      vendorName: document.getElementById("vendorName").value,
      vendorEmail: document.getElementById("vendorEmail").value,
      quantityBilled: parseInt(document.getElementById("quantityBilled").value),
      quantityReceived: parseInt(
        document.getElementById("quantityReceived").value
      ),
    };

    try {
      const res = await fetch(`/api/items/${itemId}/imports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(importData),
      });

      if (!res.ok) throw new Error("Failed to add import record");

      alert(" Import record added successfully!");
      window.location.href = "/html/product-details.html";
    } catch (err) {
      console.error("Error:", err.message);
      alert(" Failed to add import record");
    }
  });
});
