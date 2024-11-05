"use client";

import { useCabinetData } from "@/store/use-cabinet-store";
import Link from "next/link";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const materials = [
  { value: "#D3B8AE", name: "Oak" },
  { value: "#F3D6C4", name: "Pine" },
  { value: "#D9B68C", name: "Walnut" },
  { value: "#6b7280", name: "Grey" },
  { value: "#f1f5f9", name: "White" },
];

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

  // Convert string dimensions to numbers, with fallback to 0 if conversion fails
  const numWidth = parseFloat(width) || 0;
  const numHeight = parseFloat(height) || 0;
  const numDepth = parseFloat(depth) || 0;
  const numShelves = parseInt(shelves, 10) || 0;
  const numTotalQty = parseInt(totalQty, 10) || 0;
  const numThickness = parseInt(thickness, 10) || 0; // Fixed to use thickness

  // Define panel data based on the input dimensions
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

  const mmToSqFt = (length: number, width: number) => {
    // Calculate area in square feet
    return length * width * 0.0000107639; // Conversion from mm² to ft²
  };

  const calculateEstimatedCost = (
    length: number,
    width: number,
    quantity: number
  ) => {
    const areaSqFt = mmToSqFt(length, width);
    const cost = areaSqFt * 120; // Cost in rupees
    return (cost * quantity).toFixed(2); // Returning the total cost for the given quantity
  };

  // Function to download the cutlist as PDF
  const downloadPDF = () => {
    const input = document.getElementById("cutlist-table");
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Width of the PDF
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to PDF, managing page breaks
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Cutlist</h1>
      <div
        id="cutlist-table"
        className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md"
      >
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Part</th>
              <th className="border px-4 py-2">Width (mm)</th>
              <th className="border px-4 py-2">Height (mm)</th>
              <th className="border px-4 py-2">Thickness (mm)</th>
              <th className="border px-4 py-2">Material</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Estimated Cost</th>
            </tr>
          </thead>
          <tbody>
            {panelsData.map((panel, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{panel.sName}</td>
                <td className="border px-4 py-2">{panel.nWidth.toFixed(2)}</td>
                <td className="border px-4 py-2">{panel.nLength.toFixed(2)}</td>
                <td className="border px-4 py-2">{numThickness}</td>{" "}
                <td className="border px-4 py-2">{panel.material}</td>{" "}
                <td className="border px-4 py-2">{panel.nQty}</td>
                <td className="border px-4 py-2">
                  ₹
                  {calculateEstimatedCost(
                    panel.nLength,
                    panel.nWidth,
                    panel.nQty
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mr-4"
        >
          Download Cutlist PDF
        </button>
        <Link
          href="/"
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
