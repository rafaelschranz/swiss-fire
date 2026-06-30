/**
 * Site-wide brand + routing constants. Display strings (tagline, descriptions,
 * nav labels) live in the locale dictionaries; only language-neutral values are
 * kept here. The canonical base URL is `NEXT_PUBLIC_SITE_URL` when set; otherwise
 * it defaults to the production domain in production builds and localhost in dev.
 */
const DEFAULT_SITE_URL = process.env.NODE_ENV === "production" ? "https://pillarzero.ch" : "http://localhost:3000";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

/** Brand name. "Pillar Zero" — the liquid bridge wealth you need before Swiss pillars 1–3 unlock. */
export const BRAND = "Pillar Zero";
export const SITE_NAME = "Pillar Zero";

/**
 * Self-hosted Umami analytics — cookieless, no personal data, no cross-site
 * tracking. Loaded in production only. Disclosed in the privacy page.
 */
export const ANALYTICS = {
  src: "https://analytics.rafaelschranz.com/script.js",
  websiteId: "0fee005b-e6f3-40d0-a7d9-3a81d509da2c",
};

/** Dictionary key for a nav/footer link label, under `common.nav` / `common.legal`. */
export interface NavItem {
  href: string;
  key: string;
}

/** Primary navigation. Labels resolved via `dict.common.nav[key]`. */
export const NAV: NavItem[] = [
  { href: "/rechner", key: "rechner" },
  { href: "/blog", key: "blog" },
  { href: "/ratgeber", key: "ratgeber" },
  { href: "/ueber-uns", key: "ueberUns" },
];

/** Footer legal links. Labels resolved via `dict.common.legal[key]`. */
export const FOOTER_LEGAL: NavItem[] = [
  { href: "/impressum", key: "impressum" },
  { href: "/datenschutz", key: "datenschutz" },
];
