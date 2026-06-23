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
  | "healthInsuranceAnnualPremium"
  | "pillar2ConversionRate";

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
  "pillar2ConversionRate",
];

/**
 * Estimable fields that hold a rate/decimal (e.g. 0.068 = 6.8%) rather than
 * an integer amount, so `applyEstimates` rounds them to a sensible precision
 * instead of to a whole number.
 */
const RATE_ESTIMABLE_KEYS: ReadonlySet<EstimableKey> = new Set(["pillar2ConversionRate"]);

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
  pillar2ConversionRate: "BVG-Minimum 6,8 %, gekürzt um ~0,1 %-Pkt. je Jahr Vorbezug — Näherung, Reglement prüfen.",
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
  pillar2ConversionRate: (i) => {
    // Funds cut the conversion rate for early retirement — roughly 0.1
    // percentage point per year drawn before the AHV reference age. Floor at
    // 4% so the estimate stays plausible for very early retirees. Approximate
    // and reglement-dependent; the user can override it.
    const yearsEarly = Math.max(0, i.ahvReferenceAge - i.earliestPkAge);
    return Math.max(0.04, PILLAR_2.minConversionRate - 0.001 * yearsEarly);
  },
};

/**
 * Returns a copy of `inputs` with every key in `autoKeys` replaced by its
 * estimate. Estimates are resolved in dependency order against the
 * progressively-updated object, so dependent fields see resolved values.
 */
export function applyEstimates(inputs: CalculatorInputs, autoKeys: ReadonlySet<EstimableKey>): CalculatorInputs {
  const out = { ...inputs };
  for (const key of ESTIMABLE_ORDER) {
    if (!autoKeys.has(key)) continue;
    const raw = ESTIMATORS[key](out);
    // Rate fields keep ~0.1%-point precision; amount/age fields are integers.
    out[key] = RATE_ESTIMABLE_KEYS.has(key) ? Math.round(raw * 1000) / 1000 : Math.round(raw);
  }
  return out;
}
