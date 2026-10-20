import { query } from "@solidjs/router";
import { getPublicPlants } from "~/lib/api/endpoints/public/plants.api";
import { listShops } from "~/lib/public-shops/public-shop.service";

/** Minimal list probe — only `meta.total` is used for the hero pill (P-065). */
export const HERO_STATS_PROBE = { page: 1, limit: 1 } as const;

/** Both must be ≥ 1 before we show numeric copy on an empty-looking marketplace. */
export const HERO_STATS_MIN_SHOPS = 1;
export const HERO_STATS_MIN_PLANTS = 1;

export type HeroStatsDisplay =
  | { mode: "numeric"; shopCount: number; plantCount: number }
  | { mode: "qualitative" };

function isValidTotal(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/**
 * Decide whether hero pill may show API totals.
 * Shop total = ACTIVE + entitled shops (not “verified only”).
 * Plant total should be fetched with `inStockOnly: true`.
 *
 * Future: replace probes with BL-08 `GET /stats/public` (P-097).
 */
export function evaluateHeroStatsDisplay(
  shopTotal: number,
  plantTotal: number,
): HeroStatsDisplay {
  if (!isValidTotal(shopTotal) || !isValidTotal(plantTotal)) {
    return { mode: "qualitative" };
  }
  if (shopTotal < HERO_STATS_MIN_SHOPS || plantTotal < HERO_STATS_MIN_PLANTS) {
    return { mode: "qualitative" };
  }
  return {
    mode: "numeric",
    shopCount: Math.floor(shopTotal),
    plantCount: Math.floor(plantTotal),
  };
}

function probeLooksInconsistent(dataLength: number, total: number): boolean {
  return dataLength > 0 && total === 0;
}

async function fetchHeroPublicTotals(): Promise<HeroStatsDisplay> {
  const [plants, shops] = await Promise.all([
    getPublicPlants({ ...HERO_STATS_PROBE, inStockOnly: true }),
    listShops({ ...HERO_STATS_PROBE }),
  ]);

  const shopTotal = shops.meta.total;
  const plantTotal = plants.meta.total;

  if (
    probeLooksInconsistent(shops.data.length, shopTotal) ||
    probeLooksInconsistent(plants.data.length, plantTotal)
  ) {
    return { mode: "qualitative" };
  }

  return evaluateHeroStatsDisplay(shopTotal, plantTotal);
}

export const listHomeHeroStats = query(async (): Promise<HeroStatsDisplay> => {
  "use server";
  try {
    return await fetchHeroPublicTotals();
  } catch {
    return { mode: "qualitative" };
  }
}, "home-hero-public-stats");
