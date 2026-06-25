import Link from "next/link";

import { BRAND, FOOTER_LEGAL, NAV } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink-2 text-paper/70">
      <div className="col grid grid-cols-1 gap-8 py-12 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="serif text-lg font-semibold text-paper">{BRAND}</p>
          <p className="max-w-xs text-xs leading-relaxed">
            Der unabhängige Schweizer Rechner für die Frühpensionierung — Brückenphase, Vorsorge und
            echte Steuern, transparent durchgerechnet.
          </p>
        </div>

        <div>
          <p className="eyebrow text-brass-soft">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="no-underline transition hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-brass-soft">Rechtliches</p>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="no-underline transition hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="col py-6 text-xs leading-relaxed">
          <p className="max-w-prose">
            Ausschliesslich zu Bildungszwecken. Keine Finanz-, Steuer- oder Anlageberatung. Alle
            Steuerangaben sind Schätzungen ohne Gewähr. Berechnungen laufen lokal im Browser; es werden
            keine Eingaben an einen Server übertragen.
          </p>
          <p className="mt-3 text-paper/50">© {new Date().getFullYear()} {BRAND}. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
