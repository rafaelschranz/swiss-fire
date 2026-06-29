"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { axisTick, CHART, DossierTooltip, tickFormatterChf } from "@/components/ui/ChartTokens";
import type { DecumulationYearResult } from "@/lib/engine/types";
import { formatChf, formatPercent } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface BalancePointLike {
  age: number;
  taxable: number;
  pillar3a: number;
  pillar2: number;
}

/** The subset of a scenario result this view needs (structurally satisfied by ScenarioResult). */
export interface ScenarioLike {
  failed: boolean;
  bridgeCapital: number;
  taxableAtFire: number;
  years: DecumulationYearResult[];
  balancePoints: BalancePointLike[];
}

interface Summary {
  feasible: boolean;
  bridge: number;
  liquid: number;
  buffer: number;
  finalWealth: number;
  depletionAge: number | null;
  lifetimeTax: number;
  lifetimeAhv: number;
}

function summarize(s: ScenarioLike): Summary {
  const last = s.years[s.years.length - 1];
  return {
    feasible: !s.failed,
    bridge: s.bridgeCapital,
    liquid: s.taxableAtFire,
    buffer: s.taxableAtFire - s.bridgeCapital,
    finalWealth: last ? last.taxableBalance + last.pillar3aBalance + last.pillar2Balance : 0,
    depletionAge: s.years.find((y) => y.depleted)?.age ?? null,
    lifetimeTax: s.years.reduce((sum, y) => sum + y.dividendTax + y.wealthTax + y.lumpSumTax, 0),
    lifetimeAhv: s.years.reduce((sum, y) => sum + y.ahvNonEmployedContribution, 0),
  };
}

type Fmt = "chf" | "pct" | "age";

