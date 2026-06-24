import { describe, expect, it } from "vitest";
import { ESTIMABLE_ORDER } from "@/lib/estimates";
import { DEFAULT_INPUTS } from "@/lib/inputs";
import { decodeShareHash, encodeShareHash } from "@/lib/share";

describe("Scenario share codec", () => {
  it("round-trips inputs and auto-keys through the URL hash", () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      currentAge: 41,
      hasPartner: true,
      oneOffInflows: [{ age: 50, amount: 250_000, label: "Erbschaft (Tante Söönke)" }],
      partner: { ...DEFAULT_INPUTS.partner, currentAge: 39, ahvAnnualPension: 21_500 },
    };
    const autoKeys = new Set(ESTIMABLE_ORDER.slice(0, 3));

    const hash = encodeShareHash(inputs, autoKeys);
    expect(hash.startsWith("#s=")).toBe(true);

    const decoded = decodeShareHash(hash)!;
    expect(decoded).not.toBeNull();
    expect(decoded.inputs.currentAge).toBe(41);
    expect(decoded.inputs.hasPartner).toBe(true);
    expect(decoded.inputs.partner.currentAge).toBe(39);
    expect(decoded.inputs.oneOffInflows[0].label).toBe("Erbschaft (Tante Söönke)"); // unicode survives
    expect(decoded.autoKeys.sort()).toEqual(ESTIMABLE_ORDER.slice(0, 3).sort());
  });

  it("returns null for an absent or malformed hash", () => {
    expect(decodeShareHash("")).toBeNull();
    expect(decodeShareHash("#other=1")).toBeNull();
    expect(decodeShareHash("#s=not-valid-base64!!")).toBeNull();
  });

  it("fills missing fields from defaults (forward-compatible links)", () => {
    const hash = encodeShareHash({ ...DEFAULT_INPUTS, currentAge: 33 }, new Set());
    const decoded = decodeShareHash(hash)!;
    // A field not present in a minimal payload still resolves to the default.
    expect(decoded.inputs.horizonAge).toBe(DEFAULT_INPUTS.horizonAge);
    expect(decoded.inputs.partner.fireAge).toBe(DEFAULT_INPUTS.partner.fireAge);
  });
});
