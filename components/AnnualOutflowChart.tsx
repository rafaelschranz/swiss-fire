"use client";

import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { axisTick, CHART, DossierTooltip, tickFormatterChf } from "@/components/ui/ChartTokens";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";
import type { DecumulationYearResult } from "@/lib/engine/types";

export function AnnualOutflowChart({
  years,
  baseAge,
  inflation,
}: {
  /** Decumulation year results (real CHF). */
  years: DecumulationYearResult[];
  /** Age "today" — the base year for the inflation reflation. */
  baseAge: number;
  /** Annual inflation used to convert real → nominal for display. */
  inflation: number;
}) {
  const { t } = useI18n();
  const c = t.charts.outflow;
  const rn = t.charts.realNominal;
  // The engine is real-terms; default to real (consistent with the other views).
  // The user can switch to nominal francs to see the inflation effect.
  const [nominal, setNominal] = useState(false);

  const rows = years.map((y) => {
    const factor = nominal ? Math.pow(1 + inflation, y.age - baseAge) : 1;
    return {
      age: y.age,
      living: y.spend * factor,
      ahvContrib: y.ahvNonEmployedContribution * factor,
      taxes: (y.dividendTax + y.wealthTax + y.lumpSumTax) * factor,
      ahvPension: y.ahvPension * factor,
      pk2Pension: y.pillar2Pension * factor,
    };
  });

  const hasPkPension = rows.some((r) => r.pk2Pension > 0);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="eyebrow text-muted">
          {c.caption} · {nominal ? tpl(rn.nominalCaption, { pct: Math.round(inflation * 100) }) : rn.realCaption}
        </p>
        <div className="flex" role="group" aria-label={rn.toggleAria}>
          {([["real", rn.real], ["nominal", rn.nominal]] as const).map(([key, label]) => {
            const active = (key === "nominal") === nominal;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setNominal(key === "nominal")}
                className={`eyebrow -ml-px border px-2.5 py-1 transition first:ml-0 ${
                  active ? "border-ink bg-ink text-paper" : "border-line-2 text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-72 w-full" role="img" aria-label={c.imgAlt}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="age" type="number" domain={["dataMin", "dataMax"]} allowDecimals={false} tick={axisTick} tickLine={false} axisLine={{ stroke: CHART.grid }} />
            <YAxis tickFormatter={tickFormatterChf} tick={axisTick} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<DossierTooltip />} cursor={{ fill: "rgba(21,33,46,0.04)" }} />
            <Legend
              iconType="square"
              wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}
            />
            <Bar dataKey="living" name={c.living} stackId="out" fill={CHART.petrol} maxBarSize={18} />
            <Bar dataKey="ahvContrib" name={c.ahvContrib} stackId="out" fill={CHART.stone} maxBarSize={18} />
            <Bar dataKey="taxes" name={c.taxes} stackId="out" fill={CHART.brass} maxBarSize={18} />
            <Line type="monotone" dataKey="ahvPension" name={c.ahvPension} stroke={CHART.ink} strokeWidth={2} dot={false} />
            {hasPkPension && (
              <Line type="monotone" dataKey="pk2Pension" name={c.pkPension} stroke={CHART.steel} strokeWidth={2} strokeDasharray="4 3" dot={false} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
