import { AHV, DEFAULTS, PILLAR_2, PILLAR_3A } from "@/lib/engine/constants";
import { estimateAhvPension } from "@/lib/engine/tax";
import type { CalculatorInputs, PartnerInputs } from "@/lib/inputs";

/**
 * Inputs that a typical user often can't fill in confidently (pension
 * mechanics, statutory ages, an AHV pension projection). Each one can be
 * "estimated" from the figures the user *has* entered plus the verified
 * 2026 constants, so the form is usable without looking anything up. The
 * user can switch any field to manual entry to override the estimate.
 */
type PrimaryEstimableKey =
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
 * Partner fields that can be estimated. These mirror the primary person's
 * estimable fields except the household-level ones (e.g. the planning
 * horizon). They are addressed with a `partner:` prefix.
 */
const PARTNER_ESTIMABLE_FIELDS = [
  "ahvReferenceAge",
  "ahvClaimAge",
  "pillar3aUnlockAge",
  "earliestPkAge",
  "ahvAnnualPension",
  "annualPillar3aContribution",
  "healthInsuranceAnnualPremium",
  "pillar2ConversionRate",
] as const satisfies ReadonlyArray<keyof PartnerInputs>;

type PartnerEstimableField = (typeof PARTNER_ESTIMABLE_FIELDS)[number];
type PartnerEstimableKey = `partner:${PartnerEstimableField}`;

export type EstimableKey = PrimaryEstimableKey | PartnerEstimableKey;

const partnerKey = (f: PartnerEstimableField): PartnerEstimableKey => `partner:${f}`;

/**
 * Resolution order matters: fields whose estimate depends on another
 * estimable field (e.g. the 3a unlock age depends on the AHV reference
 * age) must come after their dependency so they read the resolved value.
 */
