import { describe, expect, it } from "vitest";
import {
  HOME_ANALYTICS_SECTIONS,
  homeClickAttrs,
  homeSectionAttrs,
} from "./home-analytics";

describe("HOME_ANALYTICS_SECTIONS", () => {
  it("has unique section ids", () => {
    const values = Object.values(HOME_ANALYTICS_SECTIONS);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("homeSectionAttrs", () => {
  it("returns data-analytics-section", () => {
    expect(homeSectionAttrs(HOME_ANALYTICS_SECTIONS.hero)).toEqual({
      "data-analytics-section": "hero",
    });
  });
});

describe("homeClickAttrs", () => {
  it("returns data-analytics-click", () => {
    expect(homeClickAttrs("hero.explore_plants")).toEqual({
      "data-analytics-click": "hero.explore_plants",
    });
  });
});
