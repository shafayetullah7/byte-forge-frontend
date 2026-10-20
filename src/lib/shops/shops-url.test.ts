import { describe, expect, it } from "vitest";
import {
  canonicalShopsQueryString,
  parseShopsSearchParams,
  serializeShopsUrlState,
  SHOPS_URL_DEFAULT_PAGE,
  SHOPS_URL_DEFAULT_SORT,
} from "./shops-url";

describe("parseShopsSearchParams", () => {
  it("returns defaults for empty params", () => {
    const parsed = parseShopsSearchParams({});
    expect(parsed.search).toBe("");
    expect(parsed.sort).toBe(SHOPS_URL_DEFAULT_SORT);
    expect(parsed.page).toBe(SHOPS_URL_DEFAULT_PAGE);
  });

  it("parses search", () => {
    const parsed = parseShopsSearchParams({ search: "  green house  " });
    expect(parsed.search).toBe("green house");
  });

  it("falls back invalid sort to popular", () => {
    expect(parseShopsSearchParams({ sort: "followers" }).sort).toBe("popular");
    expect(parseShopsSearchParams({ sort: "newest" }).sort).toBe("newest");
  });

  it("parses page with invalid values as 1", () => {
    expect(parseShopsSearchParams({ page: "3" }).page).toBe(3);
    expect(parseShopsSearchParams({ page: "0" }).page).toBe(1);
    expect(parseShopsSearchParams({ page: "x" }).page).toBe(1);
  });
});

describe("serializeShopsUrlState", () => {
  it("round-trips search", () => {
    const state = parseShopsSearchParams({ search: "nursery" });
    const qs = serializeShopsUrlState(state).toString();
    expect(qs).toBe("search=nursery");
    expect(parseShopsSearchParams({ search: "nursery" }).search).toBe("nursery");
  });

  it("omits default sort and page", () => {
    const qs = serializeShopsUrlState({
      search: "",
      sort: "popular",
      page: 1,
    }).toString();
    expect(qs).toBe("");
  });

  it("includes non-default sort and page", () => {
    const qs = serializeShopsUrlState({
      search: "a",
      sort: "rating",
      page: 2,
    }).toString();
    expect(qs).toContain("search=a");
    expect(qs).toContain("sort=rating");
    expect(qs).toContain("page=2");
  });
});

describe("canonicalShopsQueryString", () => {
  it("normalizes messy input", () => {
    const canonical = canonicalShopsQueryString({
      sort: "not-a-sort",
      page: "0",
      search: "  x ",
    });
    expect(canonical).toBe("search=x");
  });
});
