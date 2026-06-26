import Link from "next/link";

import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/routing";
import { BRAND, NAV } from "@/lib/site";

export function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = dict.common.nav as Record<string, string>;
  return (
    <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink/95 text-paper backdrop-blur">
      <div className="col flex items-center justify-between gap-6 py-3.5">
        <Link href={localeHref(lang, "/")} className="flex items-baseline gap-2 no-underline">
          <span className="serif text-lg font-semibold tracking-tight text-paper">{BRAND}</span>
          <span className="eyebrow hidden text-brass-soft sm:inline">{dict.common.brandKicker}</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-5 sm:flex" aria-label={dict.common.menu}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={localeHref(lang, item.href)}
                className="eyebrow text-paper/70 no-underline transition hover:text-paper"
              >
                {nav[item.key]}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher lang={lang} ariaLabel={dict.common.langSwitch} />
          <Link
            href={localeHref(lang, "/rechner")}
            className="bg-brass px-3.5 py-2 text-xs font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
          >
            {dict.common.ctaCalc}
          </Link>

          {/* Mobile menu — JS-free native disclosure */}
          <details className="relative sm:hidden">
            <summary
              aria-label={dict.common.menu}
              className="flex cursor-pointer list-none items-center text-paper/80 transition hover:text-paper [&::-webkit-details-marker]:hidden"
            >
              <span aria-hidden="true" className="text-lg leading-none">☰</span>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-3 flex min-w-44 flex-col gap-1 border border-paper/10 bg-ink-2 p-2 shadow-xl">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={localeHref(lang, item.href)}
                  className="eyebrow px-3 py-2 text-paper/80 no-underline transition hover:bg-paper/5 hover:text-paper"
                >
                  {nav[item.key]}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
