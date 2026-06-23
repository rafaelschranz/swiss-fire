import { PILLAR_2 } from "./constants";
import { coordinatedSalary, retirementCreditRate } from "./tax";
import type { AccumulationInputs, AccumulationResult, AccumulationYearResult, IncomePhase } from "./types";

/**
 * Returns the income phase whose band covers `age`: the phase with the
 * greatest `fromAge` that is still <= age. Ages below the lowest band fall
 * back to the lowest phase, so coverage is always continuous. Assumes
 * `phases` is sorted ascending by `fromAge`.
 */
function activeIncomePhase(phases: IncomePhase[], age: number): IncomePhase {
  let chosen = phases[0];
  for (const phase of phases) {
    if (phase.fromAge <= age) chosen = phase;
  }
  return chosen;
}

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
 *
 * Salary and savings come either from the flat constant-growth fields or,
 * when `inputs.incomePhases` is supplied, from the age-banded schedule.
 */
export function simulateAccumulation(
  currentAge: number,
  fireAge: number,
  inputs: AccumulationInputs,
): AccumulationResult {
  const years: AccumulationYearResult[] = [];

  const phases =
    inputs.incomePhases && inputs.incomePhases.length > 0
      ? [...inputs.incomePhases].sort((a, b) => a.fromAge - b.fromAge)
      : null;

  let taxable = inputs.currentTaxableBalance;
  let pillar3a = inputs.currentPillar3aBalance;
  let pillar2 = inputs.currentPillar2Balance;
  let salary = phases ? activeIncomePhase(phases, currentAge).salary : inputs.currentSalary;

  years.push({ age: currentAge, taxableBalance: taxable, pillar3aBalance: pillar3a, pillar2Balance: pillar2, salary });

  for (let age = currentAge; age < fireAge; age++) {
    const phase = phases ? activeIncomePhase(phases, age) : null;
    const taxableSavings = phase ? phase.annualTaxableSavings : inputs.annualTaxableSavings;
    const pillar3aContribution = phase ? phase.annualPillar3aContribution : inputs.annualPillar3aContribution;
    const salaryThisYear = phase ? phase.salary : salary;

    taxable = taxable * (1 + inputs.expectedReturn) + taxableSavings;
    pillar3a = pillar3a * (1 + inputs.pillar3aReturn) + pillar3aContribution;

    const coordinated = coordinatedSalary(salaryThisYear);
    const creditRate = retirementCreditRate(age + 1);
    pillar2 = pillar2 * (1 + PILLAR_2.minInterestRate) + coordinated * creditRate;

    if (!phases) salary = salary * (1 + inputs.salaryGrowth);
    const recordedSalary = phases ? activeIncomePhase(phases, age + 1).salary : salary;

    years.push({
      age: age + 1,
      taxableBalance: taxable,
      pillar3aBalance: pillar3a,
      pillar2Balance: pillar2,
      salary: recordedSalary,
    });
  }

  return {
    years,
    taxableAtFire: taxable,
    pillar3aAtFire: pillar3a,
    pillar2AtFire: inputs.expectedPillar2BalanceAtFire ?? pillar2,
  };
}
