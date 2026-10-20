import { describe, expect, it } from "vitest";
import { evaluateHeroStatsDisplay } from "./hero-public-stats";

describe("evaluateHeroStatsDisplay", () => {
  it("returns numeric when both totals meet minimum", () => {
    expect(evaluateHeroStatsDisplay(3, 42)).toEqual({
      mode: "numeric",
      shopCount: 3,
      plantCount: 42,
    });
  });

  it("returns qualitative when either total is below minimum", () => {
    expect(evaluateHeroStatsDisplay(0, 10)).toEqual({ mode: "qualitative" });
    expect(evaluateHeroStatsDisplay(2, 0)).toEqual({ mode: "qualitative" });
  });

  it("returns qualitative for invalid totals", () => {
    expect(evaluateHeroStatsDisplay(NaN, 1)).toEqual({ mode: "qualitative" });
    expect(evaluateHeroStatsDisplay(1, -1)).toEqual({ mode: "qualitative" });
  });

  it("floors non-integer totals", () => {
    expect(evaluateHeroStatsDisplay(2.9, 10.1)).toEqual({
      mode: "numeric",
      shopCount: 2,
      plantCount: 10,
    });
  });
});
