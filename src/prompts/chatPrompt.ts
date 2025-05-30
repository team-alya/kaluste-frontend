import dedent from "dedent";
import { FurnitureFormData, PriceAnalysisResponse } from "../types/furniture";

export const getTabInitialMessage = (
  priceAnalysis?: PriceAnalysisResponse | null,
  furniture?: FurnitureFormData | null,
) => {
  if (!priceAnalysis || !furniture) {
    return `Miten voin auttaa sinua tänään?\n\n**Voin auttaa sinua seuraavissa asioissa:**\n\n• Myynti-ilmoituksen laatiminen\n• Lähimmät kierrätyspisteet\n• Kunnostuspalvelut\n• Lisätietoja markkinatilanteesta`;
  }

  const hinnatText =
    priceAnalysis.alin_hinta && priceAnalysis.korkein_hinta
      ? `${priceAnalysis.alin_hinta} - ${priceAnalysis.korkein_hinta}`
      : "_ei saatavilla_";

  const suositusHintaText = priceAnalysis.suositus_hinta
    ? `\n\n**Suositushinta:** ${priceAnalysis.suositus_hinta}€`
    : "";

  const huonekalunTiedot = `${furniture.merkki} ${furniture.malli}`;

  const mittatiedot = `\n\n**Mitat (Syvyys × Korkeus × Leveys):** ${furniture.mitat.pituus} × ${furniture.mitat.korkeus} × ${furniture.mitat.leveys} cm`;

  const materiaalitText = furniture.materiaalit.length
    ? `\n**Materiaalit:** ${furniture.materiaalit.join(", ")}`
    : "";

  const kuntoText = `\n**Kunto:** ${furniture.kunto}`;

  const myyntiaikaText = priceAnalysis.arvioitu_myyntiaika
    ? `\n\n**Arvioitu myyntiaika:**\n\n` +
      `• Edullisella hinnalla (${priceAnalysis.alin_hinta}€): ${priceAnalysis.arvioitu_myyntiaika.nopea} päivää\n` +
      `• Suositushinnalla (${priceAnalysis.suositus_hinta}€): ${priceAnalysis.arvioitu_myyntiaika.normaali} päivää\n` +
      `• Korkealla hinnalla (${priceAnalysis.korkein_hinta}€): ${priceAnalysis.arvioitu_myyntiaika.hidas} päivää`
    : "";

  const markkinatilanneText = priceAnalysis.markkinatilanne
    ? `\n\n**Markkinatilanne:**\n\n` +
      `• Kysyntä: ${priceAnalysis.markkinatilanne.kysyntä}\n` +
      `• ${priceAnalysis.markkinatilanne.sesonki ? "✨ Nyt on hyvä sesonki myymiselle!" : "Ei ole sesonkiaika."}`
    : "";

  const myyntikanavat = priceAnalysis.myyntikanavat?.length
    ? `\n\n**Suositellut myyntikanavat:**\n\n${priceAnalysis.myyntikanavat
        .map((kanava) => `• ${kanava}`)
        .join("\n")}`
    : "";

  const perustelut = priceAnalysis.perustelu?.length
    ? `\n\n**Hinta-arvion perustelut:**\n\n${priceAnalysis.perustelu
        .map((perustelu) => `• ${perustelu}`)
        .join("\n")}`
    : "";

  return dedent`
  **Hinta-arvio huonekalulle** ${huonekalunTiedot}: ${hinnatText}€${suositusHintaText}

  **Huonekalun tiedot:**${mittatiedot}${
    /* Add newline before materials if they exist to ensure separation */
    materiaalitText ? "\n" + materiaalitText : ""
  }${
    /* Add newline before condition if it exists and follows materials or dimensions */
    kuntoText ? "\n" + kuntoText : ""
  }${perustelut}${myyntiaikaText}${markkinatilanneText}${myyntikanavat}

  ---
  `;
};

export const SALES_QUESTION_MESSAGE = {
  role: "assistant" as const,
  content: "Haluatko, että laadin sinulle myynti-ilmoituksen pohjan?",
};

export const FOLLOW_UP_QUESTION = {
  role: "assistant" as const,
  content: "Voinko auttaa vielä jotenkin?",
};

export const SALES_POST_PROMPT = dedent`
  Luo myynti-ilmoitus kalusteelle, jossa annetaan selkeä ja myyvä kuvaus. 
  Sisällytä ilmoitukseen kalusteen nimi, hinta, väri, koko(pituus, leveys, korkeus) ja kunto. 
  Ilmoituksen tulee olla helposti luettavissa ja houkutteleva potentiaalisille ostajille, 
  mutta älä käytä erikoismerkkejä, kuten tähtiä tai emojeita. 
  Kirjoita ilmoitus asiallisella ja myyntiin sopivalla tyylillä.
`;

export const FOLLOW_UP_MESSAGES = {
  afterSalesConfirm: {
    role: "assistant" as const,
    content: dedent` 
 Voit halutessasi kysyä minulta tarkennuksia ilmoitukseen.
 
 **Voin myös auttaa sinua:**
 - Huonekalun kierrätykseen liittyvissä kysymyksissä
 - Kunnostukseen liittyvissä asioissa
 - Etsimään lähin kierrätyspiste tai kunnostuspalvelu internetistä
 - Miten muuten voin auttaa? Voin auttaa esimerkiksi kierrätykseen ja kunnostukseen liittyvissä asioissa.
 `,
  },
  afterSalesDecline: {
    role: "assistant" as const,
    content: dedent`
 **Selvä!** Jos haluat apua myynnin kanssa myöhemmin, voit kysyä minulta lisätietoja.
 
 **Voin auttaa sinua seuraavissa asioissa:**
 - Lähimpien kierrätyspisteiden löytämisessä
 - Kunnostuspalveluiden kartoittamisessa 
 - Markkinatilanteen tarkemmassa analysoinnissa`,
  },
};

export const createSalesPrompt = dedent`
Luo myynti-ilmoitus kalusteelle, jossa annetaan selkeä ja myyvä kuvaus. 
    Sisällytä ilmoitukseen kalusteen nimi, hinta, väri, koko(pituus, leveys, korkeus) ja kunto. 
    Ilmoituksen tulee olla helposti luettavissa ja houkutteleva potentiaalisille ostajille, 
    mutta älä käytä erikoismerkkejä, kuten tähtiä tai emojeita. 
    Kirjoita ilmoitus asiallisella ja myyntiin sopivalla tyylillä.
`;
