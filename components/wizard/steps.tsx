"use client";

import type { ReactNode } from "react";

import { Field } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SelectField } from "@/components/ui/SelectField";
import { IncomePhasesEditor } from "@/components/wizard/IncomePhasesEditor";
import { OneOffInflowsEditor } from "@/components/wizard/OneOffInflowsEditor";
import { CANTONS } from "@/lib/engine/cantons";
import type { CantonCode, IncomePhase } from "@/lib/engine/types";
import type { EstimableKey } from "@/lib/estimates";
import { formatChf } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { tpl } from "@/lib/i18n/tpl";
import type { CalculatorInputs, PartnerInputs } from "@/lib/inputs";
import { municipalitiesForCanton } from "@/lib/municipalities";

export interface StepProps {
  inputs: CalculatorInputs;
  set: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  isAuto: (key: EstimableKey) => boolean;
  toggleAuto: (key: EstimableKey) => void;
}

export interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  render: (props: StepProps) => ReactNode;
}

type EstimateLabelKey = keyof Dictionary["wizard"]["estimateLabels"];

const cantonOptions = (Object.keys(CANTONS) as CantonCode[]).map((code) => ({
  value: code,
  label: CANTONS[code].name,
}));

const Grid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
);

/** Two side-by-side person columns (You / Partner). */
const TwoCol = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">{children}</div>
);

const ColHeading = ({ children }: { children: ReactNode }) => (
  <p className="eyebrow border-b border-line pb-2 text-brass">{children}</p>
);

/** Fields a person needs in the "Wealth & income" step. */
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

/** Fields a person needs in the "Retirement" step. */
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
  baristaFireIncome: number;
}

/**
 * Builds the localised step definitions. A factory (rather than a const) so the
 * dictionary can flow into every label, option and hint.
 */
