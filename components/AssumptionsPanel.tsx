import { AHV, DEFAULTS, GENERAL_TAX, PILLAR_2, PILLAR_3A } from "@/lib/engine/constants";
import type { CantonTaxData } from "@/lib/engine/types";

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <li className="flex flex-col gap-0.5 py-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">{value}</span>
      </div>
      {note && <span className="text-xs text-zinc-500 dark:text-zinc-400">{note}</span>}
    </li>
  );
}

export function AssumptionsPanel({ canton }: { canton: CantonTaxData }) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Verwendete Annahmen &amp; Quellen</p>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Säule 3a
        </p>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          <Row label="Max. Einzahlung (mit PK)" value={`CHF ${PILLAR_3A.maxContributionWithPK.toLocaleString("de-CH")}/Jahr`} />
          <Row
            label="Frühestmöglicher Bezug"
            value={`Referenzalter − ${PILLAR_3A.earliestWithdrawalYearsBeforeReferenceAge} Jahre`}
          />
        </ul>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Pensionskasse (BVG-Minimum)
        </p>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          <Row label="Koordinationsabzug" value={`CHF ${PILLAR_2.coordinationDeduction.toLocaleString("de-CH")}`} />
          <Row label="Mindestzinssatz" value={`${(PILLAR_2.minInterestRate * 100).toFixed(2)}%`} />
          <Row label="Mindestumwandlungssatz" value={`${(PILLAR_2.minConversionRate * 100).toFixed(1)}%`} />
          <Row label="Frühestes Bezugsalter (Standard)" value={`${PILLAR_2.defaultEarliestPkAge}`} note="Reglementsabhängig, individuell konfigurierbar." />
        </ul>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">AHV</p>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          <Row label="Maximale Vollrente" value={`CHF ${AHV.maxAnnualPension.toLocaleString("de-CH")}/Jahr`} />
          <Row label="Referenzalter (Standard)" value={`${AHV.referenceAgeDefault}`} />
          <Row label="Bezugsfenster" value={`${AHV.earliestClaimAge}–${AHV.latestClaimAge}`} />
          <Row
            label="Kürzung/Zuschlag pro Vorbezugsjahr"
            value={`${(AHV.approxEarlyReductionPerYear * 100).toFixed(1)}%`}
            note="Vereinfachung — AHV21 kennt einkommensabhängige Kürzungssätze; offizieller AHV-Rechner für genaue Werte."
          />
        </ul>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Steuern — {canton.name} {!canton.verified && "(Näherung, nicht verifiziert)"}
        </p>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          <Row
            label="Dividendenrendite-Annahme"
            value={`${(DEFAULTS.dividendYield * 100).toFixed(1)}%/Jahr`}
            note="Annahme, nicht aus dem Projektbrief — typischer ETF-Mix."
          />
          <Row
            label="Keine Kapitalgewinnsteuer"
            value={GENERAL_TAX.capitalGainsTaxed ? "Ja" : "Nein"}
            note="Für Privatanleger auf bewegliches Vermögen."
          />
          <Row label="Quelle Kapitalauszahlungssteuer" value={canton.source} />
        </ul>
        {!canton.verified && (
          <p className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Für {canton.name} liegen noch keine gegengeprüften Kapitalauszahlungs-Referenzwerte vor — die Kurve ist
            ein grober, von Schwyz skalierter Platzhalter. Bitte mit dem offiziellen ESTV- oder kantonalen
            Steuerrechner verifizieren.
          </p>
        )}
      </div>
    </div>
  );
}
