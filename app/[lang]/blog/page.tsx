import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { postsSorted } from "@/lib/blog";
import { HTML_LANG, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternates } from "@/lib/i18n/metadata";
import { localeHref } from "@/lib/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.blog.meta.title,
    description: t.blog.meta.description,
    alternates: alternates(lang, "/blog"),
  };
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
}

export default async function BlogIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "de";
  const t = getDictionary(locale);
  const bi = t.blog.index;
  const posts = postsSorted(locale);

  return (
    <main id="hauptinhalt">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${SITE_NAME} Blog`,
          url: `${SITE_URL}${localeHref(locale, "/blog")}`,
          inLanguage: HTML_LANG[locale],
        }}
      />

      <section className="bg-ink text-paper">
        <div className="col pt-14 pb-16">
          <p className="eyebrow text-brass-soft">{bi.kicker}</p>
          <h1 className="display mt-4 text-[clamp(32px,5vw,52px)] text-paper">{bi.h1}</h1>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-paper/70">{bi.body}</p>
        </div>
      </section>

      <div className="col-wide py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={localeHref(locale, `/blog/${post.slug}`)}
              className="card flex flex-col p-7 no-underline transition hover:border-line-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-brass">{post.tag}</p>
                <p className="eyebrow text-muted">
                  {post.readingMinutes} {bi.readingShort}
                </p>
              </div>
              <h2 className="serif mt-3 text-xl leading-snug text-ink">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
              <p className="num mt-5 text-xs text-muted">{formatDate(post.date, HTML_LANG[locale])}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
