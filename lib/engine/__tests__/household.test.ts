import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import { simulateHousehold, type HouseholdParams, type HouseholdPerson } from "../household";

function person(overrides: Partial<HouseholdPerson> = {}): HouseholdPerson {
  return {
    label: "X",
    currentAge: 40,
    fireAge: 55,
    currentSalary: 0,
    salaryGrowth: 0,
    annualTaxableSavings: 0,
    currentPillar3a: 0,
    annualPillar3aContribution: 0,
    pillar3aUnlockAge: 60,
    pillar3aTranches: 1,
    currentPillar2: 0,
    pillar2Plan: { model: "bvg", savingsRate: 0.15, insuredCeiling: 90_720, interestRate: 0 },
    earliestPkAge: 58,
    pillar2PayoutMode: "capital",
    pillar2CapitalShare: 0.5,
    pillar2ConversionRate: 0.068,
    ahvReferenceAge: 65,
    ahvClaimAge: 65,
    ahvAnnualPension: 0,
    healthInsuranceAnnualPremium: 0,
    ...overrides,
  };
}

function baseParams(overrides: Partial<HouseholdParams> = {}): HouseholdParams {
  return {
    primary: person(),
    partner: person(),
    startingTaxable: 1_000_000,
    annualRealSpending: 40_000,
    canton: CANTONS.SZ,
    expectedReturn: 0,
    pillar3aReturn: 0,
    horizonAge: 95,
    ...overrides,
  };
}

describe("Household pots", () => {
  it("reports household 3a and PK balances as the sum of both partners' pots", () => {
    const result = simulateHousehold(
      baseParams({
        primary: person({ currentAge: 40, fireAge: 42, currentPillar3a: 30_000, annualPillar3aContribution: 7_000 }),
        partner: person({ currentAge: 40, fireAge: 42, currentPillar3a: 10_000, annualPillar3aContribution: 5_000 }),
        horizonAge: 50,
      }),
    );

    // First year (both working, no returns): each 3a grows by its contribution.
    const firstYear = result.years[0];
    expect(firstYear.pillar3aBalance).toBeCloseTo(30_000 + 7_000 + (10_000 + 5_000), 2);
  });
});

describe("Non-employed AHV (AHV on wealth)", () => {
  it("exempts the household while one partner is still working", () => {
    const result = simulateHousehold(
      baseParams({
        primary: person({ currentAge: 60, fireAge: 60, ahvReferenceAge: 65 }), // retired now
        partner: person({ currentAge: 60, fireAge: 65, currentSalary: 100_000, ahvReferenceAge: 65 }), // still working
        horizonAge: 70,
      }),
    );

    // Primary is retired and below reference age, but the working partner covers
    // the household — so no non-employed contribution in the first year.
    expect(result.years[0].ahvNonEmployedContribution).toBe(0);
  });

  it("charges both partners once both are retired and below the reference age", () => {
    const result = simulateHousehold(
      baseParams({
        primary: person({ currentAge: 60, fireAge: 60, ahvReferenceAge: 65 }),
        partner: person({ currentAge: 60, fireAge: 60, ahvReferenceAge: 65 }),
        horizonAge: 70,
      }),
    );

    // Both retired, both below 65: the wealth-based contribution applies.
    expect(result.years[0].ahvNonEmployedContribution).toBeGreaterThan(0);
  });
});

describe("Accumulation phase", () => {
  it("does not draw down the portfolio while both partners are still working", () => {
    // Both work until 60 and save; the household must not deplete during the
    // working years (regression: living costs were wrongly drawn from the pot
    // before retirement, depleting it in the 40s).
    const result = simulateHousehold(
      baseParams({
        primary: person({ currentAge: 35, fireAge: 60, currentSalary: 110_000, annualTaxableSavings: 25_000 }),
        partner: person({ currentAge: 35, fireAge: 60, currentSalary: 90_000, annualTaxableSavings: 15_000 }),
        startingTaxable: 120_000,
        annualRealSpending: 58_000,
        horizonAge: 90,
      }),
    );

    // The taxable pot grows through the working years rather than depleting.
    const at40 = result.years.find((y) => y.age === 40)!;
    const at55 = result.years.find((y) => y.age === 55)!;
    expect(at55.taxableBalance).toBeGreaterThan(at40.taxableBalance);
    expect(at55.depleted).toBe(false);
  });
});

describe("Income phases", () => {
  it("uses a person's age-banded income phases instead of the flat fields", () => {
    const result = simulateHousehold(
      baseParams({
        primary: person({
          currentAge: 30,
          fireAge: 40,
          annualTaxableSavings: 999_999, // must be ignored in favour of phases
          incomePhases: [
            { fromAge: 30, salary: 80_000, annualTaxableSavings: 10_000, annualPillar3aContribution: 0 },
            { fromAge: 35, salary: 100_000, annualTaxableSavings: 20_000, annualPillar3aContribution: 0 },
          ],
        }),
        partner: person({ currentAge: 30, fireAge: 40, annualTaxableSavings: 0 }),
        startingTaxable: 0,
        annualRealSpending: 0,
        expectedReturn: 0,
        pillar3aReturn: 0,
        horizonAge: 41,
      }),
    );

    // 5 years at 10k (30-34) + 5 years at 20k (35-39), no returns/spend = 150k
    // (SZ levies ~no wealth tax below 250k and negligible tax on tiny dividends)
    // — and far below what the ignored flat 999_999 field would have produced.
    const at39 = result.years.find((y) => y.age === 39)!;
    expect(at39.taxableBalance).toBeGreaterThan(145_000);
    expect(at39.taxableBalance).toBeLessThanOrEqual(150_000);
  });
});

describe("Independent retirement timing", () => {
  it("keeps the still-working partner contributing to the taxable pot after the primary retires", () => {
    const withWorkingPartner = simulateHousehold(
      baseParams({
        primary: person({ currentAge: 55, fireAge: 55 }),
        partner: person({ currentAge: 45, fireAge: 65, currentSalary: 120_000, annualTaxableSavings: 30_000 }),
        startingTaxable: 500_000,
        annualRealSpending: 50_000,
        horizonAge: 70,
      }),
    );
    const idlePartner = simulateHousehold(
      baseParams({
        primary: person({ currentAge: 55, fireAge: 55 }),
        partner: person({ currentAge: 45, fireAge: 45, currentSalary: 120_000, annualTaxableSavings: 30_000 }),
        startingTaxable: 500_000,
        annualRealSpending: 50_000,
        horizonAge: 70,
      }),
    );

    // The partner who keeps working adds savings, so the household taxable
    // balance a few years into the primary's retirement is higher.
    const balAt = (r: ReturnType<typeof simulateHousehold>, age: number) =>
      r.years.find((y) => y.age === age)!.taxableBalance;
    expect(balAt(withWorkingPartner, 60)).toBeGreaterThan(balAt(idlePartner, 60));
  });
});
