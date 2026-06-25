"use client";

import { Field } from "@/components/ui/Field";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";
import type { OneOffInflow } from "@/lib/engine/types";

/**
 * Editor for one-off inflows (inheritance, property sale, bonus payout).
 * Each is credited to the taxable account in the year the person reaches
 * the given age. Real CHF.
 */
export function OneOffInflowsEditor({
  inflows,
  currentAge,
  horizonAge,
  onChange,
}: {
  inflows: OneOffInflow[];
  currentAge: number;
  horizonAge: number;
  onChange: (next: OneOffInflow[]) => void;
}) {
  const { t } = useI18n();
  const o = t.wizard.oneOff;
  const update = (i: number, patch: Partial<OneOffInflow>) =>
    onChange(inflows.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  const remove = (i: number) => onChange(inflows.filter((_, idx) => idx !== i));

  const add = () =>
    onChange([...inflows, { age: Math.min(horizonAge, currentAge + 10), amount: 100_000 }]);

  return (
    <div className="space-y-4">
      {inflows.length === 0 && <p className="text-xs leading-relaxed text-muted">{o.empty}</p>}

      {inflows.map((f, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <p className="eyebrow text-muted">{tpl(o.label, { n: i + 1 })}</p>
            <button type="button" onClick={() => remove(i)} className="eyebrow text-muted transition hover:text-brass">
              {o.remove}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={o.atAge} value={f.age} onChange={(v) => update(i, { age: v })} suffix={t.wizard.units.years} min={currentAge} max={horizonAge} />
            <Field label={o.amount} value={f.amount} onChange={(v) => update(i, { amount: v })} prefix="CHF" step={10_000} min={0} />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="eyebrow border border-line-2 px-4 py-2.5 text-ink transition hover:border-ink"
      >
        {o.add}
      </button>
    </div>
  );
}
