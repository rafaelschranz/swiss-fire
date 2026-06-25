import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { postsSorted } from "@/lib/blog";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { alternates } from "@/lib/i18n/metadata";
import { localeHref } from "@/lib/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.home.meta.title,
    description: t.home.meta.description,
    alternates: alternates(lang, "/"),
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "de";
  const t = getDictionary(locale);
  const h = t.home;
  const posts = postsSorted(locale).slice(0, 3);

  return (
    <main id="hauptinhalt">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: h.faq.items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="col pt-16 pb-24 sm:pt-24">
          <p className="eyebrow text-brass-soft">{h.hero.kicker}</p>
          <h1 className="display mt-5 max-w-4xl text-[clamp(38px,7vw,72px)] text-paper">{h.hero.h1}</h1>
          <p className="mt-6 max-w-prose text-[16px] leading-relaxed text-paper/70">{h.hero.body}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={localeHref(locale, "/rechner")}
              className="bg-brass px-6 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
            >
              {h.hero.ctaPrimary}
            </Link>
            <Link
              href={localeHref(locale, "/ratgeber")}
              className="eyebrow border border-paper/30 px-5 py-3 text-paper no-underline transition hover:bg-paper hover:text-ink"
            >
              {h.hero.ctaSecondary}
            </Link>
          </div>
          <p className="mt-6 text-xs text-paper/50">{h.hero.note}</p>
        </div>
      </section>

      {/* The problem */}
      <section className="col-wide py-20">
        <p className="eyebrow text-brass">{h.problem.kicker}</p>
        <h2 className="serif mt-3 max-w-3xl text-[clamp(24px,4vw,38px)] leading-tight text-ink">{h.problem.h2}</h2>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">{h.problem.body}</p>
        <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          {h.problem.cards.map((c) => (
            <div key={c.k} className="bg-paper p-6">
              <p className="eyebrow text-muted">{c.k}</p>
              <p className="num mt-2 text-xl font-semibold text-ink">{c.v}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-porcelain">
        <div className="col-wide py-20">
          <p className="eyebrow text-brass">{h.features.kicker}</p>
          <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">{h.features.h2}</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {h.features.items.map((f) => (
              <div key={f.title} className="card p-6">
                <h3 className="serif text-lg text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="col-wide py-20">
        <p className="eyebrow text-brass">{h.steps.kicker}</p>
        <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">{h.steps.h2}</h2>
        <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {h.steps.items.map((s) => (
            <div key={s.n} className="bg-paper p-6">
              <p className="eyebrow text-brass">{s.n}</p>
              <h3 className="serif mt-2 text-lg text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href={localeHref(locale, "/rechner")} className="eyebrow text-brass no-underline transition hover:text-ink">
            {h.steps.cta}
          </Link>
        </div>
      </section>

      {/* Blog teasers */}
      <section className="bg-porcelain">
        <div className="col-wide py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-brass">{h.blogTeaser.kicker}</p>
              <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">{h.blogTeaser.h2}</h2>
            </div>
            <Link
              href={localeHref(locale, "/blog")}
              className="eyebrow hidden text-brass no-underline transition hover:text-ink sm:inline"
            >
              {h.blogTeaser.all}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={localeHref(locale, `/blog/${post.slug}`)}
                className="card flex flex-col p-6 no-underline transition hover:border-line-2"
              >
                <p className="eyebrow text-brass">{post.tag}</p>
                <h3 className="serif mt-2 text-lg leading-snug text-ink">{post.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
                <p className="eyebrow mt-4 text-muted">
                  {post.readingMinutes} {h.blogTeaser.readingSuffix}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="col-wide py-20">
        <p className="eyebrow text-brass">{h.faq.kicker}</p>
        <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">{h.faq.h2}</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {h.faq.items.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="serif cursor-pointer list-none text-lg text-ink marker:content-none">
                <span className="text-brass">+ </span>
                {f.q}
              </summary>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink text-paper">
        <div className="col flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center">
          <div>
            <h2 className="display text-[clamp(26px,4vw,40px)] text-paper">{h.finalCta.h2}</h2>
            <p className="mt-2 text-sm text-paper/70">{h.finalCta.body}</p>
          </div>
          <Link
            href={localeHref(locale, "/rechner")}
            className="shrink-0 bg-brass px-6 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
          >
            {h.finalCta.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
