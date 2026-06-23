import { describe, expect, it } from "vitest";
import { simulateAccumulation } from "../accumulation";
import { PILLAR_2 } from "../constants";

describe("PK projection", () => {
  it("accrues 10% credits on coordinated salary + 1.25% interest for a 35-year-old over N years", () => {
    const currentAge = 35;
    const fireAge = 44; // stays within the 35-44 / 10% credit band throughout
    const salary = 70_000; // coordinated salary = 43,540
    const coordinated = salary - PILLAR_2.coordinationDeduction;

    const result = simulateAccumulation(currentAge, fireAge, {
      currentSalary: salary,
      salaryGrowth: 0, // isolate the PK credit/interest mechanics from salary growth
      currentTaxableBalance: 0,
      annualTaxableSavings: 0,
      currentPillar3aBalance: 0,
      annualPillar3aContribution: 0,
      pillar3aReturn: 0,
      currentPillar2Balance: 0,
      expectedReturn: 0,
    });

    // Manually replicate the expected year-by-year PK projection.
    let expectedPk = 0;
    for (let age = currentAge; age < fireAge; age++) {
      expectedPk = expectedPk * (1 + PILLAR_2.minInterestRate) + coordinated * 0.10;
    }

    expect(result.pillar2AtFire).toBeCloseTo(expectedPk, 2);
  });
});

describe("Accumulation simulator", () => {
  it("grows taxable and 3a balances with contributions and returns", () => {
    const result = simulateAccumulation(30, 32, {
      currentSalary: 80_000,
      salaryGrowth: 0,
      currentTaxableBalance: 10_000,
      annualTaxableSavings: 20_000,
      currentPillar3aBalance: 5_000,
      annualPillar3aContribution: 7_258,
      pillar3aReturn: 0.03,
      currentPillar2Balance: 0,
      expectedReturn: 0.05,
    });

    expect(result.years).toHaveLength(3); // ages 30, 31, 32
    expect(result.taxableAtFire).toBeGreaterThan(10_000 + 20_000 * 2);
    expect(result.pillar3aAtFire).toBeGreaterThan(5_000 + 7_258 * 2);
  });

  it("applies age-banded income phases instead of the flat fields when provided", () => {
    // Two phases: ages 25-29 save 10k/yr, ages 30-34 save 40k/yr. No returns,
    // so the taxable balance is just the sum of the per-year savings.
    const result = simulateAccumulation(25, 35, {
      currentSalary: 0,
      salaryGrowth: 0,
      currentTaxableBalance: 0,
      annualTaxableSavings: 999_999, // must be ignored in favour of phases
      currentPillar3aBalance: 0,
      annualPillar3aContribution: 999_999, // must be ignored
      pillar3aReturn: 0,
      currentPillar2Balance: 0,
      expectedReturn: 0,
      incomePhases: [
        { fromAge: 25, salary: 70_000, annualTaxableSavings: 10_000, annualPillar3aContribution: 5_000 },
        { fromAge: 30, salary: 120_000, annualTaxableSavings: 40_000, annualPillar3aContribution: 7_000 },
      ],
    });

    // 5 years at 10k (ages 25-29) + 5 years at 40k (ages 30-34).
    expect(result.taxableAtFire).toBeCloseTo(5 * 10_000 + 5 * 40_000, 2);
    expect(result.pillar3aAtFire).toBeCloseTo(5 * 5_000 + 5 * 7_000, 2);
  });

  it("projects the PK from an average savings rate on the insured salary when a rate plan is given", () => {
    const currentAge = 40;
    const fireAge = 45;
    const salary = 150_000; // above the mandatory ceiling
    const ceiling = 200_000; // insure the super-mandatory portion too
    const rate = 0.18;
    const insured = salary - 26_460; // coordination deduction; salary < ceiling

    const result = simulateAccumulation(currentAge, fireAge, {
      currentSalary: salary,
      salaryGrowth: 0,
      currentTaxableBalance: 0,
      annualTaxableSavings: 0,
      currentPillar3aBalance: 0,
      annualPillar3aContribution: 0,
      pillar3aReturn: 0,
      currentPillar2Balance: 0,
      expectedReturn: 0,
      pillar2Plan: { model: "rate", savingsRate: rate, insuredCeiling: ceiling, interestRate: 0 },
    });

    // No interest: PK = years * insured salary * rate.
    expect(result.pillar2AtFire).toBeCloseTo((fireAge - currentAge) * insured * rate, 2);
  });

  it("uses an explicit override for the PK balance at FIRE when provided", () => {
    const result = simulateAccumulation(40, 42, {
      currentSalary: 80_000,
      salaryGrowth: 0,
      currentTaxableBalance: 0,
      annualTaxableSavings: 0,
      currentPillar3aBalance: 0,
      annualPillar3aContribution: 0,
      pillar3aReturn: 0,
      currentPillar2Balance: 100_000,
      expectedPillar2BalanceAtFire: 250_000,
      expectedReturn: 0,
    });

    expect(result.pillar2AtFire).toBe(250_000);
  });
});
