import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { POSTS_SORTED } from "@/lib/blog";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frühpensionierung in der Schweiz berechnen",
  description:
    "Vorzeit zeigt Ihnen in vier Schritten, ob Ihr Kapital für die Frühpensionierung reicht — " +
    "Brückenphase, Säule 3a, Pensionskasse, AHV und echte ESTV-Steuern pro Gemeinde. Kostenlos und privat.",
  alternates: { canonical: "/" },
};

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Brückenkapital",
    body: "Wie viel liquides Vermögen Sie brauchen, um die Jahre bis zum ersten Vorsorge-Bezug zu überbrücken.",
  },
  {
    title: "Echte Steuern pro Gemeinde",
    body: "Einkommens-, Vermögens- und Kapitalsteuer mit realen ESTV-Werten 2026 — für jede der 2'110 Gemeinden.",
  },
  {
    title: "Säule 3a · PK · AHV",
    body: "Gestaffelter 3a-Bezug, Pensionskasse als Kapital oder Rente, AHV-Vorbezug und die AHV-Beiträge aufs Vermögen.",
  },
  {
    title: "Monte-Carlo mit echten Daten",
    body: "Wie robust ist der Plan? Simulation auf Basis realer Schweizer Aktien- und Obligationenrenditen seit 1900.",
  },
  {
    title: "Auch für Paare",
    body: "Zwei Profile mit eigenem Ausstiegsalter, eigener Vorsorge — als Haushalt durchgerechnet, inkl. AHV-Plafonierung.",
  },
  {
    title: "Lokal & privat",
    body: "Alle Berechnungen laufen in Ihrem Browser. Es werden keine Eingaben an einen Server übertragen.",
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Über Sie", body: "Alter, geplantes Ausstiegsalter, Kanton und Gemeinde." },
  { n: "02", title: "Vermögen & Einkommen", body: "Depot, Säule 3a, Pensionskasse, Salär und Sparrate." },
  { n: "03", title: "Ruhestand", body: "Ausgaben, Renten, Bezugsalter und Bezugsart der Vorsorge." },
  { n: "04", title: "Ergebnis", body: "Reicht das Kapital? Mit Zeitlinie, Steuern und Jahresverlauf." },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Was kostet Vorzeit?",
    a: "Nichts. Der Rechner ist kostenlos und ohne Anmeldung nutzbar. Es gibt keine kostenpflichtige Version.",
  },
  {
    q: "Werden meine Eingaben gespeichert?",
    a: "Nein. Sämtliche Berechnungen laufen lokal in Ihrem Browser. Es werden keine Finanzdaten an einen Server übertragen.",
  },
  {
    q: "Wie genau sind die Steuern?",
    a: "Die Kapital-, Einkommens- und Vermögenssteuer beruhen auf echten Werten des offiziellen ESTV-Steuerrechners (2026), pro Gemeinde skaliert. Die direkte Bundessteuer wird mit dem exakten Tarif berechnet. Es bleiben Vereinfachungen (z. B. Abzüge) — die Angaben sind Schätzungen ohne Gewähr.",
  },
  {
    q: "Ist das eine Finanzberatung?",
    a: "Nein. Vorzeit ist ein Bildungstool. Es ersetzt keine persönliche Finanz-, Steuer- oder Vorsorgeberatung.",
  },
];