export function ScenarioCompare({
  a,
  b,
  mcSuccessA,
  mcSuccessB,
  onClear,
}: {
  a: ScenarioLike;
  b: ScenarioLike;
  mcSuccessA?: number;
  mcSuccessB?: number;
  onClear: () => void;
}) {
  const { t } = useI18n();
  const c = t.calculator.compare;
  const sa = summarize(a);
  const sb = summarize(b);

  const fmt = (v: number | null, kind: Fmt): string => {
    if (v === null) return c.never;
    if (kind === "chf") return formatChf(v);
    if (kind === "pct") return formatPercent(v);
    return String(v);
  };

  // Metric rows. `betterHigher` colours the Δ (green when B improves on A).
  const rows: { label: string; a: number | null; b: number | null; fmt: Fmt; betterHigher: boolean }[] = [
    { label: c.bridge, a: sa.bridge, b: sb.bridge, fmt: "chf", betterHigher: false },
    { label: c.liquid, a: sa.liquid, b: sb.liquid, fmt: "chf", betterHigher: true },
    { label: c.buffer, a: sa.buffer, b: sb.buffer, fmt: "chf", betterHigher: true },
    ...(mcSuccessA !== undefined || mcSuccessB !== undefined
      ? [{ label: c.mc, a: mcSuccessA ?? null, b: mcSuccessB ?? null, fmt: "pct" as Fmt, betterHigher: true }]
      : []),
    { label: c.depletion, a: sa.depletionAge, b: sb.depletionAge, fmt: "age", betterHigher: true },
    { label: c.finalWealth, a: sa.finalWealth, b: sb.finalWealth, fmt: "chf", betterHigher: true },
    { label: c.lifetimeTax, a: sa.lifetimeTax, b: sb.lifetimeTax, fmt: "chf", betterHigher: false },
    { label: c.lifetimeAhv, a: sa.lifetimeAhv, b: sb.lifetimeAhv, fmt: "chf", betterHigher: false },
  ];

  const deltaCell = (row: (typeof rows)[number]) => {
    if (row.a === null || row.b === null) return <span className="text-muted">—</span>;
    const diff = row.b - row.a;
    if (Math.abs(diff) < (row.fmt === "chf" ? 1 : 0.001)) return <span className="text-muted">—</span>;
    const good = row.betterHigher ? diff > 0 : diff < 0;
    const sign = diff > 0 ? "+" : "−";
    const mag = Math.abs(diff);
    const text = row.fmt === "chf" ? formatChf(mag) : row.fmt === "pct" ? formatPercent(mag) : `${mag} ${c.years}`;
    return <span className={good ? "text-petrol" : "text-brass"}>{sign}{text}</span>;
  };

  // Overlay chart: total wealth A vs B, merged on the age axis.
  const byAge = new Map<number, { age: number; a?: number; b?: number }>();
  const total = (p: BalancePointLike) => p.taxable + p.pillar3a + p.pillar2;
  for (const p of a.balancePoints) byAge.set(p.age, { ...(byAge.get(p.age) ?? { age: p.age }), age: p.age, a: total(p) });
  for (const p of b.balancePoints) byAge.set(p.age, { ...(byAge.get(p.age) ?? { age: p.age }), age: p.age, b: total(p) });
  const chartRows = [...byAge.values()].sort((x, y) => x.age - y.age);

  const identical = rows.every((r) => r.a !== null && r.b !== null && Math.abs(r.b - r.a) < (r.fmt === "chf" ? 1 : 0.001)) && sa.feasible === sb.feasible;

  return (
    <div className="card border-l-4 border-l-ink p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-brass">{c.kicker}</p>
          <h3 className="serif mt-2 text-xl leading-tight text-ink">{c.heading}</h3>
        </div>
        <button type="button" onClick={onClear} className="eyebrow shrink-0 text-muted transition hover:text-brass">
          {c.clear}
        </button>
      </div>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">{identical ? c.identical : c.subtitle}</p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-2 text-left">
              <th className="eyebrow py-2 pr-3 font-medium text-muted">{c.metric}</th>
              <th className="eyebrow py-2 px-3 text-right font-medium text-muted">{c.colA}</th>
              <th className="eyebrow py-2 px-3 text-right font-medium text-muted">{c.colB}</th>
              <th className="eyebrow py-2 pl-3 text-right font-medium text-muted">{c.colDelta}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-2 pr-3 text-ink">{c.verdict}</td>
              <td className={`py-2 px-3 text-right ${sa.feasible ? "text-petrol" : "text-brass"}`}>{sa.feasible ? c.ok : c.notOk}</td>
              <td className={`py-2 px-3 text-right ${sb.feasible ? "text-petrol" : "text-brass"}`}>{sb.feasible ? c.ok : c.notOk}</td>
              <td className="py-2 pl-3 text-right text-muted">—</td>
            </tr>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line">
                <td className="py-2 pr-3 text-ink">{row.label}</td>
                <td className="num py-2 px-3 text-right text-muted">{fmt(row.a, row.fmt)}</td>
                <td className="num py-2 px-3 text-right text-ink">{fmt(row.b, row.fmt)}</td>
                <td className="num py-2 pl-3 text-right">{deltaCell(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="eyebrow mt-6 mb-2 text-muted">{c.chartLabel}</p>
      <div className="h-64 w-full" role="img" aria-label={c.chartLabel}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartRows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="age" type="number" domain={["dataMin", "dataMax"]} allowDecimals={false} tick={axisTick} tickLine={false} axisLine={{ stroke: CHART.grid }} />
            <YAxis tickFormatter={tickFormatterChf} tick={axisTick} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<DossierTooltip />} cursor={{ stroke: CHART.muted, strokeDasharray: "3 3" }} />
            <Legend iconType="plainline" wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }} />
            <Line type="monotone" dataKey="a" name={c.colA} stroke={CHART.steel} strokeWidth={2} strokeDasharray="4 3" dot={false} connectNulls />
            <Line type="monotone" dataKey="b" name={c.colB} stroke={CHART.ink} strokeWidth={2.5} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
