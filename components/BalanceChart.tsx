"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
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

export function BalanceChart({ data, fireAge }: { data: BalancePoint[]; fireAge: number }) {
  return (
    <div className="card p-5">
      <div
        className="h-72 w-full"
        role="img"
        aria-label="Flächendiagramm des steuerbaren Vermögens, der Säule 3a und der Pensionskasse über die Zeit, mit Markierung des FIRE-Alters."
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
              iconType="square"
              wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}
            />
            <ReferenceLine
              x={fireAge}
              stroke={CHART.brass}
              strokeDasharray="3 3"
              label={{ value: "FIRE", fontSize: 11, fill: CHART.brass, fontFamily: "var(--font-mono)" }}
            />
            <Area type="monotone" dataKey="taxable" name="Steuerbar" stackId="1" stroke={CHART.petrol} fill={CHART.petrol} fillOpacity={0.85} />
            <Area type="monotone" dataKey="pillar3a" name="Säule 3a" stackId="1" stroke={CHART.brass} fill={CHART.brass} fillOpacity={0.85} />
            <Area type="monotone" dataKey="pillar2" name="Pensionskasse" stackId="1" stroke={CHART.steel} fill={CHART.steel} fillOpacity={0.85} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
