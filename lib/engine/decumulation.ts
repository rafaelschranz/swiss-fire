import { inflowAt } from "./accumulation";
import { AHV, DEFAULTS } from "./constants";
import { dividendIncomeTax, lumpSumTax, nonEmployedAhvContribution, wealthTax } from "./tax";
import type { CantonTaxData, DecumulationResult, DecumulationYearResult, OneOffInflow } from "./types";

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
  /**
   * Optional per-year real return sequence for the taxable portfolio,
   * indexed by years since `fireAge` (returnsPath[0] applies to the
   * fireAge -> fireAge+1 transition, etc). When supplied, overrides
   * `expectedReturn` for that year — this is what lets montecarlo.ts
   * reuse this exact deterministic engine across many stochastic paths.
   * Falls back to the constant `expectedReturn` for any year beyond the
   * supplied path's length.
   */
  returnsPath?: number[];
  /**
   * Real annual growth of the (still-locked or not-yet-withdrawn) Pillar 3a
   * balance during decumulation — a deferred 3a stays invested until drawn.
   * Defaults to 0 (held flat) when omitted.
   */
  pillar3aReturn?: number;
  /**
   * Real annual interest credited on the Pillar 2 / vested-benefits balance
   * until it is withdrawn. Defaults to 0 (held flat) when omitted.
   */
  pillar2InterestRate?: number;
  /**
   * One-off inflows (inheritance, windfalls) credited to the taxable account.
   * Those after `fireAge` apply here; inflows at or before `fireAge` are
   * already reflected in `startingTaxable` by the accumulation phase.
   */
  oneOffInflows?: OneOffInflow[];
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
 * Net annual cash need (real terms) for a decumulation year, plus the
 * non-employed AHV contribution component (broken out because the main
 * simulator reports it per year). Shared by both `simulateDecumulation`
 * and `computeBridgeCapitalRequired` so the spending / AHV-contribution /
 * AHV-pension-offset accounting lives in exactly one place.
 */
function annualCashNeed(
  params: DecumulationParams,
  age: number,
  taxableEstimate: number,
  ahvPension: number,
): { nonEmployedContribution: number; netCashNeed: number } {
  const replacementIncomeBasis = ahvPension > 0 ? ahvPension : params.annualRealSpending;
  const nonEmployedContribution =
    age < params.ahvReferenceAge
      ? nonEmployedAhvContribution(taxableEstimate, replacementIncomeBasis, params.maritalStatus)
      : 0;
  const spend = params.annualRealSpending + params.healthInsuranceAnnualPremium;
  const netCashNeed = spend + nonEmployedContribution - ahvPension;
  return { nonEmployedContribution, netCashNeed };
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

    // One-off inflows after FIRE land in the taxable account for that year.
    // (Inflows at/before fireAge are already baked into startingTaxable.)
    if (age > params.fireAge) taxable += inflowAt(params.oneOffInflows, age);

    const { nonEmployedContribution, netCashNeed } = annualCashNeed(params, age, taxable, ahvPension);
    const spend = params.annualRealSpending + params.healthInsuranceAnnualPremium;

    let lumpSumTaxPaid = 0;
    taxable -= netCashNeed;

    if (taxable < 0) {
      const shortfall = -taxable;
      taxable = 0;
      let covered = false;

      const pillar3aUnlocked = age >= params.pillar3aUnlockAge && pillar3a > 0;
      const pillar2Unlocked = age >= params.earliestPkAge && pillar2 > 0;

      if (pillar3aUnlocked || pillar2Unlocked) {
        // Prefer whichever pillar has more remaining balance, to draw
        // each pillar down across fewer, larger, separate tax years
        // rather than thin slices from both.
        const usePillar3a = pillar3aUnlocked && (!pillar2Unlocked || pillar3a >= pillar2);
        const { gross } = grossUpLumpSum(params.canton, shortfall);

        const sourceBalance = usePillar3a ? pillar3a : pillar2;
        const drawn = Math.min(gross, sourceBalance);
        if (usePillar3a) pillar3a -= drawn;
        else pillar2 -= drawn;

        const actualTax = lumpSumTax(params.canton, drawn);
        taxable += Math.max(0, drawn - actualTax);
        lumpSumTaxPaid = actualTax;

        // Covered iff the chosen pillar's balance was large enough to
        // supply the full grossed-up draw. A balance-capped draw
        // (drawn < gross) means the shortfall was only partially met —
        // the case the previous `taxable === 0` guard silently missed.
        covered = drawn >= gross - 1e-6;
      }

      if (!covered) {
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

    const yearIndex = age - params.fireAge;
    const yearReturn = params.returnsPath?.[yearIndex] ?? params.expectedReturn;
    taxable *= 1 + yearReturn;

    // Not-yet-withdrawn pension capital keeps compounding until it is drawn.
    pillar3a *= 1 + (params.pillar3aReturn ?? 0);
    pillar2 *= 1 + (params.pillar2InterestRate ?? 0);

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
    const { netCashNeed } = annualCashNeed(params, age, taxableEstimate, ahvPension);

    pv += netCashNeed / Math.pow(1 + params.expectedReturn, i);
    taxableEstimate = Math.max(0, taxableEstimate - netCashNeed) * (1 + params.expectedReturn);
  }

  return pv;
}
