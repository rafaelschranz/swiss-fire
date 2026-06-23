import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import { computeBridgeCapitalRequired, simulateDecumulation, type DecumulationParams } from "../decumulation";
import { lumpSumTax } from "../tax";

function baseParams(overrides: Partial<DecumulationParams> = {}): DecumulationParams {
  return {
    fireAge: 45,
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
    expectedReturn: 0.03,
    startingTaxable: 1_000_000,
    startingPillar3a: 150_000,
    startingPillar2: 300_000,
    ...overrides,
  };
}

describe("Decumulation bridge failure", () => {
  it("reports failure during the bridge when taxable assets deplete before any pillar unlocks", () => {
    const params = baseParams({
      startingTaxable: 50_000, // far too small to bridge to age 58/60
      startingPillar3a: 0,
      startingPillar2: 0,
      annualRealSpending: 60_000,
    });

    const result = simulateDecumulation(params);

    expect(result.failed).toBe(true);
    expect(result.failedDuringBridge).toBe(true);
  });

  it("does not report failure when assets comfortably cover the full horizon", () => {
    const result = simulateDecumulation(baseParams());
    expect(result.failed).toBe(false);
  });

  it("reports failure when an unlocked pillar only partially covers the shortfall", () => {
    // No bridge (FIRE at/after first unlock), tiny taxable, and a pillar
    // balance smaller than a single year's grossed-up shortfall: the draw
    // is capped by the balance, so the shortfall is only partially met.
    const result = simulateDecumulation(
      baseParams({
        fireAge: 60,
        pillar3aUnlockAge: 60,
        earliestPkAge: 58,
        startingTaxable: 10_000,
        startingPillar3a: 0,
        startingPillar2: 30_000,
        annualRealSpending: 40_000,
      }),
    );

    expect(result.failed).toBe(true);
    expect(result.failedDuringBridge).toBe(false); // failure happens after unlock, not in the bridge
  });
});

describe("Bridge capital required", () => {
  it("is positive when FIRE happens before the first pillar unlock", () => {
    const required = computeBridgeCapitalRequired(baseParams({ fireAge: 45 }));
    expect(required).toBeGreaterThan(0);
  });

  it("is zero when FIRE happens at or after the first pillar unlock", () => {
    const required = computeBridgeCapitalRequired(baseParams({ fireAge: 60 }));
    expect(required).toBe(0);
  });
});

describe("Tax-optimal withdrawal sequencing", () => {
  it("staggering pillar withdrawals across separate years costs less lump-sum tax than one combined same-year withdrawal", () => {
    // Force two distinct shortfall years that each draw a lump from a
    // different pillar by depleting taxable right as each pillar unlocks.
    const params = baseParams({
      fireAge: 56,
      startingTaxable: 250_000,
      startingPillar3a: 120_000,
      startingPillar2: 150_000,
      annualRealSpending: 45_000,
      ahvClaimAge: 65,
    });

    const result = simulateDecumulation(params);
    const totalLumpSumTaxPaid = result.years.reduce((sum, y) => sum + y.lumpSumTax, 0);
    const totalDrawn =
      params.startingPillar3a +
      params.startingPillar2 -
      result.years[result.years.length - 1].pillar3aBalance -
      result.years[result.years.length - 1].pillar2Balance;

    // What a single same-year combined withdrawal of the same total would have cost.
    const combinedYearTax = lumpSumTax(params.canton, totalDrawn);

    expect(totalLumpSumTaxPaid).toBeGreaterThan(0);
    expect(totalLumpSumTaxPaid).toBeLessThan(combinedYearTax);
  });
});
