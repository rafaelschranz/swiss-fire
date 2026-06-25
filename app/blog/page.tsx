import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { POSTS_SORTED } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Wissen zur Frühpensionierung",
  description:
    "Artikel zur Schweizer Frühpensionierung: Brückenphase, Säule 3a, Pensionskasse, AHV-Beiträge und Steuern — verständlich erklärt.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
}

export default function BlogIndex() {
  return (
    <main id="hauptinhalt">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${SITE_NAME} Blog`,
          url: `${SITE_URL}/blog`,
          inLanguage: "de-CH",
        }}
      />

      <section className="bg-ink text-paper">
        <div className="col pt-14 pb-16">
          <p className="eyebrow text-brass-soft">Blog</p>
          <h1 className="display mt-4 text-[clamp(32px,5vw,52px)] text-paper">Wissen zur Frühpensionierung</h1>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-paper/70">
            Brückenphase, Vorsorge und Steuern — die Mechanik der Schweizer Frühpension, verständlich erklärt.
          </p>
        </div>
      </section>

      <div className="col-wide py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {POSTS_SORTED.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card flex flex-col p-7 no-underline transition hover:border-line-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-brass">{post.tag}</p>
                <p className="eyebrow text-muted">{post.readingMinutes} Min.</p>
              </div>
              <h2 className="serif mt-3 text-xl leading-snug text-ink">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
              <p className="num mt-5 text-xs text-muted">{formatDate(post.date)}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
