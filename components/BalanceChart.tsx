"use client";

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

export interface BalancePoint {
  age: number;
  taxable: number;
  pillar3a: number;
  pillar2: number;
}

export interface BalanceMarkers {
  fireAge: number;
  pillar3aUnlockAge: number;
  earliestPkAge: number;
  ahvClaimAge: number;
}

export function BalanceChart({ data, markers }: { data: BalancePoint[]; markers: BalanceMarkers }) {
  const rows = data.map((d) => ({ ...d, total: d.taxable + d.pillar3a + d.pillar2 }));
  const minAge = data.length ? data[0].age : 0;
  const maxAge = data.length ? data[data.length - 1].age : 0;

  // One labelled vertical marker per milestone, de-duplicated and clipped to range.
  const milestones = [
    { age: markers.fireAge, label: "FIRE" },
    { age: markers.earliestPkAge, label: "PK" },
    { age: markers.pillar3aUnlockAge, label: "3a" },
    { age: markers.ahvClaimAge, label: "AHV" },
  ].filter((m, i, arr) => m.age >= minAge && m.age <= maxAge && arr.findIndex((x) => x.age === m.age) === i);

  return (
    <div className="card p-5">
      <p className="eyebrow mb-3 text-muted">Vermögen je Topf · in heutiger Kaufkraft (real)</p>
      <div
        className="h-72 w-full"
        role="img"
        aria-label="Liniendiagramm des Gesamtvermögens sowie des steuerbaren Vermögens, der Säule 3a und der Pensionskasse über die Zeit, mit Markierungen für FIRE, PK-, 3a- und AHV-Bezug."
      >
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
            {milestones.map((m) => (
              <ReferenceLine
                key={m.label}
                x={m.age}
                stroke={m.label === "FIRE" ? CHART.brass : CHART.muted}
                strokeDasharray="3 3"
                label={{ value: m.label, position: "top", fontSize: 10, fill: m.label === "FIRE" ? CHART.brass : CHART.muted, fontFamily: "var(--font-mono)" }}
              />
            ))}
            <Line type="monotone" dataKey="total" name="Gesamt" stroke={CHART.ink} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="taxable" name="Steuerbar" stroke={CHART.petrol} strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="pillar3a" name="Säule 3a" stroke={CHART.brass} strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="pillar2" name="Pensionskasse" stroke={CHART.steel} strokeWidth={1.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
