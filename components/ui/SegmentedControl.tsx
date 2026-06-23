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
      {label && <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>}
      <div
        role="group"
        aria-label={ariaLabel ?? label}
        className="inline-flex rounded-xl border border-zinc-300 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-800"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
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
