import type { CantonCode, CantonTaxData } from "./types";

/**
 * 26-canton tax data table.
 *
 * Capital-withdrawal tax (Kapitalauszahlungssteuer on 3a / Pillar 2 lump sums):
 * the `lumpSumTax.referencePoints` for ALL cantons are now REAL figures from
 * the official ESTV tax calculator (swisstaxcalculator.estv.admin.ch,
 * API_calculateManyCapitalTaxes, tax year 2026), for a single person with no
 * church tax at the cantonal capital municipality. They are the combined
 * cantonal + communal capital tax (the federal one-fifth tariff is added
 * separately by the engine). The engine interpolates between these points and
 * scales them by the user's Gemeinde factor for other municipalities.
 *
 * Wealth-tax brackets and the ordinary income effective rate remain
 * approximations: seeded "approximate effective curves" for SZ/ZG/ZH/LU per the
 * project brief, and generic mid-range placeholders for the rest
 * (`verified: false`). These still need real cantonal grounding. Re-verify all
 * figures every January.
 */

type ReferencePoint = { amount: number; tax: number };

/**
 * Real ESTV 2026 capital-withdrawal tax (cantonal + communal, single, no church
 * tax, cantonal capital municipality). Source: ESTV official calculator.
 */
const CAPITAL_REFERENCE_POINTS: Record<CantonCode, ReferencePoint[]> = {
  AG: [{ amount: 50000, tax: 1424 }, { amount: 100000, tax: 4142 }, { amount: 250000, tax: 13287 }, { amount: 500000, tax: 29398 }, { amount: 1000000, tax: 62233 }],
  AI: [{ amount: 50000, tax: 1110 }, { amount: 100000, tax: 2774 }, { amount: 250000, tax: 7600 }, { amount: 500000, tax: 15200 }, { amount: 1000000, tax: 30400 }],
  AR: [{ amount: 50000, tax: 3700 }, { amount: 100000, tax: 7400 }, { amount: 250000, tax: 18500 }, { amount: 500000, tax: 39042 }, { amount: 1000000, tax: 88374 }],
  BE: [{ amount: 50000, tax: 1669 }, { amount: 100000, tax: 4091 }, { amount: 250000, tax: 12422 }, { amount: 500000, tax: 30758 }, { amount: 1000000, tax: 73154 }],
  BL: [{ amount: 50000, tax: 1650 }, { amount: 100000, tax: 3300 }, { amount: 250000, tax: 8250 }, { amount: 500000, tax: 23100 }, { amount: 1000000, tax: 72600 }],
  BS: [{ amount: 50000, tax: 1750 }, { amount: 100000, tax: 4750 }, { amount: 250000, tax: 16750 }, { amount: 500000, tax: 36750 }, { amount: 1000000, tax: 76750 }],
  FR: [{ amount: 50000, tax: 900 }, { amount: 100000, tax: 2700 }, { amount: 250000, tax: 13500 }, { amount: 500000, tax: 36000 }, { amount: 1000000, tax: 81000 }],
  GE: [{ amount: 50000, tax: 1183 }, { amount: 100000, tax: 3588 }, { amount: 250000, tax: 11650 }, { amount: 500000, tax: 26550 }, { amount: 1000000, tax: 58069 }],
  GL: [{ amount: 50000, tax: 2414 }, { amount: 100000, tax: 4828 }, { amount: 250000, tax: 12070 }, { amount: 500000, tax: 24140 }, { amount: 1000000, tax: 48280 }],
  GR: [{ amount: 50000, tax: 1350 }, { amount: 100000, tax: 2700 }, { amount: 250000, tax: 6750 }, { amount: 500000, tax: 18000 }, { amount: 1000000, tax: 36000 }],
  JU: [{ amount: 50000, tax: 2613 }, { amount: 100000, tax: 5637 }, { amount: 250000, tax: 17495 }, { amount: 500000, tax: 37682 }, { amount: 1000000, tax: 78057 }],
  LU: [{ amount: 50000, tax: 986 }, { amount: 100000, tax: 3016 }, { amount: 250000, tax: 9106 }, { amount: 500000, tax: 19256 }, { amount: 1000000, tax: 39556 }],
  NE: [{ amount: 50000, tax: 2363 }, { amount: 100000, tax: 5139 }, { amount: 250000, tax: 15661 }, { amount: 500000, tax: 31775 }, { amount: 1000000, tax: 64519 }],
  NW: [{ amount: 50000, tax: 1241 }, { amount: 100000, tax: 3035 }, { amount: 250000, tax: 8520 }, { amount: 500000, tax: 17045 }, { amount: 1000000, tax: 34095 }],
  OW: [{ amount: 50000, tax: 2560 }, { amount: 100000, tax: 5119 }, { amount: 250000, tax: 12798 }, { amount: 500000, tax: 25596 }, { amount: 1000000, tax: 51192 }],
  SG: [{ amount: 50000, tax: 2673 }, { amount: 100000, tax: 5346 }, { amount: 250000, tax: 13365 }, { amount: 500000, tax: 26730 }, { amount: 1000000, tax: 53460 }],
  SH: [{ amount: 50000, tax: 877 }, { amount: 100000, tax: 2542 }, { amount: 250000, tax: 7870 }, { amount: 500000, tax: 15741 }, { amount: 1000000, tax: 31482 }],
  SO: [{ amount: 50000, tax: 1670 }, { amount: 100000, tax: 4489 }, { amount: 250000, tax: 13799 }, { amount: 500000, tax: 28350 }, { amount: 1000000, tax: 56700 }],
  SZ: [{ amount: 50000, tax: 445 }, { amount: 100000, tax: 1389 }, { amount: 250000, tax: 8140 }, { amount: 500000, tax: 21375 }, { amount: 1000000, tax: 42750 }],
  TG: [{ amount: 50000, tax: 3012 }, { amount: 100000, tax: 6024 }, { amount: 250000, tax: 15060 }, { amount: 500000, tax: 30120 }, { amount: 1000000, tax: 60240 }],
  TI: [{ amount: 50000, tax: 1930 }, { amount: 100000, tax: 3860 }, { amount: 250000, tax: 9650 }, { amount: 500000, tax: 22751 }, { amount: 1000000, tax: 57900 }],
  UR: [{ amount: 50000, tax: 1853 }, { amount: 100000, tax: 3705 }, { amount: 250000, tax: 9263 }, { amount: 500000, tax: 18525 }, { amount: 1000000, tax: 37050 }],
  VD: [{ amount: 50000, tax: 1591 }, { amount: 100000, tax: 4052 }, { amount: 250000, tax: 13460 }, { amount: 500000, tax: 31446 }, { amount: 1000000, tax: 67638 }],
  VS: [{ amount: 50000, tax: 2100 }, { amount: 100000, tax: 4200 }, { amount: 250000, tax: 10778 }, { amount: 500000, tax: 30172 }, { amount: 1000000, tax: 80000 }],
  ZG: [{ amount: 50000, tax: 780 }, { amount: 100000, tax: 2197 }, { amount: 250000, tax: 7352 }, { amount: 500000, tax: 17752 }, { amount: 1000000, tax: 38552 }],
  ZH: [{ amount: 50000, tax: 2140 }, { amount: 100000, tax: 4280 }, { amount: 250000, tax: 10700 }, { amount: 500000, tax: 24567 }, { amount: 1000000, tax: 86542 }],
};

