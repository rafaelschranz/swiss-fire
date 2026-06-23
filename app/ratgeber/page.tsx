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
    <main id="hauptinhalt" className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <nav aria-label="Brotkrümel" className="text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="underline-offset-2 hover:underline">
          Rechner
        </Link>{" "}
        / <span className="text-zinc-700 dark:text-zinc-300">Ratgeber</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Frühpensionierung in der Schweiz: die Brückenphase verstehen
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ein kompakter Überblick über die Mechanik zwischen FIRE-Ausstieg und dem Zugriff auf
          Säule 3a, Pensionskasse und AHV — die Grundlage hinter dem Rechner.
        </p>
      </header>

      <Disclaimer />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Die drei Säulen auf einen Blick</h2>
        <p className="leading-7 text-zinc-700 dark:text-zinc-300">
          Das Schweizer Vorsorgesystem ruht auf drei Säulen: der staatlichen AHV (Säule 1), der
          beruflichen Vorsorge / Pensionskasse (Säule 2, BVG) und der gebundenen privaten Vorsorge
          (Säule 3a). Für eine Frühpensionierung ist entscheidend, dass alle drei erst ab einem
          bestimmten Alter Geld ausschütten — die Lücke davor muss aus eigenem, frei verfügbarem
          Vermögen überbrückt werden.
        </p>
        <ul className="ml-5 list-disc space-y-2 leading-7 text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Säule 1 (AHV):</strong> Bezug flexibel ab 63, regulär ab Referenzalter 65. Ein
            Vorbezug reduziert die lebenslange Rente.
          </li>
          <li>
            <strong>Säule 2 (Pensionskasse):</strong> Kapital- oder Rentenbezug je nach Reglement
            oft ab 58–60. Ein Kapitalbezug wird einmalig besteuert.
          </li>
          <li>
            <strong>Säule 3a:</strong> Bezug frühestens fünf Jahre vor dem Referenzalter, also
            typischerweise ab rund 60. Mehrere 3a-Konten erlauben gestaffelte Bezüge.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Warum die Staffelung beim Bezug zählt</h2>
        <p className="leading-7 text-zinc-700 dark:text-zinc-300">
          Kapitalbezüge aus Vorsorgegeldern werden im Bezugsjahr zusammengezählt und progressiv
          besteuert. Wer Säule 3a und Pensionskasse im selben Jahr bezieht, landet schnell in einer
          höheren Progressionsstufe. Eine Verteilung über mehrere Steuerjahre kann die gesamte
          Kapitalauszahlungssteuer spürbar senken. Der Rechner bildet diese Heuristik nach, indem er
          pro Jahr höchstens aus einer Säule bezieht.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Häufige Fragen</h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">{item.q}</dt>
              <dd className="mt-1 leading-7 text-zinc-700 dark:text-zinc-300">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p>
        <Link
          href="/"
          className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          ← Zum Rechner
        </Link>
      </p>
    </main>
  );
}
