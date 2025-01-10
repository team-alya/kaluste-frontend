import { createSalesPrompt } from "@/prompts/chatPrompt";
import {
  ChatApiResponse,
  LocationApiResponse,
  LocationSource,
} from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const sendMessage = async (
  requestId: string,
  message: string,
): Promise<ChatApiResponse> => {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestId,
      question: message,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const sendLocationRequest = async (
  requestId: string,
  location: string,
  source: LocationSource,
): Promise<LocationApiResponse> => {
  const response = await fetch(`${API_URL}/api/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestId,
      location,
      source,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const createSalesPost = async (
  requestId: string,
): Promise<ChatApiResponse> => {
  const message = createSalesPrompt;
  return sendMessage(requestId, message);
};

export const sendFeedBack = async (
  requestId: string,
  rating: number,
  comment: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestId,
      review: {
        rating,
        comment,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
