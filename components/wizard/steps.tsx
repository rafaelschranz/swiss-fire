"use client";

import type { ReactNode } from "react";

import { Field } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SelectField } from "@/components/ui/SelectField";
import { IncomePhasesEditor } from "@/components/wizard/IncomePhasesEditor";
import { CANTONS } from "@/lib/engine/cantons";
import type { CantonCode } from "@/lib/engine/types";
import { ESTIMATE_LABELS, type EstimableKey } from "@/lib/estimates";
import type { CalculatorInputs } from "@/lib/inputs";

export interface StepProps {
  inputs: CalculatorInputs;
  set: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  isAuto: (key: EstimableKey) => boolean;
  toggleAuto: (key: EstimableKey) => void;
}

/**
 * Builds the props that turn a Field into an estimable one: the auto flag,
 * the toggle handler, and (while auto) the rationale hint.
 */
function estimable(props: StepProps, key: EstimableKey, baseHint?: string) {
  const auto = props.isAuto(key);
  return {
    auto,
    onToggleAuto: () => props.toggleAuto(key),
    hint: auto ? ESTIMATE_LABELS[key] : baseHint,
  };
}

export interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  render: (props: StepProps) => ReactNode;
}

const cantonOptions = (Object.keys(CANTONS) as CantonCode[]).map((code) => ({
  value: code,
  label: `${CANTONS[code].name}${CANTONS[code].verified ? "" : " (Näherung)"}`,
}));

const Grid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
);

