import { AHV, DEFAULTS } from "./constants";
import { dividendIncomeTax, lumpSumTax, nonEmployedAhvContribution, wealthTax } from "./tax";
import type { CantonTaxData, DecumulationResult, DecumulationYearResult } from "./types";

export interface DecumulationParams {
  fireAge: number;
  horizonAge: number;
  pillar3aUnlockAge: number;
  earliestPkAge: number;
  ahvReferenceAge: number;
  ahvClaimAge: number;
  ahvAnnualPension: number;
  annualRealSpending: number;
  healthInsuranceAnnualPremium: number;
  maritalStatus: "single" | "married";
  canton: CantonTaxData;
  expectedReturn: number;
  startingTaxable: number;
  startingPillar3a: number;
  startingPillar2: number;
}

/**
 * Approximate actuarial adjustment to AHV for claiming before/after the
 * reference age. Uses the single documented rate from the brief
 * symmetrically for early and deferred claims — flagged approximate,
 * since AHV21 introduced income-dependent reduced rates for early
 * claiming that this simplification does not model.
 */
function adjustedAhvPension(basePension: number, claimAge: number, referenceAge: number): number {
  const yearsOffset = claimAge - referenceAge;
  return basePension * (1 + yearsOffset * AHV.approxEarlyReductionPerYear);
}

/**
 * Solves for the gross lump-sum withdrawal whose net-of-tax proceeds
 * cover `netNeeded`, by fixed-point iteration on the (non-linear,
 * piecewise-linear) lump-sum tax curve.
 */
function grossUpLumpSum(canton: CantonTaxData, netNeeded: number): { gross: number; tax: number } {
  let gross = netNeeded;
  for (let i = 0; i < 5; i++) {
    const tax = lumpSumTax(canton, gross);
    gross = netNeeded + tax;
  }
  return { gross, tax: lumpSumTax(canton, gross) };
}

/**
 * Year-by-year decumulation simulator implementing a documented
 * tax-optimised HEURISTIC (not a global optimiser):
 *   1. Bridge years: fund spending from the taxable account first.
 *   2. Once unlocked, draw lump sums from Pillar 3a / Pillar 2 only when
 *      the taxable account runs short, and never both in the same tax
 *      year (each year draws from at most one pillar), to avoid the
 *      same-year aggregation that inflates the lump-sum tax.
 *   3. AHV starts at `ahvClaimAge` and offsets the portfolio draw.
 *   4. Non-employed AHV contributions and health insurance are modelled
 *      as recurring decumulation costs until the AHV reference age.
 */
