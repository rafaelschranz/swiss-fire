"use client";

import { formatChf } from "@/lib/format";

export interface LedgerSegment {
  label: string;
  value: number;
  /** Tailwind background utility from the dossier palette, e.g. "bg-petrol". */
  color: string;
  /** Render a 45° hatch overlay (reserved / excluded). */
  hatched?: boolean;
}

/**
 * Full-width stacked "ledger" bar. Segment widths are proportional to value
 * and animate from 0 on mount. A hairline legend lists each segment below.
 */
export function LedgerBar({ segments }: { segments: LedgerSegment[] }) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;

  return (
    <div>
      <div className="flex h-[58px] w-full overflow-hidden border border-line">
        {segments.map((seg) => {
          const pct = (Math.max(0, seg.value) / total) * 100;
          return (
            <div
              key={seg.label}
              className={`ledger-seg relative ${seg.color}`}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${formatChf(seg.value)}`}
            >
              {seg.hatched && <span className="hatch absolute inset-0" aria-hidden="true" />}
            </div>
          );
        })}
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-3 bg-paper px-4 py-3">
            <dt className="flex items-center gap-2 text-sm text-muted">
              <span className={`inline-block h-2.5 w-2.5 ${seg.color}`} aria-hidden="true" />
              {seg.label}
            </dt>
            <dd className="num text-sm font-medium text-ink">{formatChf(seg.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
