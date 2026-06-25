import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "Brückenrechner — Frühpensionierung berechnen",
  description:
    "Berechnen Sie in vier Schritten, ob Ihr Kapital für die Frühpensionierung reicht: " +
    "Brückenphase, Säule 3a, Pensionskasse, AHV und echte ESTV-Steuern pro Gemeinde. Kostenlos, lokal im Browser.",
  alternates: { canonical: "/rechner" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/rechner`,
    title: "Brückenrechner — Frühpensionierung berechnen",
  },
};

export default function RechnerPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `${SITE_NAME} Brückenrechner`,
          url: `${SITE_URL}/rechner`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          inLanguage: "de-CH",
          offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
        }}
      />
      <Calculator />
    </>
  );
}
