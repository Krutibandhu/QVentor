import { supabase } from "./supabase-client.js";
import * as docx from "https://cdn.jsdelivr.net/npm/docx@8.5.0/+esm";

const importsTable = document.getElementById("importsTable");
const exportsTable = document.getElementById("exportsTable");

//  Get current logged-in Supabase user
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

//  Load all imports & exports for admin
async function loadImportExportDetails() {
  const user = await getCurrentUser();
  if (!user) return;

  const supabaseUserId = user.id;

  try {
    // Fetch Imports
    const importRes = await fetch(`/api/admins/${supabaseUserId}/imports`);
    const imports = importRes.ok ? await importRes.json() : [];
    renderImports(imports);

    // Fetch Exports
    const exportRes = await fetch(`/api/admins/${supabaseUserId}/exports`);
    const exports = exportRes.ok ? await exportRes.json() : [];
    renderExports(exports);
  } catch (err) {
    console.error("Error loading import/export:", err.message);
    alert("Could not load Import/Export records.");
  }
}

//  Render Imports
function renderImports(imports) {
  importsTable.innerHTML = "";
  if (imports.length === 0) {
    importsTable.innerHTML = `<tr><td colspan="9">No Import records found.</td></tr>`;
    return;
  }

  imports.forEach((imp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${imp.id}</td>
      <td>${imp.item?.name || "-"}</td>
      <td>${imp.date}</td>
      <td>${imp.documentNumber}</td>
      <td>${imp.vendorName || "-"}</td>
      <td>${imp.quantityOrdered}</td>
      <td>${imp.quantityBilled}</td>
      <td>${imp.quantityReceived}</td>
      <td>${imp.status}</td>
    `;
    importsTable.appendChild(row);
  });
}

//  Render Exports
function renderExports(exports) {
  exportsTable.innerHTML = "";
  if (exports.length === 0) {
    exportsTable.innerHTML = `<tr><td colspan="9">No Export records found.</td></tr>`;
    return;
  }

  exports.forEach((exp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.id}</td>
      <td>${exp.item?.name || "-"}</td>
      <td>${exp.date}</td>
      <td>${exp.documentNumber}</td>
      <td>${exp.customerName || "-"}</td>
      <td>${exp.quantityOrdered}</td>
      <td>${exp.quantityBilled}</td>
      <td>${exp.quantityShipped}</td>
      <td>${exp.status}</td>
    `;
    exportsTable.appendChild(row);
  });
}
function tableToDocx(tableElement) {
  const { Table, TableRow, TableCell, Paragraph, TextRun } = docx;

  const rows = [];
  const trs = tableElement.querySelectorAll("tr");

  trs.forEach((tr) => {
    const cells = [];
    tr.querySelectorAll("th, td").forEach((cell) => {
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cell.innerText,
                  bold: tr.parentNode.tagName === "THEAD",
                }),
              ],
            }),
          ],
        })
      );
    });
    rows.push(new TableRow({ children: cells }));
  });

  return new Table({ rows });
}

async function downloadTableAsDocx(tableElement, title, filename) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    ShadingType,
  } = docx;

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 36, // title font size (~18px)
              }),
            ],
            spacing: { after: 300 }, // space below title
          }),
          new Table({
            rows: Array.from(tableElement.querySelectorAll("tr")).map(
              (tr, rowIndex) =>
                new TableRow({
                  children: Array.from(tr.querySelectorAll("th, td")).map(
                    (cell) =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: cell.innerText,
                                bold: rowIndex === 0, // header bold
                                size: 28, // table font size (~14px)
                              }),
                            ],
                          }),
                        ],
                        margins: {
                          top: 200, // padding ≈ 10px
                          bottom: 200,
                          left: 200,
                          right: 200,
                        },
                        borders: {
                          top: { style: "single", size: 1, color: "000000" },
                          bottom: { style: "single", size: 1, color: "000000" },
                          left: { style: "single", size: 1, color: "000000" },
                          right: { style: "single", size: 1, color: "000000" },
                        },
                        shading:
                          rowIndex === 0
                            ? {
                                type: ShadingType.CLEAR,
                                color: "auto",
                                fill: "DDDDDD",
                              } // light grey background for header
                            : undefined,
                      })
                  ),
                })
            ),
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Attach click listeners for download
document.getElementById("downloadImports").addEventListener("click", () => {
  const table = document.querySelector("table:nth-of-type(1)");
  downloadTableAsDocx(table, "📥 Import Records", "imports.docx");
});

document.getElementById("downloadExports").addEventListener("click", () => {
  const table = document.querySelector("table:nth-of-type(2)");
  downloadTableAsDocx(table, "📤 Export Records", "exports.docx");
});

// Run on load
document.addEventListener("DOMContentLoaded", loadImportExportDetails);
