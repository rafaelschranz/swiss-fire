import type { CantonCode, IncomePhase } from "@/lib/engine/types";

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

  pillar3aUnlockAge: number;
  earliestPkAge: number;
  ahvReferenceAge: number;
  ahvClaimAge: number;
  ahvAnnualPension: number;

  annualRealSpending: number;
  healthInsuranceAnnualPremium: number;

  expectedReturn: number;
  volatility: number;
  equityShare: number;
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

  pillar3aUnlockAge: 60,
  earliestPkAge: 58,
  ahvReferenceAge: 65,
  ahvClaimAge: 65,
  ahvAnnualPension: 24_000,

  annualRealSpending: 48_000,
  healthInsuranceAnnualPremium: 5_000,

  expectedReturn: 0.04,
  volatility: 0.12,
  equityShare: 0.7,
};
