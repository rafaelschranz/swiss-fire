import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import { computeBridgeCapitalRequired, simulateDecumulation, type DecumulationParams } from "../decumulation";
import { lumpSumTax, nonEmployedAhvContribution } from "../tax";

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

  it("grows the not-yet-withdrawn pension balances during decumulation", () => {
    // FIRE at 50 with a large taxable buffer, so no pillar is drawn in the
    // early years — the locked 3a and PK should compound at their rates.
    const params = baseParams({
      fireAge: 50,
      pillar3aUnlockAge: 60,
      earliestPkAge: 58,
      startingTaxable: 2_000_000,
      startingPillar3a: 100_000,
      startingPillar2: 300_000,
      pillar3aReturn: 0.05,
      pillar2InterestRate: 0.02,
    });

    const result = simulateDecumulation(params);
    const afterTwoYears = result.years[1]; // age 51, two end-of-year compoundings

    expect(afterTwoYears.pillar3aBalance).toBeCloseTo(100_000 * 1.05 ** 2, 0);
    expect(afterTwoYears.pillar2Balance).toBeCloseTo(300_000 * 1.02 ** 2, 0);
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

describe("Pillar 2 payout mode", () => {
  it("annuitises the whole PK into a lifelong Rente in pension mode (no capital withdrawn)", () => {
    const conversionRate = 0.068;
    const startingPillar2 = 300_000;
    const params = baseParams({
      fireAge: 58,
      earliestPkAge: 58,
      pillar3aUnlockAge: 60,
      startingPillar2,
      pillar2PayoutMode: "pension",
      pillar2ConversionRate: conversionRate,
    });

    const result = simulateDecumulation(params);

    // PK is converted at age 58: balance → 0, a lifelong Rente begins, and
    // no PK capital ever lands in the lump-sum tax.
    const atSettlement = result.years.find((y) => y.age === 58)!;
    expect(atSettlement.pillar2Balance).toBe(0);
    expect(atSettlement.pillar2Pension).toBeCloseTo(startingPillar2 * conversionRate, 2);
    // The Rente persists in later years and the PK never triggers lump-sum tax.
    const later = result.years.find((y) => y.age === 70)!;
    expect(later.pillar2Pension).toBeCloseTo(startingPillar2 * conversionRate, 2);
  });

  it("splits capital and Rente in mix mode", () => {
    const conversionRate = 0.068;
    const capitalShare = 0.4;
    const startingPillar2 = 300_000;
    const params = baseParams({
      fireAge: 58,
      earliestPkAge: 58,
      startingPillar2,
      pillar2PayoutMode: "mix",
      pillar2CapitalShare: capitalShare,
      pillar2ConversionRate: conversionRate,
    });

    const result = simulateDecumulation(params);
    const atSettlement = result.years.find((y) => y.age === 58)!;

    expect(atSettlement.pillar2Balance).toBe(0);
    expect(atSettlement.pillar2Pension).toBeCloseTo(startingPillar2 * (1 - capitalShare) * conversionRate, 2);
    expect(atSettlement.lumpSumTax).toBeGreaterThan(0); // the capital share is taxed as a lump sum
  });
});

describe("Staggered Säule 3a withdrawal", () => {
  it("splitting the 3a across accounts withdrawn in separate years lowers total lump-sum tax", () => {
    const base = baseParams({
      fireAge: 60,
      pillar3aUnlockAge: 60,
      startingTaxable: 2_000_000, // ample, so depletion is never the factor
      startingPillar3a: 300_000,
      startingPillar2: 0, // isolate the 3a from any PK settlement
      pillar3aReturn: 0,
    });

    const single = simulateDecumulation({ ...base, pillar3aTranches: 1 });
    const split = simulateDecumulation({ ...base, pillar3aTranches: 3 });

    const totalLumpTax = (r: ReturnType<typeof simulateDecumulation>) =>
      r.years.reduce((s, y) => s + y.lumpSumTax, 0);

    expect(totalLumpTax(single)).toBeGreaterThan(0);
    // Progressive tax: 3 × tax(100k) < tax(300k).
    expect(totalLumpTax(split)).toBeLessThan(totalLumpTax(single));
    // Both fully draw the 3a down to ~0 within the horizon.
    expect(split.years[split.years.length - 1].pillar3aBalance).toBeCloseTo(0, 6);
  });
});

describe("Other net wealth (real estate)", () => {
  it("raises the non-employed AHV contribution and wealth tax, but is not drawable", () => {
    const base = baseParams({
      fireAge: 45,
      ahvClaimAge: 65,
      startingTaxable: 500_000,
      startingPillar3a: 0,
      startingPillar2: 0,
    });
    const without = simulateDecumulation(base).years[0];
    const withProperty = simulateDecumulation({ ...base, otherNetWealth: 1_000_000 }).years[0];

    // Property raises the AHV-on-wealth basis and the wealth tax...
    expect(withProperty.ahvNonEmployedContribution).toBeGreaterThan(without.ahvNonEmployedContribution);
    expect(withProperty.wealthTax).toBeGreaterThan(without.wealthTax);
    // ...but does not add to the liquid (drawable) taxable balance.
    expect(withProperty.taxableBalance).toBeLessThan(without.taxableBalance); // slightly lower due to extra tax
  });
});

describe("Non-employed AHV basis (wealth only, no spending proxy)", () => {
  it("bases the contribution on wealth + actual pension income, not on spending", () => {
    const params = baseParams({
      fireAge: 45,
      ahvClaimAge: 65, // no pension income in the first bridge year
      startingTaxable: 1_000_000,
      startingPillar3a: 0,
      startingPillar2: 0,
    });
    const firstYear = simulateDecumulation(params).years[0]; // age 45, taxable = 1.0M, no pension
    // Contribution is the wealth-only figure (with the 5% admin surcharge baked in),
    // NOT inflated by 20× spending.
    expect(firstYear.ahvNonEmployedContribution).toBeCloseTo(nonEmployedAhvContribution(1_000_000, 0, "single"), 0);
  });

  it("exposes the per-year funding split (pensions, employment, portfolio draw)", () => {
    const y = simulateDecumulation(baseParams())
      .years.find((r) => r.age === 70)!; // AHV flowing by 70
    expect(y.ahvPension).toBeGreaterThan(0);
    expect(typeof y.netWithdrawal).toBe("number");
    expect(typeof y.employmentIncome).toBe("number");
  });
});

describe("Post-FIRE residual employment", () => {
  it("waives the non-employed AHV contribution while earning enough, and reinstates it after", () => {
    // Early retiree (FIRE 50), below AHV reference age, would owe the
    // non-employed contribution — but works part-time until 60.
    const params = baseParams({
      fireAge: 50,
      ahvClaimAge: 65,
      startingTaxable: 2_000_000, // large wealth → sizeable would-be contribution
      startingPillar3a: 0,
      startingPillar2: 0,
      postFireIncome: 60_000,
      postFireWorkUntilAge: 60,
    });

    const result = simulateDecumulation(params);
    const at55 = result.years.find((y) => y.age === 55)!; // still working
    const at62 = result.years.find((y) => y.age === 62)!; // stopped, still < reference age

    expect(at55.ahvNonEmployedContribution).toBe(0); // waived while working enough
    expect(at62.ahvNonEmployedContribution).toBeGreaterThan(0); // reinstated after work ends
  });

  it("does not waive the contribution when the residual income is too small", () => {
    const params = baseParams({
      fireAge: 50,
      ahvClaimAge: 65,
      startingTaxable: 2_000_000,
      startingPillar3a: 0,
      startingPillar2: 0,
      postFireIncome: 5_000, // 10.6% × 5000 = 530 < half the would-be contribution
      postFireWorkUntilAge: 60,
    });

    const at55 = simulateDecumulation(params).years.find((y) => y.age === 55)!;
    expect(at55.ahvNonEmployedContribution).toBeGreaterThan(0);
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
