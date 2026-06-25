import type { Metadata } from "next";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternates } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.impressum.meta.title,
    description: t.impressum.meta.description,
    alternates: alternates(lang, "/impressum"),
    robots: { index: false, follow: true },
  };
}

export default async function Impressum({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "de";
  const t = getDictionary(locale);
  const im = t.impressum;

  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col pt-12 pb-12">
          <p className="eyebrow text-brass-soft">{im.kicker}</p>
          <h1 className="display mt-3 text-[clamp(28px,4vw,44px)] text-paper">{im.h1}</h1>
        </div>
      </section>

      <div className="col py-14">
        <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-ink/85">
          <p className="border-l-2 border-brass bg-brass/5 p-4 text-sm text-ink">{im.placeholder}</p>

          <h2 className="serif pt-2 text-2xl text-ink">{im.providerHeading}</h2>
          <p>
            {im.providerLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < im.providerLines.length - 1 && <br />}
              </span>
            ))}
          </p>

          <h2 className="serif pt-4 text-2xl text-ink">{im.contactHeading}</h2>
          <p>{im.contact}</p>

          <h2 className="serif pt-4 text-2xl text-ink">{im.liabilityHeading}</h2>
          <p>{im.liability1}</p>
          <p>{im.liability2}</p>
        </div>
      </div>
    </main>
  );
}
