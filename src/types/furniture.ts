import { z } from "zod";

export const kuntoOptions = [
  "Erinomainen",
  "Hyvä",
  "Kohtalainen",
  "Huono",
  "Tuntematon",
] as const;

export type KuntoType = (typeof kuntoOptions)[number];

export const furnitureSchema = z.object({
  requestId: z.string(),
  merkki: z.string().min(1, "Merkki on pakollinen"),
  malli: z.string().min(1, "Malli on pakollinen"),
  väri: z.string().min(1, "Väri on pakollinen"),
  mitat: z.object({
    pituus: z.number().min(0, "Pituus ei voi olla negatiivinen"),
    korkeus: z.number().min(0, "Korkeus ei voi olla negatiivinen"),
    leveys: z.number().min(0, "Leveys ei voi olla negatiivinen"),
  }),
  materiaalit: z
    .array(z.string())
    .min(1, "Vähintään yksi materiaali vaaditaan"),
  kunto: z.enum(kuntoOptions, {
    errorMap: () => ({ message: "Valitse kunto listasta" }),
  }),
});

export type FurnitureFormData = z.infer<typeof furnitureSchema>;

export interface ToriPrices {
  Uusi?: [number, number];
  Hyvä?: [number, number];
  Kohtalainen?: [number, number];
  Huono?: [number, number];
  [key: string]: [number, number] | undefined;
}

export interface PriceAnalysisResponse {
  requestId: string;
  korkein_hinta: number;
  alin_hinta: number;
  myyntikanavat: string[];
  tori_hinnat: ToriPrices;
}

export interface PriceAnalysisResult {
  message: string;
  result: PriceAnalysisResponse;
}

// Zod schema for validation
export const priceAnalysisSchema = z.object({
  korkein_hinta: z.number(),
  alin_hinta: z.number(),
  myyntikanavat: z.array(z.string()),
  tori_hinnat: z.record(z.tuple([z.number(), z.number()]).optional()),
});
