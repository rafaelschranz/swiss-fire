"use client";

import { useMemo, useState } from "react";

import { AffiliateSlot } from "@/components/AffiliateSlot";
import { AssumptionsPanel } from "@/components/AssumptionsPanel";
import { BalanceChart, type BalancePoint } from "@/components/BalanceChart";
import { Disclaimer } from "@/components/Disclaimer";
import { InputsPanel, type CalculatorInputs } from "@/components/InputsPanel";
import { Lifeline } from "@/components/Lifeline";
import { MonteCarloFan, type FanPoint } from "@/components/MonteCarloFan";
import { ResultsHeadline } from "@/components/ResultsHeadline";
import { AFFILIATE_SLOTS } from "@/lib/affiliates";
import { getCanton } from "@/lib/engine/cantons";
import { simulateAccumulation } from "@/lib/engine/accumulation";
import { computeBridgeCapitalRequired, simulateDecumulation, type DecumulationParams } from "@/lib/engine/decumulation";
import { simulateMonteCarlo, type MonteCarloMode } from "@/lib/engine/montecarlo";

const DEFAULT_INPUTS: CalculatorInputs = {
  currentAge: 35,
  fireAge: 55,
  horizonAge: 95,
  maritalStatus: "single",
  canton: "ZH",

  currentSalary: 110_000,
  salaryGrowth: 0.01,
  currentTaxableBalance: 80_000,
  annualTaxableSavings: 25_000,
  currentPillar3aBalance: 40_000,
  annualPillar3aContribution: 7_258,
  pillar3aReturn: 0.04,
  currentPillar2Balance: 90_000,

  pillar3aUnlockAge: 60,
  earliestPkAge: 58,
  ahvReferenceAge: 65,
  ahvClaimAge: 65,
  ahvAnnualPension: 24_000,

  annualRealSpending: 48_000,
  healthInsuranceAnnualPremium: 5_000,

  expectedReturn: 0.04,
  volatility: 0.12,
  equityShare: 0.7,
};

function buildDecumulationParams(inputs: CalculatorInputs, startingTaxable: number, startingPillar3a: number, startingPillar2: number): DecumulationParams {
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
  const [mcMode, setMcMode] = useState<MonteCarloMode | "off">("off");

  const accumulation = useMemo(
    () =>
      simulateAccumulation(inputs.currentAge, inputs.fireAge, {
        currentSalary: inputs.currentSalary,
        salaryGrowth: inputs.salaryGrowth,
        currentTaxableBalance: inputs.currentTaxableBalance,
        annualTaxableSavings: inputs.annualTaxableSavings,
        currentPillar3aBalance: inputs.currentPillar3aBalance,
        annualPillar3aContribution: inputs.annualPillar3aContribution,
        pillar3aReturn: inputs.pillar3aReturn,
        currentPillar2Balance: inputs.currentPillar2Balance,
        expectedReturn: inputs.expectedReturn,
      }),
    [inputs],
  );

  const decumulationParams = useMemo(
    () => buildDecumulationParams(inputs, accumulation.taxableAtFire, accumulation.pillar3aAtFire, accumulation.pillar2AtFire),
    [inputs, accumulation],
  );

  const decumulation = useMemo(() => simulateDecumulation(decumulationParams), [decumulationParams]);
  const bridgeCapitalRequired = useMemo(() => computeBridgeCapitalRequired(decumulationParams), [decumulationParams]);

  const monteCarlo = useMemo(() => {
    if (mcMode === "off") return null;
    return simulateMonteCarlo({
      decumulationParams,
      volatility: inputs.volatility,
      equityShare: inputs.equityShare,
      mode: mcMode,
      paths: 500,
    });
  }, [mcMode, decumulationParams, inputs.volatility, inputs.equityShare]);

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
      age: inputs.fireAge + i,
      p10: monteCarlo.percentile10[i],
      p50,
      p90: monteCarlo.percentile90[i],
    }));
  }, [monteCarlo, inputs.fireAge]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Swiss FIRE Brücken-Rechner
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Modelliert die Brückenphase zwischen FIRE-Ausstieg und dem Zugriff auf Säule 3a, Pensionskasse
          und AHV — inklusive Steuerschätzung pro Kanton.
        </p>
      </header>

      <Disclaimer />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <InputsPanel inputs={inputs} onChange={setInputs} />

        <div className="space-y-6">
          <Lifeline
            currentAge={inputs.currentAge}
            fireAge={inputs.fireAge}
            pillar3aUnlockAge={inputs.pillar3aUnlockAge}
            earliestPkAge={inputs.earliestPkAge}
            ahvClaimAge={inputs.ahvClaimAge}
            horizonAge={inputs.horizonAge}
          />

          <ResultsHeadline
            bridgeCapitalRequired={bridgeCapitalRequired}
            taxableAtFire={accumulation.taxableAtFire}
            feasible={!decumulation.failed}
            failedDuringBridge={decumulation.failedDuringBridge}
            monteCarloSuccessRate={monteCarlo?.successRate}
          />

          <BalanceChart data={balanceData} fireAge={inputs.fireAge} />

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Monte-Carlo-Simulation</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMcMode("off")}
                className={`rounded-md px-3 py-1.5 text-sm ${mcMode === "off" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700"}`}
              >
                Aus
              </button>
              <button
                type="button"
                onClick={() => setMcMode("parametric")}
                className={`rounded-md px-3 py-1.5 text-sm ${mcMode === "parametric" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700"}`}
              >
                Parametrisch
              </button>
              <button
                type="button"
                onClick={() => setMcMode("bootstrap")}
                className={`rounded-md px-3 py-1.5 text-sm ${mcMode === "bootstrap" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border border-zinc-300 dark:border-zinc-700"}`}
              >
                Block-Bootstrap (synthetisch)
              </button>
            </div>
            {mcMode === "bootstrap" && (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Verwendet eine synthetische Platzhalter-Renditeserie (data/returns/proxy-returns.ts), keine
                echten historischen Daten.
              </p>
            )}
          </div>

          {monteCarlo && <MonteCarloFan data={fanData} />}

          <AssumptionsPanel canton={getCanton(inputs.canton)} />

          <AffiliateSlot slot={AFFILIATE_SLOTS.broker} />
          <AffiliateSlot slot={AFFILIATE_SLOTS.pillar3a} />
        </div>
      </div>
    </div>
  );
}
