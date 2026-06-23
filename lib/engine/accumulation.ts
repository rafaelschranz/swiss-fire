import { PILLAR_2 } from "./constants";
import { coordinatedSalary, retirementCreditRate } from "./tax";
import type { AccumulationInputs, AccumulationResult, AccumulationYearResult } from "./types";

/**
 * Year-by-year accumulation simulator from currentAge to fireAge.
 *
 * All figures are in real (inflation-adjusted) terms. Each year: balances
 * grow at their respective expected return, then that year's contribution
 * is added (contribute-at-year-end convention). PK balance is projected
 * from coordinated salary x age-banded retirement credit + minimum BVG
 * interest unless the caller supplies `expectedPillar2BalanceAtFire`, in
 * which case that value is used directly at FIRE (PK balances are still
 * tracked through the loop using salary-based projection for any UI
 * progress display, but `pillar2AtFire` is overridden).
 */
export function simulateAccumulation(
  currentAge: number,
  fireAge: number,
  inputs: AccumulationInputs,
): AccumulationResult {
  const years: AccumulationYearResult[] = [];

  let taxable = inputs.currentTaxableBalance;
  let pillar3a = inputs.currentPillar3aBalance;
  let pillar2 = inputs.currentPillar2Balance;
  let salary = inputs.currentSalary;

  years.push({ age: currentAge, taxableBalance: taxable, pillar3aBalance: pillar3a, pillar2Balance: pillar2, salary });

  for (let age = currentAge; age < fireAge; age++) {
    taxable = taxable * (1 + inputs.expectedReturn) + inputs.annualTaxableSavings;
    pillar3a = pillar3a * (1 + inputs.pillar3aReturn) + inputs.annualPillar3aContribution;

    const coordinated = coordinatedSalary(salary);
    const creditRate = retirementCreditRate(age + 1);
    pillar2 = pillar2 * (1 + PILLAR_2.minInterestRate) + coordinated * creditRate;

    salary = salary * (1 + inputs.salaryGrowth);

    years.push({
      age: age + 1,
      taxableBalance: taxable,
      pillar3aBalance: pillar3a,
      pillar2Balance: pillar2,
      salary,
    });
  }

  return {
    years,
    taxableAtFire: taxable,
    pillar3aAtFire: pillar3a,
    pillar2AtFire: inputs.expectedPillar2BalanceAtFire ?? pillar2,
  };
}
