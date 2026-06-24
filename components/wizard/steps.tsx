"use client";

import type { ReactNode } from "react";

import { Field } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SelectField } from "@/components/ui/SelectField";
import { IncomePhasesEditor } from "@/components/wizard/IncomePhasesEditor";
import { OneOffInflowsEditor } from "@/components/wizard/OneOffInflowsEditor";
import { CANTONS } from "@/lib/engine/cantons";
import type { CantonCode, IncomePhase } from "@/lib/engine/types";
import { ESTIMATE_LABELS, type EstimableKey } from "@/lib/estimates";
import { formatChf } from "@/lib/format";
import type { CalculatorInputs, PartnerInputs } from "@/lib/inputs";

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

/** Two side-by-side person columns (Sie / Partner:in). */
const TwoCol = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">{children}</div>
);

const ColHeading = ({ children }: { children: ReactNode }) => (
  <p className="eyebrow border-b border-line pb-2 text-brass">{children}</p>
);

/** Fields a person needs in the "Vermögen & Einkommen" step. */
interface WealthVals {
  currentTaxableBalance: number;
  currentPillar3aBalance: number;
  currentPillar2Balance: number;
  currentSalary: number;
  salaryGrowth: number;
  annualTaxableSavings: number;
  annualPillar3aContribution: number;
  pillar2Model: "bvg" | "rate";
  pillar2SavingsRate: number;
  pillar2InsuredCeiling: number;
}

type FieldSetter<T> = (key: keyof T, value: number | string) => void;

/** Returns auto-estimate props for a field, or {} for a person without estimates. */
type EstProvider = (key: EstimableKey, hint?: string) => Record<string, unknown>;

/** Per-person income-mode configuration (constant salary vs age-banded phases). */
interface IncomeConfig {
  use: boolean;
  phases: IncomePhase[];
  startAge: number;
  fireAge: number;
  setUse: (b: boolean) => void;
  setPhases: (p: IncomePhase[]) => void;
}

