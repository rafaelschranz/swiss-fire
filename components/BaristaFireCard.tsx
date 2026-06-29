"use client";

import { baristaBreakEvenIncome } from "@/lib/engine/tax";
import type { DecumulationYearResult } from "@/lib/engine/types";
import { formatChf } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";

/**
 * The "Barista-FIRE" eye-opener: surfaces the wealth-based "AHV on wealth" a
 * wealth-funded early retiree faces across the bridge, and how the statutory
 * half rule (a side job whose AHV contributions reach half the would-be
 * contribution) waives it. Driven entirely by the simulated year results, so
 * the verdict is honest — it shows the actual break-even, not the myth that any
 * tiny job suffices.
 */
export function BaristaFireCard({
  years,
  active,
  income,
  hasPartner,
}: {
  years: DecumulationYearResult[];
  active: boolean;
  income: number;
  hasPartner: boolean;
}) {
  const { t } = useI18n();
  const b = t.calculator.barista;

  // Bridge exposure: the pre-exemption wealth-AHV the engine would charge.
  const bridge = years.filter((y) => y.ahvNonEmployedGross > 0);
  const grossSum = bridge.reduce((s, y) => s + y.ahvNonEmployedGross, 0);
  if (grossSum <= 0) return null; // no wealth-AHV exposure → nothing to surface

  const paidSum = bridge.reduce((s, y) => s + y.ahvNonEmployedContribution, 0);
  const peakGross = bridge.reduce((m, y) => Math.max(m, y.ahvNonEmployedGross), 0);
  const savings = Math.max(0, grossSum - paidSum);
  const breakEven = baristaBreakEvenIncome(peakGross);

  let verdict: string;
  let tone: "petrol" | "brass";
  if (!active || income <= 0) {
    verdict = tpl(b.verdictOff, { breakEven: formatChf(breakEven) });
    tone = "brass";
  } else if (savings <= 0) {
    verdict = tpl(b.verdictShort, { income: formatChf(income), breakEven: formatChf(breakEven) });
    tone = "brass";
  } else if (paidSum <= 1) {
    verdict = tpl(b.verdictCoveredFull, { savings: formatChf(savings) });
    tone = "petrol";
  } else {
    verdict = tpl(b.verdictCoveredPartial, { savings: formatChf(savings) });
    tone = "petrol";
  }

  // Tiles vary so there are no empty/redundant cells: exposure + break-even
  // always; the "saved" tile only once a side job actually waives something.
  const tiles: { label: string; value: string; note?: string; accent?: boolean }[] = [
    { label: b.tileExposure, value: formatChf(grossSum), note: tpl(b.tileExposureNote, { peak: formatChf(peakGross) }) },
    { label: b.tileBreakEven, value: formatChf(breakEven), note: b.tileBreakEvenNote },
  ];
  if (active && savings > 0) {
    tiles.push({ label: b.tileSaved, value: formatChf(savings), accent: true });
  }

  return (
    <div className={`card border-l-4 p-6 sm:p-7 ${tone === "petrol" ? "border-l-petrol" : "border-l-brass"}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-muted">{b.kicker}</p>
        <span className="eyebrow text-brass">Barista-FIRE</span>
      </div>
      <h3 className="serif mt-2 text-xl leading-tight text-ink">{b.heading}</h3>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{b.intro}</p>

      <div className={`mt-5 grid grid-cols-1 gap-px border border-line bg-line ${tiles.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-paper p-4">
            <p className="eyebrow text-muted">{tile.label}</p>
            <p className={`num mt-1 text-lg font-semibold ${tile.accent ? "text-petrol" : "text-ink"}`}>{tile.value}</p>
            {tile.note && <p className="mt-0.5 text-xs text-muted">{tile.note}</p>}
          </div>
        ))}
      </div>

      <p className={`mt-4 text-sm leading-relaxed ${tone === "petrol" ? "text-petrol" : "text-brass"}`}>{verdict}</p>
      <p className="mt-3 max-w-prose text-xs leading-relaxed text-muted">{hasPartner ? b.householdNote : b.ruleNote}</p>
    </div>
  );
}
