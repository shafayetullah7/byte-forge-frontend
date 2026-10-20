/**
 * /plants URL query params (read + write — P-005 / P-006).
 *
 * | Query param        | Field              | Notes |
 * |--------------------|--------------------|-------|
 * | search             | search             | string |
 * | categoryId         | categoryId         | UUID |
 * | tagIds             | tagIds             | comma-separated UUIDs (max 10) |
 * | careDifficulty     | careDifficulty     | BEGINNER \| INTERMEDIATE \| EXPERT |
 * | lightRequirement   | lightRequirement   | enum |
 * | wateringFrequency  | wateringFrequency  | enum |
 * | humidityLevel      | humidityLevel      | enum |
 * | growthRate         | growthRate         | enum |
 * | minPrice / maxPrice| numbers            | |
 * | inStockOnly        | true when present  | true, 1, or empty value |
 * | sortBy / sortOrder | catalog sorts      | name, price, createdAt, etc. |
 * | page               | pagination         | default 1 |
 */

import type { PublicPlantFilter } from "~/lib/api/types/public/plants.types";
import {
  PUBLIC_CARE_DIFFICULTY,
  PUBLIC_GROWTH_RATE,
  PUBLIC_HUMIDITY_LEVEL,
  PUBLIC_LIGHT_REQUIREMENT,
  PUBLIC_WATERING_FREQUENCY,
} from "~/lib/api/types/public/plants.types";
import {
  type PlantsSearchParams,
  readPlantsSearchParam,
} from "./plants-search-param";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_TAG_IDS = 10;

export type PlantsUrlSortBy = NonNullable<PublicPlantFilter["sortBy"]>;
export type PlantsUrlSortOrder = NonNullable<PublicPlantFilter["sortOrder"]>;

const SORT_BY_VALUES: PlantsUrlSortBy[] = [
  "name",
  "price",
  "difficulty",
  "inventory",
  "createdAt",
];

export const PLANTS_URL_DEFAULT_SORT_BY: PlantsUrlSortBy = "name";
export const PLANTS_URL_DEFAULT_SORT_ORDER: PlantsUrlSortOrder = "asc";
export const PLANTS_URL_DEFAULT_PAGE = 1;

/** All query keys managed by parse/serialize (cleared via `undefined` in setSearchParams). */
export const PLANTS_URL_PARAM_KEYS = [
  "search",
  "categoryId",
  "tagIds",
  "careDifficulty",
  "lightRequirement",
  "wateringFrequency",
  "humidityLevel",
  "growthRate",
  "minPrice",
  "maxPrice",
  "inStockOnly",
  "sortBy",
  "sortOrder",
  "page",
] as const;

export type PlantsUrlParamKey = (typeof PLANTS_URL_PARAM_KEYS)[number];

/** Hydration shape for `(plants).tsx` signals. */
export type ParsedPlantsUrlState = {
  search: string;
  categoryId: string;
  selectedTagIds: Set<string>;
  careDifficulty: string;
  lightRequirement: string;
  wateringFrequency: string;
  humidityLevel: string;
  growthRate: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  sortBy: PlantsUrlSortBy;
  sortOrder: PlantsUrlSortOrder;
  page: number;
};

function readQueryValue(
  params: PlantsSearchParams,
  key: string,
): string | undefined {
  const val = params[key];
  if (val === undefined) return undefined;
  const raw = Array.isArray(val) ? val[0] : val;
  if (typeof raw !== "string") return undefined;
  return raw;
}

function hasQueryKey(params: PlantsSearchParams, key: string): boolean {
  return params[key] !== undefined;
}

function parseUuid(value: string | undefined): string {
  if (!value?.trim()) return "";
  const trimmed = value.trim();
  return UUID_RE.test(trimmed) ? trimmed : "";
}

function parseTagIds(value: string | undefined): Set<string> {
  if (!value?.trim()) return new Set();
  const ids = value
    .split(",")
    .map((s) => s.trim())
    .filter((id) => UUID_RE.test(id))
    .slice(0, MAX_TAG_IDS);
  return new Set(ids);
}

function parseEnumValue<T extends string>(
  value: string | undefined,
  allowed: Record<string, T>,
): string {
  if (!value?.trim()) return "";
  const upper = value.trim();
  return Object.values(allowed).includes(upper as T) ? upper : "";
}

function parsePriceString(value: string | undefined): string {
  if (!value?.trim()) return "";
  const n = parseFloat(value.trim());
  if (Number.isNaN(n) || n < 0) return "";
  return String(n);
}

