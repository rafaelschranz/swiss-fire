import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import { PILLAR_2, PILLAR_3A } from "../constants";
import { adjustedAhvPension, cantonalIncomeTax, cantonalWealthTax, cappedPillar3aContribution, coordinatedSalary, federalCapitalTax, federalIncomeTax, lumpSumTax, nonEmployedAhvContribution } from "../tax";

describe("Cantonal income & wealth tax (real ESTV 2026 curves)", () => {
  it("matches the embedded ESTV reference points (Zürich)", () => {
    expect(cantonalIncomeTax(CANTONS.ZH, 100_000, false)).toBeCloseTo(12_356, 0); // single
    expect(cantonalIncomeTax(CANTONS.ZH, 100_000, true)).toBeCloseTo(8_767, 0); // married
    expect(cantonalWealthTax(CANTONS.ZH, 500_000, false)).toBeCloseTo(639, 0);
  });

  it("interpolates between points and is monotonic", () => {
    const a = cantonalIncomeTax(CANTONS.ZH, 60_000, false);
    const b = cantonalIncomeTax(CANTONS.ZH, 80_000, false);
    expect(b).toBeGreaterThan(a);
    // 60k lies between the 50k and 75k points (3670 and 7666).
    expect(a).toBeGreaterThan(3_670);
    expect(a).toBeLessThan(7_666);
  });

  it("married income tax is below single at the same income; low-tax cantons rank below high-tax", () => {
    expect(cantonalIncomeTax(CANTONS.ZG, 100_000, false)).toBeLessThan(cantonalIncomeTax(CANTONS.ZH, 100_000, false));
    expect(cantonalIncomeTax(CANTONS.BE, 100_000, false)).toBeGreaterThan(cantonalIncomeTax(CANTONS.ZG, 100_000, false));
  });
});

describe("Federal direct income tax (2026 tariff)", () => {
  it("matches the ESTV tariff at reference incomes (single)", () => {
    expect(federalIncomeTax(60_000, false)).toBeCloseTo(671.4, 1);
    expect(federalIncomeTax(100_000, false)).toBeCloseTo(2684.35, 1);
    expect(federalIncomeTax(150_000, false)).toBeCloseTo(7075.55, 1);
  });

  it("matches the ESTV tariff at reference incomes (married)", () => {
    expect(federalIncomeTax(100_000, true)).toBeCloseTo(1816, 1);
    expect(federalIncomeTax(150_000, true)).toBeCloseTo(5408, 1);
  });

  it("is zero below the tax-free threshold and married is below single", () => {
    expect(federalIncomeTax(14_000, false)).toBe(0);
    expect(federalIncomeTax(120_000, true)).toBeLessThan(federalIncomeTax(120_000, false));
  });

  it("taxes capital benefits at one-fifth of the ordinary tariff (Art. 38 DBG)", () => {
    expect(federalCapitalTax(100_000, false)).toBeCloseTo(federalIncomeTax(100_000, false) / 5, 6);
  });
});

describe("Pillar 3a contribution capping", () => {
  it("caps at the statutory maximum with a pension fund", () => {
    expect(cappedPillar3aContribution(10_000, true)).toBe(PILLAR_3A.maxContributionWithPK);
  });

  it("passes through a requested amount under the cap", () => {
    expect(cappedPillar3aContribution(5_000, true)).toBe(5_000);
  });

  it("rejects (caps) contributions above the maximum without a PK at 20% of net income", () => {
    const netIncome = 50_000;
    const expectedCap = netIncome * PILLAR_3A.maxContributionWithoutPKRate;
    expect(cappedPillar3aContribution(100_000, false, netIncome)).toBeCloseTo(expectedCap);
  });
});

describe("Coordinated salary", () => {
  it("clamps salary - coordinationDeduction within [min, max]", () => {
    const salary = 70_000;
    const expected = Math.min(
      Math.max(salary - PILLAR_2.coordinationDeduction, PILLAR_2.minCoordinatedSalary),
      PILLAR_2.maxCoordinatedSalary,
    );
    expect(coordinatedSalary(salary)).toBeCloseTo(expected);
    expect(coordinatedSalary(salary)).toBeCloseTo(43_540, 0);
  });

  it("returns 0 below the BVG entry threshold", () => {
    expect(coordinatedSalary(20_000)).toBe(0);
  });
});

