"use client";

import { useId } from "react";

export interface FieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Render/convert as a percentage: stores 0.04, displays "4". */
  percent?: boolean;
  /** Currency prefix chip, e.g. "CHF". */
  prefix?: string;
  /** Trailing unit, e.g. "/Jahr" or "Jahre". */
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  hint?: string;
  /** When provided, the field can be auto-estimated; renders a toggle. */
  onToggleAuto?: () => void;
  /** Whether the value is currently auto-estimated (read-only). */
  auto?: boolean;
}

/**
 * A single polished numeric input. Handles the real-terms decimal <-> percent
 * conversion so the user types "4" while the engine receives 0.04.
 */
export function Field({ label, value, onChange, percent, prefix, suffix, step, min, max, hint, onToggleAuto, auto }: FieldProps) {
  const id = useId();
  const display = percent ? Math.round(value * 1000) / 10 : value;
  const effectiveStep = step ?? (percent ? 0.5 : 1);
  const unit = suffix ?? (percent ? "%" : undefined);

  const handle = (raw: string) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    onChange(percent ? n / 100 : n);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        {onToggleAuto && (
          <button
            type="button"
            role="switch"
            aria-checked={!!auto}
            aria-label={`${label} automatisch schätzen`}
            onClick={onToggleAuto}
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium transition ${
              auto
                ? "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            {auto ? "✨ Geschätzt" : "Schätzen"}
          </button>
        )}
      </div>
      <div
        className={`group flex items-stretch overflow-hidden rounded-xl border shadow-sm transition focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/30 ${
          auto
            ? "border-dashed border-sky-300 bg-sky-50/50 dark:border-sky-500/30 dark:bg-sky-500/5"
            : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        }`}
      >
        {prefix && (
          <span className="flex items-center bg-zinc-100 px-3 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          aria-label={unit ? `${label} (${unit})` : label}
          readOnly={auto}
          tabIndex={auto ? -1 : undefined}
          className={`w-full bg-transparent px-3 py-2.5 text-base tabular-nums outline-none placeholder:text-zinc-400 ${
            auto ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-100"
          }`}
          value={display}
          step={effectiveStep}
          min={min}
          max={max}
          onChange={(e) => handle(e.target.value)}
        />
        {unit && (
          <span className="flex items-center pr-3 text-sm text-zinc-400" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>}
    </div>
  );
}
