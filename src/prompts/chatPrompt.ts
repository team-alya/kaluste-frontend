import dedent from "dedent";
import { TabType } from "../types/chat";
import { PriceAnalysisResponse } from "../types/furniture";

export const getTabInitialMessage = (
  currentTab: TabType,
  priceAnalysis?: PriceAnalysisResponse | null,
) => {
  let hinnat: string;
  let myyntikanavat: string;

  switch (currentTab) {
    case "myynti":
      if (!priceAnalysis) {
        return "Haluatko että laadin sinulle myynti-ilmoitukseen pohjan?";
      }

      hinnat =
        priceAnalysis.alin_hinta && priceAnalysis.korkein_hinta
          ? `${priceAnalysis.alin_hinta} - ${priceAnalysis.korkein_hinta} euroa`
          : "ei saatavilla";

      myyntikanavat = priceAnalysis.myyntikanavat?.length
        ? `\n\nSuosittelen seuraavia myyntikanavia: ${priceAnalysis.myyntikanavat.join(", ")}`
        : "";

      return dedent`
          Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${hinnat}.${myyntikanavat}
   
          Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?
        `;

    case "lahjoitus":
      return dedent`
          Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, joihin kalusteen voi lahjoittaa.
        `;

    case "kierrätys":
      return dedent`
          Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, jotka kierrättävät kalusteiden materiaaleja.
        `;

    default:
      return dedent`
          Kertoisitko osoitteesi, jotta voin ehdottaa lähellä olevia yrityksiä, joissa kunnostetaan kalusteita.
        `;
  }
};

export const SALES_POST_PROMPT = dedent`
  Luo myynti-ilmoitus kalusteelle, jossa annetaan selkeä ja myyvä kuvaus. 
  Sisällytä ilmoitukseen kalusteen nimi, hinta, väri, koko(pituus, leveys, korkeus) ja kunto. 
  Ilmoituksen tulee olla helposti luettavissa ja houkutteleva potentiaalisille ostajille, 
  mutta älä käytä erikoismerkkejä, kuten tähtiä tai emojeita. 
  Kirjoita ilmoitus asiallisella ja myyntiin sopivalla tyylillä.
`;
