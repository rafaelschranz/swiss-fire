import type { Metadata } from "next";

import { type Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/routing";

/**
 * Canonical + hreflang alternates for a page. `path` is the app-relative path
 * without a locale prefix (e.g. "/blog", or "/" for the home page).
 */
export function alternates(lang: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localeHref(lang, path),
    languages: {
      "de-CH": localeHref("de", path),
      "en-CH": localeHref("en", path),
      "x-default": localeHref("de", path),
    },
  };
}
