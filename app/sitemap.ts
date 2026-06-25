import type { MetadataRoute } from "next";

import { allSlugs } from "@/lib/blog";
import { LOCALES } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/site";

/** Builds hreflang alternates for an app-relative path across all locales. */
function languages(path: string): Record<string, string> {
  return Object.fromEntries(LOCALES.map((lang) => [lang, `${SITE_URL}${localeHref(lang, path)}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: languages(page.path) },
      });
    }
  }

  for (const slug of allSlugs()) {
    const path = `/blog/${slug}`;
    for (const lang of LOCALES) {
      entries.push({
        url: `${SITE_URL}${localeHref(lang, path)}`,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languages(path) },
      });
    }
  }

  return entries;
}
