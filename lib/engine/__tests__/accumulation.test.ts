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
