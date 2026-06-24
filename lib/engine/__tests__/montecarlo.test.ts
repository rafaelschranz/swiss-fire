import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import type { DecumulationParams } from "../decumulation";
import { MARKET } from "../constants";
import { blendedEquity, simulateMonteCarlo } from "../montecarlo";

function baseParams(overrides: Partial<DecumulationParams> = {}): DecumulationParams {
  return {
    fireAge: 50,
    horizonAge: 90,
    pillar3aUnlockAge: 60,
    earliestPkAge: 58,
    ahvReferenceAge: 65,
    ahvClaimAge: 65,
    ahvAnnualPension: 24_000,
    annualRealSpending: 40_000,
    healthInsuranceAnnualPremium: 5_000,
    maritalStatus: "single",
    canton: CANTONS.SZ,
    expectedReturn: 0.04,
    startingTaxable: 1_000_000,
    startingPillar3a: 150_000,
    startingPillar2: 300_000,
    ...overrides,
  };
}

describe("Equity geography blend", () => {
  it("returns the pure Swiss and pure global figures at the extremes", () => {
    const swissOnly = blendedEquity(1);
    expect(swissOnly.mean).toBeCloseTo(MARKET.equityRealReturn, 10);
    expect(swissOnly.vol).toBeCloseTo(MARKET.equityVolatility, 10);

    const globalOnly = blendedEquity(0);
    expect(globalOnly.mean).toBeCloseTo(MARKET.globalEquityRealReturn, 10);
    expect(globalOnly.vol).toBeCloseTo(MARKET.globalEquityVolatility, 10);
  });

  it("blends the mean linearly and diversifies the volatility below the linear mix", () => {
    const w = 0.4; // 40% Swiss / 60% global
    const blend = blendedEquity(w);
    expect(blend.mean).toBeCloseTo(w * MARKET.equityRealReturn + (1 - w) * MARKET.globalEquityRealReturn, 10);
    // With correlation < 1, the blended vol is below the naive weighted average.
    const linearVol = w * MARKET.equityVolatility + (1 - w) * MARKET.globalEquityVolatility;
    expect(blend.vol).toBeLessThan(linearVol);
  });
});

describe("Monte Carlo: parametric mode", () => {
  it("success rate is monotonic in starting capital", () => {
    const low = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 200_000 }),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "parametric",
      paths: 300,
      seed: 42,
    });
    const high = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 2_000_000 }),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "parametric",
      paths: 300,
      seed: 42,
    });

    expect(high.successRate).toBeGreaterThanOrEqual(low.successRate);
  });

  it("success rate is monotonic in expected return", () => {
    const low = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 700_000, expectedReturn: 0.01 }),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "parametric",
      paths: 300,
      seed: 7,
    });
    const high = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 700_000, expectedReturn: 0.06 }),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "parametric",
      paths: 300,
      seed: 7,
    });

    expect(high.successRate).toBeGreaterThanOrEqual(low.successRate);
  });

  it("returns a success rate and bridge failure rate within [0, 1]", () => {
    const result = simulateMonteCarlo({
      decumulationParams: baseParams(),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "parametric",
      paths: 200,
      seed: 1,
    });

    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(1);
    expect(result.bridgeFailureRate).toBeGreaterThanOrEqual(0);
    expect(result.bridgeFailureRate).toBeLessThanOrEqual(1);
  });

  it("produces ordered percentile fans (p10 <= p50 <= p90) in early years", () => {
    const result = simulateMonteCarlo({
      decumulationParams: baseParams(),
      volatility: 0.15,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "parametric",
      paths: 500,
      seed: 99,
    });

    for (let y = 0; y < result.percentile10.length; y++) {
      expect(result.percentile10[y]).toBeLessThanOrEqual(result.percentile50[y] + 1e-6);
      expect(result.percentile50[y]).toBeLessThanOrEqual(result.percentile90[y] + 1e-6);
    }
  });
});

describe("Monte Carlo: historical (real-data) mode", () => {
  it("runs without error and produces a valid success rate", () => {
    const result = simulateMonteCarlo({
      decumulationParams: baseParams(),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "historical",
      paths: 200,
      seed: 5,
    });

    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(1);
  });

  it("success rate is monotonic in starting capital", () => {
    const low = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 200_000 }),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "historical",
      paths: 300,
      seed: 42,
    });
    const high = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 2_000_000 }),
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "historical",
      paths: 300,
      seed: 42,
    });

    expect(high.successRate).toBeGreaterThanOrEqual(low.successRate);
  });

  it("a higher equity share widens the p10–p90 dispersion (more risk)", () => {
    const conservative = simulateMonteCarlo({
      decumulationParams: baseParams(),
      volatility: 0.12,
      equityShare: 0.2,
      swissEquityShare: 0.4,
      mode: "historical",
      paths: 600,
      seed: 11,
    });
    const aggressive = simulateMonteCarlo({
      decumulationParams: baseParams(),
      volatility: 0.12,
      equityShare: 0.9,
      swissEquityShare: 0.4,
      mode: "historical",
      paths: 600,
      seed: 11,
    });

    const spread = (r: { percentile10: number[]; percentile90: number[] }, y: number) =>
      r.percentile90[y] - r.percentile10[y];
    const y = 5; // a few years in, before depletion truncates paths
    expect(spread(aggressive, y)).toBeGreaterThan(spread(conservative, y));
  });
});

describe("Household Monte Carlo", () => {
  it("runs the household engine over real-data paths and returns valid rates", async () => {
    const { simulateHouseholdMonteCarlo } = await import("../montecarlo");
    const { CANTONS } = await import("../cantons");
    const person = {
      label: "X",
      currentAge: 40,
      fireAge: 58,
      currentSalary: 100_000,
      salaryGrowth: 0,
      annualTaxableSavings: 20_000,
      currentPillar3a: 50_000,
      annualPillar3aContribution: 7_000,
      pillar3aUnlockAge: 60,
      pillar3aTranches: 3,
      currentPillar2: 200_000,
      pillar2Plan: { model: "bvg" as const, savingsRate: 0.15, insuredCeiling: 90_720, interestRate: 0.0125 },
      earliestPkAge: 58,
      pillar2PayoutMode: "capital" as const,
      pillar2CapitalShare: 0.5,
      pillar2ConversionRate: 0.068,
      ahvReferenceAge: 65,
      ahvClaimAge: 65,
      ahvAnnualPension: 24_000,
      healthInsuranceAnnualPremium: 5_000,
    };
    const result = simulateHouseholdMonteCarlo({
      householdParams: {
        primary: person,
        partner: { ...person, currentAge: 38 },
        startingTaxable: 300_000,
        annualRealSpending: 60_000,
        canton: CANTONS.SZ,
        expectedReturn: 0.04,
        pillar3aReturn: 0.02,
        horizonAge: 90,
      },
      volatility: 0.12,
      equityShare: 0.7,
      swissEquityShare: 0.4,
      mode: "historical",
      paths: 200,
      seed: 3,
    });

    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(1);
    // One percentile entry per year from the primary's current age to horizon.
    expect(result.percentile50.length).toBe(90 - 40);
  });
});
