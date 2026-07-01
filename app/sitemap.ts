import type { MetadataRoute } from "next";

import { postsSorted } from "@/lib/blog";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";

/**
 * Stable last-modified for the static pages. Kept constant (not `new Date()`)
 * so `<lastmod>` doesn't churn on every deploy — Google distrusts lastmod that
 * always equals "now". Bump when the static pages meaningfully change.
 */
const SITE_LAST_MODIFIED = new Date("2026-07-01");

/** hreflang alternates (all locales + x-default → the default locale) for a path. */
function languages(path: string): Record<string, string> {
  const map = Object.fromEntries(LOCALES.map((lang) => [lang, `${SITE_URL}${localeHref(lang, path)}`]));
  map["x-default"] = `${SITE_URL}${localeHref(DEFAULT_LOCALE, path)}`;
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/rechner", changeFrequency: "monthly", priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/ratgeber", changeFrequency: "monthly", priority: 0.6 },
    { path: "/ueber-uns", changeFrequency: "yearly", priority: 0.4 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const lang of LOCALES) {
      entries.push({
        url: `${SITE_URL}${localeHref(lang, page.path)}`,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: languages(page.path) },
      });
    }
  }

  // Blog posts carry their own publish date as lastmod.
  for (const post of postsSorted(DEFAULT_LOCALE)) {
    const path = `/blog/${post.slug}`;
    for (const lang of LOCALES) {
      entries.push({
        url: `${SITE_URL}${localeHref(lang, path)}`,
        lastModified: new Date(post.date),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languages(path) },
      });
    }
  }

  return entries;
}
