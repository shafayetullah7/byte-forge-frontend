import { fetcher } from "../../api-client";
import type { SearchSuggestData } from "../../types/public/search.types";

export type GetSearchSuggestOptions = {
  signal?: AbortSignal;
  limit?: number;
};

/**
 * Navbar typeahead — client-only (no SSR query cache).
 */
export async function getSearchSuggest(
  q: string,
  options?: GetSearchSuggestOptions,
): Promise<SearchSuggestData> {
  const trimmed = q.trim();
  const params: Record<string, string | number> = { q: trimmed };
  if (options?.limit !== undefined) {
    params.limit = options.limit;
  }

  return fetcher<SearchSuggestData>("/api/v1/search/suggest", {
    params,
    signal: options?.signal,
    strict: false,
  });
}
