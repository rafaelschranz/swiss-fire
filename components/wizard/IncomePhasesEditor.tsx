"use client";

import { Field } from "@/components/ui/Field";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";
import type { IncomePhase } from "@/lib/engine/types";

/**
 * Editor for the age-banded salary / savings schedule. Each phase applies
 * from its `fromAge` until the next-higher band starts (or FIRE). Display
 * order follows the array; the engine sorts by age, so order doesn't matter.
 */
export function IncomePhasesEditor({
  phases,
  startAge,
  fireAge,
  onChange,
}: {
  phases: IncomePhase[];
  startAge: number;
  fireAge: number;
  onChange: (next: IncomePhase[]) => void;
}) {
  const { t } = useI18n();
  const ip = t.wizard.incomePhases;
  const update = (i: number, patch: Partial<IncomePhase>) =>
    onChange(phases.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const remove = (i: number) => onChange(phases.filter((_, idx) => idx !== i));

  const add = () => {
    const last = phases.reduce((a, b) => (b.fromAge > a.fromAge ? b : a), phases[0]);
    const nextFrom = Math.min(fireAge - 1, last.fromAge + 5);
    onChange([
      ...phases,
      {
        fromAge: nextFrom,
        salary: last.salary,
        annualTaxableSavings: last.annualTaxableSavings,
        annualPillar3aContribution: last.annualPillar3aContribution,
      },
    ]);
  };

  // End age of a phase = (lowest fromAge strictly greater than its own) − 1,
  // else FIRE. Independent of array order.
  const endLabel = (p: IncomePhase): string => {
    const higher = phases.map((x) => x.fromAge).filter((a) => a > p.fromAge);
    return higher.length ? `${Math.min(...higher) - 1}` : tpl(ip.fireEnd, { age: fireAge });
  };

  const lowestFromAge = Math.min(...phases.map((p) => p.fromAge));

  return (
    <div className="space-y-4">
      {phases.map((p, i) => {
        const isLowest = p.fromAge === lowestFromAge;
        const startLabel = isLowest ? Math.min(startAge, p.fromAge) : p.fromAge;
        return (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <p className="eyebrow text-muted">
                {tpl(ip.phaseLabel, { n: i + 1, start: startLabel, end: endLabel(p) })}
              </p>
              {phases.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="eyebrow text-muted transition hover:text-brass"
                >
                  {ip.remove}
                </button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={ip.fromAge} value={p.fromAge} onChange={(v) => update(i, { fromAge: v })} suffix={t.wizard.units.years} min={15} max={fireAge - 1} />
              <Field label={ip.grossSalary} value={p.salary} onChange={(v) => update(i, { salary: v })} prefix="CHF" suffix={t.wizard.units.perYear} step={1000} min={0} />
              <Field label={ip.taxableSavings} value={p.annualTaxableSavings} onChange={(v) => update(i, { annualTaxableSavings: v })} prefix="CHF" suffix={t.wizard.units.perYear} step={1000} min={0} />
              <Field label={ip.contribution3a} value={p.annualPillar3aContribution} onChange={(v) => update(i, { annualPillar3aContribution: v })} prefix="CHF" suffix={t.wizard.units.perYear} step={100} min={0} />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="eyebrow border border-line-2 px-4 py-2.5 text-ink transition hover:border-ink"
      >
        {ip.add}
      </button>
    </div>
  );
}
