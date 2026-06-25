"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface I18nValue {
  lang: Locale;
  t: Dictionary;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Makes the active locale + its dictionary available to client components. The
 * server layout selects the dictionary and passes it down; the plain-data
 * object is serialised into the RSC payload, so no dictionary code ships in the
 * client JS bundle.
 */
export function I18nProvider({ lang, dict, children }: { lang: Locale; dict: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, t: dict }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used within an I18nProvider");
  return value;
}
