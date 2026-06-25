import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/routing";
import { BRAND, FOOTER_LEGAL, NAV } from "@/lib/site";

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = dict.common.nav as Record<string, string>;
  const legal = dict.common.legal as Record<string, string>;
  return (
    <footer className="mt-auto bg-ink-2 text-paper/70">
      <div className="col grid grid-cols-1 gap-8 py-12 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="serif text-lg font-semibold text-paper">{BRAND}</p>
          <p className="max-w-xs text-xs leading-relaxed">{dict.common.footer.blurb}</p>
        </div>

        <div>
          <p className="eyebrow text-brass-soft">{dict.common.footer.navHeading}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={localeHref(lang, item.href)} className="no-underline transition hover:text-paper">
                  {nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-brass-soft">{dict.common.footer.legalHeading}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={localeHref(lang, item.href)} className="no-underline transition hover:text-paper">
                  {legal[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="col py-6 text-xs leading-relaxed">
          <p className="max-w-prose">{dict.common.footer.disclaimer}</p>
          <p className="mt-3 text-paper/50">
            © {new Date().getFullYear()} {BRAND}. {dict.common.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
