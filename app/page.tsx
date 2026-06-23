"use client";

import { useMemo, useState } from "react";

import { AffiliateSlot } from "@/components/AffiliateSlot";
import { AnnualOutflowChart } from "@/components/AnnualOutflowChart";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import { BalanceChart, type BalancePoint } from "@/components/BalanceChart";
import { Disclaimer } from "@/components/Disclaimer";
import { Lifeline } from "@/components/Lifeline";
import { MonteCarloFan, type FanPoint } from "@/components/MonteCarloFan";
import { ResultsHeadline } from "@/components/ResultsHeadline";
import { LedgerBar } from "@/components/ui/LedgerBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StepProgress } from "@/components/wizard/StepProgress";
import { STEPS } from "@/components/wizard/steps";
import { AFFILIATE_SLOTS } from "@/lib/affiliates";
import { simulateAccumulation } from "@/lib/engine/accumulation";
import { getCanton } from "@/lib/engine/cantons";
import { computeBridgeCapitalRequired, simulateDecumulation, type DecumulationParams } from "@/lib/engine/decumulation";
import { simulateMonteCarlo, type MonteCarloMode } from "@/lib/engine/montecarlo";
import { applyEstimates, ESTIMABLE_ORDER, type EstimableKey } from "@/lib/estimates";
import { DEFAULT_INPUTS, type CalculatorInputs } from "@/lib/inputs";

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

  // Effective inputs: manual values, with estimated fields resolved. This
  // is what both the engine and the displayed field values use.
  const eff = useMemo(() => applyEstimates(inputs, autoKeys), [inputs, autoKeys]);

  const set = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const isAuto = (key: EstimableKey) => autoKeys.has(key);

  const toggleAuto = (key: EstimableKey) => {
    const wasAuto = autoKeys.has(key);
    if (wasAuto) {
      // Switching to manual: seed the editable value with the current estimate.
      const seeded = eff[key];
      setInputs((prev) => ({ ...prev, [key]: seeded }));
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
  const bridgeCapitalRequired = useMemo(() => computeBridgeCapitalRequired(decumulationParams), [decumulationParams]);

  const monteCarlo = useMemo(() => {
    if (mcMode === "off") return null;
    return simulateMonteCarlo({
      decumulationParams,
      volatility: eff.volatility,
      equityShare: eff.equityShare,
      mode: mcMode,
      paths: 500,
    });
  }, [mcMode, decumulationParams, eff.volatility, eff.equityShare]);

  const balanceData: BalancePoint[] = useMemo(() => {
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
  }, [accumulation, decumulation, eff.fireAge]);

  const fanData: FanPoint[] = useMemo(() => {
    if (!monteCarlo) return [];
    return monteCarlo.percentile50.map((p50, i) => ({
      age: eff.fireAge + i,
      p10: monteCarlo.percentile10[i],
      p50,
      p90: monteCarlo.percentile90[i],
    }));
  }, [monteCarlo, eff.fireAge]);

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

        {/* The instrument: form card overlapping the masthead */}
        <div className="col -mt-16 pb-20">
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
    { label: "Steuerbar", value: accumulation.taxableAtFire, color: "bg-petrol" },
    { label: "Säule 3a", value: accumulation.pillar3aAtFire, color: "bg-brass" },
    { label: "Pensionskasse", value: accumulation.pillar2AtFire, color: "bg-steel" },
  ];

  return (
    <main id="hauptinhalt">
      <section className="bg-ink text-paper">
        <div className="col flex flex-wrap items-end justify-between gap-4 pt-12 pb-20 sm:pt-14">
          <div>
            <p className="eyebrow text-brass-soft">Dossier · Ergebnis</p>
            <h1 className="display mt-3 text-[clamp(30px,5vw,48px)] text-paper">Ihre Brückenrechnung</h1>
          </div>
          <button
            type="button"
            onClick={editInputs}
            className="eyebrow border border-paper/30 px-4 py-2.5 text-paper transition hover:bg-paper hover:text-ink"
          >
            Eingaben anpassen
          </button>
        </div>
      </section>

      <div className="col-wide animate-rise -mt-12 space-y-14 pb-20">
        <ResultsHeadline
          bridgeCapitalRequired={bridgeCapitalRequired}
          taxableAtFire={accumulation.taxableAtFire}
          feasible={!decumulation.failed}
          failedDuringBridge={decumulation.failedDuringBridge}
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
          <Lifeline
            currentAge={eff.currentAge}
            fireAge={eff.fireAge}
            pillar3aUnlockAge={eff.pillar3aUnlockAge}
            earliestPkAge={eff.earliestPkAge}
            ahvClaimAge={eff.ahvClaimAge}
            horizonAge={eff.horizonAge}
          />
        </section>

        <section className="space-y-5">
          <SectionHeader index="04" title="Vermögensverlauf" />
          <BalanceChart
            data={balanceData}
            markers={{
              fireAge: eff.fireAge,
              pillar3aUnlockAge: eff.pillar3aUnlockAge,
              earliestPkAge: eff.earliestPkAge,
              ahvClaimAge: eff.ahvClaimAge,
            }}
          />
        </section>

        <section className="space-y-5">
          <SectionHeader index="05" title="Mittelverwendung pro Jahr" />
          <p className="max-w-prose text-sm leading-relaxed text-muted">
            Wie viel Geld wird im Ruhestand jährlich verbraucht — in nominalen Franken inklusive Teuerung,
            damit die reale Brückenrechnung greifbar wird. Die AHV-Rente reduziert ab Bezug den Eigenbedarf.
          </p>
          <AnnualOutflowChart years={decumulation.years} baseAge={eff.currentAge} inflation={eff.inflation} />
        </section>

        <section className="space-y-5">
          <SectionHeader
            index="06"
            title="Monte-Carlo"
            action={
              <div className="flex" role="group" aria-label="Monte-Carlo-Modus">
                {mcButton("off", "Aus")}
                {mcButton("parametric", "Parametrisch")}
                {mcButton("bootstrap", "Bootstrap")}
              </div>
            }
          />
          <p className="max-w-prose text-sm leading-relaxed text-muted">
            Wie robust ist der Plan gegenüber schwankenden Renditen?
            {mcMode === "bootstrap" &&
              " Der Bootstrap-Modus verwendet eine synthetische Platzhalter-Renditeserie (noch keine echten historischen Daten)."}
          </p>
          {monteCarlo && <MonteCarloFan data={fanData} />}
        </section>

        <section className="space-y-5">
          <SectionHeader index="07" title="Annahmen & Quellen" />
          <AssumptionsPanel canton={getCanton(eff.canton)} />
        </section>

        <section className="space-y-5">
          <SectionHeader index="08" title="Anbieter" />
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