/** One person's wealth/income column, shared by the primary and the partner. */
function wealthColumn(title: string, v: WealthVals, setField: FieldSetter<WealthVals>, est: EstProvider, income: IncomeConfig): ReactNode {
  return (
    <div className="space-y-4">
      <ColHeading>{title}</ColHeading>
      <Field label="Steuerbares Vermögen heute" value={v.currentTaxableBalance} onChange={(x) => setField("currentTaxableBalance", x)} prefix="CHF" step={1000} min={0} />
      <Field label="Säule-3a-Guthaben heute" value={v.currentPillar3aBalance} onChange={(x) => setField("currentPillar3aBalance", x)} prefix="CHF" step={1000} min={0} />
      <Field label="Pensionskasse-Guthaben heute" value={v.currentPillar2Balance} onChange={(x) => setField("currentPillar2Balance", x)} prefix="CHF" step={1000} min={0} />

      <div className="border-t border-line pt-4">
        <SegmentedControl
          label="Salär & Sparrate"
          ariaLabel={`Einkommensmodus ${title}`}
          value={income.use ? "phases" : "simple"}
          onChange={(x) => income.setUse(x === "phases")}
          options={[
            { value: "simple", label: "Konstant" },
            { value: "phases", label: "Phasen" },
          ]}
        />
        <div className="mt-4">
          {income.use ? (
            <IncomePhasesEditor phases={income.phases} startAge={income.startAge} fireAge={income.fireAge} onChange={income.setPhases} />
          ) : (
            <div className="space-y-4">
              <Field label="Bruttosalär" value={v.currentSalary} onChange={(x) => setField("currentSalary", x)} prefix="CHF" suffix="/Jahr" step={1000} min={0} />
              <Field label="Salärwachstum (real)" value={v.salaryGrowth} onChange={(x) => setField("salaryGrowth", x)} percent />
              <Field label="Sparbetrag (steuerbar)" value={v.annualTaxableSavings} onChange={(x) => setField("annualTaxableSavings", x)} prefix="CHF" suffix="/Jahr" step={1000} min={0} />
              <Field label="3a-Einzahlung" value={v.annualPillar3aContribution} onChange={(x) => setField("annualPillar3aContribution", x)} prefix="CHF" suffix="/Jahr" step={100} min={0} {...est("annualPillar3aContribution")} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <SegmentedControl
          label="PK-Aufbau"
          ariaLabel={`Pensionskassen-Modell ${title}`}
          value={v.pillar2Model}
          onChange={(x) => setField("pillar2Model", x)}
          options={[
            { value: "bvg", label: "BVG-Minimum" },
            { value: "rate", label: "Ø Sparbeitrag" },
          ]}
        />
        {v.pillar2Model === "rate" && (
          <div className="mt-4 space-y-4">
            <Field label="Ø PK-Sparbeitrag" value={v.pillar2SavingsRate} onChange={(x) => setField("pillar2SavingsRate", x)} percent hint="Anteil des versicherten Lohns pro Jahr." />
            <Field label="Versicherter Lohn bis" value={v.pillar2InsuredCeiling} onChange={(x) => setField("pillar2InsuredCeiling", x)} prefix="CHF" step={5000} min={0} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Fields a person needs in the "Ruhestand" step. */
interface RetVals {
  healthInsuranceAnnualPremium: number;
  ahvAnnualPension: number;
  ahvClaimAge: number;
  ahvReferenceAge: number;
  pillar3aUnlockAge: number;
  pillar3aTranches: number;
  earliestPkAge: number;
  pillar2PayoutMode: "capital" | "pension" | "mix";
  pillar2ConversionRate: number;
  pillar2CapitalShare: number;
}

/** One person's retirement column, shared by the primary and the partner. */
function retirementColumn(title: string, v: RetVals, setField: FieldSetter<RetVals>, est: EstProvider): ReactNode {
  return (
    <div className="space-y-4">
      <ColHeading>{title}</ColHeading>
      <Field label="Krankenkassenprämie" value={v.healthInsuranceAnnualPremium} onChange={(x) => setField("healthInsuranceAnnualPremium", x)} prefix="CHF" suffix="/Jahr" step={100} min={0} {...est("healthInsuranceAnnualPremium")} />
      <Field label="Erwartete AHV-Rente" value={v.ahvAnnualPension} onChange={(x) => setField("ahvAnnualPension", x)} prefix="CHF" suffix="/Jahr" step={500} min={0} hint="Bei Ehepaaren ist die Summe beider Renten auf 150 % der Maximalrente plafoniert." {...est("ahvAnnualPension")} />
      <Field label="AHV-Bezug ab" value={v.ahvClaimAge} onChange={(x) => setField("ahvClaimAge", x)} suffix="Jahre" min={63} max={70} {...est("ahvClaimAge")} />
      <Field label="AHV-Referenzalter" value={v.ahvReferenceAge} onChange={(x) => setField("ahvReferenceAge", x)} suffix="Jahre" min={64} max={66} {...est("ahvReferenceAge")} />
      <Field label="Säule 3a verfügbar ab" value={v.pillar3aUnlockAge} onChange={(x) => setField("pillar3aUnlockAge", x)} suffix="Jahre" min={58} max={70} {...est("pillar3aUnlockAge")} />
      <Field label="Säule-3a-Konten (gestaffelt)" value={v.pillar3aTranches} onChange={(x) => setField("pillar3aTranches", x)} suffix="Konten" min={1} max={5} step={1} hint="Mehrere 3a-Konten in getrennten Jahren beziehen bricht die Progression der Kapitalauszahlungssteuer." />
      <Field label="Pensionskasse verfügbar ab" value={v.earliestPkAge} onChange={(x) => setField("earliestPkAge", x)} suffix="Jahre" min={55} max={70} {...est("earliestPkAge")} />
      <div className="border-t border-line pt-4">
        <SegmentedControl
          label="Pensionskasse-Bezug"
          ariaLabel={`Pensionskassen-Bezugsart ${title}`}
          value={v.pillar2PayoutMode}
          onChange={(x) => setField("pillar2PayoutMode", x)}
          options={[
            { value: "capital", label: "Kapital" },
            { value: "pension", label: "Rente" },
            { value: "mix", label: "Gemischt" },
          ]}
        />
        {v.pillar2PayoutMode !== "capital" && (
          <div className="mt-4 space-y-4">
            <Field label="Umwandlungssatz" value={v.pillar2ConversionRate} onChange={(x) => setField("pillar2ConversionRate", x)} percent hint="BVG-Minimum 6,8 %; überobligatorisch oft tiefer." {...est("pillar2ConversionRate")} />
            {v.pillar2PayoutMode === "mix" && (
              <Field label="Kapitalanteil" value={v.pillar2CapitalShare} onChange={(x) => setField("pillar2CapitalShare", x)} percent hint="Anteil als Kapital; Rest wird verrentet." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Combined household net worth (both partners' liquid + 3a + PK). */
function netWorthBanner(inputs: CalculatorInputs): ReactNode {
  const sum = (a: { currentTaxableBalance: number; currentPillar3aBalance: number; currentPillar2Balance: number }) =>
    a.currentTaxableBalance + a.currentPillar3aBalance + a.currentPillar2Balance;
  const total = sum(inputs) + sum(inputs.partner);
  return (
    <div className="flex items-baseline justify-between gap-4 bg-ink p-4 text-paper">
      <p className="eyebrow text-brass-soft">Haushaltsvermögen heute</p>
      <p className="num text-lg font-semibold">{formatChf(total)}</p>
    </div>
  );
}

export const STEPS: StepDef[] = [
  {
    id: "you",
    title: "Über Sie",
    subtitle: "Wann steigen Sie aus und wo wohnen Sie?",
    render: (props) => {
      const { inputs, set } = props;
      const p = inputs.partner;
      const setP = <K extends keyof PartnerInputs>(k: K, val: PartnerInputs[K]) => set("partner", { ...p, [k]: val });
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
        <div className="border-t border-line pt-5">
          <SegmentedControl
            label="Gemeinsam planen"
            ariaLabel="Haushalt mit Partner:in"
            value={inputs.hasPartner ? "yes" : "no"}
            onChange={(v) => set("hasPartner", v === "yes")}
            options={[
              { value: "no", label: "Alleine" },
              { value: "yes", label: "Mit Partner:in" },
            ]}
          />
          {inputs.hasPartner ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Alter Partner:in" value={p.currentAge} onChange={(v) => setP("currentAge", v)} suffix="Jahre" min={18} max={75} />
              <Field label="FIRE-Alter Partner:in" value={p.fireAge} onChange={(v) => setP("fireAge", v)} suffix="Jahre" min={30} max={75} />
            </div>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Beziehen Sie eine zweite Person mit eigenem Salär, eigenen Säulen und eigenem Ausstiegsalter ein.
              Vermögen und Lebenshaltungskosten werden dann als Haushalt gerechnet.
            </p>
          )}
        </div>
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
      if (inputs.hasPartner) {
        const p = inputs.partner;
        const setPrimaryW: FieldSetter<WealthVals> = (k, val) => set(k as keyof CalculatorInputs, val as never);
        const setPartnerW: FieldSetter<WealthVals> = (k, val) => set("partner", { ...p, [k]: val } as PartnerInputs);
        const setPartnerField = <K extends keyof PartnerInputs>(k: K, val: PartnerInputs[K]) =>
          set("partner", { ...p, [k]: val });
        const estPrimary: EstProvider = (key, hint) => estimable(props, key, hint);
        const estPartner: EstProvider = (key, hint) => estimable(props, `partner:${key}` as EstimableKey, hint);
        const incomePrimary: IncomeConfig = {
          use: inputs.useIncomePhases,
          phases: inputs.incomePhases,
          startAge: inputs.currentAge,
          fireAge: inputs.fireAge,
          setUse: (b) => set("useIncomePhases", b),
          setPhases: (next) => set("incomePhases", next),
        };
        const incomePartner: IncomeConfig = {
          use: p.useIncomePhases,
          phases: p.incomePhases,
          startAge: p.currentAge,
          fireAge: p.fireAge,
          setUse: (b) => setPartnerField("useIncomePhases", b),
          setPhases: (next) => setPartnerField("incomePhases", next),
        };
        return (
          <div className="space-y-6">
            {netWorthBanner(inputs)}
            <TwoCol>
              {wealthColumn("Sie", inputs, setPrimaryW, estPrimary, incomePrimary)}
              {wealthColumn("Partner:in", p, setPartnerW, estPartner, incomePartner)}
            </TwoCol>
            <div className="border-t border-line pt-5">
              <p className="text-sm font-medium text-ink">Einmalige Zuflüsse (z. B. Erbschaft)</p>
              <p className="mt-1 mb-4 text-xs leading-relaxed text-muted">
                Optionale Einmalbeträge, die in einem bestimmten Alter dem gemeinsamen steuerbaren Vermögen
                gutgeschrieben werden (auf der Alters-Zeitachse der ersten Person).
              </p>
              <OneOffInflowsEditor
                inflows={inputs.oneOffInflows}
                currentAge={inputs.currentAge}
                horizonAge={inputs.horizonAge}
                onChange={(next) => set("oneOffInflows", next)}
              />
            </div>
          </div>
        );
      }
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

          <div className="border-t border-line pt-5">
            <p className="text-sm font-medium text-ink">Einmalige Zuflüsse (z. B. Erbschaft)</p>
            <p className="mt-1 mb-4 text-xs leading-relaxed text-muted">
              Optionale Einmalbeträge, die in einem bestimmten Alter dem steuerbaren Vermögen gutgeschrieben werden.
            </p>
            <OneOffInflowsEditor
              inflows={inputs.oneOffInflows}
              currentAge={inputs.currentAge}
              horizonAge={inputs.horizonAge}
              onChange={(next) => set("oneOffInflows", next)}
            />
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
      if (inputs.hasPartner) {
        const p = inputs.partner;
        const setPrimaryR: FieldSetter<RetVals> = (k, val) => set(k as keyof CalculatorInputs, val as never);
        const setPartnerR: FieldSetter<RetVals> = (k, val) => set("partner", { ...p, [k]: val } as PartnerInputs);
        const estPrimary: EstProvider = (key, hint) => estimable(props, key, hint);
        const estPartner: EstProvider = (key, hint) => estimable(props, `partner:${key}` as EstimableKey, hint);
        return (
          <div className="space-y-6">
            <Field label="Lebenshaltungskosten (Haushalt)" value={inputs.annualRealSpending} onChange={(v) => set("annualRealSpending", v)} prefix="CHF" suffix="/Jahr" step={1000} min={0} hint="Gemeinsame Ausgaben in heutiger Kaufkraft (Krankenkasse je Person separat unten)." />
            <TwoCol>
              {retirementColumn("Sie", inputs, setPrimaryR, estPrimary)}
              {retirementColumn("Partner:in", p, setPartnerR, estPartner)}
            </TwoCol>
          </div>
        );
      }
      return (
      <Grid>
        <Field label="Lebenshaltungskosten" value={inputs.annualRealSpending} onChange={(v) => set("annualRealSpending", v)} prefix="CHF" suffix="/Jahr" step={1000} min={0} hint="In heutiger Kaufkraft." />
        <Field label="Krankenkassenprämie" value={inputs.healthInsuranceAnnualPremium} onChange={(v) => set("healthInsuranceAnnualPremium", v)} prefix="CHF" suffix="/Jahr" step={100} min={0} {...estimable(props, "healthInsuranceAnnualPremium")} />
        <Field label="Erwartete AHV-Rente" value={inputs.ahvAnnualPension} onChange={(v) => set("ahvAnnualPension", v)} prefix="CHF" suffix="/Jahr" step={500} min={0} {...estimable(props, "ahvAnnualPension")} />
        <Field label="AHV-Bezug ab" value={inputs.ahvClaimAge} onChange={(v) => set("ahvClaimAge", v)} suffix="Jahre" min={63} max={70} {...estimable(props, "ahvClaimAge")} />
        <Field label="Säule 3a verfügbar ab" value={inputs.pillar3aUnlockAge} onChange={(v) => set("pillar3aUnlockAge", v)} suffix="Jahre" min={58} max={70} {...estimable(props, "pillar3aUnlockAge")} />
        <Field label="Säule-3a-Konten (gestaffelt)" value={inputs.pillar3aTranches} onChange={(v) => set("pillar3aTranches", v)} suffix="Konten" min={1} max={5} step={1} hint="Auf mehrere 3a-Konten verteilt und in getrennten Jahren bezogen — bricht die Progression der Kapitalauszahlungssteuer." />
        <Field label="Pensionskasse verfügbar ab" value={inputs.earliestPkAge} onChange={(v) => set("earliestPkAge", v)} suffix="Jahre" min={55} max={70} {...estimable(props, "earliestPkAge")} />
        <Field label="AHV-Referenzalter" value={inputs.ahvReferenceAge} onChange={(v) => set("ahvReferenceAge", v)} suffix="Jahre" min={64} max={66} {...estimable(props, "ahvReferenceAge")} />

        <div className="sm:col-span-2 border-t border-line pt-5">
          <SegmentedControl
            label="Pensionskasse-Bezug"
            ariaLabel="Pensionskassen-Bezugsart"
            value={inputs.pillar2PayoutMode}
            onChange={(v) => set("pillar2PayoutMode", v)}
            options={[
              { value: "capital", label: "Kapital" },
              { value: "pension", label: "Rente" },
              { value: "mix", label: "Gemischt" },
            ]}
          />
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {inputs.pillar2PayoutMode === "capital"
              ? "Das ganze PK-Guthaben wird als Kapital bezogen (einmalig zum reduzierten Kapitalsteuersatz) und ins frei verfügbare Vermögen überführt."
              : inputs.pillar2PayoutMode === "pension"
                ? "Das ganze PK-Guthaben wird in eine lebenslange Rente umgewandelt (Guthaben × Umwandlungssatz pro Jahr). Die Rente ist steuerbares Einkommen."
                : "Ein Teil wird als Kapital bezogen, der Rest verrentet. Gesetzlich sind mindestens 25 % als Kapital beziehbar."}
            {" "}Die Säule 3a wird gesetzlich immer als Kapital bezogen.
          </p>
          {inputs.pillar2PayoutMode !== "capital" && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Umwandlungssatz" value={inputs.pillar2ConversionRate} onChange={(v) => set("pillar2ConversionRate", v)} percent {...estimable(props, "pillar2ConversionRate", "BVG-Minimum 6,8 %; überobligatorisch oft tiefer.")} />
              {inputs.pillar2PayoutMode === "mix" && (
                <Field label="Kapitalanteil" value={inputs.pillar2CapitalShare} onChange={(v) => set("pillar2CapitalShare", v)} percent hint="Anteil als Kapital; Rest wird verrentet." />
              )}
            </div>
          )}
        </div>
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
        <Field label="Teuerung (Inflation)" value={inputs.inflation} onChange={(v) => set("inflation", v)} percent hint="Nur für die nominale Darstellung der Jahresausgaben." />
        <Field label="Volatilität" value={inputs.volatility} onChange={(v) => set("volatility", v)} percent hint="Für die Monte-Carlo-Simulation." />
        <Field label="Aktienanteil" value={inputs.equityShare} onChange={(v) => set("equityShare", v)} percent hint="Aktien vs. Obligationen für den historischen Monte-Carlo-Modus." />
        <Field label="Schweiz-Anteil der Aktien" value={inputs.swissEquityShare} onChange={(v) => set("swissEquityShare", v)} percent hint="z. B. 40 % Schweiz / 60 % global. Rest = globale Aktien (reale Kennzahlen Pictet & UBS/DMS)." />
      </Grid>
    ),
  },
];
