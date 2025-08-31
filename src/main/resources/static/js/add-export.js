document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("exportForm");
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("itemId");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const exportData = {
      documentNumber: document.getElementById("documentNumber").value,
      date: document.getElementById("exportDate").value,
      status: document.getElementById("status").value,
      quantityOrdered: parseInt(
        document.getElementById("quantityOrdered").value
      ),
      customerEntityId: document.getElementById("customerEntityId").value,
      customerName: document.getElementById("customerName").value,
      quantityBilled: parseInt(document.getElementById("quantityBilled").value),
      quantityShipped: parseInt(
        document.getElementById("quantityShipped").value
      ),
    };

    try {
      const res = await fetch(`/api/items/${itemId}/exports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      });

      if (!res.ok) throw new Error("Failed to add export record");

      alert(" Export record added successfully!");
      window.location.href = "/html/product-details.html";
    } catch (err) {
      console.error("Error:", err.message);
      alert(" Failed to add export record");
    }
  });
});
