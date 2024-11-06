"use client";

import { useState } from "react";
import { AIModalCabinet } from "@/components/cabinet";
import { CabientForm } from "@/components/cabinet-form"; // Fixed typo in import statement
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
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Left Section: Form Section */}
        <div
          style={{ backgroundColor: "#554232" }}
          className="h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-6 bg-cover"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
            Design Your Custom Cabinet
          </h1>
          <p className="text-base sm:text-lg text-white mb-8 text-center max-w-xs sm:max-w-md">
            Create a cabinet that fits your exact needs. Customize dimensions,
            materials, and more with our easy-to-use tool.
          </p>
          <CabientForm />
        </div>

        {/* Right Section: 3D Model Display */}
        <div
          style={{ backgroundImage: "url('/BG1.png')" }}
          className="bg-gray-300 h-full flex flex-col justify-center items-center bg-cover"
        >
          <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 w-full sm:w-3/4 md:w-3/4 lg:w-5/6 max-w-lg md:max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 text-center">
              Visualize in 3D
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
              Watch your cabinet design come to life in real-time as you make
              changes.
            </p>
            <div className="w-full rounded-lg h-[400px] sm:h-[500px] lg:h-[600px]">
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
