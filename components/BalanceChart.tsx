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

export interface BalancePoint {
  age: number;
  taxable: number;
  pillar3a: number;
  pillar2: number;
}

function formatChfShort(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}k`;
  return `${Math.round(value)}`;
}

export function BalanceChart({ data, fireAge }: { data: BalancePoint[]; fireAge: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Vermögensverlauf (steuerbar, 3a, PK)
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
            <XAxis dataKey="age" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatChfShort} tick={{ fontSize: 12 }} width={56} />
            <Tooltip formatter={(value) => `CHF ${formatChfShort(Number(value))}`} labelFormatter={(age) => `Alter ${age}`} />
            <Legend />
            <ReferenceLine x={fireAge} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: "FIRE", fontSize: 12 }} />
            <Area type="monotone" dataKey="taxable" name="Steuerbar" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
            <Area type="monotone" dataKey="pillar3a" name="Säule 3a" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
            <Area type="monotone" dataKey="pillar2" name="Pensionskasse" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
