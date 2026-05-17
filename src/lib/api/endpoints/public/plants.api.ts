import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  PublicPlantListItem,
  PublicPlantDetail,
  PublicPlantListResponse,
  PublicPlantFilter,
} from "../../types/public/plants.types";

/**
 * Get all active plants (paginated, with filtering)
 * Public endpoint - no authentication required
 * Returns full response with data array and pagination meta
 */
export const getPublicPlants = query(
  async (filter?: PublicPlantFilter) => {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filter) {
      if (filter.page !== undefined) params.page = filter.page;
      if (filter.limit !== undefined) params.limit = filter.limit;
      if (filter.search !== undefined) params.search = filter.search;
      if (filter.categoryId !== undefined) params.categoryId = filter.categoryId;
      if (filter.careDifficulty !== undefined) params.careDifficulty = filter.careDifficulty;
      if (filter.lightRequirement !== undefined) params.lightRequirement = filter.lightRequirement;
      if (filter.wateringFrequency !== undefined) params.wateringFrequency = filter.wateringFrequency;
      if (filter.humidityLevel !== undefined) params.humidityLevel = filter.humidityLevel;
      if (filter.growthRate !== undefined) params.growthRate = filter.growthRate;
      if (filter.minPrice !== undefined) params.minPrice = filter.minPrice;
      if (filter.maxPrice !== undefined) params.maxPrice = filter.maxPrice;
      if (filter.inStockOnly !== undefined) params.inStockOnly = filter.inStockOnly;
      if (filter.sortBy !== undefined) params.sortBy = filter.sortBy;
      if (filter.sortOrder !== undefined) params.sortOrder = filter.sortOrder;
      if (filter.tagIds && filter.tagIds.length > 0) {
        params.tagIds = filter.tagIds.join(",");
      }
    }

    return fetcher<PublicPlantListResponse>("/api/v1/plants", {
      params,
      unwrapData: false,
    });
  },
  "public-plants"
);

/**
 * Get plant by slug (full detail with variants, care instructions, media, shop, SEO)
 * Public endpoint - no authentication required
 */
export const getPublicPlantBySlug = query(
  async (slug: string) => {
    return fetcher<PublicPlantDetail>(`/api/v1/plants/${slug}`);
  },
  "public-plant-by-slug"
);

/**
 * Plant API endpoints (public)
 */
export const publicPlantsApi = {
  getAll: getPublicPlants,
  getBySlug: getPublicPlantBySlug,
};
