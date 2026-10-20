import { describe, expect, it } from "vitest";
import {
  PLANTS_URL_PARAM_KEYS,
  buildPlantsFilterHref,
  canonicalPlantsQueryString,
  parsePlantsSearchParams,
  parsedPlantsUrlStatesEqual,
  plantsUrlSearchParamsToSetterObject,
  serializePlantsUrlState,
  type ParsedPlantsUrlState,
} from "./plants-url";

const CATEGORY_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const TAG_1 = "11111111-2222-4333-8444-555555555551";
const TAG_2 = "11111111-2222-4333-8444-555555555552";

describe("parsePlantsSearchParams", () => {
  it("returns defaults for empty params", () => {
    const parsed = parsePlantsSearchParams({});
    expect(parsed.search).toBe("");
    expect(parsed.categoryId).toBe("");
    expect(parsed.selectedTagIds.size).toBe(0);
    expect(parsed.careDifficulty).toBe("");
    expect(parsed.inStockOnly).toBe(false);
    expect(parsed.sortBy).toBe("name");
    expect(parsed.sortOrder).toBe("asc");
    expect(parsed.page).toBe(1);
  });

  it("parses search, careDifficulty, and categoryId", () => {
    const parsed = parsePlantsSearchParams({
      search: "  pothos ",
      careDifficulty: "BEGINNER",
      categoryId: CATEGORY_ID,
    });
    expect(parsed.search).toBe("pothos");
    expect(parsed.careDifficulty).toBe("BEGINNER");
    expect(parsed.categoryId).toBe(CATEGORY_ID);
  });

  it("ignores invalid careDifficulty", () => {
    const parsed = parsePlantsSearchParams({ careDifficulty: "foo" });
    expect(parsed.careDifficulty).toBe("");
  });

  it("parses tagIds and strips invalid UUIDs", () => {
    const parsed = parsePlantsSearchParams({
      tagIds: `${TAG_1},not-a-uuid,${TAG_2}`,
    });
    expect([...parsed.selectedTagIds]).toEqual([TAG_1, TAG_2]);
  });

  it("caps tagIds at 10", () => {
    const ids = Array.from({ length: 12 }, (_, i) =>
      `11111111-2222-4333-8444-5555555555${String(i).padStart(2, "0")}`,
    );
    const parsed = parsePlantsSearchParams({ tagIds: ids.join(",") });
    expect(parsed.selectedTagIds.size).toBe(10);
  });

  it("parses minPrice and maxPrice", () => {
    const parsed = parsePlantsSearchParams({
      minPrice: "100",
      maxPrice: "500.5",
    });
    expect(parsed.minPrice).toBe("100");
    expect(parsed.maxPrice).toBe("500.5");
  });

  it("rejects negative prices", () => {
    const parsed = parsePlantsSearchParams({ minPrice: "-1" });
    expect(parsed.minPrice).toBe("");
  });

  it("parses inStockOnly", () => {
    expect(parsePlantsSearchParams({ inStockOnly: "true" }).inStockOnly).toBe(
      true,
    );
    expect(parsePlantsSearchParams({ inStockOnly: "1" }).inStockOnly).toBe(true);
    expect(parsePlantsSearchParams({ inStockOnly: "" }).inStockOnly).toBe(true);
    expect(parsePlantsSearchParams({}).inStockOnly).toBe(false);
  });

  it("parses page", () => {
    expect(parsePlantsSearchParams({ page: "3" }).page).toBe(3);
    expect(parsePlantsSearchParams({ page: "0" }).page).toBe(1);
    expect(parsePlantsSearchParams({ page: "x" }).page).toBe(1);
  });

  it("parses sortBy and sortOrder", () => {
    const parsed = parsePlantsSearchParams({
      sortBy: "price",
      sortOrder: "desc",
    });
    expect(parsed.sortBy).toBe("price");
    expect(parsed.sortOrder).toBe("desc");
  });

  it("rejects invalid categoryId", () => {
    expect(parsePlantsSearchParams({ categoryId: "not-uuid" }).categoryId).toBe(
      "",
    );
  });
});

function fullState(overrides: Partial<ParsedPlantsUrlState> = {}): ParsedPlantsUrlState {
  return {
    search: "",
    categoryId: "",
    selectedTagIds: new Set(),
    careDifficulty: "",
    lightRequirement: "",
    wateringFrequency: "",
    humidityLevel: "",
    growthRate: "",
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    sortBy: "name",
    sortOrder: "asc",
    page: 1,
    ...overrides,
  };
}

describe("serializePlantsUrlState", () => {
  it("omits defaults for empty state", () => {
    expect(serializePlantsUrlState(fullState()).toString()).toBe("");
  });

  it("serializes filters and page", () => {
    const serialized = serializePlantsUrlState(
      fullState({
        search: "pothos",
        careDifficulty: "BEGINNER",
        categoryId: CATEGORY_ID,
        page: 3,
        sortBy: "price",
        sortOrder: "desc",
      }),
    );
    expect(serialized.get("search")).toBe("pothos");
    expect(serialized.get("careDifficulty")).toBe("BEGINNER");
    expect(serialized.get("categoryId")).toBe(CATEGORY_ID);
    expect(serialized.get("page")).toBe("3");
    expect(serialized.get("sortBy")).toBe("price");
    expect(serialized.get("sortOrder")).toBe("desc");
  });

  it("sorts tagIds for stable query strings", () => {
    const a = serializePlantsUrlState(
      fullState({ selectedTagIds: new Set([TAG_2, TAG_1]) }),
    ).toString();
    const b = serializePlantsUrlState(
      fullState({ selectedTagIds: new Set([TAG_1, TAG_2]) }),
    ).toString();
    expect(a).toBe(b);
    expect(a).toContain(TAG_1);
    expect(a).toContain(TAG_2);
  });

  it("round-trips through parse", () => {
    const original = fullState({
      search: "monstera",
      inStockOnly: true,
      minPrice: "50",
      maxPrice: "200",
      selectedTagIds: new Set([TAG_1]),
      page: 2,
    });
    const params = serializePlantsUrlState(original);
    const record: Record<string, string> = {};
    params.forEach((v, k) => {
      record[k] = v;
    });
    const parsed = parsePlantsSearchParams(record);
    expect(parsedPlantsUrlStatesEqual(original, parsed)).toBe(true);
  });

  it("canonicalPlantsQueryString normalizes input", () => {
    const messy = {
      search: "  fern ",
      page: "2",
      sortOrder: "desc",
      sortBy: "createdAt",
    };
    const canonical = canonicalPlantsQueryString(messy);
    expect(canonical).toContain("search=fern");
    expect(canonical).toContain("page=2");
  });

  it("setter object clears all keys when empty", () => {
    const setter = plantsUrlSearchParamsToSetterObject(
      serializePlantsUrlState(fullState()),
    );
    for (const key of PLANTS_URL_PARAM_KEYS) {
      expect(setter[key]).toBeUndefined();
    }
  });
});

describe("buildPlantsFilterHref", () => {
  it("serializes careDifficulty preset", () => {
    const href = buildPlantsFilterHref({ careDifficulty: "BEGINNER" });
    expect(href).toBe("/plants?careDifficulty=BEGINNER");
  });

  it("serializes inStockOnly and maxPrice", () => {
    const href = buildPlantsFilterHref({ inStockOnly: true, maxPrice: 500 });
    expect(href).toContain("inStockOnly=true");
    expect(href).toContain("maxPrice=500");
  });
});
