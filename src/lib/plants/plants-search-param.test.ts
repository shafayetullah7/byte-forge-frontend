import { describe, expect, it } from "vitest";
import {
  buildPlantsSearchHref,
  readPlantsSearchFromSearchString,
  readPlantsSearchParam,
} from "./plants-search-param";

describe("readPlantsSearchParam", () => {
  it("returns empty when search is missing", () => {
    expect(readPlantsSearchParam({})).toBe("");
  });

  it("trims whitespace", () => {
    expect(readPlantsSearchParam({ search: "  monstera  " })).toBe("monstera");
  });

  it("uses first element when search is an array", () => {
    expect(readPlantsSearchParam({ search: ["pothos", "other"] })).toBe("pothos");
  });

  it("preserves BN text", () => {
    expect(readPlantsSearchParam({ search: "মনস্টেরা" })).toBe("মনস্টেরা");
  });

  it("treats whitespace-only as empty", () => {
    expect(readPlantsSearchParam({ search: "   " })).toBe("");
  });
});

describe("readPlantsSearchFromSearchString", () => {
  it("reads search from query string", () => {
    expect(readPlantsSearchFromSearchString("?search=monstera")).toBe("monstera");
  });

  it("trims and handles missing param", () => {
    expect(readPlantsSearchFromSearchString("?page=2")).toBe("");
    expect(readPlantsSearchFromSearchString("?search=%20foo%20")).toBe("foo");
  });
});

describe("buildPlantsSearchHref", () => {
  it("returns /plants when query is empty", () => {
    expect(buildPlantsSearchHref("")).toBe("/plants");
  });

  it("encodes search param", () => {
    expect(buildPlantsSearchHref("foo bar")).toBe("/plants?search=foo%20bar");
  });

  it("preserves BN in encoded form", () => {
    expect(buildPlantsSearchHref("মনস্টেরা")).toBe(
      `/plants?search=${encodeURIComponent("মনস্টেরা")}`,
    );
  });
});
