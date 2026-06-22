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
  equityShare: number; // 0..1, for bootstrap mix
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
