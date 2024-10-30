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

export const useCabinetData = create<CabinetData>((set) => ({
  width: "",
  height: "",
  depth: "",
  thickness: "",
  materialColor: "",
  shelves: "",
  totalQty: "",
  optimize: false,
  setCabinetData: (cabinet) => set((state) => ({ ...state, ...cabinet })),
}));