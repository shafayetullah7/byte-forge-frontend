/**
 * Home featured shops rotation (P-061).
 *
 * 1. UTC day bucket: dayIndex = floor(ms / 86400000).
 * 2. Fetch popular shops pool (see FEATURED_SHOPS_POOL_LIMIT in featured-shops-home).
 * 3. If pool.length <= display limit, show entire pool.
 * 4. Else start = (dayIndex * displayLimit) % pool.length; take displayLimit items with wrap-around.
 */

export const FEATURED_SHOPS_DISPLAY_LIMIT = 3;

/** Popular shops fetched before applying the rotating window. */
export const FEATURED_SHOPS_POOL_LIMIT = 12;

const MS_PER_UTC_DAY = 86_400_000;

export function getUtcDayIndex(date: Date = new Date()): number {
  return Math.floor(date.getTime() / MS_PER_UTC_DAY);
}

export function selectFeaturedShopWindow<T>(
  shops: T[],
  displayLimit: number,
  dayIndex: number,
): T[] {
  if (shops.length === 0 || displayLimit <= 0) return [];
  if (shops.length <= displayLimit) return [...shops];

  const start = (dayIndex * displayLimit) % shops.length;
  const out: T[] = [];
  for (let i = 0; i < displayLimit; i++) {
    out.push(shops[(start + i) % shops.length]);
  }
  return out;
}