const PRIMARY_ORDER: PrimaryEstimableKey[] = [
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

/** All estimable keys (primary + partner), used to seed the auto set. */
export const ESTIMABLE_ORDER: EstimableKey[] = [
  ...PRIMARY_ORDER,
  ...PARTNER_ESTIMABLE_FIELDS.map(partnerKey),
];

/**
 * Estimable fields that hold a rate/decimal (e.g. 0.068 = 6.8%) rather than
 * an integer amount, so `applyEstimates` rounds them to a sensible precision
 * instead of to a whole number.
 */
const RATE_FIELDS: ReadonlySet<string> = new Set(["pillar2ConversionRate"]);

const round = (key: string, raw: number): number =>
  RATE_FIELDS.has(key.replace("partner:", "")) ? Math.round(raw * 1000) / 1000 : Math.round(raw);

/** Short, user-facing rationale shown under an estimated field. */
const FIELD_LABELS: Record<PrimaryEstimableKey, string> = {
  horizonAge: "Standard-Planungshorizont (95).",
  ahvReferenceAge: "Gesetzliches Referenzalter (65).",
  ahvClaimAge: "Bezug am Referenzalter angenommen.",
  pillar3aUnlockAge: "5 Jahre vor dem Referenzalter.",
  earliestPkAge: "Üblicher früheste PK-Bezug (58).",
  ahvAnnualPension: "Aus Referenzalter & Zivilstand geschätzt — bitte mit AHV-Auszug prüfen.",
  annualPillar3aContribution: "Maximalbeitrag mit Pensionskasse.",
  healthInsuranceAnnualPremium: "Grobe Pauschale pro Person.",
  pillar2ConversionRate: "BVG-Minimum 6,8 %, gekürzt um ~0,1 %-Pkt. je Jahr Vorbezug — Näherung, Reglement prüfen.",
};

export const ESTIMATE_LABELS: Record<EstimableKey, string> = {
  ...FIELD_LABELS,
  ...(Object.fromEntries(
    PARTNER_ESTIMABLE_FIELDS.map((f) => [partnerKey(f), FIELD_LABELS[f]]),
  ) as Record<PartnerEstimableKey, string>),
};

/** AHV pension assuming continuous contributions from 21 to the reference age. */
function estimateAhvFromAge(referenceAge: number, married: boolean): number {
  const single = estimateAhvPension(Math.max(0, referenceAge - 21));
  // Married couples' combined AHV is capped at 150% of a single max pension.
  return married ? Math.min(2 * single, 1.5 * AHV.maxAnnualPension) : single;
}

/** Conversion rate trimmed for early withdrawal before the reference age. */
function estimateConversionRate(referenceAge: number, earliestPkAge: number): number {
  return Math.max(0.04, PILLAR_2.minConversionRate - 0.001 * Math.max(0, referenceAge - earliestPkAge));
}

const PRIMARY_ESTIMATORS: Record<PrimaryEstimableKey, (i: CalculatorInputs) => number> = {
  horizonAge: () => DEFAULTS.horizonAge,
  ahvReferenceAge: () => AHV.referenceAgeDefault,
  ahvClaimAge: (i) => i.ahvReferenceAge,
  pillar3aUnlockAge: (i) => i.ahvReferenceAge - PILLAR_3A.earliestWithdrawalYearsBeforeReferenceAge,
  earliestPkAge: () => PILLAR_2.defaultEarliestPkAge,
  // In household mode the combined-couple AHV cap is the user's responsibility
  // (flagged in the UI); each person's own estimate is the single full-career one.
  ahvAnnualPension: (i) => estimateAhvFromAge(i.ahvReferenceAge, !i.hasPartner && i.maritalStatus === "married"),
  annualPillar3aContribution: () => PILLAR_3A.maxContributionWithPK,
  // With a partner, each person carries their own (single) premium; a married
  // single-person plan covers two people, so it doubles.
  healthInsuranceAnnualPremium: (i) =>
    !i.hasPartner && i.maritalStatus === "married"
      ? 2 * DEFAULTS.healthInsuranceAnnualPremium
      : DEFAULTS.healthInsuranceAnnualPremium,
  pillar2ConversionRate: (i) => estimateConversionRate(i.ahvReferenceAge, i.earliestPkAge),
};

const PARTNER_ESTIMATORS: Record<PartnerEstimableField, (p: PartnerInputs) => number> = {
  ahvReferenceAge: () => AHV.referenceAgeDefault,
  ahvClaimAge: (p) => p.ahvReferenceAge,
  pillar3aUnlockAge: (p) => p.ahvReferenceAge - PILLAR_3A.earliestWithdrawalYearsBeforeReferenceAge,
  earliestPkAge: () => PILLAR_2.defaultEarliestPkAge,
  ahvAnnualPension: (p) => estimateAhvFromAge(p.ahvReferenceAge, false),
  annualPillar3aContribution: () => PILLAR_3A.maxContributionWithPK,
  healthInsuranceAnnualPremium: () => DEFAULTS.healthInsuranceAnnualPremium,
  pillar2ConversionRate: (p) => estimateConversionRate(p.ahvReferenceAge, p.earliestPkAge),
};

/**
 * Returns a copy of `inputs` with every key in `autoKeys` replaced by its
 * estimate. Estimates are resolved in dependency order against the
 * progressively-updated object, so dependent fields see resolved values.
 */
export function applyEstimates(inputs: CalculatorInputs, autoKeys: ReadonlySet<EstimableKey>): CalculatorInputs {
  const out: CalculatorInputs = { ...inputs, partner: { ...inputs.partner } };

  for (const key of PRIMARY_ORDER) {
    if (autoKeys.has(key)) out[key] = round(key, PRIMARY_ESTIMATORS[key](out));
  }

  for (const field of PARTNER_ESTIMABLE_FIELDS) {
    if (autoKeys.has(partnerKey(field))) {
      out.partner[field] = round(field, PARTNER_ESTIMATORS[field](out.partner));
    }
  }

  return out;
}

/** Resolves the seed value for a key when switching it from auto to manual. */
export function estimatedValue(eff: CalculatorInputs, key: EstimableKey): number {
  if (key.startsWith("partner:")) {
    return eff.partner[key.slice("partner:".length) as PartnerEstimableField];
  }
  return eff[key as PrimaryEstimableKey];
}

/** Applies an estimated value back into the inputs object (handles partner keys). */
export function withManualSeed(inputs: CalculatorInputs, key: EstimableKey, value: number): CalculatorInputs {
  if (key.startsWith("partner:")) {
    const field = key.slice("partner:".length) as PartnerEstimableField;
    return { ...inputs, partner: { ...inputs.partner, [field]: value } };
  }
  return { ...inputs, [key]: value };
}
