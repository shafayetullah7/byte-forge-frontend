import { describe, expect, it } from "vitest";
import { buildPlantsFilterHref, parsePlantsSearchParams } from "~/lib/plants/plants-url";
import { SHOP_BY_NEED_PRESETS } from "./need-presets";

function queryFromHref(href: string): Record<string, string> {
  const query = href.includes("?") ? href.split("?")[1] : "";
  return Object.fromEntries(new URLSearchParams(query));
}

describe("SHOP_BY_NEED_PRESETS", () => {
  it("has at least one preset", () => {
    expect(SHOP_BY_NEED_PRESETS.length).toBeGreaterThan(0);
  });

  it.each(SHOP_BY_NEED_PRESETS.map((p) => [p.id, p] as const))(
    "%s links to /plants with parseable filter params",
    (_id, preset) => {
      const href = buildPlantsFilterHref(preset.filter);
      expect(href.startsWith("/plants")).toBe(true);
      const parsed = parsePlantsSearchParams(queryFromHref(href));
      if (preset.filter.careDifficulty) {
        expect(parsed.careDifficulty).toBe(preset.filter.careDifficulty);
      }
      if (preset.filter.lightRequirement) {
        expect(parsed.lightRequirement).toBe(preset.filter.lightRequirement);
      }
      if (preset.filter.inStockOnly) {
        expect(parsed.inStockOnly).toBe(true);
      }
      if (preset.filter.maxPrice !== undefined) {
        expect(parsed.maxPrice).toBe(String(preset.filter.maxPrice));
      }
    },
  );
});
