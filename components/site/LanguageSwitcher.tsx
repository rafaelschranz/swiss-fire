"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALE_LABEL, LOCALES, type Locale } from "@/lib/i18n/config";
import { splitLocale } from "@/lib/i18n/routing";

/**
 * Links to the current page in each other locale, keeping the same path
 * (slugs are shared across languages, so blog articles map 1:1). Sets the
 * `NEXT_LOCALE` cookie so the proxy remembers the choice on later visits.
 */
export function LanguageSwitcher({ lang, ariaLabel }: { lang: Locale; ariaLabel: string }) {
  const pathname = usePathname();
  const { rest } = splitLocale(pathname ?? "/");

  return (
    <div className="flex items-center gap-1" role="group" aria-label={ariaLabel}>
      {LOCALES.map((locale) => {
        const active = locale === lang;
        const href = `/${locale}${rest === "/" ? "" : rest}`;
        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={`eyebrow no-underline transition ${active ? "text-brass-soft" : "text-paper/50 hover:text-paper"}`}
            title={LOCALE_LABEL[locale]}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
