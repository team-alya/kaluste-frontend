import { v4 as uuidv4 } from "uuid";
import { FurnitureFormData, PriceAnalysisResponse } from "../types/furniture";

// Mock response for image upload
export const uploadImage = async (
  imageFile: File,
): Promise<FurnitureFormData> => {
  console.log(`Mock: Pretending to upload image: ${imageFile.name}`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    requestId: uuidv4(),
    merkki: "IKEA",
    malli: "POÄNG",
    vari: "Musta",
    mitat: {
      pituus: 82,
      korkeus: 100,
      leveys: 67,
    },
    materiaalit: ["Koivu", "Kangas"],
    kunto: "Hyvä",
  };
};

// Mock response for price analysis
export const analyzeFurniturePrice = async (
  furnitureData: FurnitureFormData,
): Promise<PriceAnalysisResponse> => {
  console.log(
    `Mock: Analyzing furniture price for ${furnitureData.merkki} ${furnitureData.malli}`,
  );

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    korkein_hinta: 150,
    alin_hinta: 50,
    suositus_hinta: 95,
    arvioitu_myyntiaika: {
      nopea: 7,
      normaali: 21,
      hidas: 45,
    },
    myyntikanavat: [
      "Tori.fi",
      "Facebook Marketplace",
      "Huuto.net",
      "IKEA Kierrätys",
    ],
    perustelu: [
      `${furnitureData.merkki} ${furnitureData.malli} on suosittu malli, jolla on hyvä jälleenmyyntiarvo.`,
      `Kunto "${furnitureData.kunto}" vaikuttaa positiivisesti tuotteen arvoon.`,
      "Tuotteen materiaalit ovat kestäviä ja lisäävät arvoa.",
      "Klassinen muotoilu tekee tuotteesta ajattoman.",
    ],
    markkinatilanne: {
      kysyntä: "korkea",
      kilpailu: 42,
      sesonki: true,
    },
  };
};

// Alternative mock with different values
export const analyzeFurniturePriceAlternative = async (
  furnitureData: FurnitureFormData,
): Promise<PriceAnalysisResponse> => {
  console.log(
    `Mock: Alternative price analysis for ${furnitureData.merkki} ${furnitureData.malli}`,
  );

  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    korkein_hinta: 220,
    alin_hinta: 80,
    suositus_hinta: 140,
    arvioitu_myyntiaika: {
      nopea: 5,
      normaali: 14,
      hidas: 30,
    },
    myyntikanavat: [
      "Tori.fi",
      "Facebook Marketplace",
      "Design-huutokauppa",
      "Sisustusliikkeet",
    ],
    perustelu: [
      `${furnitureData.merkki} ${furnitureData.malli} on arvostettu design-tuote.`,
      "Materiaalit ovat laadukkaita ja tuote on hyvin säilyttänyt arvonsa.",
      `${furnitureData.kunto}-kuntoiset tuotteet menevät nopeasti kaupaksi.`,
      "Tuotteen mittasuhteet ovat ihanteelliset moniin koteihin.",
    ],
    markkinatilanne: {
      kysyntä: "normaali",
      kilpailu: 25,
      sesonki: false,
    },
  };
};
