/**
 * Verified Swiss parameters, as of 2026.
 *
 * Re-verification checklist (do this every January, since the Federal
 * Council typically adjusts AHV/BVG figures with the AHV pension):
 *   1. Pillar 3a max contributions (admin.ch / estv.admin.ch)
 *   2. BVG entry threshold, coordination deduction, salary bounds, min
 *      interest rate, min conversion rate (bsv.admin.ch)
 *   3. AHV max/min pension, reference age schedule, non-employed
 *      contribution brackets (ahv-iv.ch)
 *   4. Lump-sum withdrawal tax reference points per canton (ESTV /
 *      cantonal tax administration calculators)
 *   5. Update the `source` field and date comment on every changed constant.
 */

// ---------------------------------------------------------------------------
// Pillar 3a — tied private pension
// Source: estv.admin.ch, Säule 3a Maximalbeträge 2026.
// ---------------------------------------------------------------------------
export const PILLAR_3A = {
  /** Max annual contribution for employees affiliated with a pension fund (CHF). */
  maxContributionWithPK: 7_258,
  /** Max annual contribution for self-employed / not affiliated with a PK: 20% of net income, capped. */
  maxContributionWithoutPKRate: 0.2,
  maxContributionWithoutPKCap: 36_288,
  /** Earliest withdrawal: 5 years before reference age (~age 60). */
  earliestWithdrawalYearsBeforeReferenceAge: 5,
  /** Must be withdrawn by reference age; can be deferred up to 5 years if still working. */
  maxDeferralYearsPastReferenceAge: 5,
} as const;

// ---------------------------------------------------------------------------
// Pillar 2 — BVG / Pensionskasse (mandatory minimums)
// Source: bsv.admin.ch, berufliche Vorsorge Kennzahlen 2026.
// ---------------------------------------------------------------------------
export const PILLAR_2 = {
  /** Eintrittsschwelle: minimum annual salary to be covered by mandatory BVG. */
  entryThreshold: 22_680,
  /** Koordinationsabzug = 7/8 of max AHV pension. */
  coordinationDeduction: 26_460,
  /** Minimum coordinated salary. */
  minCoordinatedSalary: 3_780,
  /** Maximum coordinated salary (mandatory portion). */
  maxCoordinatedSalary: 64_260,
  /** Upper insured salary limit = 3x max AHV pension. */
  upperInsuredSalaryLimit: 90_720,
  /** Minimum interest rate credited on BVG mandatory balances, 2026. */
  minInterestRate: 0.0125,
  /** Minimum conversion rate (Umwandlungssatz) on mandatory BVG capital. */
  minConversionRate: 0.068,
  /**
   * Retirement credits (Altersgutschriften), statutory minimums, as % of
   * coordinated salary, by age band.
   */
  retirementCredits: [
    { minAge: 25, maxAge: 34, rate: 0.07 },
    { minAge: 35, maxAge: 44, rate: 0.10 },
    { minAge: 45, maxAge: 54, rate: 0.15 },
    { minAge: 55, maxAge: 65, rate: 0.18 },
  ] as const,
  /** Earliest age capital can be withdrawn, if fund regulations allow (commonly 58-60). Configurable. */
  defaultEarliestPkAge: 58,
} as const;

// ---------------------------------------------------------------------------
// Pillar 1 — AHV
// Source: ahv-iv.ch, Renten und Beitraege 2026.
// ---------------------------------------------------------------------------
export const AHV = {
  /** Maximum annual full AHV pension, 2026 (CHF 2,520/month). */
  maxAnnualPension: 30_240,
  /** Minimum full AHV pension ~= half of max. */
  minAnnualPension: 15_120,
  /** Reference age, men. Women transitioning 64 -> 65 (65 from 2028). Model as a parameter. */
  referenceAgeDefault: 65,
  /** Flexible draw window under AHV21. */
  earliestClaimAge: 63,
  latestClaimAge: 70,
  /**
   * Default approximate actuarial reduction per year claimed early.
   * NOTE: AHV21 introduced income-dependent reduced rates for early claiming;
   * this flat default is a simplification — flagged as approximate in the UI,
   * link to the official AHV calculator for precise figures.
   */
  approxEarlyReductionPerYear: 0.068,
  /** Non-employed (Nichterwerbstätige) AHV contribution brackets. */
  nonEmployed: {
    minAnnualContribution: 530,
    maxAnnualContribution: 26_500,
    /** Admin surcharge, up to this fraction of the contribution. */
    maxAdminSurchargeRate: 0.05,
    /** Wealth (+ 20x annual pension/replacement income) bracket where contributions start scaling up from the minimum. */
    firstBracketThreshold: 350_000,
    /** Multiplier applied to annual pension/replacement income when computing the contribution basis. */
    pensionIncomeMultiplier: 20,
    /** A non-employed spouse is exempt if the working spouse pays at least this multiple of the minimum. */
    spouseExemptionMultiple: 2,
  },
} as const;

// ---------------------------------------------------------------------------
// General tax facts baked into engine assumptions.
// Source: DBG / StHG general principles; ESTV.
// ---------------------------------------------------------------------------
export const GENERAL_TAX = {
  /** Switzerland has no capital gains tax for private investors on movable assets. */
  capitalGainsTaxed: false,
  /** Dividends are taxed as ordinary income. */
  dividendsTaxedAsIncome: true,
} as const;

// ---------------------------------------------------------------------------
// Default model assumptions (real terms throughout).
// ---------------------------------------------------------------------------
export const DEFAULTS = {
  horizonAge: 95,
  inflation: 0, // engine operates in real terms; nominal inflation kept at 0 by convention
  expectedReturn: 0.04,
  volatility: 0.12,
  equityShare: 0.7,
  healthInsuranceAnnualPremium: 5_000,
  monteCarloPaths: 2_000,
  bootstrapBlockYears: { min: 3, max: 5 },
} as const;
