"use client";

import { useState } from "react";
import { AIModalCabinet } from "@/components/cabinet";
import { CabientForm } from "@/components/cabinet-form";
import { useCabinetData } from "@/store/use-cabinet-store";

export default function Home() {
  const { width, height, depth, thickness, materialColor, shelves } =
    useCabinetData();

  const [isResizing, setIsResizing] = useState(false);

  const toggleResizing = () => {
    setIsResizing(true);
  };

  const aiSettings = {
    width,
    height,
    depth,
    thickness,
    materialColor,
    shelves,
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
        {/* Left Section: Form Section */}

        <div className="bg-amber-100 h-full flex flex-col justify-center items-center px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Design Your Custom Cabinet
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            Create a cabinet that fits your exact needs. Customize dimensions,
            materials, and more with our easy-to-use tool.
          </p>
          <CabientForm />
        </div>

        {/* Right Section: 3D Model Display */}
        <div
          style={{ backgroundImage: "url('/BG1.png')" }}
          className="bg-gray-300 h-full flex flex-col justify-center items-center"
        >
          <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-lg p-8 w-full">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
              Visualize in 3D
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Watch your cabinet design come to life in real-time as you make
              changes.
            </p>
            <div className="w-full rounded-lg h-[500px]">
              <AIModalCabinet
                aiSettings={aiSettings}
                isResizing={isResizing}
                toggleResizing={toggleResizing}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}