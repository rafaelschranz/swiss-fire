import type { Metadata } from "next";
import Link from "next/link";

import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Warum es ${BRAND} gibt und wie der Rechner funktioniert: unabhängig, transparent und vollständig im Browser.`,
  alternates: { canonical: "/ueber-uns" },
};

export default function UeberUns() {
  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col pt-14 pb-16">
          <p className="eyebrow text-brass-soft">Über uns</p>
          <h1 className="display mt-4 max-w-3xl text-[clamp(32px,5vw,52px)] text-paper">
            Frühpensionierung, ehrlich durchgerechnet.
          </h1>
        </div>
      </section>

      <div className="col py-16">
        <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-ink/85">
          <p>
            {BRAND} ist aus einer einfachen Beobachtung entstanden: Die meisten FIRE-Rechner ignorieren,
            was die Schweiz besonders macht — das Vorsorgevermögen ist die längste Zeit gesperrt, und die
            Steuern auf Kapitalbezüge, Einkommen und Vermögen unterscheiden sich von Gemeinde zu Gemeinde
            massiv.
          </p>
          <p>
            Wir wollten ein Werkzeug, das diese Realität abbildet: die Brückenphase zwischen Ausstieg und
            Vorsorge-Bezug, den gestaffelten Säule-3a-Bezug, die Wahl zwischen Pensionskassen-Kapital und
            -Rente, die AHV-Beiträge der Nichterwerbstätigen — und echte Steuern für Ihre Gemeinde.
          </p>

          <h2 className="serif pt-6 text-2xl text-ink">Woher die Zahlen kommen</h2>
          <p>
            Die Steuerwerte stammen aus dem offiziellen Steuerrechner der Eidgenössischen Steuerverwaltung
            (ESTV, Steuerjahr 2026): die Kapitalauszahlungssteuer, die kantonale/kommunale Einkommens- und
            Vermögenssteuer sowie die Gemeinde-Steuerfüsse aller 2&apos;110 Gemeinden. Die direkte Bundessteuer
            rechnen wir mit dem exakten gesetzlichen Tarif. AHV-, BVG- und Säule-3a-Kennzahlen folgen den
            offiziellen Werten 2026.
          </p>
          <p>
            Es bleiben bewusste Vereinfachungen (etwa bei Abzügen und der Kirchensteuer). Alle Angaben sind
            Schätzungen ohne Gewähr und ersetzen keine persönliche Beratung.
          </p>

          <h2 className="serif pt-6 text-2xl text-ink">Ihre Daten bleiben bei Ihnen</h2>
          <p>
            Sämtliche Berechnungen laufen lokal in Ihrem Browser. Es werden keine Finanzdaten an einen
            Server übertragen oder gespeichert. Geteilte Szenario-Links kodieren die Eingaben in der URL —
            auch sie verlassen Ihren Browser nicht.
          </p>

          <h2 className="serif pt-6 text-2xl text-ink">Unabhängig &amp; werbefinanziert</h2>
          <p>
            {BRAND} ist kostenlos und unabhängig. Allfällige Partner-Hinweise sind klar als Werbung
            gekennzeichnet und von den Berechnungsergebnissen getrennt.
          </p>

          <div className="pt-6">
            <Link
              href="/rechner"
              className="inline-block bg-brass px-5 py-3 text-sm font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
            >
              Zum Rechner →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
