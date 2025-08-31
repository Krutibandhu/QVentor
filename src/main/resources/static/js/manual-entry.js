import { supabase } from "./supabase-client.js";

let qrDiv = document.getElementById("qrcode");

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Auth error:", error.message);
    return null;
  }
  return data.user;
}

async function loadWarehouses(adminSupabaseId) {
  try {
    const res = await fetch(`/api/admins/${adminSupabaseId}`);
    if (!res.ok) throw new Error("Failed to fetch admin");
    const admin = await res.json();
    const warehouses = admin.warehouses || [];

    const select = document.getElementById("manual-warehouse");
    warehouses.forEach((w) => {
      const opt = document.createElement("option");
      opt.value = w.warehouseName;
      opt.textContent = w.warehouseName;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    alert(" Failed to load warehouses.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert("⚠ Please log in.");
    window.location.href = "/html/employee-login.html";
    return;
  }

  const adminSupabaseId = user.user_metadata.adminId;
  if (!adminSupabaseId) {
    alert("⚠ No admin ID in employee metadata.");
    return;
  }

  await loadWarehouses(adminSupabaseId);

  const form = document.getElementById("manualForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //  Build Item + Import JSON
    const itemData = {
      name: document.getElementById("manual-name").value,
      description: document.getElementById("manual-desc").value,
      price: parseFloat(document.getElementById("manual-price").value),
      quantity: parseInt(document.getElementById("manual-qty").value),
      warehouses: [
        { warehouseName: document.getElementById("manual-warehouse").value },
      ],
      imports: [
        {
          documentNumber: document.getElementById("manual-doc").value,
          vendorName: document.getElementById("manual-vendor").value,
          vendorEmail: document.getElementById("vendorEmail").value,
          quantityOrdered: parseInt(
            document.getElementById("manual-ordered").value
          ),
          quantityBilled: parseInt(
            document.getElementById("manual-billed").value
          ),
          quantityReceived: parseInt(
            document.getElementById("manual-received").value
          ),
          date: document.getElementById("manual-date").value,
          status: document.getElementById("manual-status").value,
        },
      ],
      exports: [],
    };

    try {
      const res = await fetch(`/api/items/save/${adminSupabaseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!res.ok) throw new Error("Failed to save item with imports");
      const savedItem = await res.json();

      alert(" Item & Import saved successfully!");

      //  Show QR
      const qrUrl = `${window.location.origin}/html/qr-view.html?itemId=${savedItem.id}`;
      qrDiv.innerHTML = "";
      new QRCode(qrDiv, {
        text: qrUrl,
        width: 200,
        height: 200,
        colorDark: "#ffffff",
        colorLight: "#0a1a3d",
      });
      document.getElementById("qrPopup").style.display = "flex";

      form.reset();
    } catch (err) {
      console.error(err);
      alert(" Error saving product.");
    }
  });
});

//  QR Download
document.getElementById("downloadQR").addEventListener("click", () => {
  const canvas = qrDiv.querySelector("canvas") || qrDiv.querySelector("img");
  if (!canvas) {
    alert("QR not generated yet!");
    return;
  }
  const dataURL =
    canvas.tagName.toLowerCase() === "canvas"
      ? canvas.toDataURL("image/png")
      : canvas.src;
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "product-qr.png";
  link.click();
});