export function getSteps(t: Dictionary): StepDef[] {
  const w = t.wizard;
  const u = w.units;
  const sy = w.steps.you;
  const sw = w.steps.wealth;
  const sr = w.steps.retirement;
  const sa = w.steps.assumptions;

  /** Auto-estimate props: the auto flag, the toggle handler and (while auto) the rationale hint. */
  const estimable = (props: StepProps, key: EstimableKey, baseHint?: string) => {
    const auto = props.isAuto(key);
    const baseKey = key.replace("partner:", "") as EstimateLabelKey;
    return {
      auto,
      onToggleAuto: () => props.toggleAuto(key),
      hint: auto ? w.estimateLabels[baseKey] : baseHint,
    };
  };

  /** One person's wealth/income column, shared by the primary and the partner. */
  const wealthColumn = (
    title: string,
    v: WealthVals,
    setField: FieldSetter<WealthVals>,
    est: EstProvider,
    income: IncomeConfig,
  ): ReactNode => (
    <div className="space-y-4">
      <ColHeading>{title}</ColHeading>
      <Field label={sw.taxableNow} value={v.currentTaxableBalance} onChange={(x) => setField("currentTaxableBalance", x)} prefix={u.chf} step={1000} min={0} />
      <Field label={sw.pillar3aNow} value={v.currentPillar3aBalance} onChange={(x) => setField("currentPillar3aBalance", x)} prefix={u.chf} step={1000} min={0} />
      <Field label={sw.pillar2Now} value={v.currentPillar2Balance} onChange={(x) => setField("currentPillar2Balance", x)} prefix={u.chf} step={1000} min={0} />

      <div className="border-t border-line pt-4">
        <SegmentedControl
          label={sw.salarySavings}
          ariaLabel={tpl(sw.incomeModeAria, { who: title })}
          value={income.use ? "phases" : "simple"}
          onChange={(x) => income.setUse(x === "phases")}
          options={[
            { value: "simple", label: sw.constant },
            { value: "phases", label: sw.phases },
          ]}
        />
        <div className="mt-4">
          {income.use ? (
            <IncomePhasesEditor phases={income.phases} startAge={income.startAge} fireAge={income.fireAge} onChange={income.setPhases} />
          ) : (
            <div className="space-y-4">
              <Field label={sw.grossSalary} value={v.currentSalary} onChange={(x) => setField("currentSalary", x)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} />
              <Field label={sw.salaryGrowth} value={v.salaryGrowth} onChange={(x) => setField("salaryGrowth", x)} percent />
              <Field label={sw.taxableSavings} value={v.annualTaxableSavings} onChange={(x) => setField("annualTaxableSavings", x)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} />
              <Field label={sw.contribution3a} value={v.annualPillar3aContribution} onChange={(x) => setField("annualPillar3aContribution", x)} prefix={u.chf} suffix={u.perYear} step={100} min={0} {...est("annualPillar3aContribution")} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <SegmentedControl
          label={sw.pkBuildupShort}
          ariaLabel={tpl(sw.pkModelAria, { who: title })}
          value={v.pillar2Model}
          onChange={(x) => setField("pillar2Model", x)}
          options={[
            { value: "bvg", label: sw.bvgMin },
            { value: "rate", label: sw.avgContribution },
          ]}
        />
        {v.pillar2Model === "rate" && (
          <div className="mt-4 space-y-4">
            <Field label={sw.avgPkContribution} value={v.pillar2SavingsRate} onChange={(x) => setField("pillar2SavingsRate", x)} percent hint={sw.avgPkContributionHint} />
            <Field label={sw.insuredCeiling} value={v.pillar2InsuredCeiling} onChange={(x) => setField("pillar2InsuredCeiling", x)} prefix={u.chf} step={5000} min={0} />
          </div>
        )}
      </div>
    </div>
  );

  /** One person's retirement column, shared by the primary and the partner. */
  const retirementColumn = (title: string, v: RetVals, setField: FieldSetter<RetVals>, est: EstProvider): ReactNode => (
    <div className="space-y-4">
      <ColHeading>{title}</ColHeading>
      <Field label={sr.healthPremium} value={v.healthInsuranceAnnualPremium} onChange={(x) => setField("healthInsuranceAnnualPremium", x)} prefix={u.chf} suffix={u.perYear} step={100} min={0} {...est("healthInsuranceAnnualPremium")} />
      <Field label={sr.ahvPension} value={v.ahvAnnualPension} onChange={(x) => setField("ahvAnnualPension", x)} prefix={u.chf} suffix={u.perYear} step={500} min={0} hint={sr.ahvPensionHint} {...est("ahvAnnualPension")} />
      <Field label={sr.ahvClaimAge} value={v.ahvClaimAge} onChange={(x) => setField("ahvClaimAge", x)} suffix={u.years} min={63} max={70} {...est("ahvClaimAge")} />
      <Field label={sr.ahvReferenceAge} value={v.ahvReferenceAge} onChange={(x) => setField("ahvReferenceAge", x)} suffix={u.years} min={64} max={66} {...est("ahvReferenceAge")} />
      <Field label={sr.pillar3aUnlock} value={v.pillar3aUnlockAge} onChange={(x) => setField("pillar3aUnlockAge", x)} suffix={u.years} min={58} max={70} {...est("pillar3aUnlockAge")} />
      <Field label={sr.pillar3aTranches} value={v.pillar3aTranches} onChange={(x) => setField("pillar3aTranches", x)} suffix={u.accounts} min={1} max={5} step={1} hint={sr.pillar3aTranchesHint} />
      <Field label={sr.earliestPk} value={v.earliestPkAge} onChange={(x) => setField("earliestPkAge", x)} suffix={u.years} min={55} max={70} {...est("earliestPkAge")} />
      <div className="border-t border-line pt-4">
        <SegmentedControl
          label={sr.pkPayout}
          ariaLabel={tpl(sr.pkPayoutAria, { who: title })}
          value={v.pillar2PayoutMode}
          onChange={(x) => setField("pillar2PayoutMode", x)}
          options={[
            { value: "capital", label: sr.capital },
            { value: "pension", label: sr.pension },
            { value: "mix", label: sr.mixed },
          ]}
        />
        {v.pillar2PayoutMode !== "capital" && (
          <div className="mt-4 space-y-4">
            <Field label={sr.conversionRate} value={v.pillar2ConversionRate} onChange={(x) => setField("pillar2ConversionRate", x)} percent hint={sr.conversionRateHint} {...est("pillar2ConversionRate")} />
            {v.pillar2PayoutMode === "mix" && (
              <Field label={sr.capitalShare} value={v.pillar2CapitalShare} onChange={(x) => setField("pillar2CapitalShare", x)} percent hint={sr.capitalShareHint} />
            )}
          </div>
        )}
      </div>
      <div className="border-t border-line pt-4">
        <Field label={sr.baristaIncome} value={v.baristaFireIncome} onChange={(x) => setField("baristaFireIncome", x)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} hint={sr.baristaIncomeHintHousehold} />
      </div>
    </div>
  );

  /** Combined household net worth (both partners' liquid + 3a + PK). */
  const netWorthBanner = (inputs: CalculatorInputs): ReactNode => {
    const sum = (a: { currentTaxableBalance: number; currentPillar3aBalance: number; currentPillar2Balance: number }) =>
      a.currentTaxableBalance + a.currentPillar3aBalance + a.currentPillar2Balance;
    const total = sum(inputs) + sum(inputs.partner);
    return (
      <div className="flex items-baseline justify-between gap-4 bg-ink p-4 text-paper">
        <p className="eyebrow text-brass-soft">{sw.householdBanner}</p>
        <p className="num text-lg font-semibold">{formatChf(total)}</p>
      </div>
    );
  };

  return [
    {
      id: "you",
      title: sy.title,
      subtitle: sy.subtitle,
      render: (props) => {
        const { inputs, set } = props;
        const p = inputs.partner;
        const setP = <K extends keyof PartnerInputs>(k: K, val: PartnerInputs[K]) => set("partner", { ...p, [k]: val });
        return (
          <div className="space-y-5">
            <Grid>
              <Field label={sy.currentAge} value={inputs.currentAge} onChange={(v) => set("currentAge", v)} suffix={u.years} min={18} max={70} />
              <Field label={sy.fireAge} value={inputs.fireAge} onChange={(v) => set("fireAge", v)} suffix={u.years} min={30} max={75} />
              <Field label={sy.horizonAge} value={inputs.horizonAge} onChange={(v) => set("horizonAge", v)} suffix={u.years} min={70} max={110} {...estimable(props, "horizonAge", sy.horizonHint)} />
            </Grid>
            <SegmentedControl
              label={sy.maritalStatus}
              value={inputs.maritalStatus}
              onChange={(v) => set("maritalStatus", v)}
              options={[
                { value: "single", label: sy.single },
                { value: "married", label: sy.married },
              ]}
            />
            <SelectField
              label={sy.canton}
              value={inputs.canton}
              onChange={(v) => {
                const c = v as CantonCode;
                const capital = municipalitiesForCanton(c).find((m) => m.factor === 1) ?? municipalitiesForCanton(c)[0];
                set("canton", c);
                if (capital) {
                  set("gemeindeBfs", capital.bfs);
                  set("gemeindeSteuerfuss", capital.factor);
                }
              }}
              options={cantonOptions}
              hint={sy.cantonHint}
            />
            <SelectField
              label={sy.gemeinde}
              value={String(inputs.gemeindeBfs)}
              onChange={(v) => {
                const m = municipalitiesForCanton(inputs.canton).find((x) => x.bfs === Number(v));
                set("gemeindeBfs", Number(v));
                if (m) set("gemeindeSteuerfuss", m.factor);
              }}
              options={municipalitiesForCanton(inputs.canton).map((m) => ({
                value: String(m.bfs),
                label: `${m.name} (${Math.round(m.factor * 100)} %)`,
              }))}
              hint={sy.gemeindeHint}
            />
            <SelectField
              label={sy.confession}
              value={inputs.confession}
              onChange={(v) => set("confession", v as CalculatorInputs["confession"])}
              options={[
                { value: "none", label: sy.confessionNone },
                { value: "protestant", label: sy.confessionProtestant },
                { value: "roman", label: sy.confessionRoman },
              ]}
              hint={sy.confessionHint}
            />
            <div className="border-t border-line pt-5">
              <SegmentedControl
                label={sy.planTogether}
                ariaLabel={sy.planTogetherAria}
                value={inputs.hasPartner ? "yes" : "no"}
                onChange={(v) => set("hasPartner", v === "yes")}
                options={[
                  { value: "no", label: sy.alone },
                  { value: "yes", label: sy.withPartner },
                ]}
              />
              {inputs.hasPartner ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={sy.partnerAge} value={p.currentAge} onChange={(v) => setP("currentAge", v)} suffix={u.years} min={18} max={75} />
                  <Field label={sy.partnerFireAge} value={p.fireAge} onChange={(v) => setP("fireAge", v)} suffix={u.years} min={30} max={75} />
                </div>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-muted">{sy.partnerIntro}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "wealth",
      title: sw.title,
      subtitle: sw.subtitle,
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
                {wealthColumn(t.common.you, inputs, setPrimaryW, estPrimary, incomePrimary)}
                {wealthColumn(t.common.partner, p, setPartnerW, estPartner, incomePartner)}
              </TwoCol>
              <div className="border-t border-line pt-5">
                <Field label={sw.otherWealthHousehold} value={inputs.otherNetWealth} onChange={(v) => set("otherNetWealth", v)} prefix={u.chf} step={10000} min={0} hint={sw.otherWealthHint} />
              </div>
              <div className="border-t border-line pt-5">
                <p className="text-sm font-medium text-ink">{sw.oneOffHeading}</p>
                <p className="mt-1 mb-4 text-xs leading-relaxed text-muted">{sw.oneOffNoteHousehold}</p>
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
              <Field label={sw.taxableNow} value={inputs.currentTaxableBalance} onChange={(v) => set("currentTaxableBalance", v)} prefix={u.chf} step={1000} min={0} />
              <Field label={sw.pillar3aNow} value={inputs.currentPillar3aBalance} onChange={(v) => set("currentPillar3aBalance", v)} prefix={u.chf} step={1000} min={0} />
              <Field label={sw.pillar2Now} value={inputs.currentPillar2Balance} onChange={(v) => set("currentPillar2Balance", v)} prefix={u.chf} step={1000} min={0} />
              <Field label={sw.otherWealth} value={inputs.otherNetWealth} onChange={(v) => set("otherNetWealth", v)} prefix={u.chf} step={10000} min={0} hint={sw.otherWealthHint} />
            </Grid>

            <div className="border-t border-line pt-5">
              <SegmentedControl
                label={sw.pkBuildup}
                ariaLabel={sw.pkModelAriaSingle}
                value={inputs.pillar2Model}
                onChange={(v) => set("pillar2Model", v)}
                options={[
                  { value: "bvg", label: sw.bvgMin },
                  { value: "rate", label: sw.avgContribution },
                ]}
              />
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {inputs.pillar2Model === "rate" ? sw.pkRateNote : sw.pkBvgNote}
              </p>
              {inputs.pillar2Model === "rate" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={sw.avgPkContribution} value={inputs.pillar2SavingsRate} onChange={(v) => set("pillar2SavingsRate", v)} percent hint={sw.avgPkContributionHint} />
                  <Field
                    label={sw.insuredCeiling}
                    value={inputs.pillar2InsuredCeiling}
                    onChange={(v) => set("pillar2InsuredCeiling", v)}
                    prefix={u.chf}
                    step={5000}
                    min={0}
                    hint={sw.insuredCeilingHint}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-line pt-5">
              <SegmentedControl
                label={sw.salarySavings}
                ariaLabel={sw.pkModelAriaSingle}
                value={inputs.useIncomePhases ? "phases" : "simple"}
                onChange={(v) => set("useIncomePhases", v === "phases")}
                options={[
                  { value: "simple", label: sw.constant },
                  { value: "phases", label: sw.phasesLong },
                ]}
              />
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {inputs.useIncomePhases ? sw.incomePhasesNote : sw.incomeSimpleNote}
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
                    <Field label={sw.grossSalary} value={inputs.currentSalary} onChange={(v) => set("currentSalary", v)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} />
                    <Field label={sw.taxableSavings} value={inputs.annualTaxableSavings} onChange={(v) => set("annualTaxableSavings", v)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} />
                    <Field label={sw.contribution3a} value={inputs.annualPillar3aContribution} onChange={(v) => set("annualPillar3aContribution", v)} prefix={u.chf} suffix={u.perYear} step={100} min={0} {...estimable(props, "annualPillar3aContribution")} />
                  </Grid>
                )}
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <p className="text-sm font-medium text-ink">{sw.oneOffHeading}</p>
              <p className="mt-1 mb-4 text-xs leading-relaxed text-muted">{sw.oneOffNote}</p>
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
      title: sr.title,
      subtitle: sr.subtitle,
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
              <Field label={sr.livingHousehold} value={inputs.annualRealSpending} onChange={(v) => set("annualRealSpending", v)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} hint={sr.livingHouseholdHint} />
              <TwoCol>
                {retirementColumn(t.common.you, inputs, setPrimaryR, estPrimary)}
                {retirementColumn(t.common.partner, p, setPartnerR, estPartner)}
              </TwoCol>
            </div>
          );
        }
        return (
          <Grid>
            <Field label={sr.living} value={inputs.annualRealSpending} onChange={(v) => set("annualRealSpending", v)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} hint={sr.livingHint} />
            <Field label={sr.healthPremium} value={inputs.healthInsuranceAnnualPremium} onChange={(v) => set("healthInsuranceAnnualPremium", v)} prefix={u.chf} suffix={u.perYear} step={100} min={0} {...estimable(props, "healthInsuranceAnnualPremium")} />
            <Field label={sr.ahvPension} value={inputs.ahvAnnualPension} onChange={(v) => set("ahvAnnualPension", v)} prefix={u.chf} suffix={u.perYear} step={500} min={0} {...estimable(props, "ahvAnnualPension")} />
            <Field label={sr.ahvClaimAge} value={inputs.ahvClaimAge} onChange={(v) => set("ahvClaimAge", v)} suffix={u.years} min={63} max={70} {...estimable(props, "ahvClaimAge")} />
            <Field label={sr.pillar3aUnlock} value={inputs.pillar3aUnlockAge} onChange={(v) => set("pillar3aUnlockAge", v)} suffix={u.years} min={58} max={70} {...estimable(props, "pillar3aUnlockAge")} />
            <Field label={sr.pillar3aTranches} value={inputs.pillar3aTranches} onChange={(v) => set("pillar3aTranches", v)} suffix={u.accounts} min={1} max={5} step={1} hint={sr.pillar3aTranchesHint} />
            <Field label={sr.earliestPk} value={inputs.earliestPkAge} onChange={(v) => set("earliestPkAge", v)} suffix={u.years} min={55} max={70} {...estimable(props, "earliestPkAge")} />
            <Field label={sr.ahvReferenceAge} value={inputs.ahvReferenceAge} onChange={(v) => set("ahvReferenceAge", v)} suffix={u.years} min={64} max={66} {...estimable(props, "ahvReferenceAge")} />

            <div className="sm:col-span-2 border-t border-line pt-5">
              <SegmentedControl
                label={sr.pkPayout}
                ariaLabel={sr.pkPayoutAriaSingle}
                value={inputs.pillar2PayoutMode}
                onChange={(v) => set("pillar2PayoutMode", v)}
                options={[
                  { value: "capital", label: sr.capital },
                  { value: "pension", label: sr.pension },
                  { value: "mix", label: sr.mixed },
                ]}
              />
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {inputs.pillar2PayoutMode === "capital"
                  ? sr.payoutNoteCapital
                  : inputs.pillar2PayoutMode === "pension"
                    ? sr.payoutNotePension
                    : sr.payoutNoteMixed}
                {sr.payoutNote3a}
              </p>
              {inputs.pillar2PayoutMode !== "capital" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={sr.conversionRate} value={inputs.pillar2ConversionRate} onChange={(v) => set("pillar2ConversionRate", v)} percent {...estimable(props, "pillar2ConversionRate", sr.conversionRateHint)} />
                  {inputs.pillar2PayoutMode === "mix" && (
                    <Field label={sr.capitalShare} value={inputs.pillar2CapitalShare} onChange={(v) => set("pillar2CapitalShare", v)} percent hint={sr.capitalShareHint} />
                  )}
                </div>
              )}
            </div>

            <div className="sm:col-span-2 border-t border-line pt-5">
              <SegmentedControl
                label={sr.postFire}
                ariaLabel={sr.postFireAria}
                value={inputs.postFireEmployment ? "yes" : "no"}
                onChange={(v) => set("postFireEmployment", v === "yes")}
                options={[
                  { value: "no", label: sr.no },
                  { value: "yes", label: sr.partTime },
                ]}
              />
              <p className="mt-2 text-xs leading-relaxed text-muted">{sr.postFireNote}</p>
              {inputs.postFireEmployment && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={sr.postFireIncome} value={inputs.postFireIncome} onChange={(v) => set("postFireIncome", v)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} />
                  <Field label={sr.postFireUntil} value={inputs.postFireWorkUntilAge} onChange={(v) => set("postFireWorkUntilAge", v)} suffix={u.years} min={inputs.fireAge} max={70} />
                </div>
              )}
            </div>

            <div className="sm:col-span-2 border-t border-line pt-5">
              <SegmentedControl
                label={sr.barista}
                ariaLabel={sr.baristaAria}
                value={inputs.baristaFire ? "yes" : "no"}
                onChange={(v) => {
                  const on = v === "yes";
                  set("baristaFire", on);
                  if (on && inputs.baristaFireIncome === 0) set("baristaFireIncome", 12_000);
                }}
                options={[
                  { value: "no", label: sr.no },
                  { value: "yes", label: sr.baristaYes },
                ]}
              />
              <p className="mt-2 text-xs leading-relaxed text-muted">{sr.baristaNote}</p>
              {inputs.baristaFire && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={sr.baristaIncome} value={inputs.baristaFireIncome} onChange={(v) => set("baristaFireIncome", v)} prefix={u.chf} suffix={u.perYear} step={1000} min={0} hint={sr.baristaIncomeHint} />
                </div>
              )}
            </div>
          </Grid>
        );
      },
    },
    {
      id: "assumptions",
      title: sa.title,
      subtitle: sa.subtitle,
      render: (props) => {
        const { inputs, set } = props;
        return (
          <Grid>
            <Field label={sa.expectedReturn} value={inputs.expectedReturn} onChange={(v) => set("expectedReturn", v)} percent {...estimable(props, "expectedReturn", sa.expectedReturnHint)} />
            <Field label={sa.volatility} value={inputs.volatility} onChange={(v) => set("volatility", v)} percent {...estimable(props, "volatility", sa.volatilityHint)} />
            <Field label={sa.equityShare} value={inputs.equityShare} onChange={(v) => set("equityShare", v)} percent hint={sa.equityShareHint} />
            <Field label={sa.swissShare} value={inputs.swissEquityShare} onChange={(v) => set("swissEquityShare", v)} percent hint={sa.swissShareHint} />
            <Field label={sa.return3a} value={inputs.pillar3aReturn} onChange={(v) => set("pillar3aReturn", v)} percent />
            <Field label={sa.pkInterest} value={inputs.pillar2InterestRate} onChange={(v) => set("pillar2InterestRate", v)} percent hint={sa.pkInterestHint} />
            <Field label={sa.salaryGrowth} value={inputs.salaryGrowth} onChange={(v) => set("salaryGrowth", v)} percent />
            <Field label={sa.inflation} value={inputs.inflation} onChange={(v) => set("inflation", v)} percent hint={sa.inflationHint} />
          </Grid>
        );
      },
    },
  ];
}
