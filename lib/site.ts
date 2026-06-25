/**
 * Site-wide brand + SEO constants. The canonical base URL is taken from
 * NEXT_PUBLIC_SITE_URL when set (e.g. in production), with a localhost fallback
 * for development. No real domain is hard-coded — swap it in via the env var.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Brand name. "Vorzeit" — evokes the early ("vorzeitige") retirement the tool plans for. */
export const BRAND = "Vorzeit";
export const SITE_NAME = "Vorzeit";
export const TAGLINE = "Frühpensionierung in der Schweiz, durchgerechnet.";

export const SITE_DESCRIPTION =
  "Vorzeit ist der kostenlose Schweizer Rechner für die Frühpensionierung: " +
  "Brückenphase, Säule 3a, Pensionskasse, AHV und echte ESTV-Steuern pro Gemeinde. " +
  "Bildungstool, keine Finanzberatung — alle Berechnungen laufen lokal im Browser.";

export interface NavLink {
  href: string;
  label: string;
}

export const NAV: NavLink[] = [
  { href: "/rechner", label: "Rechner" },
  { href: "/blog", label: "Blog" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/ueber-uns", label: "Über uns" },
];

export const FOOTER_LEGAL: NavLink[] = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];
