import { FurnitureFormData, PriceAnalysisResponse } from "../types/furniture";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const uploadImage = async (
  imageFile: File,
): Promise<FurnitureFormData> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_URL}/api/image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const analyzeFurniturePrice = async (
  furnitureData: FurnitureFormData,
): Promise<PriceAnalysisResponse> => {
  console.log("furnitureData", furnitureData);

  const response = await fetch(`${API_URL}/api/price`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ furnitureDetails: furnitureData }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
