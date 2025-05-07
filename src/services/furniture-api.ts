import {
  AIModelOptions,
  FurnitureFormData,
  PriceAnalysisResponse,
} from "../types/furniture";
import * as mockApi from "./furniture-api-mock";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// Set to true to use mock data instead of real API calls
const USE_MOCK_API = false;

export const uploadImage = async (
  imageFile: File,
  modelOptions?: AIModelOptions,
): Promise<FurnitureFormData> => {
  if (USE_MOCK_API) {
    return mockApi.uploadImage(imageFile);
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  // Add AI model selection options to the form data if provided
  if (modelOptions?.model) {
    formData.append("model", modelOptions.model);
  }

  if (modelOptions?.model === "o3" && modelOptions?.reasoningEffort) {
    formData.append("reasoningEffort", modelOptions.reasoningEffort);
  }

  const response = await fetch(`${API_URL}/api/image`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error response:", errorText);
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`,
    );
  }

  const data = await response.json();
  return data;
};

export const analyzeFurniturePrice = async (
  furnitureData: FurnitureFormData,
): Promise<PriceAnalysisResponse> => {
  if (USE_MOCK_API) {
    return mockApi.analyzeFurniturePrice(furnitureData);
  }

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
