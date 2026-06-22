import type { CantonCode, CantonTaxData } from "./types";

/**
 * 26-canton tax data table.
 *
 * Seeded with grounded figures (per project brief, 2026, "ohne Gewähr"):
 *   - Schwyz (SZ): lump-sum withdrawal tax reference points are real,
 *     cited figures: CHF 100,000 -> ~CHF 2,151; CHF 250,000 -> ~CHF 13,147.
 *     SZ has a pending Federal Court case on capital-benefit taxation —
 *     treat as provisional.
 *   - Zug (ZG), Zurich (ZH), Lucerne (LU): the brief only gives a
 *     *qualitative* ranking (ZG "low", ZH "relatively high in the
 *     250k-500k range", and a CHF 1,000,000 cross-canton spread of
 *     ~CHF 58,200 with Appenzell Innerrhoden cheapest at that amount).
 *     No absolute lump-sum reference points for ZG/ZH/LU were provided,
 *     so we do NOT invent precise numbers for their lump-sum curves —
 *     `lumpSumTax.referencePoints` for these three are explicitly marked
 *     as unverified placeholders pending real sourcing from the ESTV /
 *     cantonal calculators, even though the canton-level `verified` flag
 *     is true (their *wealth tax* curves are seeded "approximate effective
 *     curves" per the brief, which is the intended seeded content for them).
 *
 * The remaining 22 cantons are unseeded approximations (`verified: false`):
 * both their wealth-tax brackets and lump-sum reference points are rough
 * placeholders scaled off the Schwyz curve and need real grounding before
 * being relied on. Re-verify all figures every January.
 */

const SCHWYZ_REFERENCE_POINTS = [
  { amount: 100_000, tax: 2_151 },
  { amount: 250_000, tax: 13_147 },
];

/** Rough placeholder scale factor vs. Schwyz, used only for unseeded cantons. */
function placeholderLumpSumPoints(scale: number) {
  return SCHWYZ_REFERENCE_POINTS.map((p) => ({
    amount: p.amount,
    tax: Math.round(p.tax * scale),
  }));
}

const SEEDED: CantonTaxData[] = [
  {
    code: "SZ",
    name: "Schwyz",
    verified: true,
    wealthTaxBrackets: [
      { from: 0, rate: 0.0010 },
      { from: 250_000, rate: 0.0020 },
      { from: 1_000_000, rate: 0.0030 },
    ],
    incomeTaxEffectiveRate: 0.18,
    lumpSumTax: { referencePoints: SCHWYZ_REFERENCE_POINTS },
    source:
      "Project brief reference points 2026 (single, no church tax, age 65, 'ohne Gewähr'). " +
      "Pending Federal Court case on capital-benefit taxation in SZ — treat as provisional.",
  },
  {
    code: "ZG",
    name: "Zug",
    verified: true,
    wealthTaxBrackets: [
      { from: 0, rate: 0.0005 },
      { from: 250_000, rate: 0.0015 },
      { from: 1_000_000, rate: 0.0025 },
    ],
    incomeTaxEffectiveRate: 0.16,
    lumpSumTax: {
      // PLACEHOLDER: brief only states ZG is "low" qualitatively; no
      // absolute reference points given. Needs grounding before relying
      // on this canton's lump-sum curve.
      referencePoints: placeholderLumpSumPoints(0.8),
    },
    source:
      "Wealth tax: approximate effective curve seeded per brief (ZG known low-tax canton). " +
      "Lump-sum tax: unverified placeholder — brief gives no absolute figures for ZG.",
  },
  {
    code: "ZH",
    name: "Zürich",
    verified: true,
    wealthTaxBrackets: [
      { from: 0, rate: 0.0015 },
      { from: 250_000, rate: 0.0030 },
      { from: 1_000_000, rate: 0.0045 },
    ],
    incomeTaxEffectiveRate: 0.22,
    lumpSumTax: {
      // PLACEHOLDER: brief states ZH is "relatively high in the
      // 250k-500k range" qualitatively only. No absolute figures given.
      referencePoints: placeholderLumpSumPoints(1.6),
    },
    source:
      "Wealth tax: approximate effective curve seeded per brief. " +
      "Lump-sum tax: unverified placeholder — brief gives no absolute figures for ZH.",
  },
  {
    code: "LU",
    name: "Luzern",
    verified: true,
    wealthTaxBrackets: [
      { from: 0, rate: 0.0012 },
      { from: 250_000, rate: 0.0025 },
      { from: 1_000_000, rate: 0.0035 },
    ],
    incomeTaxEffectiveRate: 0.19,
    lumpSumTax: {
      // PLACEHOLDER: brief gives no qualitative or quantitative figure
      // for LU's lump-sum tax at all. Needs grounding.
      referencePoints: placeholderLumpSumPoints(1.2),
    },
    source:
      "Wealth tax: approximate effective curve seeded per brief. " +
      "Lump-sum tax: unverified placeholder — brief gives no figures for LU.",
  },
];

const UNSEEDED_CODES: CantonCode[] = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR",
  "JU", "NE", "NW", "OW", "SG", "SH", "SO", "TG", "TI", "UR",
  "VD", "VS",
];

const UNSEEDED_NAMES: Record<string, string> = {
  AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden",
  BE: "Bern", BL: "Basel-Landschaft", BS: "Basel-Stadt", FR: "Fribourg",
  GE: "Genève", GL: "Glarus", GR: "Graubünden", JU: "Jura", NE: "Neuchâtel",
  NW: "Nidwalden", OW: "Obwalden", SG: "St. Gallen", SH: "Schaffhausen",
  SO: "Solothurn", TG: "Thurgau", TI: "Ticino", UR: "Uri", VD: "Vaud",
  VS: "Valais",
};

function buildUnseededCanton(code: CantonCode): CantonTaxData {
  return {
    code,
    name: UNSEEDED_NAMES[code],
    verified: false,
    wealthTaxBrackets: [
      { from: 0, rate: 0.0015 },
      { from: 250_000, rate: 0.0030 },
      { from: 1_000_000, rate: 0.0045 },
    ],
    incomeTaxEffectiveRate: 0.20,
    lumpSumTax: { referencePoints: placeholderLumpSumPoints(1.3) },
    source:
      "UNVERIFIED PLACEHOLDER: not grounded in cited cantonal figures. " +
      "Uses a generic mid-range wealth-tax curve and a Schwyz-scaled " +
      "lump-sum tax estimate. Needs real sourcing from the cantonal tax " +
      "administration / ESTV calculator before being relied on.",
  };
}

export const CANTONS: Record<CantonCode, CantonTaxData> = Object.fromEntries(
  [...SEEDED, ...UNSEEDED_CODES.map(buildUnseededCanton)].map((c) => [c.code, c]),
) as Record<CantonCode, CantonTaxData>;

export function getCanton(code: CantonCode): CantonTaxData {
  return CANTONS[code];
}
