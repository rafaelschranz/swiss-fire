"use client";

import { useId, useState } from "react";

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
 * A single dossier numeric input. Mono tabular figures; hairline frame that
 * darkens on focus. Handles the real-terms decimal <-> percent conversion so
 * the user types "4" while the engine receives 0.04.
 */
export function Field({ label, value, onChange, percent, prefix, suffix, step, min, max, hint, onToggleAuto, auto }: FieldProps) {
  const id = useId();
  // Convert the numeric value to its display string (percent shows 0.04 -> "4").
  const toText = (v: number) => {
    const safe = Number.isFinite(v) ? v : 0;
    return String(percent ? Math.round(safe * 1000) / 10 : safe);
  };

  // Own the input text so the user can clear it (empty) and type freely without
  // it snapping back to 0 on every keystroke. When `value` changes externally
  // (estimate toggle, shared link, canton-driven Gemeinde reset), re-sync the
  // text — using the React "adjust state during render" pattern (no effect).
  const [text, setText] = useState(() => toText(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    const parsed = text === "" ? NaN : Number(text);
    const current = percent ? parsed / 100 : parsed;
    if (!Number.isFinite(current) || Math.abs(current - value) > 1e-9) {
      setText(toText(value));
    }
  }

  const effectiveStep = step ?? (percent ? 0.5 : 1);
  const unit = suffix ?? (percent ? "%" : undefined);

  const handle = (raw: string) => {
    setText(raw);
    if (raw === "") return; // allow an empty field while editing (don't coerce to 0)
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    onChange(percent ? n / 100 : n);
  };

  // On blur, an empty/invalid field falls back to 0 so the model stays valid.
  const handleBlur = () => {
    if (text === "" || Number.isNaN(Number(text))) {
      setText(toText(0));
      onChange(0);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {onToggleAuto && (
          <button
            type="button"
            role="switch"
            aria-checked={!!auto}
            aria-label={`${label} automatisch schätzen`}
            onClick={onToggleAuto}
            className={`eyebrow shrink-0 transition ${
              auto ? "text-brass" : "text-muted hover:text-ink"
            }`}
          >
            {auto ? "Geschätzt ●" : "Schätzen ○"}
          </button>
        )}
      </div>
      <div
        className={`flex items-stretch border bg-paper transition focus-within:border-ink ${
          auto ? "border-dashed border-line-2" : "border-line-2"
        }`}
      >
        {prefix && (
          <span className="eyebrow flex items-center border-r border-line px-3 text-muted">
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
          className={`num w-full bg-transparent px-3 py-2.5 text-base outline-none ${
            auto ? "text-muted" : "text-ink"
          }`}
          value={text}
          step={effectiveStep}
          min={min}
          max={max}
          onChange={(e) => handle(e.target.value)}
          onBlur={handleBlur}
        />
        {unit && (
          <span className="num flex items-center pr-3 text-sm text-muted" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
