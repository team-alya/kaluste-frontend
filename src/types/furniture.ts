import { z } from "zod";

export const kuntoOptions = [
  "Uusi",
  "Erinomainen",
  "Hyvä",
  "Kohtalainen",
  "Huono",
  "Ei tiedossa",
] as const;

export type KuntoType = (typeof kuntoOptions)[number];

export const furnitureSchema = z.object({
  requestId: z.string().uuid(),
  merkki: z.string().min(1, "Merkki on pakollinen"),
  malli: z.string().min(1, "Malli on pakollinen"),
  vari: z.string().min(1, "Väri on pakollinen"),
  mitat: z.object({
    pituus: z.number().min(0, "Pituus ei voi olla negatiivinen"),
    korkeus: z.number().min(0, "Korkeus ei voi olla negatiivinen"),
    leveys: z.number().min(0, "Leveys ei voi olla negatiivinen"),
  }),
  materiaalit: z
    .array(z.string())
    .min(1, "Vähintään yksi materiaali vaaditaan"),
  kunto: z
    .enum(kuntoOptions, {
      errorMap: () => ({ message: "Valitse kunto listasta" }),
    })
    .default("Ei tiedossa"),
});

export interface ToriPrices {
  Uusi?: [number, number];
  Hyvä?: [number, number];
  Kohtalainen?: [number, number];
  Huono?: [number, number];
  [key: string]: [number, number] | undefined;
}

// Zod schema for validation
export const priceAnalysisSchema = z.object({
  korkein_hinta: z.number(),
  alin_hinta: z.number(),
  myyntikanavat: z.array(z.string()),
});

export type FurnitureFormData = z.infer<typeof furnitureSchema>;
export type PriceAnalysisResponse = z.infer<typeof priceAnalysisSchema>;
