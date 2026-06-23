import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import type { DecumulationParams } from "../decumulation";
import { simulateMonteCarlo } from "../montecarlo";

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

describe("Monte Carlo: parametric mode", () => {
  it("success rate is monotonic in starting capital", () => {
    const low = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 200_000 }),
      volatility: 0.12,
      equityShare: 0.7,
      mode: "parametric",
      paths: 300,
      seed: 42,
    });
    const high = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 2_000_000 }),
      volatility: 0.12,
      equityShare: 0.7,
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
      mode: "parametric",
      paths: 300,
      seed: 7,
    });
    const high = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 700_000, expectedReturn: 0.06 }),
      volatility: 0.12,
      equityShare: 0.7,
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

describe("Monte Carlo: bootstrap mode", () => {
  it("runs without error and produces a valid success rate", () => {
    const result = simulateMonteCarlo({
      decumulationParams: baseParams(),
      volatility: 0.12,
      equityShare: 0.7,
      mode: "bootstrap",
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
      mode: "bootstrap",
      paths: 300,
      seed: 42,
    });
    const high = simulateMonteCarlo({
      decumulationParams: baseParams({ startingTaxable: 2_000_000 }),
      volatility: 0.12,
      equityShare: 0.7,
      mode: "bootstrap",
      paths: 300,
      seed: 42,
    });

    expect(high.successRate).toBeGreaterThanOrEqual(low.successRate);
  });
});
