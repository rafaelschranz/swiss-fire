"use client";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  ariaLabel,
}: {
  label?: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <div role="group" aria-label={ariaLabel ?? label} className="inline-flex">
        {options.map((opt, i) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={`flex-1 whitespace-nowrap border px-4 py-2 text-sm font-medium transition ${i > 0 ? "-ml-px" : ""} ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line-2 bg-paper text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
