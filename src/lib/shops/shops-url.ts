/**
 * /shops directory URL query params (read + write — P-060).
 *
 * | Query param | Field  | Notes |
 * |-------------|--------|-------|
 * | search      | search | string, trimmed |
 * | sort        | sort   | popular \| rating \| products \| newest |
 * | page        | page   | default 1 |
 */

import type { PublicShopSortOption } from "~/lib/types/public/shops.types";

export type ShopsSearchParams = Record<string, string | string[] | undefined>;

export const SHOPS_URL_DEFAULT_SORT: PublicShopSortOption = "popular";
export const SHOPS_URL_DEFAULT_PAGE = 1;

/** Sort options exposed on the public shops directory toolbar. */
export const SHOPS_DIRECTORY_SORT_VALUES: PublicShopSortOption[] = [
  "popular",
  "rating",
  "products",
  "newest",
];

export const SHOPS_URL_PARAM_KEYS = ["search", "sort", "page"] as const;
export type ShopsUrlParamKey = (typeof SHOPS_URL_PARAM_KEYS)[number];

export type ParsedShopsUrlState = {
  search: string;
  sort: PublicShopSortOption;
  page: number;
};

function readStringParam(params: ShopsSearchParams, key: string): string {
  const val = params[key];
  const raw = Array.isArray(val) ? val[0] : val ?? "";
  if (typeof raw !== "string") return "";
  return raw.trim();
}

function parseSort(raw: string): PublicShopSortOption {
  if (SHOPS_DIRECTORY_SORT_VALUES.includes(raw as PublicShopSortOption)) {
    return raw as PublicShopSortOption;
  }
  return SHOPS_URL_DEFAULT_SORT;
}

function parsePage(raw: string): number {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return SHOPS_URL_DEFAULT_PAGE;
  return n;
}

export function parseShopsSearchParams(params: ShopsSearchParams): ParsedShopsUrlState {
  return {
    search: readStringParam(params, "search"),
    sort: parseSort(readStringParam(params, "sort")),
    page: parsePage(readStringParam(params, "page")),
  };
}

export function shopsUrlStateFromPageSignals(signals: {
  debouncedSearch: string;
  sort: PublicShopSortOption;
  page: number;
}): ParsedShopsUrlState {
  return {
    search: signals.debouncedSearch.trim(),
    sort: signals.sort,
    page: signals.page,
  };
}

export function serializeShopsUrlState(state: ParsedShopsUrlState): URLSearchParams {
  const params = new URLSearchParams();

  const search = state.search.trim();
  if (search) params.set("search", search);

  if (state.sort !== SHOPS_URL_DEFAULT_SORT) {
    params.set("sort", state.sort);
  }
  if (state.page !== SHOPS_URL_DEFAULT_PAGE) {
    params.set("page", String(state.page));
  }

  return params;
}

export function canonicalShopsQueryString(params: ShopsSearchParams): string {
  return serializeShopsUrlState(parseShopsSearchParams(params)).toString();
}

/** Solid Router `setSearchParams` object; omits keys via `undefined`. */
export function shopsUrlSearchParamsToSetterObject(
  serialized: URLSearchParams,
): Record<ShopsUrlParamKey, string | undefined> {
  const out = {} as Record<ShopsUrlParamKey, string | undefined>;
  for (const key of SHOPS_URL_PARAM_KEYS) {
    out[key] = serialized.get(key) ?? undefined;
  }
  return out;
}
