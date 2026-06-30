"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeHref, splitLocale } from "@/lib/i18n/routing";

const COPY = {
  de: {
    kicker: "404",
    h1: "Seite nicht gefunden.",
    body: "Diese Seite existiert nicht (mehr). Vielleicht hilft der Rechner oder die Startseite weiter.",
    calc: "Zum Rechner →",
    home: "Zur Startseite",
  },
  en: {
    kicker: "404",
    h1: "Page not found.",
    body: "This page doesn't exist (anymore). The calculator or the home page might help.",
    calc: "To the calculator →",
    home: "Back to home",
  },
};

export default function NotFound() {
  const { lang } = splitLocale(usePathname() ?? "/");
  const t = COPY[lang];

  return (
    <main id="hauptinhalt" className="col flex min-h-[60vh] flex-col justify-center py-20">
      <p className="eyebrow text-brass-soft num text-brass">{t.kicker}</p>
      <h1 className="serif mt-3 text-[clamp(28px,5vw,44px)] leading-tight text-ink">{t.h1}</h1>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">{t.body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={localeHref(lang, "/rechner")}
          className="bg-brass px-5 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
        >
          {t.calc}
        </Link>
        <Link
          href={localeHref(lang, "/")}
          className="eyebrow border border-line-2 px-5 py-3 text-ink no-underline transition hover:border-ink"
        >
          {t.home}
        </Link>
      </div>
    </main>
  );
}