export default function Home() {
  return (
    <main id="hauptinhalt">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="col pt-16 pb-24 sm:pt-24">
          <p className="eyebrow text-brass-soft">{BRAND} · Schweizer FIRE</p>
          <h1 className="display mt-5 max-w-4xl text-[clamp(38px,7vw,72px)] text-paper">
            Reicht Ihr Kapital für die Frühpensionierung?
          </h1>
          <p className="mt-6 max-w-prose text-[16px] leading-relaxed text-paper/70">
            Vorzeit rechnet die Brücke zwischen Ihrem Ausstieg und dem Zugriff auf Säule 3a,
            Pensionskasse und AHV — inklusive echter ESTV-Steuern für Ihre Gemeinde. In vier Schritten,
            kostenlos und vollständig privat.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/rechner"
              className="bg-brass px-6 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
            >
              Jetzt kostenlos rechnen →
            </Link>
            <Link
              href="/ratgeber"
              className="eyebrow border border-paper/30 px-5 py-3 text-paper no-underline transition hover:bg-paper hover:text-ink"
            >
              Zum Ratgeber
            </Link>
          </div>
          <p className="mt-6 text-xs text-paper/50">
            Bildungstool, keine Finanzberatung · keine Anmeldung · keine Daten verlassen den Browser
          </p>
        </div>
      </section>

      {/* The problem */}
      <section className="col-wide py-20">
        <p className="eyebrow text-brass">Das Problem</p>
        <h2 className="serif mt-3 max-w-3xl text-[clamp(24px,4vw,38px)] leading-tight text-ink">
          Ihr Vorsorgevermögen ist gesperrt — genau dann, wenn Sie es brauchen.
        </h2>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">
          Wer früh aufhört, muss die Jahre bis 58–65 überbrücken, bevor die drei Säulen greifen. Diese
          Brückenphase entscheidet, ob die Frühpension trägt.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          {[
            { k: "Brückenphase", v: "Ausstieg → 58/60", d: "Nur das frei verfügbare Vermögen steht zur Verfügung. Säule 3a und PK sind gesperrt." },
            { k: "Vorsorge-Bezug", v: "ab 58–60", d: "Pensionskasse und Säule 3a werden zugänglich — gestaffelt geplant, spart das Steuern." },
            { k: "AHV", v: "ab 63–65", d: "Die AHV-Rente setzt ein und reduziert den Bedarf aus dem eigenen Vermögen." },
          ].map((c) => (
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
          <p className="eyebrow text-brass">Was Vorzeit rechnet</p>
          <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">Alles, was die Schweizer Frühpension ausmacht.</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
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
        <p className="eyebrow text-brass">So funktioniert&rsquo;s</p>
        <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">In vier Schritten zum Ergebnis.</h2>
        <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-paper p-6">
              <p className="eyebrow text-brass">{s.n}</p>
              <h3 className="serif mt-2 text-lg text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/rechner" className="eyebrow text-brass no-underline transition hover:text-ink">
            Rechner öffnen →
          </Link>
        </div>
      </section>

      {/* Blog teasers */}
      <section className="bg-porcelain">
        <div className="col-wide py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-brass">Aus dem Blog</p>
              <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">Wissen für die Frühpension.</h2>
            </div>
            <Link href="/blog" className="eyebrow hidden text-brass no-underline transition hover:text-ink sm:inline">
              Alle Beiträge →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {POSTS_SORTED.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card flex flex-col p-6 no-underline transition hover:border-line-2">
                <p className="eyebrow text-brass">{post.tag}</p>
                <h3 className="serif mt-2 text-lg leading-snug text-ink">{post.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
                <p className="eyebrow mt-4 text-muted">{post.readingMinutes} Min. Lesezeit</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="col-wide py-20">
        <p className="eyebrow text-brass">Häufige Fragen</p>
        <h2 className="serif mt-3 text-[clamp(24px,4vw,38px)] text-ink">Gut zu wissen.</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
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
            <h2 className="display text-[clamp(26px,4vw,40px)] text-paper">Rechnen Sie Ihre Brücke durch.</h2>
            <p className="mt-2 text-sm text-paper/70">Kostenlos, in wenigen Minuten, ohne dass Daten Ihren Browser verlassen.</p>
          </div>
          <Link
            href="/rechner"
            className="shrink-0 bg-brass px-6 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
          >
            Jetzt starten →
          </Link>
        </div>
      </section>
    </main>
  );
}
