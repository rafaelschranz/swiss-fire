import type { Metadata } from "next";

import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: `Datenschutzerklärung von ${BRAND}: Alle Berechnungen laufen lokal im Browser, es werden keine Finanzdaten übertragen.`,
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

export default function Datenschutz() {
  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col pt-12 pb-12">
          <p className="eyebrow text-brass-soft">Rechtliches</p>
          <h1 className="display mt-3 text-[clamp(28px,4vw,44px)] text-paper">Datenschutz</h1>
        </div>
      </section>

      <div className="col py-14">
        <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-ink/85">
          <h2 className="serif text-2xl text-ink">Grundsatz: keine Server-Verarbeitung Ihrer Eingaben</h2>
          <p>
            {BRAND} ist so gebaut, dass Ihre Finanzdaten Ihren Browser nicht verlassen. Alle Berechnungen
            (Vermögen, Vorsorge, Steuern) laufen vollständig lokal auf Ihrem Gerät. Es werden keine
            Eingabewerte an einen Server übertragen, gespeichert oder ausgewertet.
          </p>

          <h2 className="serif pt-2 text-2xl text-ink">Geteilte Szenarien</h2>
          <p>
            Wenn Sie ein Szenario teilen, werden die Eingaben in den Link (URL-Fragment) kodiert. Dieses
            Fragment wird von Browsern üblicherweise nicht an den Server gesendet. Teilen Sie einen solchen
            Link nur mit Personen, denen Sie die enthaltenen Angaben anvertrauen möchten.
          </p>

          <h2 className="serif pt-2 text-2xl text-ink">Server-Logs &amp; Hosting</h2>
          <p>
            Beim Abruf der Seiten können beim Hosting-Anbieter technisch notwendige Server-Logs anfallen
            (z. B. IP-Adresse, Zeitpunkt, abgerufene Seite). Diese dienen dem Betrieb und der Sicherheit und
            enthalten keine von Ihnen eingegebenen Finanzdaten.
          </p>

          <h2 className="serif pt-2 text-2xl text-ink">Externe Inhalte</h2>
          <p>
            Schriftarten werden über den Build ausgeliefert. Klar gekennzeichnete Partner-Links führen zu
            externen Anbietern mit eigenen Datenschutzbestimmungen.
          </p>

          <h2 className="serif pt-2 text-2xl text-ink">Kontakt</h2>
          <p>
            Fragen zum Datenschutz: [kontakt@example.ch]. Diese Erklärung ist ein Platzhalter und vor der
            Veröffentlichung an die tatsächlichen Verhältnisse anzupassen.
          </p>
        </div>
      </div>
    </main>
  );
}