export function simulateDecumulation(params: DecumulationParams): DecumulationResult {
  const years: DecumulationYearResult[] = [];

  let taxable = params.startingTaxable;
  let pillar3a = params.startingPillar3a;
  let pillar2 = params.startingPillar2;
  let depleted = false;
  let failedDuringBridge = false;
  let lifetimeTaxPaid = 0;

  const firstUnlockAge = Math.min(params.pillar3aUnlockAge, params.earliestPkAge);

  for (let age = params.fireAge; age < params.horizonAge; age++) {
    const ahvPension =
      age >= params.ahvClaimAge
        ? adjustedAhvPension(params.ahvAnnualPension, params.ahvClaimAge, params.ahvReferenceAge)
        : 0;

    const replacementIncomeBasis = ahvPension > 0 ? ahvPension : params.annualRealSpending;
    const nonEmployedContribution =
      age < params.ahvReferenceAge
        ? nonEmployedAhvContribution(taxable, replacementIncomeBasis, params.maritalStatus)
        : 0;

    const spend = params.annualRealSpending + params.healthInsuranceAnnualPremium;
    const netCashNeed = spend + nonEmployedContribution - ahvPension;

    let lumpSumTaxPaid = 0;
    taxable -= netCashNeed;

    if (taxable < 0) {
      const shortfall = -taxable;
      taxable = 0;

      const pillar3aUnlocked = age >= params.pillar3aUnlockAge && pillar3a > 0;
      const pillar2Unlocked = age >= params.earliestPkAge && pillar2 > 0;

      if (pillar3aUnlocked || pillar2Unlocked) {
        // Prefer whichever pillar has more remaining balance, to draw
        // each pillar down across fewer, larger, separate tax years
        // rather than thin slices from both.
        const usePillar3a = pillar3aUnlocked && (!pillar2Unlocked || pillar3a >= pillar2);
        const { gross, tax } = grossUpLumpSum(params.canton, shortfall);

        if (usePillar3a) {
          const drawn = Math.min(gross, pillar3a);
          pillar3a -= drawn;
          const actualTax = lumpSumTax(params.canton, drawn);
          taxable += Math.max(0, drawn - actualTax);
          lumpSumTaxPaid = actualTax;
        } else {
          const drawn = Math.min(gross, pillar2);
          pillar2 -= drawn;
          const actualTax = lumpSumTax(params.canton, drawn);
          taxable += Math.max(0, drawn - actualTax);
          lumpSumTaxPaid = actualTax;
        }
        void tax;
      }

      if (taxable < shortfall - 1e-6 && taxable === 0) {
        // Could not fully cover the shortfall even after drawing a pillar.
        depleted = true;
        if (age < firstUnlockAge) failedDuringBridge = true;
      }
    }

    const dividendIncome = Math.max(0, taxable) * DEFAULTS.dividendYield;
    const divTax = dividendIncomeTax(params.canton, dividendIncome);
    const wTax = wealthTax(params.canton, Math.max(0, taxable));

    taxable -= divTax + wTax;
    if (taxable < 0) {
      depleted = true;
      if (age < firstUnlockAge) failedDuringBridge = true;
      taxable = 0;
    }

    taxable *= 1 + params.expectedReturn;

    lifetimeTaxPaid += divTax + wTax + lumpSumTaxPaid;

    years.push({
      age,
      taxableBalance: taxable,
      pillar3aBalance: pillar3a,
      pillar2Balance: pillar2,
      spend,
      ahvNonEmployedContribution: nonEmployedContribution,
      dividendTax: divTax,
      wealthTax: wTax,
      lumpSumTax: lumpSumTaxPaid,
      ahvPension,
      depleted,
    });

    if (depleted) break;
  }

  return {
    years,
    bridgeCapitalRequired: computeBridgeCapitalRequired(params),
    lifetimeTaxPaid,
    failed: depleted,
    failedDuringBridge,
  };
}

/**
 * Present value (at FIRE, real terms) of net cash needs from `fireAge`
 * until the first pillar unlock — the headline "bridge number": how much
 * liquid capital is needed to cover spending, health insurance, and
 * non-employed AHV contributions before any pension pillar can help.
 */
export function computeBridgeCapitalRequired(params: DecumulationParams): number {
  const firstUnlockAge = Math.min(params.pillar3aUnlockAge, params.earliestPkAge);
  const bridgeYears = Math.max(0, firstUnlockAge - params.fireAge);

  let pv = 0;
  let taxableEstimate = params.startingTaxable;

  for (let i = 0; i < bridgeYears; i++) {
    const age = params.fireAge + i;
    const ahvPension = age >= params.ahvClaimAge ? params.ahvAnnualPension : 0;
    const replacementIncomeBasis = ahvPension > 0 ? ahvPension : params.annualRealSpending;
    const nonEmployedContribution =
      age < params.ahvReferenceAge
        ? nonEmployedAhvContribution(taxableEstimate, replacementIncomeBasis, params.maritalStatus)
        : 0;
    const netCashNeed =
      params.annualRealSpending + params.healthInsuranceAnnualPremium + nonEmployedContribution - ahvPension;

    pv += netCashNeed / Math.pow(1 + params.expectedReturn, i);
    taxableEstimate = Math.max(0, taxableEstimate - netCashNeed) * (1 + params.expectedReturn);
  }

  return pv;
}
