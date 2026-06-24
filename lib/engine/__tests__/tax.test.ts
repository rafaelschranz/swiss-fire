import { describe, expect, it } from "vitest";
import { CANTONS } from "../cantons";
import { PILLAR_2, PILLAR_3A } from "../constants";
import { cappedPillar3aContribution, coordinatedSalary, federalCapitalTax, federalIncomeTax, lumpSumTax, nonEmployedAhvContribution } from "../tax";

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

describe("Non-employed AHV contribution", () => {
  // Figures include the 5% administrative-cost surcharge added by the funds.
  it("is at (or near) the minimum bracket at wealth 350k", () => {
    const contribution = nonEmployedAhvContribution(350_000, 0, "single");
    expect(contribution).toBeCloseTo(530 * 1.05, 0); // 556.5
  });

  it("hits the CHF 26,500 cap (+admin) at wealth >= ~8.8M", () => {
    const contribution = nonEmployedAhvContribution(8_800_000, 0, "single");
    expect(contribution).toBeCloseTo(26_500 * 1.05, 0); // 27'825
  });

  it("is monotonically increasing with wealth between the anchors", () => {
    const low = nonEmployedAhvContribution(1_000_000, 0, "single");
    const high = nonEmployedAhvContribution(5_000_000, 0, "single");
    expect(high).toBeGreaterThan(low);
  });

  it("halves the basis for married couples", () => {
    const single = nonEmployedAhvContribution(2_000_000, 0, "single");
    const married = nonEmployedAhvContribution(4_000_000, 0, "married");
    expect(married).toBeCloseTo(single, 0);
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
