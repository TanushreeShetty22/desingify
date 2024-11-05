// store/use-cabinet-store.ts

import { create } from "zustand";

type CabinetData = {
  width: string;
  height: string;
  depth: string;
  thickness: string;
  materialColor: string;
  shelves: string;
  totalQty: string;
  optimize: boolean;
  setCabinetData: (cabinet: Partial<CabinetData>) => void;
};

const defaultCabinetData: CabinetData = {
  width: "",
  height: "",
  depth: "",
  thickness: "",
  materialColor: "",
  shelves: "",
  totalQty: "",
  optimize: false,
  setCabinetData: () => {},
};

// Function to load initial state from localStorage in the browser
export const loadCabinetData = (): CabinetData => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem("cabinetData");
    return savedData ? JSON.parse(savedData) : defaultCabinetData;
  }
  return defaultCabinetData;
};

// Create Zustand store
export const useCabinetData = create<CabinetData>((set) => ({
  ...defaultCabinetData,
  setCabinetData: (cabinet) => {
    set((state) => {
      const newState = { ...state, ...cabinet };
      if (typeof window !== "undefined") {
        localStorage.setItem("cabinetData", JSON.stringify(newState));
      }
      return newState;
    });
  },
}));
