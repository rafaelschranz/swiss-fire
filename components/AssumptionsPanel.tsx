import { AHV, DEFAULTS, FEDERAL_INCOME_TAX, GENERAL_TAX, MARKET, PILLAR_2, PILLAR_3A } from "@/lib/engine/constants";
import type { CantonTaxData } from "@/lib/engine/types";

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-t border-line py-2.5 first:border-t-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-ink">{label}</span>
        <span className="num text-sm font-medium text-ink">{value}</span>
      </div>
      {note && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{note}</span>}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow border-b border-line-2 pb-2 text-muted">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function AssumptionsPanel({ canton }: { canton: CantonTaxData }) {
  return (
    <div className="card space-y-6 p-5">
      <Group title="Säule 3a">
        <Row label="Max. Einzahlung (mit PK)" value={`CHF ${PILLAR_3A.maxContributionWithPK.toLocaleString("de-CH")}/Jahr`} />
        <Row
          label="Frühestmöglicher Bezug"
          value={`Referenzalter − ${PILLAR_3A.earliestWithdrawalYearsBeforeReferenceAge} Jahre`}
        />
        <Row
          label="Gestaffelter Bezug"
          value="je Konto ein Jahr"
          note="Mehrere 3a-Konten in getrennten Kalenderjahren beziehen bricht die Progression der Kapitalauszahlungssteuer."
        />
      </Group>

      <Group title="Pensionskasse (BVG-Minimum)">
        <Row label="Koordinationsabzug" value={`CHF ${PILLAR_2.coordinationDeduction.toLocaleString("de-CH")}`} />
        <Row label="Mindestzinssatz" value={`${(PILLAR_2.minInterestRate * 100).toFixed(2)}%`} />
        <Row label="Mindestumwandlungssatz" value={`${(PILLAR_2.minConversionRate * 100).toFixed(1)}%`} />
        <Row label="Frühestes Bezugsalter (Standard)" value={`${PILLAR_2.defaultEarliestPkAge}`} note="Reglementsabhängig, individuell konfigurierbar." />
        <Row
          label="Bezug"
          value="Kapital / Rente / gemischt"
          note="Die Säule 3a wird gesetzlich als Kapital bezogen; die PK wahlweise als Kapital, lebenslange Rente (Guthaben × Umwandlungssatz) oder Mischung. Rentenbezüge (AHV + PK) werden als Einkommen besteuert (siehe Einkommenssteuer)."
        />
      </Group>

      <Group title={`Einkommens- & Kapitalsteuer — ${FEDERAL_INCOME_TAX.source}`}>
        <Row
          label="Direkte Bundessteuer"
          value={`Tarif ${FEDERAL_INCOME_TAX.year}`}
          note="Exakter eidgenössischer Tarif (ledig/verheiratet). Renten (AHV + PK) und Dividenden werden als Einkommen besteuert; Abzüge sind nicht modelliert (leicht konservativ)."
        />
        <Row
          label="Kapitalauszahlungssteuer Bund"
          value="⅕ des ordentlichen Tarifs"
          note="Art. 38 DBG, auf 3a-/PK-Kapitalbezügen — zusätzlich zur kantonalen/kommunalen Kapitalsteuer."
        />
        <Row
          label="Kantonal/kommunal"
          value="Gemeinde-Steuerfaktor"
          note="Kantonale Effektivsätze × Ihrem Gemeinde-Steuerfaktor (100 % = Kantonsmittel) — Näherung; für exakte Gemeindewerte den ESTV-Steuerrechner nutzen."
        />
      </Group>

      <Group title="Monte-Carlo — reale Marktdaten">
        <Row
          label="Aktien Schweiz (real)"
          value={`${(MARKET.equityRealReturn * 100).toFixed(1)}% · σ ${(MARKET.equityVolatility * 100).toFixed(0)}%`}
        />
        <Row
          label="Aktien global (real)"
          value={`${(MARKET.globalEquityRealReturn * 100).toFixed(1)}% · σ ${(MARKET.globalEquityVolatility * 100).toFixed(0)}%`}
          note="UBS/DMS Welt-Index. Der Aktienteil wird nach Ihrem Schweiz-/Global-Anteil gemischt; Welt-Kennzahlen im Berichtswährungs-Basis (CHF-Stärke nicht abgebildet)."
        />
        <Row
          label="Obligationen Schweiz (real)"
          value={`${(MARKET.bondRealReturn * 100).toFixed(1)}% · σ ${(MARKET.bondVolatility * 100).toFixed(1)}%`}
        />
        <Row
          label="Korrelationen (Annahme)"
          value={`Aktien/Obl. ${MARKET.equityBondCorrelation.toFixed(2)} · CH/Welt ${MARKET.swissGlobalEquityCorrelation.toFixed(2)}`}
          note="Modellannahmen, keine publizierten Einzelwerte. Der historische Modus zieht Renditen aus diesen Verteilungen."
        />
        <Row label="Quelle" value={MARKET.source} />
      </Group>

      <Group title="AHV">
        <Row label="Maximale Vollrente" value={`CHF ${AHV.maxAnnualPension.toLocaleString("de-CH")}/Jahr`} />
        <Row label="Referenzalter (Standard)" value={`${AHV.referenceAgeDefault}`} />
        <Row label="Bezugsfenster" value={`${AHV.earliestClaimAge}–${AHV.latestClaimAge}`} />
        <Row
          label="Kürzung/Zuschlag pro Vorbezugsjahr"
          value={`${(AHV.approxEarlyReductionPerYear * 100).toFixed(1)}%`}
          note="Vereinfachung — AHV21 kennt einkommensabhängige Kürzungssätze; offizieller AHV-Rechner für genaue Werte."
        />
      </Group>

      <Group title={`Steuern — ${canton.name}${!canton.verified ? " (Näherung)" : ""}`}>
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
        <Row
          label="Kapitalauszahlungssteuer"
          value="ESTV 2026 (real)"
          note="Echte ESTV-Referenzwerte (kantonal + kommunal, Kantonshauptort, ledig, ohne Kirchensteuer); zwischen den Stützpunkten interpoliert und über den Gemeinde-Steuerfaktor skaliert."
        />
        <Row label="Quelle" value={canton.source} />
        {!canton.verified && (
          <p className="mt-3 border-l-2 border-brass bg-brass/5 p-3 text-xs leading-relaxed text-ink">
            Für {canton.name} ist die Kapitalauszahlungssteuer mit echten ESTV-Werten hinterlegt; die
            Vermögens- und ordentliche Einkommenssteuer beruhen jedoch noch auf einer generischen Näherung.
            Für exakte Werte den offiziellen ESTV-Steuerrechner nutzen.
          </p>
        )}
      </Group>
    </div>
  );
}
