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
