"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";

import { axisTick, CHART, tickFormatterChf } from "@/components/ui/ChartTokens";
import { formatChf } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export interface FanPoint {
  age: number;
  p10: number;
  p50: number;
  p90: number;
}

function FanTooltip({
  active,
  payload,
  label,
  c,
}: Partial<TooltipContentProps<number, string>> & { c: Dictionary["charts"]["fan"] }) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload as FanPoint;
  const rows: Array<[string, number]> = [
    [c.p90, row.p90],
    [c.median, row.p50],
    [c.p10, row.p10],
  ];
  return (
    <div className="border border-line-2 bg-ink px-3 py-2 text-paper shadow-lg">
      <p className="eyebrow text-brass-soft">{tpl(c.ageLabel, { age: label ?? "" })}</p>
      <div className="mt-1.5 space-y-1">
        {rows.map(([name, value]) => (
          <div key={name} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-paper/80">{name}</span>
            <span className="num text-paper">{formatChf(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonteCarloFan({ data }: { data: FanPoint[] }) {
  const { t } = useI18n();
  const c = t.charts.fan;
  const bandData = data.map((d) => ({ ...d, band: Math.max(0, d.p90 - d.p10) }));

  return (
    <div className="card p-5">
      <div className="h-72 w-full" role="img" aria-label={c.imgAlt}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={bandData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="age" tick={axisTick} tickLine={false} axisLine={{ stroke: CHART.grid }} />
            <YAxis tickFormatter={tickFormatterChf} tick={axisTick} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<FanTooltip c={c} />} cursor={{ stroke: CHART.muted, strokeDasharray: "3 3" }} />
            <Legend
              iconType="square"
              wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}
            />
            <Area type="monotone" dataKey="p10" name={c.band} stackId="band" stroke="none" fill="transparent" legendType="none" />
            <Area type="monotone" dataKey="band" name={c.band} stackId="band" stroke="none" fill={CHART.steel} fillOpacity={0.28} />
            <Line type="monotone" dataKey="p50" name={c.median} stroke={CHART.ink} strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
