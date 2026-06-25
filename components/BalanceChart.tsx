"use client";

import { useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { axisTick, CHART, DossierTooltip, tickFormatterChf } from "@/components/ui/ChartTokens";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";

export interface BalancePoint {
  age: number;
  taxable: number;
  pillar3a: number;
  pillar2: number;
}

export type MilestoneTone = "fire" | "default" | "partner";

export interface BalanceMilestone {
  /** Position on the chart's (primary) age axis. */
  age: number;
  label: string;
  tone?: MilestoneTone;
}

const TONE_COLOR: Record<MilestoneTone, string> = {
  fire: CHART.brass,
  default: CHART.muted,
  partner: CHART.steel,
};

export function BalanceChart({
  data,
  markers,
  baseAge,
  inflation,
}: {
  data: BalancePoint[];
  markers: BalanceMilestone[];
  /** Age "today" — base year for the optional nominal reflation. */
  baseAge: number;
  inflation: number;
}) {
  const { t } = useI18n();
  const c = t.charts.balance;
  const rn = t.charts.realNominal;
  const [nominal, setNominal] = useState(false);
  const rows = data.map((d) => {
    const f = nominal ? Math.pow(1 + inflation, d.age - baseAge) : 1;
    return {
      age: d.age,
      taxable: d.taxable * f,
      pillar3a: d.pillar3a * f,
      pillar2: d.pillar2 * f,
      total: (d.taxable + d.pillar3a + d.pillar2) * f,
    };
  });
  const minAge = data.length ? data[0].age : 0;
  const maxAge = data.length ? data[data.length - 1].age : 0;

  // One labelled vertical marker per milestone, de-duplicated (by age+label) and
  // clipped to range.
  const milestones = markers.filter(
    (m, i, arr) =>
      m.age >= minAge &&
      m.age <= maxAge &&
      arr.findIndex((x) => x.age === m.age && x.label === m.label) === i,
  );

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
          <ComposedChart data={rows} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis
              dataKey="age"
              type="number"
              domain={["dataMin", "dataMax"]}
              allowDecimals={false}
              tick={axisTick}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
            />
            <YAxis tickFormatter={tickFormatterChf} tick={axisTick} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<DossierTooltip />} cursor={{ stroke: CHART.muted, strokeDasharray: "3 3" }} />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}
            />
            {milestones.map((m) => {
              const color = TONE_COLOR[m.tone ?? "default"];
              return (
                <ReferenceLine
                  key={`${m.label}-${m.age}`}
                  x={m.age}
                  stroke={color}
                  strokeDasharray="3 3"
                  label={{ value: m.label, position: "top", fontSize: 10, fill: color, fontFamily: "var(--font-mono)" }}
                />
              );
            })}
            <Line type="monotone" dataKey="total" name={c.total} stroke={CHART.ink} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="taxable" name={c.taxable} stroke={CHART.petrol} strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="pillar3a" name={c.pillar3a} stroke={CHART.brass} strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="pillar2" name={c.pillar2} stroke={CHART.steel} strokeWidth={1.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
