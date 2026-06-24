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
    /**
     * Wealth (+ 20x annual pension/replacement income) bracket at and
     * above which the contribution reaches the maximum (CHF 26,500).
     * The real official table is a stepwise schedule of ~50,000 CHF
     * brackets between these two anchors; this engine linearly
     * interpolates between them as a documented smoothing approximation.
     */
    upperBracketThreshold: 8_800_000,
    /** Multiplier applied to annual pension/replacement income when computing the contribution basis. */
    pensionIncomeMultiplier: 20,
    /** A non-employed spouse is exempt if the working spouse pays at least this multiple of the minimum. */
    spouseExemptionMultiple: 2,
  },
} as const;

// ---------------------------------------------------------------------------
// Direct federal income tax (direkte Bundessteuer), tariff 2026.
// Source: ESTV official tax data (swisstaxcalculator.estv.admin.ch,
// API_exportManyTaxScales, TaxYear 2026), "EINKOMMENSSTEUER" / "BUND".
// Each bracket is [threshold (CHF, cumulative), baseTax (CHF at threshold),
// marginalPercent above the threshold]. The federal tax is national (no
// municipal multiplier). The single tariff applies to unmarried taxpayers; the
// married/family tariff (Verheiratetentarif) to couples — children/other
// deductions are NOT modelled (we tax the income as given).
// ---------------------------------------------------------------------------
export const FEDERAL_INCOME_TAX = {
  year: 2026,
  source: "ESTV direkte Bundessteuer Tarif 2026",
  single: [
    [0, 0, 0], [15200, 0, 0.77], [33200, 138.6, 0.88], [43500, 229.2, 2.64],
    [58000, 612, 2.97], [76200, 1152.5, 5.94], [82100, 1502.95, 6.6],
    [108900, 3271.75, 8.8], [141500, 6140.55, 11], [185100, 10936.55, 13.2],
    [793900, 91298.15, 13.2], [794000, 91310, 11.5],
  ] as ReadonlyArray<readonly [number, number, number]>,
  married: [
    [0, 0, 0], [29700, 0, 1], [53400, 237, 2], [61300, 395, 3], [79100, 929, 4],
    [94900, 1561, 5], [108700, 2251, 6], [120600, 2965, 7], [130500, 3658, 8],
    [138400, 4290, 9], [144300, 4821, 10], [148300, 5221, 11], [150400, 5452, 12],
    [152400, 5692, 13], [941300, 108249, 13], [941400, 108261, 11.5],
  ] as ReadonlyArray<readonly [number, number, number]>,
  /** Capital benefits (3a/PK lump sums) are taxed at one-fifth of the ordinary tariff (Art. 38 DBG). */
  capitalFraction: 1 / 5,
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
// Capital-market history — real (inflation-adjusted) asset returns.
// Sources (real long-run figures):
//   - Swiss equities & bonds: Pictet, "Performance of Swiss equities and bonds
//     (1900–2025)". Swiss equities ~6.8% nominal / ~4.6% real, σ ~19%; Swiss
//     government bonds ~3.9% nominal / ~1.8% real, σ ~5.2%; CH inflation ~2.1%.
//   - Global (world) equities: UBS / Dimson-Marsh-Staunton Global Investment
//     Returns Yearbook 2025, world index ~5.2% real since 1900, σ ~17%.
// The world-index figure is in the index's reporting basis (broadly USD); a
// CHF investor's realised global return is affected by CHF strength — a
// documented simplification. The correlations are modelling ASSUMPTIONS, not
// published single figures. Used to calibrate the Monte Carlo to real data.
// ---------------------------------------------------------------------------
export const MARKET = {
  equityRealReturn: 0.046, // Swiss equities (Pictet)
  equityVolatility: 0.19,
  globalEquityRealReturn: 0.052, // world equities (UBS/DMS)
  globalEquityVolatility: 0.17,
  bondRealReturn: 0.018,
  bondVolatility: 0.052,
  /** ASSUMPTION: long-run equity/bond real-return correlation. */
  equityBondCorrelation: 0.1,
  /** ASSUMPTION: correlation between Swiss and global equity real returns (high). */
  swissGlobalEquityCorrelation: 0.8,
  /** Average annual Swiss inflation since 1900 (Pictet) — context for nominal views. */
  historicalInflation: 0.021,
  source: "Pictet (Swiss equities/bonds, 1900–2025) & UBS/DMS Global Investment Returns Yearbook 2025 (world equities)",
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
  /**
   * ASSUMPTION (not given in the project brief): share of the taxable
   * portfolio's total real return paid out as dividends/distributions
   * each year, which is the only part of the taxable account taxed as
   * ordinary income (capital gains are untaxed for private investors in
   * Switzerland). A typical global equity/bond ETF mix yields roughly
   * 1.5-2.5% in dividends; 2% is used as a documented placeholder.
   */
  dividendYield: 0.02,
  /**
   * APPROXIMATION: number of contribution years for a "full" AHV
   * pension. Used only by the optional estimateAhvPension() helper when
   * a user has no better estimate; the official AHV scale-44 table also
   * depends on average lifetime income, which this simplification does
   * not model in detail.
   */
  fullAhvContributionYears: 44,
} as const;
