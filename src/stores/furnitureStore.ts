import { create } from "zustand";
import { FurnitureFormData, PriceAnalysisResponse } from "../types/furniture";

interface FurnitureStore {
  furnitureResult: FurnitureFormData | null;
  priceAnalysis: PriceAnalysisResponse | null;
  setFurnitureResult: (result: FurnitureFormData | null) => void;
  setPriceAnalysis: (result: PriceAnalysisResponse | null) => void;
}

export const useFurnitureStore = create<FurnitureStore>((set) => ({
  furnitureResult: null,
  priceAnalysis: null,
  setFurnitureResult: (result) => set({ furnitureResult: result }),
  setPriceAnalysis: (result) => set({ priceAnalysis: result }),
}));
