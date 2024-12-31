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

export const priceAnalysisSchema = z.object({
  korkein_hinta: z.number().describe("Suurin realistinen myyntihinta euroina"),

  alin_hinta: z.number().describe("Alin realistinen myyntihinta euroina"),

  suositus_hinta: z
    .number()
    .min(0)
    .max(1000000)
    .describe("Suositeltu optimaalinen myyntihinta euroina"),

  arvioitu_myyntiaika: z
    .object({
      nopea: z
        .number()
        .min(1)
        .max(365)
        .describe("Arvioitu myyntiaika päivissä alimmalla hinnalla"),
      normaali: z
        .number()
        .min(1)
        .max(365)
        .describe("Arvioitu myyntiaika päivissä suositushinnalla"),
      hidas: z
        .number()
        .min(1)
        .max(365)
        .describe("Arvioitu myyntiaika päivissä korkeimmalla hinnalla"),
    })
    .describe("Arviot myyntiajasta eri hintaluokissa"),

  myyntikanavat: z
    .array(z.string())
    .describe("Lista suositelluista suomalaisista myyntipaikoista"),

  perustelu: z
    .array(z.string())
    .describe(
      "Lyhyt ja ytimekäs perustelu hinta-arviolle. Älä toista perustiedoissa mainittuja asioita. Älä mainitse Perplexityä-analyysin lähteenäsi.",
    ),

  markkinatilanne: z
    .object({
      kysyntä: z.string().describe("Arvio kysynnästä (korkea/normaali/matala)"),
      kilpailu: z
        .number()
        .min(0)
        .max(100)
        .describe("Arvio kilpailevien ilmoitusten määrästä"),
      sesonki: z.boolean().describe("Onko tuotteella nyt sesonki"),
    })
    .describe("Arvio markkinatilanteesta"),
});

export type FurnitureFormData = z.infer<typeof furnitureSchema>;
export type PriceAnalysisResponse = z.infer<typeof priceAnalysisSchema>;
