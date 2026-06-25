import type { Metadata } from "next";
import Link from "next/link";

import { Disclaimer } from "@/components/Disclaimer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ratgeber: FIRE-Brückenphase, Säulen & Kapitalbezug",
  description:
    "Wie funktioniert die Brückenphase bei einer Frühpensionierung in der Schweiz? Säule 3a, Pensionskasse, AHV und die Steuer beim Kapitalbezug — verständlich erklärt.",
  alternates: { canonical: "/ratgeber" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Was ist die FIRE-Brückenphase?",
    a:
      "Als Brückenphase bezeichnet man die Jahre zwischen dem frühen Ausstieg aus dem Erwerbsleben (FIRE) und dem Zeitpunkt, ab dem Vorsorgegelder verfügbar werden. Säule 3a und Pensionskasse können in der Regel frühestens rund fünf Jahre vor dem Referenzalter bezogen werden, die AHV ab 63. In der Brückenphase müssen die Lebenshaltungskosten vollständig aus frei verfügbarem (steuerbarem) Vermögen gedeckt werden.",
  },
  {
    q: "Ab welchem Alter kann ich Säule 3a und Pensionskasse beziehen?",
    a:
      "Säule-3a-Guthaben können frühestens fünf Jahre vor dem AHV-Referenzalter bezogen werden, also üblicherweise ab etwa 60. Pensionskassenkapital ist je nach Reglement oft ab 58 bis 60 beziehbar. Die genauen Altersgrenzen hängen von der Vorsorgeeinrichtung und dem Reglement ab.",
  },
  {
    q: "Wie wird der Kapitalbezug aus der Vorsorge besteuert?",
    a:
      "Kapitalbezüge aus Säule 3a und Pensionskasse werden getrennt vom übrigen Einkommen zu einem reduzierten Satz besteuert (Kapitalauszahlungssteuer). Der Satz ist progressiv und unterscheidet sich stark je nach Kanton und Wohngemeinde. Werden mehrere Bezüge im selben Steuerjahr getätigt, werden sie zusammengezählt — eine Staffelung über mehrere Jahre kann die Steuerlast deshalb senken.",
  },
  {
    q: "Muss ich nach dem Ausstieg AHV-Beiträge zahlen?",
    a:
      "Wer vor dem Referenzalter nicht mehr erwerbstätig ist, gilt als nichterwerbstätig und zahlt AHV-Beiträge basierend auf Vermögen und allfälligem Renteneinkommen. Die Beiträge bewegen sich zwischen einem Minimum und einem Maximum pro Jahr. Diese Kosten fallen in der Brückenphase zusätzlich an und sollten eingeplant werden.",
  },
  {
    q: "Rechnet dieses Tool in realen oder nominalen Werten?",
    a:
      "Die Berechnung erfolgt durchgehend in realen (inflationsbereinigten) Werten. Renditen, Ausgaben und Renten sind also in heutiger Kaufkraft zu verstehen. Das vereinfacht die Interpretation, weil Beträge über die Jahre vergleichbar bleiben.",
  },
];

export default function RatgeberPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Rechner", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${SITE_URL}/ratgeber` },
    ],
  };

  return (
    <main id="hauptinhalt">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Ink masthead for the document */}
      <section className="bg-ink text-paper">
        <div className="col pt-10 pb-14">
          <nav aria-label="Brotkrümel" className="eyebrow text-brass-soft">
            <Link href="/" className="no-underline transition hover:text-paper">
              Rechner
            </Link>
            <span className="text-paper/40"> / Ratgeber</span>
          </nav>
          <h1 className="display mt-5 text-[clamp(30px,5vw,48px)] text-paper">
            Frühpensionierung in der Schweiz: die Brückenphase verstehen
          </h1>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-paper/70">
            Ein kompakter Überblick über die Mechanik zwischen FIRE-Ausstieg und dem Zugriff auf
            Säule 3a, Pensionskasse und AHV — die Grundlage hinter dem Rechner.
          </p>
        </div>
      </section>

      <article className="col space-y-12 py-14">
        <Disclaimer />

        <section className="space-y-4">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="eyebrow text-brass">01</span>
            <h2 className="serif text-2xl text-ink">Die drei Säulen auf einen Blick</h2>
          </div>
          <p className="max-w-prose leading-relaxed text-ink">
            Das Schweizer Vorsorgesystem ruht auf drei Säulen: der staatlichen AHV (Säule 1), der
            beruflichen Vorsorge / Pensionskasse (Säule 2, BVG) und der gebundenen privaten Vorsorge
            (Säule 3a). Für eine Frühpensionierung ist entscheidend, dass alle drei erst ab einem
            bestimmten Alter Geld ausschütten — die Lücke davor muss aus eigenem, frei verfügbarem
            Vermögen überbrückt werden.
          </p>
          <dl className="border border-line">
            {[
              ["Säule 1 — AHV", "Bezug flexibel ab 63, regulär ab Referenzalter 65. Ein Vorbezug reduziert die lebenslange Rente."],
              ["Säule 2 — Pensionskasse", "Kapital- oder Rentenbezug je nach Reglement oft ab 58–60. Ein Kapitalbezug wird einmalig besteuert."],
              ["Säule 3a", "Bezug frühestens fünf Jahre vor dem Referenzalter, also typischerweise ab rund 60. Mehrere 3a-Konten erlauben gestaffelte Bezüge."],
            ].map(([term, def]) => (
              <div key={term} className="flex flex-col gap-1 border-t border-line p-4 first:border-t-0 sm:flex-row sm:gap-6">
                <dt className="eyebrow shrink-0 pt-0.5 text-muted sm:w-48">{term}</dt>
                <dd className="leading-relaxed text-ink">{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="eyebrow text-brass">02</span>
            <h2 className="serif text-2xl text-ink">Warum die Staffelung beim Bezug zählt</h2>
          </div>
          <p className="max-w-prose leading-relaxed text-ink">
            Kapitalbezüge aus Vorsorgegeldern werden im Bezugsjahr zusammengezählt und progressiv
            besteuert. Wer Säule 3a und Pensionskasse im selben Jahr bezieht, landet schnell in einer
            höheren Progressionsstufe. Eine Verteilung über mehrere Steuerjahre kann die gesamte
            Kapitalauszahlungssteuer spürbar senken. Der Rechner bildet diese Heuristik nach, indem er
            pro Jahr höchstens aus einer Säule bezieht.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline gap-3 border-b border-line pb-3">
            <span className="eyebrow text-brass">03</span>
            <h2 className="serif text-2xl text-ink">Häufige Fragen</h2>
          </div>
          <dl className="border border-line">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t border-line p-4 first:border-t-0">
                <dt className="font-medium text-ink">{item.q}</dt>
                <dd className="mt-1.5 max-w-prose leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p>
          <Link href="/" className="bg-brass px-5 py-3 text-sm font-semibold text-[#1a1205] transition hover:bg-brass-soft">
            ← Zum Rechner
          </Link>
        </p>
      </article>
    </main>
  );
}
