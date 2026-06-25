"use client";

import { AHV, DEFAULTS, FEDERAL_INCOME_TAX, GENERAL_TAX, MARKET, PILLAR_2, PILLAR_3A } from "@/lib/engine/constants";
import type { CantonTaxData } from "@/lib/engine/types";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";

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

export function AssumptionsPanel({
  canton,
  gemeindeName,
  gemeindeFactor,
}: {
  canton: CantonTaxData;
  gemeindeName?: string;
  gemeindeFactor?: number;
}) {
  const { t } = useI18n();
  const a = t.assumptions;
  const py = a.perYear;

  return (
    <div className="card space-y-6 p-5">
      <Group title={a.pillar3a.title}>
        <Row label={a.pillar3a.maxContribution} value={`CHF ${PILLAR_3A.maxContributionWithPK.toLocaleString("de-CH")}${py}`} />
        <Row
          label={a.pillar3a.earliest}
          value={tpl(a.pillar3a.earliestValue, { years: PILLAR_3A.earliestWithdrawalYearsBeforeReferenceAge })}
        />
        <Row label={a.pillar3a.staggered} value={a.pillar3a.staggeredValue} note={a.pillar3a.staggeredNote} />
      </Group>

      <Group title={a.pillar2.title}>
        <Row label={a.pillar2.coordination} value={`CHF ${PILLAR_2.coordinationDeduction.toLocaleString("de-CH")}`} />
        <Row label={a.pillar2.minInterest} value={`${(PILLAR_2.minInterestRate * 100).toFixed(2)}%`} />
        <Row label={a.pillar2.minConversion} value={`${(PILLAR_2.minConversionRate * 100).toFixed(1)}%`} />
        <Row label={a.pillar2.earliestAge} value={`${PILLAR_2.defaultEarliestPkAge}`} note={a.pillar2.earliestAgeNote} />
        <Row label={a.pillar2.payout} value={a.pillar2.payoutValue} note={a.pillar2.payoutNote} />
      </Group>

      <Group title={a.incomeTax.title}>
        <Row
          label={a.incomeTax.federal}
          value={tpl(a.incomeTax.federalValue, { year: FEDERAL_INCOME_TAX.year })}
          note={a.incomeTax.federalNote}
        />
        <Row label={a.incomeTax.cantonal} value={a.incomeTax.cantonalValue} note={a.incomeTax.cantonalNote} />
        {gemeindeName && gemeindeFactor !== undefined && (
          <Row
            label={a.incomeTax.gemeinde}
            value={`${gemeindeName} · ${Math.round(gemeindeFactor * 100)} %`}
            note={a.incomeTax.gemeindeNote}
          />
        )}
        <Row label={a.incomeTax.federalCapital} value={a.incomeTax.federalCapitalValue} note={a.incomeTax.federalCapitalNote} />
      </Group>

      <Group title={a.market.title}>
        <Row
          label={a.market.equityCh}
          value={`${(MARKET.equityRealReturn * 100).toFixed(1)}% · σ ${(MARKET.equityVolatility * 100).toFixed(0)}%`}
        />
        <Row
          label={a.market.equityGlobal}
          value={`${(MARKET.globalEquityRealReturn * 100).toFixed(1)}% · σ ${(MARKET.globalEquityVolatility * 100).toFixed(0)}%`}
          note={a.market.equityGlobalNote}
        />
        <Row
          label={a.market.bondsCh}
          value={`${(MARKET.bondRealReturn * 100).toFixed(1)}% · σ ${(MARKET.bondVolatility * 100).toFixed(1)}%`}
        />
        <Row
          label={a.market.correlations}
          value={tpl(a.market.correlationsValue, {
            eb: MARKET.equityBondCorrelation.toFixed(2),
            sw: MARKET.swissGlobalEquityCorrelation.toFixed(2),
          })}
          note={a.market.correlationsNote}
        />
        <Row label={a.market.source} value={MARKET.source} />
      </Group>

      <Group title={a.ahv.title}>
        <Row label={a.ahv.maxPension} value={`CHF ${AHV.maxAnnualPension.toLocaleString("de-CH")}${py}`} />
        <Row label={a.ahv.referenceAge} value={`${AHV.referenceAgeDefault}`} />
        <Row label={a.ahv.claimWindow} value={`${AHV.earliestClaimAge}–${AHV.latestClaimAge}`} />
        <Row
          label={a.ahv.reduction}
          value={`${(AHV.approxEarlyReductionPerYear * 100).toFixed(1)}%`}
          note={a.ahv.reductionNote}
        />
      </Group>

      <Group title={tpl(a.cantonTax.title, { canton: canton.name })}>
        <Row
          label={a.cantonTax.dividendYield}
          value={tpl(a.cantonTax.dividendYieldValue, { pct: (DEFAULTS.dividendYield * 100).toFixed(1) })}
          note={a.cantonTax.dividendYieldNote}
        />
        <Row
          label={a.cantonTax.noCapGains}
          value={GENERAL_TAX.capitalGainsTaxed ? a.cantonTax.yes : a.cantonTax.no}
          note={a.cantonTax.noCapGainsNote}
        />
        <Row label={a.cantonTax.capitalTax} value={a.cantonTax.capitalTaxValue} note={a.cantonTax.capitalTaxNote} />
        <Row label={a.cantonTax.source} value={canton.source} />
        {!canton.verified && (
          <p className="mt-3 border-l-2 border-brass bg-brass/5 p-3 text-xs leading-relaxed text-ink">
            {tpl(a.cantonTax.unverifiedNote, { canton: canton.name })}
          </p>
        )}
      </Group>
    </div>
  );
}
