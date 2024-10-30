"use client";

import { AIModalCabinet } from "@/components/cabinet";
import { CabientForm } from "@/components/cabinet-form";
import { useCabinetData } from "@/store/use-cabinet-store";
import { useState } from "react";

export default function Home() {
  const { width, height, depth, thickness, materialColor, shelves } =
    useCabinetData();

  const [risizing, setRisizing] = useState(true);

  const toggleResizing = () => {
    setRisizing(true);
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
      <div className="grid grid-cols-2 gap-1">
        <div className="bg-gray-300 h-full flex flex-col justify-center items-center">
          <h1>Make a cabinet</h1>
          <CabientForm />
        </div>
        <AIModalCabinet
          aiSettings={aiSettings}
          isResizing={risizing}
          toggleResizing={toggleResizing}
        />
      </div>
    </>
  );
}
