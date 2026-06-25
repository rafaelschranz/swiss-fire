import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { HTML_LANG, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternates } from "@/lib/i18n/metadata";
import { localeHref } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";
import Calculator from "./Calculator";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.calculator.meta.title,
    description: t.calculator.meta.description,
    alternates: alternates(lang, "/rechner"),
    openGraph: {
      type: "website",
      url: `${SITE_URL}${localeHref(lang, "/rechner")}`,
      title: t.calculator.meta.ogTitle,
    },
  };
}

export default async function RechnerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "de";
  const t = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: t.calculator.jsonLdName,
          url: `${SITE_URL}${localeHref(locale, "/rechner")}`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          inLanguage: HTML_LANG[locale],
          offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
        }}
      />
      <Calculator />
    </>
  );
}