export const STEPS: StepDef[] = [
  {
    id: "you",
    title: "Über Sie",
    subtitle: "Wann steigen Sie aus und wo wohnen Sie?",
    render: (props) => {
      const { inputs, set } = props;
      return (
      <div className="space-y-5">
        <Grid>
          <Field label="Aktuelles Alter" value={inputs.currentAge} onChange={(v) => set("currentAge", v)} suffix="Jahre" min={18} max={70} />
          <Field label="FIRE-Alter (Ausstieg)" value={inputs.fireAge} onChange={(v) => set("fireAge", v)} suffix="Jahre" min={30} max={75} />
          <Field label="Planungshorizont" value={inputs.horizonAge} onChange={(v) => set("horizonAge", v)} suffix="Jahre" min={70} max={110} {...estimable(props, "horizonAge", "Bis zu welchem Alter soll das Geld reichen?")} />
        </Grid>
        <SegmentedControl
          label="Zivilstand"
          value={inputs.maritalStatus}
          onChange={(v) => set("maritalStatus", v)}
          options={[
            { value: "single", label: "Alleinstehend" },
            { value: "married", label: "Verheiratet" },
          ]}
        />
        <SelectField
          label="Steuerkanton"
          value={inputs.canton}
          onChange={(v) => set("canton", v as CantonCode)}
          options={cantonOptions}
          hint="„Näherung“ = Steuerkurve noch nicht verifiziert."
        />
      </div>
      );
    },
  },
  {
    id: "wealth",
    title: "Vermögen & Einkommen",
    subtitle: "Aktuelle Guthaben sowie Salär und Sparrate bis zum Ausstieg.",
    render: (props) => {
      const { inputs, set } = props;
      return (
        <div className="space-y-6">
          <Grid>
            <Field label="Steuerbares Vermögen heute" value={inputs.currentTaxableBalance} onChange={(v) => set("currentTaxableBalance", v)} prefix="CHF" step={1000} min={0} />
            <Field label="Säule-3a-Guthaben heute" value={inputs.currentPillar3aBalance} onChange={(v) => set("currentPillar3aBalance", v)} prefix="CHF" step={1000} min={0} />
            <Field label="Pensionskasse-Guthaben heute" value={inputs.currentPillar2Balance} onChange={(v) => set("currentPillar2Balance", v)} prefix="CHF" step={1000} min={0} />
          </Grid>

          <div className="border-t border-line pt-5">
            <SegmentedControl
              label="Pensionskasse-Aufbau"
              ariaLabel="Pensionskassen-Modell"
              value={inputs.pillar2Model}
              onChange={(v) => set("pillar2Model", v)}
              options={[
                { value: "bvg", label: "BVG-Minimum" },
                { value: "rate", label: "Ø Sparbeitrag" },
              ]}
            />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {inputs.pillar2Model === "rate"
                ? "Ein durchschnittlicher jährlicher Sparbeitrag (Arbeitnehmer + Arbeitgeber) in % des versicherten Lohns — wird mit dem Einkommen mitskaliert."
                : "Gesetzliche Altersgutschriften (7–18 % je nach Alter) auf dem versicherten Lohn. Für höhere Einkommen mit überobligatorischer Vorsorge „Ø Sparbeitrag“ wählen."}
            </p>
            {inputs.pillar2Model === "rate" && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Ø PK-Sparbeitrag" value={inputs.pillar2SavingsRate} onChange={(v) => set("pillar2SavingsRate", v)} percent hint="Anteil des versicherten Lohns pro Jahr." />
                <Field
                  label="Versicherter Lohn bis"
                  value={inputs.pillar2InsuredCeiling}
                  onChange={(v) => set("pillar2InsuredCeiling", v)}
                  prefix="CHF"
                  step={5000}
                  min={0}
                  hint="Bis zu diesem Lohn versichert Ihre Kasse — über 90’720 nur bei überobligatorischer Vorsorge."
                />
              </div>
            )}
          </div>

          <div className="border-t border-line pt-5">
            <SegmentedControl
              label="Salär & Sparrate"
              ariaLabel="Einkommensmodus"
              value={inputs.useIncomePhases ? "phases" : "simple"}
              onChange={(v) => set("useIncomePhases", v === "phases")}
              options={[
                { value: "simple", label: "Konstant" },
                { value: "phases", label: "Nach Altersphasen" },
              ]}
            />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {inputs.useIncomePhases
                ? "Definieren Sie Salär und Sparrate je Altersphase — ideal, wenn Ihr Einkommen über die Jahre stark steigt."
                : "Ein gleichbleibendes Salär mit realem Wachstum (siehe Feinabstimmung). Für stark steigende Einkommen auf „Nach Altersphasen“ wechseln."}
            </p>

            <div className="mt-4">
              {inputs.useIncomePhases ? (
                <IncomePhasesEditor
                  phases={inputs.incomePhases}
                  startAge={inputs.currentAge}
                  fireAge={inputs.fireAge}
                  onChange={(next) => set("incomePhases", next)}
                />
              ) : (
                <Grid>
                  <Field label="Bruttosalär" value={inputs.currentSalary} onChange={(v) => set("currentSalary", v)} prefix="CHF" suffix="/Jahr" step={1000} min={0} />
                  <Field label="Sparbetrag (steuerbar)" value={inputs.annualTaxableSavings} onChange={(v) => set("annualTaxableSavings", v)} prefix="CHF" suffix="/Jahr" step={1000} min={0} />
                  <Field label="3a-Einzahlung" value={inputs.annualPillar3aContribution} onChange={(v) => set("annualPillar3aContribution", v)} prefix="CHF" suffix="/Jahr" step={100} min={0} {...estimable(props, "annualPillar3aContribution")} />
                </Grid>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "retirement",
    title: "Ruhestand",
    subtitle: "Ausgaben, Renten und ab wann die Säulen verfügbar sind.",
    render: (props) => {
      const { inputs, set } = props;
      return (
      <Grid>
        <Field label="Lebenshaltungskosten" value={inputs.annualRealSpending} onChange={(v) => set("annualRealSpending", v)} prefix="CHF" suffix="/Jahr" step={1000} min={0} hint="In heutiger Kaufkraft." />
        <Field label="Krankenkassenprämie" value={inputs.healthInsuranceAnnualPremium} onChange={(v) => set("healthInsuranceAnnualPremium", v)} prefix="CHF" suffix="/Jahr" step={100} min={0} {...estimable(props, "healthInsuranceAnnualPremium")} />
        <Field label="Erwartete AHV-Rente" value={inputs.ahvAnnualPension} onChange={(v) => set("ahvAnnualPension", v)} prefix="CHF" suffix="/Jahr" step={500} min={0} {...estimable(props, "ahvAnnualPension")} />
        <Field label="AHV-Bezug ab" value={inputs.ahvClaimAge} onChange={(v) => set("ahvClaimAge", v)} suffix="Jahre" min={63} max={70} {...estimable(props, "ahvClaimAge")} />
        <Field label="Säule 3a verfügbar ab" value={inputs.pillar3aUnlockAge} onChange={(v) => set("pillar3aUnlockAge", v)} suffix="Jahre" min={58} max={70} {...estimable(props, "pillar3aUnlockAge")} />
        <Field label="Pensionskasse verfügbar ab" value={inputs.earliestPkAge} onChange={(v) => set("earliestPkAge", v)} suffix="Jahre" min={55} max={70} {...estimable(props, "earliestPkAge")} />
        <Field label="AHV-Referenzalter" value={inputs.ahvReferenceAge} onChange={(v) => set("ahvReferenceAge", v)} suffix="Jahre" min={64} max={66} {...estimable(props, "ahvReferenceAge")} />
      </Grid>
      );
    },
  },
  {
    id: "assumptions",
    title: "Feinabstimmung",
    subtitle: "Optional — sinnvolle Standardwerte sind bereits gesetzt.",
    render: ({ inputs, set }) => (
      <Grid>
        <Field label="Erwartete reale Rendite" value={inputs.expectedReturn} onChange={(v) => set("expectedReturn", v)} percent />
        <Field label="Rendite Säule 3a" value={inputs.pillar3aReturn} onChange={(v) => set("pillar3aReturn", v)} percent />
        <Field label="PK-Verzinsung" value={inputs.pillar2InterestRate} onChange={(v) => set("pillar2InterestRate", v)} percent hint="Ø Zins auf dem PK-Guthaben." />
        <Field label="Salärwachstum (real)" value={inputs.salaryGrowth} onChange={(v) => set("salaryGrowth", v)} percent />
        <Field label="Volatilität" value={inputs.volatility} onChange={(v) => set("volatility", v)} percent hint="Für die Monte-Carlo-Simulation." />
        <Field label="Aktienanteil" value={inputs.equityShare} onChange={(v) => set("equityShare", v)} percent hint="Für den Bootstrap-Mix." />
      </Grid>
    ),
  },
];
