"use client";

import { useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>}
    </div>
  );
}
