export interface ChatApiResponse {
  requestId: string;
  answer: string;
}

export interface LocationApiResponse {
  result: string;
}

export type LocationSource = "donation" | "recycle" | "repair";
