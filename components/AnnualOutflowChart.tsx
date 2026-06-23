"use client";

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
  // Reflate each real figure to nominal francs of that future year.
  const rows = years.map((y) => {
    const factor = Math.pow(1 + inflation, y.age - baseAge);
    return {
      age: y.age,
      living: y.spend * factor,
      ahvContrib: y.ahvNonEmployedContribution * factor,
      taxes: (y.dividendTax + y.wealthTax + y.lumpSumTax) * factor,
      ahvPension: y.ahvPension * factor,
    };
  });

  return (
    <div className="card p-5">
      <p className="eyebrow mb-3 text-muted">Mittelverwendung pro Jahr · nominal, inkl. {Math.round(inflation * 100)} % Teuerung</p>
      <div
        className="h-72 w-full"
        role="img"
        aria-label="Gestapeltes Balkendiagramm der jährlichen Ausgaben (Lebenshaltung, AHV-Beiträge, Steuern) in nominalen Franken, mit der AHV-Rente als Linie."
      >
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
            <Bar dataKey="living" name="Lebenshaltung" stackId="out" fill={CHART.petrol} maxBarSize={18} />
            <Bar dataKey="ahvContrib" name="AHV-Beiträge" stackId="out" fill={CHART.stone} maxBarSize={18} />
            <Bar dataKey="taxes" name="Steuern" stackId="out" fill={CHART.brass} maxBarSize={18} />
            <Line type="monotone" dataKey="ahvPension" name="AHV-Rente" stroke={CHART.ink} strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
