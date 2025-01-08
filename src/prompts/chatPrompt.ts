import dedent from "dedent";
import { PriceAnalysisResponse } from "../types/furniture";

export const getTabInitialMessage = (
  priceAnalysis?: PriceAnalysisResponse | null
) => {
  if (!priceAnalysis) {
    return `Miten voin auttaa? voit kysyä minulta lisätietoja.\n\nVoin myös auttaa sinua löytämään:\n• Lähimmät kierrätyspisteet\n• Kunnostuspalvelut\n• Lisätietoja markkinatilanteesta`;
  }

  const hinnatText =
    priceAnalysis.alin_hinta && priceAnalysis.korkein_hinta
      ? `${priceAnalysis.alin_hinta} - ${priceAnalysis.korkein_hinta}`
      : "ei saatavilla";

  const suositusHintaText = priceAnalysis.suositus_hinta
    ? `\nSuosittelemme asettamaan myyntihinnaksi ${priceAnalysis.suositus_hinta} euroa.`
    : "";

  const myyntiaikaText = priceAnalysis.arvioitu_myyntiaika
    ? `\n\nArvioitu myyntiaika:
• Edullisella hinnalla (${priceAnalysis.alin_hinta}€): noin ${priceAnalysis.arvioitu_myyntiaika.nopea} päivää
• Suositushinnalla (${priceAnalysis.suositus_hinta}€): noin ${priceAnalysis.arvioitu_myyntiaika.normaali} päivää
• Korkealla hinnalla (${priceAnalysis.korkein_hinta}€): noin ${priceAnalysis.arvioitu_myyntiaika.hidas} päivää`
    : "";

  const markkinatilanneText = priceAnalysis.markkinatilanne
    ? `\n\nMarkkinatilanne:
• Kysyntä: ${priceAnalysis.markkinatilanne.kysyntä}
• ${priceAnalysis.markkinatilanne.sesonki ? "Nyt on hyvä sesonki myymiselle!" : "Ei ole sesonkiaika."}`
    : "";

  const myyntikanavat = priceAnalysis.myyntikanavat?.length
    ? `\n\nSuosittelemme seuraavia myyntikanavia:\n${priceAnalysis.myyntikanavat.map((kanava) => `• ${kanava}`).join("\n")}`
    : "";

  const perustelut = priceAnalysis.perustelu?.length
    ? `\n\nHinta-arvion perustelut:\n${priceAnalysis.perustelu.map((perustelu) => `• ${perustelu}`).join("\n")}`
    : "";

  return dedent`
  Hinta-arvio tuotteellesi on ${hinnatText} euroa.${suositusHintaText}${perustelut}${myyntiaikaText}${markkinatilanneText}${myyntikanavat}

  Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?
`;
};

export const SALES_POST_PROMPT = dedent`
  Luo myynti-ilmoitus kalusteelle, jossa annetaan selkeä ja myyvä kuvaus. 
  Sisällytä ilmoitukseen kalusteen nimi, hinta, väri, koko(pituus, leveys, korkeus) ja kunto. 
  Ilmoituksen tulee olla helposti luettavissa ja houkutteleva potentiaalisille ostajille, 
  mutta älä käytä erikoismerkkejä, kuten tähtiä tai emojeita. 
  Kirjoita ilmoitus asiallisella ja myyntiin sopivalla tyylillä.
`;
