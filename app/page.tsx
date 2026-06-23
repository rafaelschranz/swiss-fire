"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AffiliateSlot } from "@/components/AffiliateSlot";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import { BalanceChart, type BalancePoint } from "@/components/BalanceChart";
import { Disclaimer } from "@/components/Disclaimer";
import { Lifeline } from "@/components/Lifeline";
import { MonteCarloFan, type FanPoint } from "@/components/MonteCarloFan";
import { ResultsHeadline } from "@/components/ResultsHeadline";
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
    const decPoints = decumulation.years.map((y) => ({
      age: y.age,
      taxable: y.taxableBalance,
      pillar3a: y.pillar3aBalance,
      pillar2: y.pillar2Balance,
    }));
    return [...accPoints, ...decPoints];
  }, [accumulation, decumulation]);

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
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        mcMode === mode
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "border border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-zinc-200/60 bg-white/70 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">🇨🇭</span> Swiss FIRE
          </span>
          <Link
            href="/ratgeber"
            className="text-sm font-medium text-sky-700 underline-offset-4 hover:underline dark:text-sky-400"
          >
            Ratgeber →
          </Link>
        </div>
      </header>

      <main id="hauptinhalt" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {!showResults ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                Reicht Ihr Kapital bis zur Pension?
              </h1>
              <p className="mx-auto mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
                In vier Schritten zur Brückenrechnung zwischen Frühpensionierung und dem Zugriff auf
                Säule 3a, Pensionskasse und AHV.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-8">
              <StepProgress steps={STEPS} current={step} onJump={setStep} />

              <div key={activeStep.id} className="animate-step mt-8">
                <div className="mb-6">
                  <p className="text-3xl" aria-hidden="true">
                    {activeStep.icon}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{activeStep.title}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{activeStep.subtitle}</p>
                </div>

                {activeStep.render({ inputs: eff, set, isAuto, toggleAuto })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:invisible dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-600/20 transition hover:brightness-110 active:scale-[0.98]"
                >
                  {isLastStep ? "Ergebnis berechnen →" : "Weiter →"}
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Bildungstool, keine Finanzberatung. Alle Berechnungen laufen lokal in Ihrem Browser.
            </p>
          </div>
        ) : (
          <div className="animate-step space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Ihre Brückenrechnung</h1>
              <button
                type="button"
                onClick={editInputs}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                ✎ Eingaben anpassen
              </button>
            </div>

            <ResultsHeadline
              bridgeCapitalRequired={bridgeCapitalRequired}
              taxableAtFire={accumulation.taxableAtFire}
              feasible={!decumulation.failed}
              failedDuringBridge={decumulation.failedDuringBridge}
              monteCarloSuccessRate={monteCarlo?.successRate}
            />

            <Lifeline
              currentAge={eff.currentAge}
              fireAge={eff.fireAge}
              pillar3aUnlockAge={eff.pillar3aUnlockAge}
              earliestPkAge={eff.earliestPkAge}
              ahvClaimAge={eff.ahvClaimAge}
              horizonAge={eff.horizonAge}
            />

            <BalanceChart data={balanceData} fireAge={eff.fireAge} />

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Monte-Carlo-Simulation</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Wie robust ist der Plan gegenüber schwankenden Renditen?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Monte-Carlo-Modus">
                  {mcButton("off", "Aus")}
                  {mcButton("parametric", "Parametrisch")}
                  {mcButton("bootstrap", "Bootstrap")}
                </div>
              </div>
              {mcMode === "bootstrap" && (
                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  Verwendet eine synthetische Platzhalter-Renditeserie (noch keine echten historischen Daten).
                </p>
              )}
              {monteCarlo && (
                <div className="mt-4">
                  <MonteCarloFan data={fanData} />
                </div>
              )}
            </div>

            <AssumptionsPanel canton={getCanton(eff.canton)} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AffiliateSlot slot={AFFILIATE_SLOTS.broker} />
              <AffiliateSlot slot={AFFILIATE_SLOTS.pillar3a} />
            </div>

            <Disclaimer />
          </div>
        )}
      </main>
    </>
  );
}
