import { PILLAR_2 } from "@/lib/engine/constants";
import type { CantonCode, IncomePhase, OneOffInflow } from "@/lib/engine/types";

/**
 * A partner's own profile. They retire on their own timeline and their pension
 * pillars unlock at their own ages; the taxable account and living costs are
 * shared at the household level. Market assumptions (returns, 3a/PK interest,
 * inflation, canton) are shared with the primary person and not duplicated
 * here. Partner fields are entered manually (no auto-estimates) for now.
 */
export interface PartnerInputs {
  currentAge: number;
  fireAge: number;
  currentSalary: number;
  salaryGrowth: number;
  annualTaxableSavings: number;
  /** When true, salary/savings come from `incomePhases` rather than the flat fields. */
  useIncomePhases: boolean;
  incomePhases: IncomePhase[];
  currentTaxableBalance: number;
  currentPillar3aBalance: number;
  annualPillar3aContribution: number;
  pillar3aUnlockAge: number;
  pillar3aTranches: number;
  currentPillar2Balance: number;
  pillar2Model: "bvg" | "rate";
  pillar2SavingsRate: number;
  pillar2InsuredCeiling: number;
  earliestPkAge: number;
  pillar2PayoutMode: "capital" | "pension" | "mix";
  pillar2CapitalShare: number;
  pillar2ConversionRate: number;
  ahvReferenceAge: number;
  ahvClaimAge: number;
  ahvAnnualPension: number;
  healthInsuranceAnnualPremium: number;
}

/**
 * The full set of user-editable calculator inputs. Stored in real
 * (inflation-adjusted) terms; rates are decimals (0.04 = 4%). Shared by the
 * multi-step form and the page-level engine wiring.
 */
export interface CalculatorInputs {
  currentAge: number;
  fireAge: number;
  horizonAge: number;
  maritalStatus: "single" | "married";
  canton: CantonCode;

  currentSalary: number;
  salaryGrowth: number;
  currentTaxableBalance: number;
  annualTaxableSavings: number;
  currentPillar3aBalance: number;
  annualPillar3aContribution: number;
  pillar3aReturn: number;
  currentPillar2Balance: number;

  /** When true, salary/savings come from `incomePhases` rather than the flat fields above. */
  useIncomePhases: boolean;
  incomePhases: IncomePhase[];

  /** Pensionskasse projection: statutory BVG credits or an average savings rate. */
  pillar2Model: "bvg" | "rate";
  pillar2SavingsRate: number; // used when pillar2Model === "rate"
  pillar2InsuredCeiling: number; // salary insured up to this amount
  pillar2InterestRate: number; // assumed average interest on PK capital

  /** How the PK is taken at retirement: lump sum, lifelong Rente, or a mix. */
  pillar2PayoutMode: "capital" | "pension" | "mix";
  pillar2CapitalShare: number; // fraction taken as capital when mode === "mix"
  pillar2ConversionRate: number; // Umwandlungssatz on the annuitised portion

  pillar3aUnlockAge: number;
  /** Number of 3a accounts to close in separate years (staggered tax-optimal withdrawal). */
  pillar3aTranches: number;
  earliestPkAge: number;
  ahvReferenceAge: number;
  ahvClaimAge: number;
  ahvAnnualPension: number;

  annualRealSpending: number;
  healthInsuranceAnnualPremium: number;

  /** One-off inflows (e.g. inheritance) credited to the taxable account at a given age. */
  oneOffInflows: OneOffInflow[];

  expectedReturn: number;
  volatility: number;
  equityShare: number;
  /** Assumed annual inflation, used only to show nominal (inflated) figures. */
  inflation: number;

  /** When true, the plan is modelled as a two-person household. */
  hasPartner: boolean;
  partner: PartnerInputs;
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  currentAge: 35,
  fireAge: 55,
  horizonAge: 95,
  maritalStatus: "single",
  canton: "ZH",

  currentSalary: 110_000,
  salaryGrowth: 0.01,
  currentTaxableBalance: 80_000,
  annualTaxableSavings: 25_000,
  currentPillar3aBalance: 40_000,
  annualPillar3aContribution: 7_258,
  pillar3aReturn: 0.04,
  currentPillar2Balance: 90_000,

  useIncomePhases: false,
  incomePhases: [
    { fromAge: 35, salary: 110_000, annualTaxableSavings: 25_000, annualPillar3aContribution: 7_258 },
    { fromAge: 45, salary: 140_000, annualTaxableSavings: 40_000, annualPillar3aContribution: 7_258 },
  ],

  pillar2Model: "bvg",
  pillar2SavingsRate: 0.15,
  pillar2InsuredCeiling: PILLAR_2.upperInsuredSalaryLimit,
  pillar2InterestRate: PILLAR_2.minInterestRate,

  pillar2PayoutMode: "capital",
  pillar2CapitalShare: 0.5,
  pillar2ConversionRate: PILLAR_2.minConversionRate,

  pillar3aUnlockAge: 60,
  pillar3aTranches: 3,
  earliestPkAge: 58,
  ahvReferenceAge: 65,
  ahvClaimAge: 65,
  ahvAnnualPension: 24_000,

  annualRealSpending: 48_000,
  healthInsuranceAnnualPremium: 5_000,

  oneOffInflows: [],

  expectedReturn: 0.04,
  volatility: 0.12,
  equityShare: 0.7,
  inflation: 0.01,

  hasPartner: false,
  partner: {
    currentAge: 33,
    fireAge: 55,
    currentSalary: 90_000,
    salaryGrowth: 0.01,
    annualTaxableSavings: 15_000,
    useIncomePhases: false,
    incomePhases: [
      { fromAge: 33, salary: 90_000, annualTaxableSavings: 15_000, annualPillar3aContribution: 7_258 },
      { fromAge: 45, salary: 120_000, annualTaxableSavings: 30_000, annualPillar3aContribution: 7_258 },
    ],
    currentTaxableBalance: 40_000,
    currentPillar3aBalance: 25_000,
    annualPillar3aContribution: 7_258,
    pillar3aUnlockAge: 60,
    pillar3aTranches: 3,
    currentPillar2Balance: 60_000,
    pillar2Model: "bvg",
    pillar2SavingsRate: 0.15,
    pillar2InsuredCeiling: PILLAR_2.upperInsuredSalaryLimit,
    earliestPkAge: 58,
    pillar2PayoutMode: "capital",
    pillar2CapitalShare: 0.5,
    pillar2ConversionRate: PILLAR_2.minConversionRate,
    ahvReferenceAge: 65,
    ahvClaimAge: 65,
    ahvAnnualPension: 22_000,
    healthInsuranceAnnualPremium: 5_000,
  },
};
