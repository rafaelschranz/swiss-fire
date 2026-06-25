"use client";

import type { TooltipContentProps } from "recharts";

import { chfShort, formatChf } from "@/lib/format";

/** Dossier chart palette (hex, for Recharts which can't read CSS vars). */
export const CHART = {
  ink: "#15212E",
  petrol: "#1C4A5A",
  brass: "#A67C3D",
  brassSoft: "#C9A567",
  steel: "#6E8A99",
  stone: "#B9B3A4",
  muted: "#5C6873",
  grid: "rgba(21,33,46,0.08)",
} as const;

export const axisTick = { fontSize: 11, fontFamily: "var(--font-mono)", fill: CHART.muted };

/** Custom tooltip: solid ink card, mono figures, brass-soft header. */
export function DossierTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="border border-line-2 bg-ink px-3 py-2 text-paper shadow-lg">
      <p className="eyebrow text-brass-soft">Alter {label}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-paper/80">
              <span className="inline-block h-2 w-2" style={{ background: entry.color }} aria-hidden="true" />
              {entry.name}
            </span>
            <span className="num text-paper">{formatChf(Number(entry.value))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const tickFormatterChf = (value: number) => chfShort(value);