describe("Non-employed AHV contribution (official 2026 Beitragstabelle)", () => {
  it("matches the official table at its grid points", () => {
    // Source: ahv-iv.ch Merkblatt 2.03, Stand 1.1.2026.
    expect(nonEmployedAhvContribution(300_000, 0, "single")).toBe(530); // below threshold → minimum
    expect(nonEmployedAhvContribution(400_000, 0, "single")).toBeCloseTo(742, 0);
    expect(nonEmployedAhvContribution(1_000_000, 0, "single")).toBeCloseTo(2_014, 0);
    expect(nonEmployedAhvContribution(1_750_000, 0, "single")).toBeCloseTo(3_604, 0); // kink
    expect(nonEmployedAhvContribution(2_000_000, 0, "single")).toBeCloseTo(4_399, 0); // steeper segment
    expect(nonEmployedAhvContribution(8_950_000, 0, "single")).toBe(26_500); // maximum
  });

  it("caps at CHF 26,500 above 8.95M and stays below it just under", () => {
    expect(nonEmployedAhvContribution(12_000_000, 0, "single")).toBe(26_500);
    expect(nonEmployedAhvContribution(8_800_000, 0, "single")).toBeLessThan(26_500);
  });

  it("halves the basis for married couples", () => {
    const single = nonEmployedAhvContribution(2_000_000, 0, "single");
    const married = nonEmployedAhvContribution(4_000_000, 0, "married");
    expect(married).toBeCloseTo(single, 0);
  });
});

describe("AHV flexible-draw adjustment (official 2026 rates)", () => {
  it("reduces the pension for early withdrawal (6.8%/yr, not symmetric to deferral)", () => {
    expect(adjustedAhvPension(1000, 64, 65)).toBeCloseTo(932, 0); // 1 year early
    expect(adjustedAhvPension(1000, 63, 65)).toBeCloseTo(864, 0); // 2 years early
  });

  it("increases the pension for deferral per the Aufschub table", () => {
    expect(adjustedAhvPension(1000, 65, 65)).toBe(1000);
    expect(adjustedAhvPension(1000, 66, 65)).toBeCloseTo(1052, 0); // +1 yr → +5.2%
    expect(adjustedAhvPension(1000, 70, 65)).toBeCloseTo(1315, 0); // +5 yr → +31.5%
  });
});

describe("Lump-sum withdrawal tax (Schwyz)", () => {
  const sz = CANTONS.SZ;

  // ESTV 2026 capital tax (cantonal + communal, Schwyz town, single, no church).
  it("matches the ESTV reference point at 250,000", () => {
    expect(lumpSumTax(sz, 250_000)).toBeCloseTo(8_140, 0);
  });

  it("matches the ESTV reference point at 100,000", () => {
    expect(lumpSumTax(sz, 100_000)).toBeCloseTo(1_389, 0);
  });

  it("is monotonically increasing in amount", () => {
    const amounts = [50_000, 100_000, 150_000, 250_000, 400_000, 600_000];
    for (let i = 1; i < amounts.length; i++) {
      expect(lumpSumTax(sz, amounts[i])).toBeGreaterThan(lumpSumTax(sz, amounts[i - 1]));
    }
  });

  it("is progressive: average effective rate increases with amount", () => {
    const rateAt = (amount: number) => lumpSumTax(sz, amount) / amount;
    expect(rateAt(250_000)).toBeGreaterThan(rateAt(100_000));
    expect(rateAt(600_000)).toBeGreaterThan(rateAt(250_000));
  });

  it("taxes a single large lump more than the sum of two smaller lumps (same total)", () => {
    const combined = lumpSumTax(sz, 400_000);
    const staggered = lumpSumTax(sz, 200_000) + lumpSumTax(sz, 200_000);
    expect(combined).toBeGreaterThan(staggered);
  });
});
