import type { Metadata } from "next";

import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung von ${BRAND}.`,
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function Impressum() {
  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col pt-12 pb-12">
          <p className="eyebrow text-brass-soft">Rechtliches</p>
          <h1 className="display mt-3 text-[clamp(28px,4vw,44px)] text-paper">Impressum</h1>
        </div>
      </section>

      <div className="col py-14">
        <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-ink/85">
          <p className="border-l-2 border-brass bg-brass/5 p-4 text-sm text-ink">
            Platzhalter — vor der Veröffentlichung mit den realen Anbieterangaben ersetzen.
          </p>

          <h2 className="serif pt-2 text-2xl text-ink">Anbieter</h2>
          <p>
            {BRAND}<br />
            [Name / Firma]<br />
            [Strasse Nr.]<br />
            [PLZ Ort], Schweiz
          </p>

          <h2 className="serif pt-4 text-2xl text-ink">Kontakt</h2>
          <p>E-Mail: [kontakt@example.ch]</p>

          <h2 className="serif pt-4 text-2xl text-ink">Haftungsausschluss</h2>
          <p>
            {BRAND} ist ein Bildungstool und stellt keine Finanz-, Steuer- oder Anlageberatung dar. Alle
            Berechnungen und Steuerangaben sind Schätzungen ohne Gewähr. Für Entscheidungen auf Basis der
            Ergebnisse wird keine Haftung übernommen; massgebend sind die offiziellen Stellen (ESTV,
            Ausgleichskasse, Pensionskasse) und eine persönliche Beratung.
          </p>
          <p>
            Für Inhalte externer Links wird keine Haftung übernommen; verantwortlich sind ausschliesslich
            deren Betreiber.
          </p>
        </div>
      </div>
    </main>
  );
}
