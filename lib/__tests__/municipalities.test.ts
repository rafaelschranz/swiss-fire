import { describe, expect, it } from "vitest";
import type { CantonCode } from "@/lib/engine/types";
import { MUNICIPALITIES, municipalitiesForCanton, municipalityByBfs } from "@/lib/municipalities";

const ALL_CANTONS: CantonCode[] = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR",
  "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG",
  "TI", "UR", "VD", "VS", "ZG", "ZH",
];

describe("Municipality Steuerfuss factors", () => {
  it("covers every canton, each with a capital at factor 1.0", () => {
    for (const c of ALL_CANTONS) {
      const munis = municipalitiesForCanton(c);
      expect(munis.length).toBeGreaterThan(0);
      expect(munis.some((m) => m.factor === 1)).toBe(true); // the cantonal capital
    }
  });

  it("has plausible, positive factors throughout", () => {
    for (const m of MUNICIPALITIES) {
      expect(m.factor).toBeGreaterThan(0.4);
      expect(m.factor).toBeLessThan(2);
    }
  });

  it("resolves Zürich (BFS 261) at factor 1.0", () => {
    const zurich = municipalityByBfs(261);
    expect(zurich?.canton).toBe("ZH");
    expect(zurich?.factor).toBe(1);
  });
});
