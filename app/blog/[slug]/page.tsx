import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { getPost, POSTS, POSTS_SORTED, type Block } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
}

function renderBlock(block: Block, i: number) {
  if ("h2" in block) {
    return (
      <h2 key={i} className="serif mt-10 text-2xl leading-tight text-ink">
        {block.h2}
      </h2>
    );
  }
  if ("p" in block) {
    return (
      <p key={i} className="mt-4 text-[15px] leading-relaxed text-ink/85">
        {block.p}
      </p>
    );
  }
  if ("ul" in block) {
    return (
      <ul key={i} className="mt-4 space-y-2">
        {block.ul.map((item, j) => (
          <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-ink/85">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brass" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p key={i} className="mt-6 border-l-2 border-brass bg-brass/5 p-4 text-[15px] leading-relaxed text-ink">
      {block.callout}
    </p>
  );
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = POSTS_SORTED.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main id="hauptinhalt">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          inLanguage: "de-CH",
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 2, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
          ],
        }}
      />

      <section className="bg-ink text-paper">
        <div className="col pt-12 pb-14">
          <Link href="/blog" className="eyebrow text-paper/60 no-underline transition hover:text-paper">
            ← Blog
          </Link>
          <p className="eyebrow mt-6 text-brass-soft">{post.tag}</p>
          <h1 className="display mt-3 max-w-3xl text-[clamp(28px,5vw,46px)] leading-tight text-paper">{post.title}</h1>
          <p className="num mt-5 text-xs text-paper/60">
            {formatDate(post.date)} · {post.readingMinutes} Min. Lesezeit
          </p>
        </div>
      </section>

      <article className="col py-14">
        <div className="max-w-prose">
          <p className="serif text-lg leading-relaxed text-muted">{post.description}</p>
          {post.body.map(renderBlock)}

          <div className="mt-12 border-t border-line pt-6">
            <p className="text-xs leading-relaxed text-muted">
              Bildungstool, keine Finanz- oder Steuerberatung. Figuren sind 2026-Schätzungen ohne Gewähr.
            </p>
            <Link
              href="/rechner"
              className="mt-5 inline-block bg-brass px-5 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
            >
              Eigene Frühpension durchrechnen →
            </Link>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="bg-porcelain">
          <div className="col-wide py-14">
            <p className="eyebrow text-brass">Weiterlesen</p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {more.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-6 no-underline transition hover:border-line-2">
                  <p className="eyebrow text-brass">{p.tag}</p>
                  <h3 className="serif mt-2 text-lg leading-snug text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
