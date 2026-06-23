import { AHV, DEFAULTS, PILLAR_2, PILLAR_3A } from "@/lib/engine/constants";
import { estimateAhvPension } from "@/lib/engine/tax";
import type { CalculatorInputs } from "@/lib/inputs";

/**
 * Inputs that a typical user often can't fill in confidently (pension
 * mechanics, statutory ages, an AHV pension projection). Each one can be
 * "estimated" from the figures the user *has* entered plus the verified
 * 2026 constants, so the form is usable without looking anything up. The
 * user can switch any field to manual entry to override the estimate.
 */
export type EstimableKey =
  | "horizonAge"
  | "ahvReferenceAge"
  | "ahvClaimAge"
  | "pillar3aUnlockAge"
  | "earliestPkAge"
  | "ahvAnnualPension"
  | "annualPillar3aContribution"
  | "healthInsuranceAnnualPremium";

/**
 * Resolution order matters: fields whose estimate depends on another
 * estimable field (e.g. the 3a unlock age depends on the AHV reference
 * age) must come after their dependency so they read the resolved value.
 */
export const ESTIMABLE_ORDER: EstimableKey[] = [
  "horizonAge",
  "ahvReferenceAge",
  "ahvClaimAge",
  "pillar3aUnlockAge",
  "earliestPkAge",
  "ahvAnnualPension",
  "annualPillar3aContribution",
  "healthInsuranceAnnualPremium",
];

/** Short, user-facing rationale shown under an estimated field. */
export const ESTIMATE_LABELS: Record<EstimableKey, string> = {
  horizonAge: "Standard-Planungshorizont (95).",
  ahvReferenceAge: "Gesetzliches Referenzalter (65).",
  ahvClaimAge: "Bezug am Referenzalter angenommen.",
  pillar3aUnlockAge: "5 Jahre vor dem Referenzalter.",
  earliestPkAge: "Üblicher früheste PK-Bezug (58).",
  ahvAnnualPension: "Aus Referenzalter & Zivilstand geschätzt — bitte mit AHV-Auszug prüfen.",
  annualPillar3aContribution: "Maximalbeitrag mit Pensionskasse.",
  healthInsuranceAnnualPremium: "Grobe Pauschale pro Haushalt.",
};

const ESTIMATORS: Record<EstimableKey, (i: CalculatorInputs) => number> = {
  horizonAge: () => DEFAULTS.horizonAge,
  ahvReferenceAge: () => AHV.referenceAgeDefault,
  ahvClaimAge: (i) => i.ahvReferenceAge,
  pillar3aUnlockAge: (i) => i.ahvReferenceAge - PILLAR_3A.earliestWithdrawalYearsBeforeReferenceAge,
  earliestPkAge: () => PILLAR_2.defaultEarliestPkAge,
  ahvAnnualPension: (i) => {
    // Assume continuous AHV contributions from age 21 to the reference age
    // (employed + non-employed bridge years both count). Married couples'
    // combined AHV is capped at 150% of a single max pension.
    const contributionYears = Math.max(0, i.ahvReferenceAge - 21);
    const single = estimateAhvPension(contributionYears);
    return i.maritalStatus === "married" ? Math.min(2 * single, 1.5 * AHV.maxAnnualPension) : single;
  },
  annualPillar3aContribution: () => PILLAR_3A.maxContributionWithPK,
  healthInsuranceAnnualPremium: (i) =>
    i.maritalStatus === "married" ? 2 * DEFAULTS.healthInsuranceAnnualPremium : DEFAULTS.healthInsuranceAnnualPremium,
};

/**
 * Returns a copy of `inputs` with every key in `autoKeys` replaced by its
 * estimate. Estimates are resolved in dependency order against the
 * progressively-updated object, so dependent fields see resolved values.
 */
export function applyEstimates(inputs: CalculatorInputs, autoKeys: ReadonlySet<EstimableKey>): CalculatorInputs {
  const out = { ...inputs };
  for (const key of ESTIMABLE_ORDER) {
    if (autoKeys.has(key)) out[key] = Math.round(ESTIMATORS[key](out));
  }
  return out;
}
