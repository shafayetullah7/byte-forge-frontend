import { query } from "@solidjs/router";
import {
  getPublicPlantBySlug,
  getPublicPlants,
} from "~/lib/api/endpoints/public/plants.api";
import { ApiError } from "~/lib/api/types";
import type {
  PublicPlantDetail,
  PublicPlantFilter,
} from "~/lib/api/types/public/plants.types";

/** Homepage featured grid: newest in-stock listings from entitled sellers. */
export const FEATURED_LISTINGS_FILTER = {
  page: 1,
  limit: 8,
  inStockOnly: true,
  sortBy: "createdAt",
  sortOrder: "desc",
} as const satisfies PublicPlantFilter;

export const listFeaturedPlants = query(
  async () => {
    "use server";
    return getPublicPlants(FEATURED_LISTINGS_FILTER);
  },
  "public-plants-featured",
);

export const getPlantBySlug = query(
  async (slug: string): Promise<PublicPlantDetail | null> => {
    "use server";
    try {
      return await getPublicPlantBySlug(slug);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
  "public-plant-profile",
);
