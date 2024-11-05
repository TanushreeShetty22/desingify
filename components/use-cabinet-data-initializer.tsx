"use client";

import { useEffect } from "react";
import { useCabinetData, loadCabinetData } from "@/store/use-cabinet-store";

export const UseCabinetDataInitializer = () => {
  const setCabinetData = useCabinetData((state) => state.setCabinetData);

  useEffect(() => {
    const data = loadCabinetData();
    setCabinetData(data);
  }, [setCabinetData]);

  return null;
};
