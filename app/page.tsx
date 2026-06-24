"use client";

import { useEffect, useMemo, useState } from "react";

import { AffiliateSlot } from "@/components/AffiliateSlot";
import { AnnualOutflowChart } from "@/components/AnnualOutflowChart";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import { BalanceChart, type BalanceMilestone, type BalancePoint } from "@/components/BalanceChart";
import { Disclaimer } from "@/components/Disclaimer";
import { Lifeline } from "@/components/Lifeline";
import { MonteCarloFan, type FanPoint } from "@/components/MonteCarloFan";
import { ResultsHeadline } from "@/components/ResultsHeadline";
import { YearTable } from "@/components/YearTable";
import { LedgerBar } from "@/components/ui/LedgerBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StepProgress } from "@/components/wizard/StepProgress";
import { STEPS } from "@/components/wizard/steps";
import { AFFILIATE_SLOTS } from "@/lib/affiliates";
import { simulateAccumulation } from "@/lib/engine/accumulation";
import { getCanton } from "@/lib/engine/cantons";
import { computeBridgeCapitalRequired, simulateDecumulation, type DecumulationParams } from "@/lib/engine/decumulation";
import { simulateHousehold, type HouseholdParams, type HouseholdPerson } from "@/lib/engine/household";
import { simulateHouseholdMonteCarlo, simulateMonteCarlo, type MonteCarloMode } from "@/lib/engine/montecarlo";
import { applyEstimates, ESTIMABLE_ORDER, estimatedValue, withManualSeed, type EstimableKey } from "@/lib/estimates";
import { DEFAULT_INPUTS, type CalculatorInputs, type PartnerInputs } from "@/lib/inputs";
import { municipalityByBfs } from "@/lib/municipalities";
import { decodeShareHash, encodeShareHash } from "@/lib/share";

function buildDecumulationParams(
  inputs: CalculatorInputs,
  startingTaxable: number,
  startingPillar3a: number,
  startingPillar2: number,
): DecumulationParams {
  return {
    fireAge: inputs.fireAge,
    horizonAge: inputs.horizonAge,
    pillar3aUnlockAge: inputs.pillar3aUnlockAge,
    earliestPkAge: inputs.earliestPkAge,
    ahvReferenceAge: inputs.ahvReferenceAge,
    ahvClaimAge: inputs.ahvClaimAge,
    ahvAnnualPension: inputs.ahvAnnualPension,
    annualRealSpending: inputs.annualRealSpending,
    healthInsuranceAnnualPremium: inputs.healthInsuranceAnnualPremium,
    maritalStatus: inputs.maritalStatus,
    canton: getCanton(inputs.canton),
    expectedReturn: inputs.expectedReturn,
    startingTaxable,
    startingPillar3a,
    startingPillar2,
    pillar3aReturn: inputs.pillar3aReturn,
    pillar2InterestRate: inputs.pillar2InterestRate,
    oneOffInflows: inputs.oneOffInflows,
    pillar2PayoutMode: inputs.pillar2PayoutMode,
    pillar2CapitalShare: inputs.pillar2CapitalShare,
    pillar2ConversionRate: inputs.pillar2ConversionRate,
    pillar3aTranches: inputs.pillar3aTranches,
    gemeindeSteuerfuss: inputs.gemeindeSteuerfuss,
    postFireIncome: inputs.postFireEmployment ? inputs.postFireIncome : 0,
    postFireWorkUntilAge: inputs.postFireWorkUntilAge,
    otherNetWealth: inputs.otherNetWealth,
  };
}

