import { describe, expect, it } from "vitest";
import {
  FEATURED_SHOPS_DISPLAY_LIMIT,
  getUtcDayIndex,
  selectFeaturedShopWindow,
} from "./featured-shops-rotation";

describe("getUtcDayIndex", () => {
  it("increments per UTC day", () => {
    const a = new Date("2024-01-01T12:00:00.000Z");
    const b = new Date("2024-01-02T00:00:00.000Z");
    expect(getUtcDayIndex(b)).toBe(getUtcDayIndex(a) + 1);
  });
});

describe("selectFeaturedShopWindow", () => {
  const pool = ["a", "b", "c", "d", "e"];

  it("returns empty for empty pool", () => {
    expect(selectFeaturedShopWindow([], 3, 0)).toEqual([]);
  });

  it("returns full pool when smaller than display limit", () => {
    expect(selectFeaturedShopWindow(["x", "y"], 3, 5)).toEqual(["x", "y"]);
  });

  it("wraps when start plus limit exceeds length", () => {
    const day0 = selectFeaturedShopWindow(pool, 3, 0);
    expect(day0).toEqual(["a", "b", "c"]);

    const day1Start = (1 * FEATURED_SHOPS_DISPLAY_LIMIT) % pool.length;
    expect(day1Start).toBe(3);
    expect(selectFeaturedShopWindow(pool, 3, 1)).toEqual(["d", "e", "a"]);
  });

  it("cycles windows over days", () => {
    const w0 = selectFeaturedShopWindow(pool, 3, 0);
    const w1 = selectFeaturedShopWindow(pool, 3, 1);
    expect(w0).not.toEqual(w1);
  });
});
