import { CreateMessage } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TabType } from "../types/chat";
import { PriceAnalysisResponse } from "../types/furniture";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GetInitialMessageProps = {
  id: string;
  currentTab: TabType;
  priceAnalysis: PriceAnalysisResponse | undefined;
};

export const getInitialMessage = ({
  id,
  currentTab,
  priceAnalysis,
}: GetInitialMessageProps): CreateMessage => {
  const baseMessage = {
    id: id,
  };

  if (currentTab === "myynti") {
    return {
      ...baseMessage,
      role: "assistant",
      content: `Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${priceAnalysis?.alin_hinta} - ${priceAnalysis?.korkein_hinta} euroa.

Suosittelen seuraavia myyntikanavia: ${priceAnalysis?.myyntikanavat?.join(", ")}

Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?`,
    };
  }
  if (currentTab === "lahjoitus") {
    return {
      ...baseMessage,
      role: "assistant",
      content:
        "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, joihin kalusteen voi lahjoittaa.",
    };
  }
  if (currentTab === "kierrätys") {
    return {
      ...baseMessage,
      role: "assistant",
      content:
        "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, jotka kierrättävät kalusteiden materiaaleja.",
    };
  }
  return {
    ...baseMessage,
    role: "assistant",
    content:
      "Kertoisitko osoitteesi, jotta voin ehdottaa lähellä olevia yrityksiä, joissa kunnostetaan kalusteita.",
  };
};