/** Maps the primary person's effective inputs to a household member. */
function primaryPerson(inputs: CalculatorInputs): HouseholdPerson {
  return {
    label: "Sie",
    currentAge: inputs.currentAge,
    fireAge: inputs.fireAge,
    currentSalary: inputs.currentSalary,
    salaryGrowth: inputs.salaryGrowth,
    annualTaxableSavings: inputs.annualTaxableSavings,
    incomePhases: inputs.useIncomePhases ? inputs.incomePhases : undefined,
    currentPillar3a: inputs.currentPillar3aBalance,
    annualPillar3aContribution: inputs.annualPillar3aContribution,
    pillar3aUnlockAge: inputs.pillar3aUnlockAge,
    pillar3aTranches: inputs.pillar3aTranches,
    currentPillar2: inputs.currentPillar2Balance,
    pillar2Plan: {
      model: inputs.pillar2Model,
      savingsRate: inputs.pillar2SavingsRate,
      insuredCeiling: inputs.pillar2InsuredCeiling,
      interestRate: inputs.pillar2InterestRate,
    },
    earliestPkAge: inputs.earliestPkAge,
    pillar2PayoutMode: inputs.pillar2PayoutMode,
    pillar2CapitalShare: inputs.pillar2CapitalShare,
    pillar2ConversionRate: inputs.pillar2ConversionRate,
    ahvReferenceAge: inputs.ahvReferenceAge,
    ahvClaimAge: inputs.ahvClaimAge,
    ahvAnnualPension: inputs.ahvAnnualPension,
    healthInsuranceAnnualPremium: inputs.healthInsuranceAnnualPremium,
  };
}

/** Maps the partner profile to a household member, sharing market assumptions. */
function partnerPerson(p: PartnerInputs, sharedPillar2Interest: number): HouseholdPerson {
  return {
    label: "Partner:in",
    currentAge: p.currentAge,
    fireAge: p.fireAge,
    currentSalary: p.currentSalary,
    salaryGrowth: p.salaryGrowth,
    annualTaxableSavings: p.annualTaxableSavings,
    incomePhases: p.useIncomePhases ? p.incomePhases : undefined,
    currentPillar3a: p.currentPillar3aBalance,
    annualPillar3aContribution: p.annualPillar3aContribution,
    pillar3aUnlockAge: p.pillar3aUnlockAge,
    pillar3aTranches: p.pillar3aTranches,
    currentPillar2: p.currentPillar2Balance,
    pillar2Plan: {
      model: p.pillar2Model,
      savingsRate: p.pillar2SavingsRate,
      insuredCeiling: p.pillar2InsuredCeiling,
      interestRate: sharedPillar2Interest,
    },
    earliestPkAge: p.earliestPkAge,
    pillar2PayoutMode: p.pillar2PayoutMode,
    pillar2CapitalShare: p.pillar2CapitalShare,
    pillar2ConversionRate: p.pillar2ConversionRate,
    ahvReferenceAge: p.ahvReferenceAge,
    ahvClaimAge: p.ahvClaimAge,
    ahvAnnualPension: p.ahvAnnualPension,
    healthInsuranceAnnualPremium: p.healthInsuranceAnnualPremium,
  };
}

