import type { Metadata } from "next";
import Link from "next/link";

import { Disclaimer } from "@/components/Disclaimer";
import { JsonLd } from "@/components/JsonLd";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternates } from "@/lib/i18n/metadata";
import { localeHref } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.ratgeber.meta.title,
    description: t.ratgeber.meta.description,
    alternates: alternates(lang, "/ratgeber"),
  };
}

export default async function RatgeberPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "de";
  const t = getDictionary(locale);
  const r = t.ratgeber;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: r.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: r.breadcrumbHome, item: `${SITE_URL}${localeHref(locale, "/rechner")}` },
      { "@type": "ListItem", position: 2, name: r.meta.title, item: `${SITE_URL}${localeHref(locale, "/ratgeber")}` },
    ],
  };

  return (
    <main id="hauptinhalt">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Ink masthead for the document */}
      <section className="bg-ink text-paper">
        <div className="col pt-10 pb-14">
          <nav aria-label={r.breadcrumbAria} className="eyebrow text-brass-soft">
            <Link href={localeHref(locale, "/rechner")} className="no-underline transition hover:text-paper">
              {r.breadcrumbHome}
            </Link>
            <span className="text-paper/40">{r.breadcrumbCurrent}</span>
          </nav>
          <h1 className="display mt-5 text-[clamp(30px,5vw,48px)] text-paper">{r.h1}</h1>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-paper/70">{r.intro}</p>
        </div>
      </section>

      <article className="col space-y-12 py-14">
        <Disclaimer />

        <section className="space-y-4">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="eyebrow text-brass">01</span>
            <h2 className="serif text-2xl text-ink">{r.section1Title}</h2>
          </div>
          <p className="max-w-prose leading-relaxed text-ink">{r.section1Body}</p>
          <dl className="border border-line">
            {r.pillars.map(([term, def]) => (
              <div key={term} className="flex flex-col gap-1 border-t border-line p-4 first:border-t-0 sm:flex-row sm:gap-6">
                <dt className="eyebrow shrink-0 pt-0.5 text-muted sm:w-48">{term}</dt>
                <dd className="leading-relaxed text-ink">{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="eyebrow text-brass">02</span>
            <h2 className="serif text-2xl text-ink">{r.section2Title}</h2>
          </div>
          <p className="max-w-prose leading-relaxed text-ink">{r.section2Body}</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="eyebrow text-brass">03</span>
            <h2 className="serif text-2xl text-ink">{r.section3Title}</h2>
          </div>
          <dl className="border border-line">
            {r.faq.map((item) => (
              <div key={item.q} className="border-t border-line p-4 first:border-t-0">
                <dt className="font-medium text-ink">{item.q}</dt>
                <dd className="mt-1.5 max-w-prose leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p>
          <Link
            href={localeHref(locale, "/rechner")}
            className="bg-brass px-5 py-3 text-sm font-semibold text-[#1a1205] transition hover:bg-brass-soft"
          >
            {r.backToCalc}
          </Link>
        </p>
      </article>
    </main>
  );
}
