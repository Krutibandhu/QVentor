document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("itemId");
  const detailsDiv = document.getElementById("details");

  let currentItem = null;

  if (!itemId) {
    detailsDiv.innerHTML = "<p>⚠ No item ID found in QR code.</p>";
    return;
  }

  try {
    const response = await fetch(`/api/items/${itemId}`);
    if (!response.ok) throw new Error("Failed to fetch item details");

    const item = await response.json();
    currentItem = item;
    detailsDiv.innerHTML = renderItemDetails(item);
  } catch (error) {
    console.error(error);
    detailsDiv.innerHTML = "<p> Error loading product details.</p>";
  }

  //  Styled PDF Download
  document.getElementById("downloadPdfBtn").addEventListener("click", () => {
    if (!currentItem) return alert("No item loaded!");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 15;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(212, 175, 122); // gold
    doc.text("QVentor - Product Report", 10, y);
    y += 10;

    doc.setDrawColor(212, 175, 122);
    doc.line(10, y, 200, y);
    y += 10;

    // Product Details
    doc.setFont("helvetica", "bold");
    doc.setTextColor(212, 175, 122);
    doc.setFontSize(14);
    doc.text("Product Details", 10, y);
    y += 8;

    doc.setFont("helvetica", "nromal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Name: ${currentItem.name || "-"}`, 10, y);
    y += 7;
    doc.text(`Description: ${currentItem.description || "-"}`, 10, y);
    y += 7;
    doc.text(`Quantity: ${currentItem.quantity ?? "-"}`, 10, y);
    y += 7;
    doc.text(`Price: ${currentItem.price ?? "-"}`, 10, y);
    y += 12;

    // Warehouses
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 122);
    doc.text("Warehouses", 10, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    if (currentItem.warehouses?.length) {
      currentItem.warehouses.forEach((w) => {
        doc.text(`- ${w.warehouseName}`, 15, y);
        y += 6;
      });
    } else {
      doc.text("None", 15, y);
      y += 6;
    }
    y += 8;

    // Import Records
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 122);
    doc.text("Import Records", 10, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    if (currentItem.imports?.length) {
      currentItem.imports.forEach((imp) => {
        doc.setFontSize(12);
        doc.setDrawColor(200);
        doc.rect(10, y, 190, 25); // box
        doc.text(`Date: ${imp.date}`, 12, y + 6);
        doc.text(
          `Doc#: ${imp.documentNumber} | Status: ${imp.status}`,
          12,
          y + 12
        );
        doc.text(
          `Vendor: ${imp.vendorName} (${imp.vendorEntityId})`,
          12,
          y + 18
        );
        doc.text(
          `Ordered: ${imp.quantityOrdered}, Billed: ${imp.quantityBilled}, Received: ${imp.quantityReceived}`,
          12,
          y + 24
        );
        y += 32;
      });
    } else {
      doc.text("No import records", 12, y);
      y += 8;
    }
    y += 8;

    // Export Records
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 122);
    doc.text("Export Records", 10, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    if (currentItem.exports?.length) {
      currentItem.exports.forEach((exp) => {
        doc.setFontSize(12);
        doc.rect(10, y, 190, 25);
        doc.text(`Date: ${exp.date}`, 12, y + 6);
        doc.text(
          `Doc#: ${exp.documentNumber} | Status: ${exp.status}`,
          12,
          y + 12
        );
        doc.text(`Customer: ${exp.customerName || "-"}`, 12, y + 18);
        doc.text(
          `Ordered: ${exp.quantityOrdered}, Shipped: ${exp.quantityShipped}, Invoiced: ${exp.quantityInvoiced}`,
          12,
          y + 24
        );
        y += 32;
      });
    } else {
      doc.text("No export records", 12, y);
    }

    // Save PDF
    doc.save(`item-${currentItem.id || "details"}.pdf`);
  });
});

// Render in HTML
function renderItemDetails(item) {
  return `
    <p><b>Name:</b> ${item.name || "-"}</p>
    <p><b>Description:</b> ${item.description || "-"}</p>
    <p><b>Quantity:</b> ${item.quantity ?? "-"}</p>
    <p><b>Price:</b> ${item.price ?? "-"}</p>
    <h3 style="color: var(--gold);">Warehouses</h3>
    ${
      item.warehouses?.length
        ? item.warehouses.map((w) => `<p>🏢 ${w.warehouseName}</p>`).join("")
        : "<p>No warehouses linked</p>"
    }
    <h3 style="color: var(--gold);">Import Records</h3>
    ${
      item.imports?.length
        ? item.imports
            .map(
              (imp) => `
      <div style="border:1px solid var(--gold);margin:6px;padding:6px;border-radius:6px;text-align:left;">
        <p><b>Date:</b> ${imp.date}</p>
        <p><b>Doc#:</b> ${imp.documentNumber}</p>
        <p><b>Status:</b> ${imp.status}</p>
        <p><b>Vendor:</b> ${imp.vendorName} (${imp.vendorEntityId})</p>
        <p><b>Ordered:</b> ${imp.quantityOrdered}, Billed: ${imp.quantityBilled}, Received: ${imp.quantityReceived}</p>
      </div>`
            )
            .join("")
        : "<p>No import records</p>"
    }
    <h3 style="color: var(--gold);">Export Records</h3>
    ${
      item.exports?.length
        ? item.exports
            .map(
              (exp) => `
      <div style="border:1px solid var(--gold);margin:6px;padding:6px;border-radius:6px;text-align:left;">
        <p><b>Date:</b> ${exp.date}</p>
        <p><b>Doc#:</b> ${exp.documentNumber}</p>
        <p><b>Status:</b> ${exp.status}</p>
        <p><b>Customer:</b> ${exp.customerName || "-"}</p>
        <p><b>Ordered:</b> ${exp.quantityOrdered}, Shipped: ${
                exp.quantityShipped
              }, Invoiced: ${exp.quantityInvoiced}</p>
      </div>`
            )
            .join("")
        : "<p>No export records</p>"
    }
  `;
}
