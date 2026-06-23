"use client";

import type { CantonCode } from "@/lib/engine/types";
import { CANTONS } from "@/lib/engine/cantons";

export interface CalculatorInputs {
  currentAge: number;
  fireAge: number;
  horizonAge: number;
  maritalStatus: "single" | "married";
  canton: CantonCode;

  currentSalary: number;
  salaryGrowth: number;
  currentTaxableBalance: number;
  annualTaxableSavings: number;
  currentPillar3aBalance: number;
  annualPillar3aContribution: number;
  pillar3aReturn: number;
  currentPillar2Balance: number;

  pillar3aUnlockAge: number;
  earliestPkAge: number;
  ahvReferenceAge: number;
  ahvClaimAge: number;
  ahvAnnualPension: number;

  annualRealSpending: number;
  healthInsuranceAnnualPremium: number;

  expectedReturn: number;
  volatility: number;
  equityShare: number;
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 tabular-nums text-zinc-900 focus:border-blue-500 focus:outline focus:outline-2 focus:outline-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          value={value}
          step={step}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && <span className="text-zinc-500">{suffix}</span>}
      </div>
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <legend className="px-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function InputsPanel({
  inputs,
  onChange,
}: {
  inputs: CalculatorInputs;
  onChange: (next: CalculatorInputs) => void;
}) {
  const set = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  const cantonCodes = Object.keys(CANTONS) as CantonCode[];

  return (
    <div className="space-y-4">
      <Section title="Sie">
        <NumberField label="Aktuelles Alter" value={inputs.currentAge} onChange={(v) => set("currentAge", v)} />
        <NumberField label="FIRE-Alter (geplanter Ausstieg)" value={inputs.fireAge} onChange={(v) => set("fireAge", v)} />
        <NumberField label="Planungshorizont (Alter)" value={inputs.horizonAge} onChange={(v) => set("horizonAge", v)} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-300">Zivilstand</span>
          <select
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={inputs.maritalStatus}
            onChange={(e) => set("maritalStatus", e.target.value as "single" | "married")}
          >
            <option value="single">Alleinstehend</option>
            <option value="married">Verheiratet</option>
          </select>
        </label>
      </Section>

      <Section title="Kanton">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-zinc-700 dark:text-zinc-300">Steuerkanton</span>
          <select
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={inputs.canton}
            onChange={(e) => set("canton", e.target.value as CantonCode)}
          >
            {cantonCodes.map((code) => (
              <option key={code} value={code}>
                {CANTONS[code].name} {!CANTONS[code].verified ? "(Näherung)" : ""}
              </option>
            ))}
          </select>
        </label>
      </Section>

      <Section title="Ansparphase">
        <NumberField label="Aktuelles Bruttosalär" value={inputs.currentSalary} onChange={(v) => set("currentSalary", v)} step={1000} suffix="CHF/Jahr" />
        <NumberField label="Salärwachstum (real)" value={inputs.salaryGrowth} onChange={(v) => set("salaryGrowth", v)} step={0.005} suffix="%/Jahr" />
        <NumberField label="Steuerbares Vermögen heute" value={inputs.currentTaxableBalance} onChange={(v) => set("currentTaxableBalance", v)} step={1000} suffix="CHF" />
        <NumberField label="Sparbetrag steuerbar" value={inputs.annualTaxableSavings} onChange={(v) => set("annualTaxableSavings", v)} step={1000} suffix="CHF/Jahr" />
      </Section>

      <Section title="Säule 3a">
        <NumberField label="3a-Guthaben heute" value={inputs.currentPillar3aBalance} onChange={(v) => set("currentPillar3aBalance", v)} step={1000} suffix="CHF" />
        <NumberField label="3a-Einzahlung pro Jahr" value={inputs.annualPillar3aContribution} onChange={(v) => set("annualPillar3aContribution", v)} step={100} suffix="CHF/Jahr" />
        <NumberField label="3a-Rendite (real)" value={inputs.pillar3aReturn} onChange={(v) => set("pillar3aReturn", v)} step={0.005} suffix="%/Jahr" />
        <NumberField label="3a-Bezugsalter (frühestens)" value={inputs.pillar3aUnlockAge} onChange={(v) => set("pillar3aUnlockAge", v)} />
      </Section>

      <Section title="Pensionskasse (Säule 2)">
        <NumberField label="PK-Guthaben heute" value={inputs.currentPillar2Balance} onChange={(v) => set("currentPillar2Balance", v)} step={1000} suffix="CHF" />
        <NumberField label="Frühestes PK-Bezugsalter" value={inputs.earliestPkAge} onChange={(v) => set("earliestPkAge", v)} />
      </Section>

      <Section title="AHV">
        <NumberField label="Referenzalter AHV" value={inputs.ahvReferenceAge} onChange={(v) => set("ahvReferenceAge", v)} />
        <NumberField label="Geplanter Bezug AHV (Alter)" value={inputs.ahvClaimAge} onChange={(v) => set("ahvClaimAge", v)} />
        <NumberField label="Erwartete AHV-Rente" value={inputs.ahvAnnualPension} onChange={(v) => set("ahvAnnualPension", v)} step={500} suffix="CHF/Jahr" />
      </Section>

      <Section title="Ausgaben im Ruhestand">
        <NumberField label="Reale Lebenshaltungskosten" value={inputs.annualRealSpending} onChange={(v) => set("annualRealSpending", v)} step={1000} suffix="CHF/Jahr" />
        <NumberField label="Krankenkassenprämie" value={inputs.healthInsuranceAnnualPremium} onChange={(v) => set("healthInsuranceAnnualPremium", v)} step={100} suffix="CHF/Jahr" />
      </Section>

      <Section title="Annahmen">
        <NumberField label="Erwartete reale Rendite" value={inputs.expectedReturn} onChange={(v) => set("expectedReturn", v)} step={0.005} suffix="%/Jahr" />
        <NumberField label="Volatilität" value={inputs.volatility} onChange={(v) => set("volatility", v)} step={0.01} suffix="%/Jahr" />
        <NumberField label="Aktienanteil (Bootstrap-Mix)" value={inputs.equityShare} onChange={(v) => set("equityShare", v)} step={0.05} min={0} suffix="0-1" />
      </Section>
    </div>
  );
}
