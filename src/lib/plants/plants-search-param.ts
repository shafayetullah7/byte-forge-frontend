export type PlantsSearchParams = Record<
  string,
  string | string[] | undefined
>;

/** Read `search` from Solid Router search params; trim; empty → "". */
export function readPlantsSearchParam(params: PlantsSearchParams): string {
  const val = params.search;
  const raw = Array.isArray(val) ? val[0] : val ?? "";
  if (typeof raw !== "string") return "";
  return raw.trim();
}

/** Parse `search` from `location.search` (e.g. `?search=foo`). */
export function readPlantsSearchFromSearchString(search: string): string {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  return (params.get("search") ?? "").trim();
}

/** Path for catalog navigation; `trimmedQuery` must already be trimmed. */
export function buildPlantsSearchHref(trimmedQuery: string): string {
  if (!trimmedQuery) return "/plants";
  return `/plants?search=${encodeURIComponent(trimmedQuery)}`;
}
