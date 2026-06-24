import { AHV, DEFAULTS, FEDERAL_INCOME_TAX, PILLAR_2, PILLAR_3A } from "./constants";
import type { CantonTaxData } from "./types";

/**
 * Direct federal income tax (direkte Bundessteuer) on taxable income, using the
 * exact 2026 ESTV tariff. Walks the cumulative bracket table: tax at the bracket
 * threshold plus the marginal rate on the excess. The federal tax is national —
 * there is no municipal multiplier.
 */
export function federalIncomeTax(taxableIncome: number, married: boolean): number {
  if (taxableIncome <= 0) return 0;
  const table = married ? FEDERAL_INCOME_TAX.married : FEDERAL_INCOME_TAX.single;
  let bracket = table[0];
  for (const row of table) {
    if (row[0] <= taxableIncome) bracket = row;
    else break;
  }
  const [threshold, baseTax, marginalPercent] = bracket;
  return baseTax + (taxableIncome - threshold) * (marginalPercent / 100);
}

/**
 * Federal tax on a one-off capital benefit (3a / Pillar 2 lump sum): one-fifth
 * of the ordinary federal tariff applied to the amount (Art. 38 DBG).
 */
export function federalCapitalTax(amount: number, married: boolean): number {
  if (amount <= 0) return 0;
  return federalIncomeTax(amount, married) * FEDERAL_INCOME_TAX.capitalFraction;
}

/**
 * Coordinated salary = clamp(salary - coordinationDeduction, minCoordinatedSalary, maxCoordinatedSalary).
 * Salaries below the BVG entry threshold are not mandatorily insured at all (returns 0).
 */
export function coordinatedSalary(annualSalary: number): number {
  if (annualSalary < PILLAR_2.entryThreshold) return 0;
  const reduced = annualSalary - PILLAR_2.coordinationDeduction;
  return Math.min(
    Math.max(reduced, PILLAR_2.minCoordinatedSalary),
    PILLAR_2.maxCoordinatedSalary,
  );
}

/**
 * Insured (coordinated) salary for an occupational pension, generalised to a
 * configurable upper salary ceiling. With the mandatory BVG ceiling
 * (`upperInsuredSalaryLimit`, 90'720) this reproduces `coordinatedSalary`;
 * a higher ceiling models a fund that also insures the super-mandatory
 * (überobligatorische) portion of higher incomes.
 */
export function insuredSalary(
  annualSalary: number,
  ceiling: number = PILLAR_2.upperInsuredSalaryLimit,
): number {
  if (annualSalary < PILLAR_2.entryThreshold) return 0;
  const capped = Math.min(annualSalary, ceiling);
  const reduced = capped - PILLAR_2.coordinationDeduction;
  return Math.max(reduced, PILLAR_2.minCoordinatedSalary);
}

/** Statutory minimum BVG retirement credit rate (% of coordinated salary) for a given age. */
export function retirementCreditRate(age: number): number {
  const band = PILLAR_2.retirementCredits.find(
    (b) => age >= b.minAge && age <= b.maxAge,
  );
  return band?.rate ?? 0;
}

/**
 * Caps a requested Pillar 3a contribution at the statutory maximum.
 * With a pension fund (PK): flat cap. Without (self-employed / below
 * BVG threshold): 20% of net income, capped at the higher absolute limit.
 */
export function cappedPillar3aContribution(
  requested: number,
  hasPensionFund: boolean,
  netIncome = 0,
): number {
  const cap = hasPensionFund
    ? PILLAR_3A.maxContributionWithPK
    : Math.min(netIncome * PILLAR_3A.maxContributionWithoutPKRate, PILLAR_3A.maxContributionWithoutPKCap);
  return Math.min(requested, cap);
}

