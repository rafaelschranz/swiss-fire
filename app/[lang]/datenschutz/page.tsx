import type { Metadata } from "next";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternates } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.datenschutz.meta.title,
    description: t.datenschutz.meta.description,
    alternates: alternates(lang, "/datenschutz"),
    robots: { index: false, follow: true },
  };
}

export default async function Datenschutz({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "de";
  const t = getDictionary(locale);
  const d = t.datenschutz;

  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col pt-12 pb-12">
          <p className="eyebrow text-brass-soft">{d.kicker}</p>
          <h1 className="display mt-3 text-[clamp(28px,4vw,44px)] text-paper">{d.h1}</h1>
        </div>
      </section>

      <div className="col py-14">
        <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-ink/85">
          <h2 className="serif text-2xl text-ink">{d.h2principle}</h2>
          <p>{d.principle}</p>

          <h2 className="serif pt-2 text-2xl text-ink">{d.h2shared}</h2>
          <p>{d.shared}</p>

          <h2 className="serif pt-2 text-2xl text-ink">{d.h2logs}</h2>
          <p>{d.logs}</p>

          <h2 className="serif pt-2 text-2xl text-ink">{d.h2external}</h2>
          <p>{d.external}</p>

          <h2 className="serif pt-2 text-2xl text-ink">{d.h2contact}</h2>
          <p>{d.contact}</p>
        </div>
      </div>
    </main>
  );
}
