import type { Metadata } from "next";
import Link from "next/link";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternates } from "@/lib/i18n/metadata";
import { localeHref } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.about.meta.title,
    description: t.about.meta.description,
    alternates: alternates(lang, "/ueber-uns"),
  };
}

export default async function UeberUns({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "de";
  const t = getDictionary(locale);
  const a = t.about;

  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col pt-14 pb-16">
          <p className="eyebrow text-brass-soft">{a.kicker}</p>
          <h1 className="display mt-4 max-w-3xl text-[clamp(32px,5vw,52px)] text-paper">{a.h1}</h1>
        </div>
      </section>

      <div className="col py-16">
        <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-ink/85">
          <p>{a.p1}</p>
          <p>{a.p2}</p>

          <h2 className="serif pt-6 text-2xl text-ink">{a.h2numbers}</h2>
          <p>{a.numbers1}</p>
          <p>{a.numbers2}</p>

          <h2 className="serif pt-6 text-2xl text-ink">{a.h2privacy}</h2>
          <p>{a.privacy}</p>

          <h2 className="serif pt-6 text-2xl text-ink">{a.h2independent}</h2>
          <p>{a.independent}</p>

          <div className="pt-6">
            <Link
              href={localeHref(locale, "/rechner")}
              className="inline-block bg-brass px-5 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
            >
              {a.cta}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
