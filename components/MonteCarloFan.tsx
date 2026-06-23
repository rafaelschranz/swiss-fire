"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface FanPoint {
  age: number;
  p10: number;
  p50: number;
  p90: number;
}

function formatChfShort(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}k`;
  return `${Math.round(value)}`;
}

export function MonteCarloFan({ data }: { data: FanPoint[] }) {
  const bandData = data.map((d) => ({ ...d, band: Math.max(0, d.p90 - d.p10) }));

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Monte-Carlo: steuerbares Vermögen (10./50./90. Perzentil)
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={bandData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
            <XAxis dataKey="age" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatChfShort} tick={{ fontSize: 12 }} width={56} />
            <Tooltip formatter={(value) => `CHF ${formatChfShort(Number(value))}`} labelFormatter={(age) => `Alter ${age}`} />
            <Legend />
            <Area type="monotone" dataKey="p10" name="10.-90. Perzentil" stackId="band" stroke="none" fill="transparent" />
            <Area type="monotone" dataKey="band" name="10.-90. Perzentil" stackId="band" stroke="none" fill="#94a3b8" fillOpacity={0.3} />
            <Line type="monotone" dataKey="p50" name="Median" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
