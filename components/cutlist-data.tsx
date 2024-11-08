"use client";

import { useCabinetData } from "@/store/use-cabinet-store";
import Link from "next/link";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Sample materials array
const materials = [
  { value: "#D3B8AE", name: "Oak" },
  { value: "#F3D6C4", name: "Pine" },
  { value: "#D9B68C", name: "Walnut" },
  { value: "#6b7280", name: "Grey" },
  { value: "#f1f5f9", name: "White" },
];

// Helper function to get material name
const getMaterialName = (hex: string) => {
  const material = materials.find(
    (m) => m.value.toLowerCase() === hex.toLowerCase()
  );
  return material ? material.name : "Unknown";
};

export const CutlistData = () => {
  // Retrieve cabinet data
  const { width, height, depth, shelves, totalQty, materialColor, thickness } =
    useCabinetData();

  const numWidth = parseFloat(width) || 0;
  const numHeight = parseFloat(height) || 0;
  const numDepth = parseFloat(depth) || 0;
  const numShelves = parseInt(shelves, 10) || 0;
  const numTotalQty = parseInt(totalQty, 10) || 0;
  const numThickness = parseInt(thickness, 10) || 0;

  // Define panel data
  const panelsData = [
    {
      nLength: numWidth - 2 * numThickness,
      nWidth: numDepth,
      nQty: numTotalQty,
      sName: "Top",
      material: getMaterialName(materialColor),
    },
    {
      nLength: numWidth - 2 * numThickness,
      nWidth: numDepth,
      nQty: numTotalQty,
      sName: "Bottom",
      material: getMaterialName(materialColor),
    },
    {
      nLength: numHeight,
      nWidth: numDepth,
      nQty: numTotalQty,
      sName: "Left Side",
      material: getMaterialName(materialColor),
    },
    {
      nLength: numHeight,
      nWidth: numDepth,
      nQty: numTotalQty,
      sName: "Right Side",
      material: getMaterialName(materialColor),
    },
    {
      nLength: numHeight,
      nWidth: numWidth,
      nQty: numTotalQty,
      sName: "Back",
      material: getMaterialName(materialColor),
    },
    {
      nLength: numWidth - 2 * numThickness,
      nWidth: numDepth,
      nQty: numShelves * numTotalQty,
      sName: "Shelf",
      material: getMaterialName(materialColor),
    },
  ];

  // Function to download cutlist as CSV
  const downloadCSV = () => {
    const headers = [
      "Part",
      "Width (mm)",
      "Height (mm)",
      "Thickness (mm)",
      "Material",
      "Quantity",
    ];
    const rows = panelsData.map((panel) => [
      panel.sName,
      panel.nWidth.toFixed(2),
      panel.nLength.toFixed(2),
      numThickness,
      panel.material,
      panel.nQty,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cutlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Existing PDF download function
  const downloadPDF = () => {
    const input = document.getElementById("cutlist-table");
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("cutlist.pdf");
    });
  };

  return (
    <div
      style={{ backgroundImage: "url('/BG1.png')" }}
      className="w-full h-full"
    >
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-white">
          Cutlist
        </h1>
        <div
          id="cutlist-table"
          className="overflow-x-auto min-w-full bg-white border border-gray-300 rounded-lg shadow-md"
        >
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1 md:px-4 md:py-2">Part</th>
                <th className="border px-2 py-1 md:px-4 md:py-2">Width (mm)</th>
                <th className="border px-2 py-1 md:px-4 md:py-2">
                  Height (mm)
                </th>
                <th className="border px-2 py-1 md:px-4 md:py-2">
                  Thickness (mm)
                </th>
                <th className="border px-2 py-1 md:px-4 md:py-2">Material</th>
                <th className="border px-2 py-1 md:px-4 md:py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {panelsData.map((panel, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-2 py-1 md:px-4 md:py-2">
                    {panel.sName}
                  </td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">
                    {panel.nWidth.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">
                    {panel.nLength.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">
                    {numThickness}
                  </td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">
                    {panel.material}
                  </td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">
                    {panel.nQty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-center gap-2 md:gap-4 text-center">
          <button
            onClick={downloadPDF}
            className="bg-blue-500 text-white px-4 py-2 text-sm md:text-base rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Download Cutlist PDF
          </button>
          <button
            onClick={downloadCSV}
            className="bg-green-500 text-white px-4 py-2 text-sm md:text-base rounded-lg hover:bg-green-600 transition duration-300"
          >
            Download Cutlist CSV
          </button>
          <Link
            href="/"
            className="bg-yellow-500 text-white px-4 py-2 text-sm md:text-base rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
