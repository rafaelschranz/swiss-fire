import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Prefixes an app-relative path with the active locale. Pass paths without a
 * leading locale (e.g. "/rechner", "/blog/foo", or "/" for the home page).
 */
export function localeHref(lang: Locale, path: string): string {
  if (path === "/" || path === "") return `/${lang}`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean}`;
}

/**
 * Splits a full pathname into its locale and the remaining app-relative path.
 * "/en/blog/foo" → { lang: "en", rest: "/blog/foo" }. Falls back to the default
 * locale and the original path when no locale prefix is present.
 */
export function splitLocale(pathname: string): { lang: Locale; rest: string } {
  const segments = pathname.split("/").filter(Boolean);
  const [first, ...others] = segments;
  if (first && isLocale(first)) {
    return { lang: first, rest: `/${others.join("/")}` };
  }
  return { lang: DEFAULT_LOCALE, rest: pathname || "/" };
}
