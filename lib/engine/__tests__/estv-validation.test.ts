import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import { cantonalIncomeTax, cantonalWealthTax, federalIncomeTax } from "../tax";
import type { CantonCode } from "../types";

/**
 * End-to-end cross-check against the official ESTV calculator
 * (swisstaxcalculator.estv.admin.ch, tax year 2026, cantonal capital, no church,
 * pension income). The engine's assembled total — cantonal+communal income tax
 * (from the embedded ESTV curve) plus the federal direct tax — is compared to
 * ESTV's reported total. Expected within a few percent: the small gap is from
 * linear interpolation between the embedded grid points and the federal tax
 * being computed on gross income (ESTV's standard deductions are reflected in
 * the cantonal curve but not in the federal piece here).
 */
interface Scenario {
  canton: CantonCode;
  married: boolean;
  income: number;
  fortune: number;
  estvIncomeTotal: number; // cantonal + communal + federal
  estvFortuneTotal: number; // cantonal + communal
}

const SCENARIOS: Scenario[] = [
  { canton: "ZH", married: false, income: 60_000, fortune: 500_000, estvIncomeTotal: 5_760, estvFortuneTotal: 639 },
  { canton: "BE", married: true, income: 80_000, fortune: 1_000_000, estvIncomeTotal: 10_254, estvFortuneTotal: 3_929 },
  { canton: "ZG", married: false, income: 100_000, fortune: 2_000_000, estvIncomeTotal: 7_189, estvFortuneTotal: 3_127 },
];

const within = (actual: number, expected: number, pct: number) =>
  Math.abs(actual - expected) <= (pct / 100) * expected;

describe("ESTV cross-check (2026)", () => {
  for (const s of SCENARIOS) {
    const canton = CANTONS[s.canton];
    it(`${s.canton} ${s.married ? "married" : "single"}: income tax within 6% of ESTV`, () => {
      const engine = cantonalIncomeTax(canton, s.income, s.married) + federalIncomeTax(s.income, s.married);
      expect(within(engine, s.estvIncomeTotal, 6)).toBe(true);
    });

    it(`${s.canton} ${s.married ? "married" : "single"}: wealth tax within 2% of ESTV`, () => {
      const engine = cantonalWealthTax(canton, s.fortune, s.married);
      expect(within(engine, s.estvFortuneTotal, 2)).toBe(true);
    });
  }
});
