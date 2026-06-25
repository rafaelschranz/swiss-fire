import type { Locale } from "@/lib/i18n/config";
import { de } from "@/lib/i18n/dictionaries/de";
import { en } from "@/lib/i18n/dictionaries/en";

/**
 * The dictionary shape is defined by the canonical German dictionary; the
 * English one must match it structurally (enforced by the `: Dictionary`
 * annotation in en.ts).
 */
export type Dictionary = typeof de;

const DICTIONARIES: Record<Locale, Dictionary> = { de, en };

/** Returns the full UI dictionary for a locale. Plain data — safe to pass to client components. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
