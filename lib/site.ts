/**
 * Site-wide constants for SEO / metadata. The canonical base URL is taken
 * from NEXT_PUBLIC_SITE_URL when set (e.g. in production), with a localhost
 * fallback for development. No real domain is hard-coded — swap in the real
 * one via the env var when the site is deployed.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const SITE_NAME = "Swiss FIRE Brücken-Rechner";

export const SITE_DESCRIPTION =
  "Kostenloser Rechner für die FIRE-Brückenphase in der Schweiz: Säule 3a, " +
  "Pensionskasse, AHV und kantonale Steuern. Ausschliesslich zu Bildungszwecken, " +
  "keine Finanzberatung.";
