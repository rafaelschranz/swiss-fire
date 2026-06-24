import { PILLAR_2 } from "./constants";
import { insuredSalary, retirementCreditRate } from "./tax";
import type {
  AccumulationInputs,
  AccumulationResult,
  AccumulationYearResult,
  IncomePhase,
  OneOffInflow,
} from "./types";

/** Sum of one-off inflows credited exactly at `age`. */
export function inflowAt(inflows: OneOffInflow[] | undefined, age: number): number {
  if (!inflows) return 0;
  return inflows.reduce((sum, f) => (f.age === age ? sum + f.amount : sum), 0);
}

/**
 * Returns the income phase whose band covers `age`: the phase with the
 * greatest `fromAge` that is still <= age. Ages below the lowest band fall
 * back to the lowest phase, so coverage is always continuous. Assumes
 * `phases` is sorted ascending by `fromAge`.
 */
export function activeIncomePhase(phases: IncomePhase[], age: number): IncomePhase {
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

  const plan = inputs.pillar2Plan;
  // The configurable insured-salary ceiling only applies to a flat-rate plan
  // (modelling super-mandatory coverage). The statutory BVG model is always
  // bound to the mandatory ceiling.
  const pkCeiling = plan && plan.model === "rate" ? plan.insuredCeiling : PILLAR_2.upperInsuredSalaryLimit;
  const pkInterest = plan?.interestRate ?? PILLAR_2.minInterestRate;

  let taxable = inputs.currentTaxableBalance + inflowAt(inputs.oneOffInflows, currentAge);
  let pillar3a = inputs.currentPillar3aBalance;
  let pillar2 = inputs.currentPillar2Balance;
  let salary = phases ? activeIncomePhase(phases, currentAge).salary : inputs.currentSalary;

  years.push({ age: currentAge, taxableBalance: taxable, pillar3aBalance: pillar3a, pillar2Balance: pillar2, salary });

  for (let age = currentAge; age < fireAge; age++) {
    const phase = phases ? activeIncomePhase(phases, age) : null;
    const taxableSavings = phase ? phase.annualTaxableSavings : inputs.annualTaxableSavings;
    const pillar3aContribution = phase ? phase.annualPillar3aContribution : inputs.annualPillar3aContribution;
    const salaryThisYear = phase ? phase.salary : salary;

    taxable = taxable * (1 + inputs.expectedReturn) + taxableSavings + inflowAt(inputs.oneOffInflows, age + 1);
    pillar3a = pillar3a * (1 + inputs.pillar3aReturn) + pillar3aContribution;

    // PK savings credit: a flat average savings rate (if a "rate" plan is
    // given) or the statutory age-banded BVG credits, applied to the
    // insured salary — so the PK scales with the salary trajectory.
    const insured = insuredSalary(salaryThisYear, pkCeiling);
    const creditRate = plan?.model === "rate" ? plan.savingsRate : retirementCreditRate(age + 1);
    pillar2 = pillar2 * (1 + pkInterest) + insured * creditRate;

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
