/**
 * Shared types for the Swiss FIRE bridge-calculator engine.
 * The engine is framework-free, pure TypeScript — no React imports here.
 * All monetary figures are CHF. All rates are real (inflation-adjusted)
 * unless a field name explicitly says "nominal".
 */

export type CantonCode =
  | "AG" | "AI" | "AR" | "BE" | "BL" | "BS" | "FR" | "GE" | "GL" | "GR"
  | "JU" | "LU" | "NE" | "NW" | "OW" | "SG" | "SH" | "SO" | "SZ" | "TG"
  | "TI" | "UR" | "VD" | "VS" | "ZG" | "ZH";

export interface WealthTaxBracket {
  /** Lower bound of net assets (CHF) this bracket applies above. */
  from: number;
  /** Marginal effective annual rate applied to assets in this bracket (e.g. 0.003 = 0.3%). */
  rate: number;
}

export interface LumpSumTaxParams {
  /**
   * Calibration points (amount -> total one-off tax) used to fit the
   * progressive lump-sum withdrawal tax curve for this canton.
   * Federal + cantonal + municipal combined, single person, no church tax,
   * reference age, 2026.
   */
  referencePoints: Array<{ amount: number; tax: number }>;
}

export interface CantonTaxData {
  code: CantonCode;
  name: string;
  /**
   * Whether the figures for this canton are grounded in researched,
   * cited sources (true) or a transparent placeholder approximation
   * that still needs grounding (false). See README "January re-verification".
   */
  verified: boolean;
  wealthTaxBrackets: WealthTaxBracket[];
  /** Flat effective rate applied to ordinary income (dividends) as a simplification. */
  incomeTaxEffectiveRate: number;
  lumpSumTax: LumpSumTaxParams;
  source: string;
}

export interface PersonalInputs {
  currentAge: number;
  fireAge: number;
  horizonAge: number;
  /** "single" halves the AHV non-employed contribution basis when married. */
  maritalStatus: "single" | "married";
  canton: CantonCode;
}

/**
 * An age-banded income/savings phase. Applies from `fromAge` until the next
 * phase's `fromAge` (or FIRE). Models careers where salary and savings rate
 * change markedly over time — e.g. a 25-year-old whose income ramps up.
 * All figures are real (today's purchasing power).
 */
export interface IncomePhase {
  fromAge: number;
  salary: number;
  annualTaxableSavings: number;
  annualPillar3aContribution: number;
}

/**
 * Pension-fund (Pillar 2) projection plan. Lets the PK be driven by the
 * salary trajectory rather than only the statutory minimum.
 *   - "bvg": age-banded statutory retirement credits (7/10/15/18%).
 *   - "rate": a single average savings contribution rate (employee +
 *     employer, % of insured salary), useful when the user knows their
 *     fund's Sparbeitrag.
 * `insuredCeiling` is the salary up to which income is insured (raise it
 * above the mandatory 90'720 to model super-mandatory coverage);
 * `interestRate` is the assumed average projected interest on PK capital.
 */
export interface Pillar2Plan {
  model: "bvg" | "rate";
  savingsRate: number;
  insuredCeiling: number;
  interestRate: number;
}

/**
 * A one-off cash inflow (e.g. an inheritance or a property sale) credited to
 * the taxable account in the year the person reaches `age`. Real CHF.
 */
export interface OneOffInflow {
  age: number;
  amount: number;
  label?: string;
}

export interface AccumulationInputs {
  currentSalary: number;
  salaryGrowth: number; // real, annual
  currentTaxableBalance: number;
  annualTaxableSavings: number;
  currentPillar3aBalance: number;
  annualPillar3aContribution: number;
  pillar3aReturn: number;
  currentPillar2Balance: number;
  /** If provided, overrides the projected PK balance at FIRE entirely. */
  expectedPillar2BalanceAtFire?: number;
  expectedReturn: number; // taxable portfolio, real
  /**
   * Optional age-banded salary / savings schedule. When present (non-empty),
   * it replaces `currentSalary` + `salaryGrowth` + `annualTaxableSavings` +
   * `annualPillar3aContribution`: each year uses the values of the phase
   * whose band covers that age. Ages below the lowest band use the lowest
   * phase. Absent → the flat constant-growth model is used (unchanged).
   */
  incomePhases?: IncomePhase[];
  /**
   * Optional occupational-pension projection plan. Absent → the statutory
   * BVG minimum (age-banded credits, mandatory ceiling, minimum interest)
   * is used, unchanged.
   */
  pillar2Plan?: Pillar2Plan;
  /**
   * One-off inflows (inheritance, windfalls) credited to the taxable account
   * at the given age. Those at age <= fireAge land during accumulation.
   */
  oneOffInflows?: OneOffInflow[];
}

export interface PillarUnlockInputs {
  pillar3aUnlockAge: number; // default currentAge-based reference age - 5
  earliestPkAge: number; // default 58
  ahvReferenceAge: number; // default 65
  ahvClaimAge: number; // 63-70, default = ahvReferenceAge
  ahvAnnualPension: number; // user-estimated or computed elsewhere
}

export interface SpendingInputs {
  annualRealSpending: number;
  inflation: number; // for nominal projections if ever needed; engine stays real internally
  healthInsuranceAnnualPremium: number;
}

export interface AssumptionsInputs {
  expectedReturn: number;
  volatility: number;
  equityShare: number; // 0..1, equity/bond mix for the historical (real-data) Monte Carlo
}

export interface FireInputs {
  personal: PersonalInputs;
  accumulation: AccumulationInputs;
  pillars: PillarUnlockInputs;
  spending: SpendingInputs;
  assumptions: AssumptionsInputs;
}

export interface AccumulationYearResult {
  age: number;
  taxableBalance: number;
  pillar3aBalance: number;
  pillar2Balance: number;
  salary: number;
}

export interface AccumulationResult {
  years: AccumulationYearResult[];
  taxableAtFire: number;
  pillar3aAtFire: number;
  pillar2AtFire: number;
}

export interface DecumulationYearResult {
  age: number;
  taxableBalance: number;
  pillar3aBalance: number;
  pillar2Balance: number;
  spend: number;
  ahvNonEmployedContribution: number;
  dividendTax: number;
  wealthTax: number;
  lumpSumTax: number;
  ahvPension: number;
  /** Annual Pillar 2 Rente once the PK is annuitised (0 in capital mode). */
  pillar2Pension: number;
  depleted: boolean;
}

export interface DecumulationResult {
  years: DecumulationYearResult[];
  bridgeCapitalRequired: number;
  lifetimeTaxPaid: number;
  failed: boolean;
  failedDuringBridge: boolean;
}

export interface MonteCarloResult {
  successRate: number;
  bridgeFailureRate: number;
  percentile10: number[];
  percentile50: number[];
  percentile90: number[];
}
