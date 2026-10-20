import { describe, expect, it } from "vitest";
import { BUDGET_FINDS_DISPLAY_CAP, excludePlantIds } from "./budget-finds";

describe("excludePlantIds", () => {
  const plants = [
    { id: "a", name: "A" },
    { id: "b", name: "B" },
    { id: "c", name: "C" },
    { id: "d", name: "D" },
    { id: "e", name: "E" },
  ];

  it("removes excluded ids", () => {
    const result = excludePlantIds(plants, new Set(["b", "d"]));
    expect(result.map((p) => p.id)).toEqual(["a", "c", "e"]);
  });

  it("caps output length", () => {
    const result = excludePlantIds(plants, new Set(), 2);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("a");
  });

  it("defaults max to BUDGET_FINDS_DISPLAY_CAP", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ id: String(i) }));
    expect(excludePlantIds(many, new Set()).length).toBe(BUDGET_FINDS_DISPLAY_CAP);
  });
});
