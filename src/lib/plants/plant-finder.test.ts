import { describe, expect, it } from "vitest";
import {
  answersToPlantFilter,
  getDefaultLightForPlacement,
  isPlantFinderComplete,
} from "./plant-finder";

describe("getDefaultLightForPlacement", () => {
  it("suggests direct for outdoor and rooftop", () => {
    expect(getDefaultLightForPlacement("outdoor")).toBe("direct");
    expect(getDefaultLightForPlacement("rooftop")).toBe("direct");
  });

  it("suggests bright for balcony and indirect for indoor", () => {
    expect(getDefaultLightForPlacement("balcony")).toBe("bright");
    expect(getDefaultLightForPlacement("indoor")).toBe("indirect");
  });
});

describe("answersToPlantFilter", () => {
  it("always includes inStockOnly", () => {
    expect(answersToPlantFilter({}).inStockOnly).toBe(true);
  });

  it("maps light and care to API enums", () => {
    const filter = answersToPlantFilter({
      placement: "indoor",
      light: "low",
      care: "easy",
    });
    expect(filter.lightRequirement).toBe("LOW");
    expect(filter.careDifficulty).toBe("BEGINNER");
    expect(filter.inStockOnly).toBe(true);
  });

  it("maps indirect to MEDIUM and bright to BRIGHT_INDIRECT", () => {
    expect(answersToPlantFilter({ light: "indirect" }).lightRequirement).toBe("MEDIUM");
    expect(answersToPlantFilter({ light: "bright" }).lightRequirement).toBe(
      "BRIGHT_INDIRECT",
    );
  });
});

describe("isPlantFinderComplete", () => {
  it("requires all three answers", () => {
    expect(isPlantFinderComplete({ placement: "indoor" })).toBe(false);
    expect(
      isPlantFinderComplete({
        placement: "indoor",
        light: "low",
        care: "moderate",
      }),
    ).toBe(true);
  });
});
