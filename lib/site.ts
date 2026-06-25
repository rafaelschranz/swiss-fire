/**
 * Site-wide brand + routing constants. Display strings (tagline, descriptions,
 * nav labels) live in the locale dictionaries; only language-neutral values are
 * kept here. The canonical base URL is taken from NEXT_PUBLIC_SITE_URL when set
 * (e.g. in production), with a localhost fallback for development.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Brand name. "Vorzeit" — evokes the early ("vorzeitige") retirement the tool plans for. */
export const BRAND = "Vorzeit";
export const SITE_NAME = "Vorzeit";

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