function buildHouseholdParams(inputs: CalculatorInputs): HouseholdParams {
  return {
    primary: primaryPerson(inputs),
    partner: partnerPerson(inputs.partner, inputs.pillar2InterestRate),
    startingTaxable: inputs.currentTaxableBalance + inputs.partner.currentTaxableBalance,
    annualRealSpending: inputs.annualRealSpending,
    canton: getCanton(inputs.canton),
    expectedReturn: inputs.expectedReturn,
    pillar3aReturn: inputs.pillar3aReturn,
    horizonAge: inputs.horizonAge,
    oneOffInflows: inputs.oneOffInflows,
    gemeindeSteuerfuss: inputs.gemeindeSteuerfuss,
    otherNetWealth: inputs.otherNetWealth,
  };
}

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  // Fields that are auto-estimated rather than user-entered. Estimable
  // fields start estimated so the form is usable without lookups.
  const [autoKeys, setAutoKeys] = useState<Set<EstimableKey>>(() => new Set(ESTIMABLE_ORDER));
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [mcMode, setMcMode] = useState<MonteCarloMode | "off">("off");
  const [shared, setShared] = useState(false);

  // Load a shared scenario from the URL hash on first mount (client-only, so no
  // hydration mismatch — the initial render uses DEFAULT_INPUTS, then this
  // one-time sync from the URL applies any shared state).
  useEffect(() => {
    const decoded = decodeShareHash(window.location.hash);
    if (!decoded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL (an external source) on mount
    setInputs(decoded.inputs);
    setAutoKeys(new Set(decoded.autoKeys));
  }, []);

  // Effective inputs: manual values, with estimated fields resolved. This
  // is what both the engine and the displayed field values use.
  const eff = useMemo(() => applyEstimates(inputs, autoKeys), [inputs, autoKeys]);

  const set = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const isAuto = (key: EstimableKey) => autoKeys.has(key);

  const toggleAuto = (key: EstimableKey) => {
    const wasAuto = autoKeys.has(key);
    if (wasAuto) {
      // Switching to manual: seed the editable value with the current estimate
      // (handles both primary and partner: keys).
      const seeded = estimatedValue(eff, key);
      setInputs((prev) => withManualSeed(prev, key, seeded));
    }
    setAutoKeys((prev) => {
      const nextKeys = new Set(prev);
      if (wasAuto) nextKeys.delete(key);
      else nextKeys.add(key);
      return nextKeys;
    });
  };

  const accumulation = useMemo(
    () =>
      simulateAccumulation(eff.currentAge, eff.fireAge, {
        currentSalary: eff.currentSalary,
        salaryGrowth: eff.salaryGrowth,
        currentTaxableBalance: eff.currentTaxableBalance,
        annualTaxableSavings: eff.annualTaxableSavings,
        currentPillar3aBalance: eff.currentPillar3aBalance,
        annualPillar3aContribution: eff.annualPillar3aContribution,
        pillar3aReturn: eff.pillar3aReturn,
        currentPillar2Balance: eff.currentPillar2Balance,
        expectedReturn: eff.expectedReturn,
        incomePhases: eff.useIncomePhases ? eff.incomePhases : undefined,
        pillar2Plan: {
          model: eff.pillar2Model,
          savingsRate: eff.pillar2SavingsRate,
          insuredCeiling: eff.pillar2InsuredCeiling,
          interestRate: eff.pillar2InterestRate,
        },
        oneOffInflows: eff.oneOffInflows,
      }),
    [eff],
  );

  const decumulationParams = useMemo(
    () => buildDecumulationParams(eff, accumulation.taxableAtFire, accumulation.pillar3aAtFire, accumulation.pillar2AtFire),
    [eff, accumulation],
  );

  const decumulation = useMemo(() => simulateDecumulation(decumulationParams), [decumulationParams]);
  const singleBridge = useMemo(() => computeBridgeCapitalRequired(decumulationParams), [decumulationParams]);

  // Household path: a two-person calendar-timeline simulation when a partner
  // is added. Replaces the single-person accumulation + decumulation outputs.
  const householdParams = useMemo(() => (eff.hasPartner ? buildHouseholdParams(eff) : null), [eff]);
  const household = useMemo(() => (householdParams ? simulateHousehold(householdParams) : null), [householdParams]);

  // Household-aware result values (fall back to the single-person engine).
  const taxableAtFire = household ? household.taxableAtFire : accumulation.taxableAtFire;
  const pillar3aAtFire = household ? household.pillar3aAtFire : accumulation.pillar3aAtFire;
  const pillar2AtFire = household ? household.pillar2AtFire : accumulation.pillar2AtFire;
  const bridgeCapital = household ? household.bridgeCapitalRequired : singleBridge;
  const failed = household ? household.failed : decumulation.failed;
  const failedDuringBridge = household ? household.failedDuringBridge : decumulation.failedDuringBridge;
  const resultYears = household ? household.years : decumulation.years;

  const monteCarlo = useMemo(() => {
    if (mcMode === "off") return null;
    if (householdParams) {
      return simulateHouseholdMonteCarlo({
        householdParams,
        volatility: eff.volatility,
        equityShare: eff.equityShare,
        swissEquityShare: eff.swissEquityShare,
        mode: mcMode,
        paths: 500,
      });
    }
    return simulateMonteCarlo({
      decumulationParams,
      volatility: eff.volatility,
      equityShare: eff.equityShare,
      swissEquityShare: eff.swissEquityShare,
      mode: mcMode,
      paths: 500,
    });
  }, [mcMode, decumulationParams, householdParams, eff.volatility, eff.equityShare, eff.swissEquityShare]);

  const balanceData: BalancePoint[] = useMemo(() => {
    if (household) {
      return household.years.map((y) => ({
        age: y.age,
        taxable: y.taxableBalance,
        pillar3a: y.pillar3aBalance,
        pillar2: y.pillar2Balance,
      }));
    }
    const accPoints = accumulation.years.map((y) => ({
      age: y.age,
      taxable: y.taxableBalance,
      pillar3a: y.pillar3aBalance,
      pillar2: y.pillar2Balance,
    }));
    // Accumulation ends at fireAge and decumulation begins at fireAge, so
    // drop the duplicate fireAge point from decumulation to keep one row per age.
    const decPoints = decumulation.years
      .filter((y) => y.age > eff.fireAge)
      .map((y) => ({
        age: y.age,
        taxable: y.taxableBalance,
        pillar3a: y.pillar3aBalance,
        pillar2: y.pillar2Balance,
      }));
    return [...accPoints, ...decPoints];
  }, [household, accumulation, decumulation, eff.fireAge]);

  const fanData: FanPoint[] = useMemo(() => {
    if (!monteCarlo) return [];
    // Household paths run from today; single-person paths from FIRE.
    const baseAge = eff.hasPartner ? eff.currentAge : eff.fireAge;
    return monteCarlo.percentile50.map((p50, i) => ({
      age: baseAge + i,
      p10: monteCarlo.percentile10[i],
      p50,
      p90: monteCarlo.percentile90[i],
    }));
  }, [monteCarlo, eff.fireAge, eff.currentAge, eff.hasPartner]);

  const isLastStep = step === STEPS.length - 1;
  const activeStep = STEPS[step];

  const next = () => {
    if (isLastStep) {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const editInputs = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shareScenario = async () => {
    const hash = encodeShareHash(inputs, autoKeys);
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    window.history.replaceState(null, "", hash);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard may be blocked; the URL is in the address bar regardless.
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 2200);
  };

  const mcButton = (mode: MonteCarloMode | "off", label: string) => (
    <button
      type="button"
      aria-pressed={mcMode === mode}
      onClick={() => setMcMode(mode)}
      className={`-ml-px border px-3 py-1.5 text-sm font-medium transition first:ml-0 ${
        mcMode === mode
          ? "border-ink bg-ink text-paper"
          : "border-line-2 bg-paper text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  if (!showResults) {
    return (
      <main id="hauptinhalt">
        {/* Ink hero band */}
        <section className="bg-ink text-paper">
          <div className="col pt-12 pb-24 sm:pt-16">
            <p className="eyebrow text-brass-soft">Schweizer Frühpensionierung · Brückenrechnung</p>
            <h1 className="display mt-4 text-[clamp(34px,6vw,60px)] text-paper">
              Reicht Ihr Kapital bis zur Pension?
            </h1>
            <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-paper/70">
              In vier Schritten zur Brückenrechnung zwischen Frühpensionierung und dem Zugriff auf
              Säule 3a, Pensionskasse und AHV — inklusive Steuerschätzung pro Kanton.
            </p>
          </div>
        </section>

        {/* The instrument: form card overlapping the masthead. Widens for the
            two-column household layout so both partners sit side by side. */}
        <div className={`${eff.hasPartner ? "col-wide" : "col"} -mt-16 pb-20`}>
          <div className="instrument p-6 sm:p-8">
            <StepProgress steps={STEPS} current={step} onJump={setStep} />

            <div key={activeStep.id} className="animate-rise mt-8">
              <div className="mb-6 flex items-baseline gap-3 border-b border-line pb-4">
                <span className="eyebrow text-brass">{String(step + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="serif text-xl text-ink">{activeStep.title}</h2>
                  <p className="mt-0.5 text-sm text-muted">{activeStep.subtitle}</p>
                </div>
              </div>

              {activeStep.render({ inputs: eff, set, isAuto, toggleAuto })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="eyebrow text-muted transition hover:text-ink disabled:invisible"
              >
                ← Zurück
              </button>
              <button
                type="button"
                onClick={next}
                className="bg-brass px-6 py-3 text-sm font-semibold text-[#1a1205] transition hover:bg-brass-soft"
              >
                {isLastStep ? "Ergebnis berechnen →" : "Weiter →"}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Bildungstool, keine Finanzberatung. Alle Berechnungen laufen lokal in Ihrem Browser.
          </p>
        </div>
      </main>
    );
  }

  const capitalSegments = [
    { label: "Steuerbar", value: taxableAtFire, color: "bg-petrol" },
    { label: "Säule 3a", value: pillar3aAtFire, color: "bg-brass" },
    { label: "Pensionskasse", value: pillar2AtFire, color: "bg-steel" },
  ];

  // Balance-chart milestones on the primary person's age axis. For couples, the
  // partner's milestones are mapped onto that axis and tagged "·P".
  const ptr = eff.partner;
  const toPrimaryAxis = (partnerAge: number) => eff.currentAge + (partnerAge - ptr.currentAge);
  const balanceMarkers: BalanceMilestone[] = [
    { age: eff.fireAge, label: "FIRE", tone: "fire" },
    { age: eff.pillar3aUnlockAge, label: "3a", tone: "default" },
    { age: eff.earliestPkAge, label: "PK", tone: "default" },
    { age: eff.ahvClaimAge, label: "AHV", tone: "default" },
    ...(eff.hasPartner
      ? [
          { age: toPrimaryAxis(ptr.fireAge), label: "FIRE·P", tone: "partner" as const },
          { age: toPrimaryAxis(ptr.pillar3aUnlockAge), label: "3a·P", tone: "partner" as const },
          { age: toPrimaryAxis(ptr.earliestPkAge), label: "PK·P", tone: "partner" as const },
          { age: toPrimaryAxis(ptr.ahvClaimAge), label: "AHV·P", tone: "partner" as const },
        ]
      : []),
  ];

  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col flex flex-wrap items-end justify-between gap-4 pt-12 pb-20 sm:pt-14">
          <div>
            <p className="eyebrow text-brass-soft">Dossier · Ergebnis</p>
            <h1 className="display mt-3 text-[clamp(30px,5vw,48px)] text-paper">Ihre Brückenrechnung</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={shareScenario}
              className="eyebrow border border-paper/30 px-4 py-2.5 text-paper transition hover:bg-paper hover:text-ink"
            >
              {shared ? "Link kopiert ✓" : "Szenario teilen"}
            </button>
            <button
              type="button"
              onClick={editInputs}
              className="eyebrow border border-paper/30 px-4 py-2.5 text-paper transition hover:bg-paper hover:text-ink"
            >
              Eingaben anpassen
            </button>
          </div>
        </div>
      </section>

      <div className="col-wide animate-rise -mt-12 space-y-14 pb-20">
        <ResultsHeadline
          bridgeCapitalRequired={bridgeCapital}
          taxableAtFire={taxableAtFire}
          feasible={!failed}
          failedDuringBridge={failedDuringBridge}
          monteCarloSuccessRate={monteCarlo?.successRate}
        />

        <section className="space-y-5">
          <SectionHeader index="02" title="Vermögen bei FIRE" />
          <p className="max-w-prose text-sm leading-relaxed text-muted">
            Zusammensetzung des projizierten Vermögens zum Ausstieg. In der Brückenphase steht nur das
            steuerbare Vermögen zur Verfügung — Säule 3a und Pensionskasse sind bis zum Bezugsalter gesperrt.
          </p>
          <LedgerBar segments={capitalSegments} />
        </section>

        <section className="space-y-5">
          <SectionHeader index="03" title="Zeitlinie" />
          {eff.hasPartner ? (
            <div className="space-y-4">
              <Lifeline
                title="Sie"
                currentAge={eff.currentAge}
                fireAge={eff.fireAge}
                pillar3aUnlockAge={eff.pillar3aUnlockAge}
                earliestPkAge={eff.earliestPkAge}
                ahvClaimAge={eff.ahvClaimAge}
                horizonAge={eff.horizonAge}
              />
              <Lifeline
                title="Partner:in"
                currentAge={ptr.currentAge}
                fireAge={ptr.fireAge}
                pillar3aUnlockAge={ptr.pillar3aUnlockAge}
                earliestPkAge={ptr.earliestPkAge}
                ahvClaimAge={ptr.ahvClaimAge}
                horizonAge={ptr.currentAge + (eff.horizonAge - eff.currentAge)}
              />
            </div>
          ) : (
            <Lifeline
              currentAge={eff.currentAge}
              fireAge={eff.fireAge}
              pillar3aUnlockAge={eff.pillar3aUnlockAge}
              earliestPkAge={eff.earliestPkAge}
              ahvClaimAge={eff.ahvClaimAge}
              horizonAge={eff.horizonAge}
            />
          )}
        </section>

        <section className="space-y-5">
          <SectionHeader index="04" title="Vermögensverlauf" />
          {eff.hasPartner && (
            <p className="max-w-prose text-sm leading-relaxed text-muted">
              Gezeigt wird das gemeinsame Haushaltsvermögen auf Ihrer Alters-Achse. Mit „·P“ markierte
              Meilensteine gehören zur Partner:in (in Steel), Ihre eigenen in Brass/Grau.
            </p>
          )}
          <BalanceChart data={balanceData} markers={balanceMarkers} baseAge={eff.currentAge} inflation={eff.inflation} />
        </section>

        <section className="space-y-5">
          <SectionHeader index="05" title="Mittelverwendung pro Jahr" />
          <p className="max-w-prose text-sm leading-relaxed text-muted">
            Wie viel Geld wird im Ruhestand jährlich verbraucht und woraus es gedeckt wird. Standardmässig in
            heutiger Kaufkraft (real) — alle Berechnungen laufen real, daher beeinflusst die Teuerung nur die
            optionale nominale Darstellung. Die AHV-Rente reduziert ab Bezug den Eigenbedarf.
          </p>
          <AnnualOutflowChart years={resultYears} baseAge={eff.currentAge} inflation={eff.inflation} />
        </section>

        <section className="space-y-5">
          <SectionHeader
            index="06"
            title="Monte-Carlo"
            action={
              <div className="flex" role="group" aria-label="Monte-Carlo-Modus">
                {mcButton("off", "Aus")}
                {mcButton("parametric", "Parametrisch")}
                {mcButton("historical", "Historisch")}
              </div>
            }
          />
          <p className="max-w-prose text-sm leading-relaxed text-muted">
            Wie robust ist der Plan gegenüber schwankenden Renditen?
            {mcMode === "historical"
              ? " Der historische Modus zieht Renditen aus realen Langfristkennzahlen — Schweizer Aktien & Obligationen (Pictet) und globale Aktien (UBS/DMS) — gemischt nach Aktienquote und Ihrem Schweiz-/Global-Anteil."
              : mcMode === "parametric"
                ? " Der parametrische Modus verwendet Ihre erwartete Rendite und Volatilität (lognormal)."
                : ""}
          </p>
          {monteCarlo && <MonteCarloFan data={fanData} />}
        </section>

        <section className="space-y-5">
          <SectionHeader index="07" title="Jahresverlauf" />
          <p className="max-w-prose text-sm leading-relaxed text-muted">
            Jedes Jahr im Detail — Vermögen je Topf, Renten, AHV-Beiträge und Steuern. Als CSV exportierbar
            zur Weiterverarbeitung in einer Tabellenkalkulation.
          </p>
          <YearTable years={resultYears} baseAge={eff.currentAge} inflation={eff.inflation} />
        </section>

        <section className="space-y-5">
          <SectionHeader index="08" title="Annahmen & Quellen" />
          <AssumptionsPanel
            canton={getCanton(eff.canton)}
            gemeindeName={municipalityByBfs(eff.gemeindeBfs)?.name}
            gemeindeFactor={eff.gemeindeSteuerfuss}
          />
        </section>

        <section className="space-y-5">
          <SectionHeader index="09" title="Anbieter" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AffiliateSlot slot={AFFILIATE_SLOTS.broker} />
            <AffiliateSlot slot={AFFILIATE_SLOTS.pillar3a} />
          </div>
        </section>

        <Disclaimer />
      </div>
    </main>
  );
}