function parseInStockOnly(params: PlantsSearchParams): boolean {
  if (!hasQueryKey(params, "inStockOnly")) return false;
  const raw = readQueryValue(params, "inStockOnly");
  if (raw === undefined || raw === "") return true;
  const lower = raw.trim().toLowerCase();
  return lower === "true" || lower === "1";
}

function parseSortBy(value: string | undefined): PlantsUrlSortBy {
  if (!value?.trim()) return PLANTS_URL_DEFAULT_SORT_BY;
  const v = value.trim() as PlantsUrlSortBy;
  return SORT_BY_VALUES.includes(v) ? v : PLANTS_URL_DEFAULT_SORT_BY;
}

function parseSortOrder(value: string | undefined): PlantsUrlSortOrder {
  if (!value?.trim()) return PLANTS_URL_DEFAULT_SORT_ORDER;
  const v = value.trim().toLowerCase();
  return v === "desc" ? "desc" : v === "asc" ? "asc" : PLANTS_URL_DEFAULT_SORT_ORDER;
}

function parsePage(value: string | undefined): number {
  if (!value?.trim()) return PLANTS_URL_DEFAULT_PAGE;
  const n = parseInt(value.trim(), 10);
  if (Number.isNaN(n) || n < 1) return PLANTS_URL_DEFAULT_PAGE;
  return n;
}

export function parsePlantsSearchParams(
  params: PlantsSearchParams,
): ParsedPlantsUrlState {
  return {
    search: readPlantsSearchParam(params),
    categoryId: parseUuid(readQueryValue(params, "categoryId")),
    selectedTagIds: parseTagIds(readQueryValue(params, "tagIds")),
    careDifficulty: parseEnumValue(
      readQueryValue(params, "careDifficulty"),
      PUBLIC_CARE_DIFFICULTY,
    ),
    lightRequirement: parseEnumValue(
      readQueryValue(params, "lightRequirement"),
      PUBLIC_LIGHT_REQUIREMENT,
    ),
    wateringFrequency: parseEnumValue(
      readQueryValue(params, "wateringFrequency"),
      PUBLIC_WATERING_FREQUENCY,
    ),
    humidityLevel: parseEnumValue(
      readQueryValue(params, "humidityLevel"),
      PUBLIC_HUMIDITY_LEVEL,
    ),
    growthRate: parseEnumValue(
      readQueryValue(params, "growthRate"),
      PUBLIC_GROWTH_RATE,
    ),
    minPrice: parsePriceString(readQueryValue(params, "minPrice")),
    maxPrice: parsePriceString(readQueryValue(params, "maxPrice")),
    inStockOnly: parseInStockOnly(params),
    sortBy: parseSortBy(readQueryValue(params, "sortBy")),
    sortOrder: parseSortOrder(readQueryValue(params, "sortOrder")),
    page: parsePage(readQueryValue(params, "page")),
  };
}

/** Map parsed URL state to `PublicPlantFilter` for API calls. */
export function parsedPlantsUrlToFilter(
  parsed: ParsedPlantsUrlState,
  limit: number,
): PublicPlantFilter {
  const tagIds = [...parsed.selectedTagIds];
  return {
    page: parsed.page,
    limit,
    search: parsed.search || undefined,
    categoryId: parsed.categoryId || undefined,
    tagIds: tagIds.length > 0 ? tagIds : undefined,
    careDifficulty: (parsed.careDifficulty || undefined) as PublicPlantFilter["careDifficulty"],
    lightRequirement: (parsed.lightRequirement || undefined) as PublicPlantFilter["lightRequirement"],
    wateringFrequency: (parsed.wateringFrequency || undefined) as PublicPlantFilter["wateringFrequency"],
    humidityLevel: (parsed.humidityLevel || undefined) as PublicPlantFilter["humidityLevel"],
    growthRate: (parsed.growthRate || undefined) as PublicPlantFilter["growthRate"],
    minPrice: parsed.minPrice ? parseFloat(parsed.minPrice) : undefined,
    maxPrice: parsed.maxPrice ? parseFloat(parsed.maxPrice) : undefined,
    inStockOnly: parsed.inStockOnly || undefined,
    sortBy: parsed.sortBy,
    sortOrder: parsed.sortOrder,
  };
}

export type PlantsPageUrlSignals = {
  debouncedSearch: string;
  categoryId: string;
  selectedTagIds: Set<string>;
  careDifficulty: string;
  lightRequirement: string;
  wateringFrequency: string;
  humidityLevel: string;
  growthRate: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  sortBy: PlantsUrlSortBy;
  sortOrder: PlantsUrlSortOrder;
  page: number;
};