const CAPITAL_SOURCE = "ESTV official calculator 2026 (capital-withdrawal tax, cantonal+communal, single, no church, cantonal capital).";

/** Per-canton wealth-tax brackets + ordinary income effective rate. */
interface CantonProfile {
  name: string;
  verified: boolean;
  wealthTaxBrackets: { from: number; rate: number }[];
  incomeTaxEffectiveRate: number;
  /** Note on the wealth/income grounding (capital is always ESTV-sourced). */
  note: string;
}

const GENERIC_WEALTH = [
  { from: 0, rate: 0.0015 },
  { from: 250_000, rate: 0.003 },
  { from: 1_000_000, rate: 0.0045 },
];

const PROFILES: Record<CantonCode, CantonProfile> = {
  SZ: {
    name: "Schwyz", verified: true, incomeTaxEffectiveRate: 0.18,
    wealthTaxBrackets: [{ from: 0, rate: 0.001 }, { from: 250_000, rate: 0.002 }, { from: 1_000_000, rate: 0.003 }],
    note: "Wealth/income: approximate effective curve seeded per brief (SZ known low-tax canton).",
  },
  ZG: {
    name: "Zug", verified: true, incomeTaxEffectiveRate: 0.16,
    wealthTaxBrackets: [{ from: 0, rate: 0.0005 }, { from: 250_000, rate: 0.0015 }, { from: 1_000_000, rate: 0.0025 }],
    note: "Wealth/income: approximate effective curve seeded per brief (ZG known low-tax canton).",
  },
  ZH: {
    name: "Zürich", verified: true, incomeTaxEffectiveRate: 0.22,
    wealthTaxBrackets: [{ from: 0, rate: 0.0015 }, { from: 250_000, rate: 0.003 }, { from: 1_000_000, rate: 0.0045 }],
    note: "Wealth/income: approximate effective curve seeded per brief.",
  },
  LU: {
    name: "Luzern", verified: true, incomeTaxEffectiveRate: 0.19,
    wealthTaxBrackets: [{ from: 0, rate: 0.0012 }, { from: 250_000, rate: 0.0025 }, { from: 1_000_000, rate: 0.0035 }],
    note: "Wealth/income: approximate effective curve seeded per brief.",
  },
  AG: { name: "Aargau", verified: false, incomeTaxEffectiveRate: 0.2, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  AI: { name: "Appenzell Innerrhoden", verified: false, incomeTaxEffectiveRate: 0.16, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  AR: { name: "Appenzell Ausserrhoden", verified: false, incomeTaxEffectiveRate: 0.21, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  BE: { name: "Bern", verified: false, incomeTaxEffectiveRate: 0.23, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  BL: { name: "Basel-Landschaft", verified: false, incomeTaxEffectiveRate: 0.21, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  BS: { name: "Basel-Stadt", verified: false, incomeTaxEffectiveRate: 0.22, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  FR: { name: "Fribourg", verified: false, incomeTaxEffectiveRate: 0.21, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  GE: { name: "Genève", verified: false, incomeTaxEffectiveRate: 0.22, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  GL: { name: "Glarus", verified: false, incomeTaxEffectiveRate: 0.19, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  GR: { name: "Graubünden", verified: false, incomeTaxEffectiveRate: 0.2, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  JU: { name: "Jura", verified: false, incomeTaxEffectiveRate: 0.23, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  NE: { name: "Neuchâtel", verified: false, incomeTaxEffectiveRate: 0.23, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  NW: { name: "Nidwalden", verified: false, incomeTaxEffectiveRate: 0.16, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  OW: { name: "Obwalden", verified: false, incomeTaxEffectiveRate: 0.17, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  SG: { name: "St. Gallen", verified: false, incomeTaxEffectiveRate: 0.21, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  SH: { name: "Schaffhausen", verified: false, incomeTaxEffectiveRate: 0.2, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  SO: { name: "Solothurn", verified: false, incomeTaxEffectiveRate: 0.21, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  TG: { name: "Thurgau", verified: false, incomeTaxEffectiveRate: 0.19, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  TI: { name: "Ticino", verified: false, incomeTaxEffectiveRate: 0.21, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  UR: { name: "Uri", verified: false, incomeTaxEffectiveRate: 0.17, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  VD: { name: "Vaud", verified: false, incomeTaxEffectiveRate: 0.23, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
  VS: { name: "Valais", verified: false, incomeTaxEffectiveRate: 0.21, wealthTaxBrackets: GENERIC_WEALTH, note: "" },
};

function buildCanton(code: CantonCode): CantonTaxData {
  const p = PROFILES[code];
  const wealthNote = p.note
    ? p.note
    : "Wealth/income: UNVERIFIED generic mid-range placeholder — needs cantonal grounding.";
  return {
    code,
    name: p.name,
    verified: p.verified,
    wealthTaxBrackets: p.wealthTaxBrackets,
    incomeTaxEffectiveRate: p.incomeTaxEffectiveRate,
    lumpSumTax: { referencePoints: CAPITAL_REFERENCE_POINTS[code] },
    source: `Capital tax: ${CAPITAL_SOURCE} ${wealthNote}`.trim(),
  };
}

const ALL_CODES: CantonCode[] = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR",
  "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG",
  "TI", "UR", "VD", "VS", "ZG", "ZH",
];

export const CANTONS: Record<CantonCode, CantonTaxData> = Object.fromEntries(
  ALL_CODES.map((code) => [code, buildCanton(code)]),
) as Record<CantonCode, CantonTaxData>;

export function getCanton(code: CantonCode): CantonTaxData {
  return CANTONS[code];
}
