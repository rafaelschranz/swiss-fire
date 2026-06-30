"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { localeHref, splitLocale } from "@/lib/i18n/routing";

const COPY = {
  de: {
    kicker: "Fehler",
    h1: "Etwas ist schiefgelaufen.",
    body: "Beim Berechnen ist ein unerwarteter Fehler aufgetreten. Ihre Eingaben verbleiben in Ihrem Browser; es wurden keine Daten übertragen.",
    retry: "Erneut versuchen",
    home: "Zur Startseite",
  },
  en: {
    kicker: "Error",
    h1: "Something went wrong.",
    body: "An unexpected error occurred while calculating. Your inputs stay in your browser; no data was transmitted.",
    retry: "Try again",
    home: "Back to home",
  },
};

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = splitLocale(usePathname() ?? "/");
  const t = COPY[lang];

  useEffect(() => {
    // Surface the error to the console for debugging; no remote reporting.
    console.error(error);
  }, [error]);

  return (
    <main id="hauptinhalt" className="col flex min-h-[60vh] flex-col justify-center py-20">
      <p className="eyebrow text-brass">{t.kicker}</p>
      <h1 className="serif mt-3 text-[clamp(28px,5vw,44px)] leading-tight text-ink">{t.h1}</h1>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">{t.body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-brass px-5 py-3 text-sm font-semibold text-[#1a1205] transition hover:bg-brass-soft"
        >
          {t.retry}
        </button>
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