export function plantsUrlStateFromPageSignals(
  signals: PlantsPageUrlSignals,
): ParsedPlantsUrlState {
  return {
    search: signals.debouncedSearch.trim(),
    categoryId: signals.categoryId,
    selectedTagIds: new Set(signals.selectedTagIds),
    careDifficulty: signals.careDifficulty,
    lightRequirement: signals.lightRequirement,
    wateringFrequency: signals.wateringFrequency,
    humidityLevel: signals.humidityLevel,
    growthRate: signals.growthRate,
    minPrice: signals.minPrice,
    maxPrice: signals.maxPrice,
    inStockOnly: signals.inStockOnly,
    sortBy: signals.sortBy,
    sortOrder: signals.sortOrder,
    page: signals.page,
  };
}

export function serializePlantsUrlState(state: ParsedPlantsUrlState): URLSearchParams {
  const params = new URLSearchParams();

  const search = state.search.trim();
  if (search) params.set("search", search);
  if (state.categoryId) params.set("categoryId", state.categoryId);

  const tagIds = [...state.selectedTagIds].sort();
  if (tagIds.length > 0) params.set("tagIds", tagIds.join(","));

  if (state.careDifficulty) params.set("careDifficulty", state.careDifficulty);
  if (state.lightRequirement) params.set("lightRequirement", state.lightRequirement);
  if (state.wateringFrequency) params.set("wateringFrequency", state.wateringFrequency);
  if (state.humidityLevel) params.set("humidityLevel", state.humidityLevel);
  if (state.growthRate) params.set("growthRate", state.growthRate);
  if (state.minPrice) params.set("minPrice", state.minPrice);
  if (state.maxPrice) params.set("maxPrice", state.maxPrice);
  if (state.inStockOnly) params.set("inStockOnly", "true");

  if (state.sortBy !== PLANTS_URL_DEFAULT_SORT_BY) {
    params.set("sortBy", state.sortBy);
  }
  if (state.sortOrder !== PLANTS_URL_DEFAULT_SORT_ORDER) {
    params.set("sortOrder", state.sortOrder);
  }
  if (state.page !== PLANTS_URL_DEFAULT_PAGE) {
    params.set("page", String(state.page));
  }

  return params;
}

export function canonicalPlantsQueryString(params: PlantsSearchParams): string {
  return serializePlantsUrlState(parsePlantsSearchParams(params)).toString();
}

/** Solid Router `setSearchParams` object; omits keys via `undefined`. */
export function plantsUrlSearchParamsToSetterObject(
  serialized: URLSearchParams,
): Record<PlantsUrlParamKey, string | undefined> {
  const out = {} as Record<PlantsUrlParamKey, string | undefined>;
  for (const key of PLANTS_URL_PARAM_KEYS) {
    out[key] = serialized.get(key) ?? undefined;
  }
  return out;
}

export function buildPlantsCategoryHref(categoryId: string): string {
  return `/plants?categoryId=${encodeURIComponent(categoryId)}`;
}

/** Map API filter fields to URL state defaults (for shareable `/plants?…` links). */
export function publicPlantFilterToUrlState(
  filter: Partial<PublicPlantFilter>,
): ParsedPlantsUrlState {
  return {
    search: filter.search?.trim() ?? "",
    categoryId: filter.categoryId ?? "",
    selectedTagIds: new Set(filter.tagIds ?? []),
    careDifficulty: filter.careDifficulty ?? "",
    lightRequirement: filter.lightRequirement ?? "",
    wateringFrequency: filter.wateringFrequency ?? "",
    humidityLevel: filter.humidityLevel ?? "",
    growthRate: filter.growthRate ?? "",
    minPrice: filter.minPrice !== undefined ? String(filter.minPrice) : "",
    maxPrice: filter.maxPrice !== undefined ? String(filter.maxPrice) : "",
    inStockOnly: filter.inStockOnly ?? false,
    sortBy: filter.sortBy ?? PLANTS_URL_DEFAULT_SORT_BY,
    sortOrder: filter.sortOrder ?? PLANTS_URL_DEFAULT_SORT_ORDER,
    page: filter.page ?? PLANTS_URL_DEFAULT_PAGE,
  };
}

export function buildPlantsFilterHref(filter: Partial<PublicPlantFilter>): string {
  const query = serializePlantsUrlState(publicPlantFilterToUrlState(filter)).toString();
  return query ? `/plants?${query}` : "/plants";
}

export function parsedPlantsUrlStatesEqual(
  a: ParsedPlantsUrlState,
  b: ParsedPlantsUrlState,
): boolean {
  return (
    serializePlantsUrlState(a).toString() === serializePlantsUrlState(b).toString()
  );
}