/**
 * Non-employed (Nichterwerbstätige) AHV contribution.
 *
 * APPROXIMATION: the official table is a stepwise schedule of ~50,000 CHF
 * wealth brackets; this implements a smooth linear interpolation between
 * the two anchor points given in the brief (350,000 -> minimum;
 * ~8,800,000 -> maximum), which is accurate at the anchors and a
 * reasonable approximation in between. Needs grounding against the full
 * official bracket table for production-grade precision.
 */
export function nonEmployedAhvContribution(
  netWealth: number,
  annualPensionOrReplacementIncome: number,
  maritalStatus: "single" | "married",
): number {
  const basis =
    netWealth + annualPensionOrReplacementIncome * AHV.nonEmployed.pensionIncomeMultiplier;
  const effectiveBasis = maritalStatus === "married" ? basis / 2 : basis;

  const { minAnnualContribution, maxAnnualContribution, firstBracketThreshold, upperBracketThreshold, maxAdminSurchargeRate } =
    AHV.nonEmployed;
  // Compensation funds add an administrative-cost surcharge (up to 5%) on top
  // of the AHV/IV/EO contribution; modelled at the maximum.
  const surcharge = 1 + maxAdminSurchargeRate;

  let contribution: number;
  if (effectiveBasis <= firstBracketThreshold) {
    contribution = minAnnualContribution;
  } else if (effectiveBasis >= upperBracketThreshold) {
    contribution = maxAnnualContribution;
  } else {
    const fraction =
      (effectiveBasis - firstBracketThreshold) / (upperBracketThreshold - firstBracketThreshold);
    contribution = minAnnualContribution + fraction * (maxAnnualContribution - minAnnualContribution);
  }
  return contribution * surcharge;
}

/** Dividend income, taxed as ordinary income at the canton's effective rate. */
export function dividendIncomeTax(canton: CantonTaxData, dividendIncome: number): number {
  return Math.max(0, dividendIncome) * canton.incomeTaxEffectiveRate;
}

/** Progressive cantonal/municipal wealth tax via marginal brackets. */
export function wealthTax(canton: CantonTaxData, netWealth: number): number {
  if (netWealth <= 0) return 0;
  const brackets = [...canton.wealthTaxBrackets].sort((a, b) => a.from - b.from);
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const lower = brackets[i].from;
    const upper = i + 1 < brackets.length ? brackets[i + 1].from : Infinity;
    if (netWealth <= lower) break;
    const sliceAmount = Math.min(netWealth, upper) - lower;
    tax += sliceAmount * brackets[i].rate;
  }
  return tax;
}

/**
 * One-off lump-sum (capital withdrawal) pension tax, calibrated to a
 * canton's documented reference points via piecewise-linear interpolation
 * over (0,0) and the reference points, extrapolated beyond the last point
 * using its segment's marginal rate. This keeps the curve monotonic and,
 * as long as reference points are themselves progressive, convex.
 */
export function lumpSumTax(canton: CantonTaxData, amount: number): number {
  if (amount <= 0) return 0;
  const points = [{ amount: 0, tax: 0 }, ...canton.lumpSumTax.referencePoints]
    .sort((a, b) => a.amount - b.amount);

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (amount <= b.amount) {
      const fraction = (amount - a.amount) / (b.amount - a.amount);
      return a.tax + fraction * (b.tax - a.tax);
    }
  }

  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const marginalRate = (last.tax - prev.tax) / (last.amount - prev.amount);
  return last.tax + (amount - last.amount) * marginalRate;
}

/**
 * APPROXIMATION: estimates an AHV pension from contribution-year
 * completeness only, linearly interpolating between the minimum and
 * maximum full pension. The official scale-44 table also depends on
 * average lifetime income; prefer letting the user input their own
 * estimate from the official AHV calculator where possible.
 */
export function estimateAhvPension(
  contributionYears: number,
  fullContributionYears: number = DEFAULTS.fullAhvContributionYears,
): number {
  const completeness = Math.min(Math.max(contributionYears / fullContributionYears, 0), 1);
  return AHV.minAnnualPension + completeness * (AHV.maxAnnualPension - AHV.minAnnualPension);
}
