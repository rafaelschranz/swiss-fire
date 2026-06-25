/**
 * Locale configuration. The site is bilingual: German (the default, kept at
 * `/de`) and English (`/en`). German is the canonical content language; English
 * is a full translation. Both live under the `app/[lang]` route segment.
 */
export const LOCALES = ["de", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "de";

/** Narrows an arbitrary string to a supported `Locale`. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** BCP-47 tags used for `<html lang>`, OpenGraph and `Intl` formatting. */
export const HTML_LANG: Record<Locale, string> = {
  de: "de-CH",
  en: "en-CH",
};

export const OG_LOCALE: Record<Locale, string> = {
  de: "de_CH",
  en: "en_CH",
};

/** Native label for each locale, shown in the language switcher. */
export const LOCALE_LABEL: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};
