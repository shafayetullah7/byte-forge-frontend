import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  PlantListItem,
  PlantListResponse,
  PlantFilter,
  CreatePlantRequest,
  CreatePlantResponse,
} from "../../types/seller.types";

/**
 * Get all plants (paginated, with filtering)
 * Returns full response with data array and pagination meta
 */
export const getPlants = query(
  async (filter?: PlantFilter) => {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filter) {
      if (filter.page !== undefined) params.page = filter.page;
      if (filter.limit !== undefined) params.limit = filter.limit;
      if (filter.search !== undefined) params.search = filter.search;
      if (filter.status !== undefined) params.status = filter.status;
      if (filter.categoryId !== undefined) params.categoryId = filter.categoryId;
      if (filter.sortBy !== undefined) params.sortBy = filter.sortBy;
      if (filter.sortOrder !== undefined) params.sortOrder = filter.sortOrder;
      if (filter.tagIds && filter.tagIds.length > 0) {
        params.tagIds = filter.tagIds.join(",");
      }
    }

    return fetcher<PlantListResponse>("/api/v1/user/seller/plants", {
      params,
      unwrapData: false,
    });
  },
  "seller-plants"
);

/**
 * Get plant by ID
 */
export const getPlantById = query(
  async (id: string) => {
    return fetcher<PlantListItem>(`/api/v1/user/seller/plants/${id}`);
  },
  "seller-plant-detail"
);

/**
 * Create a new plant
 */
export const createPlant = async (data: CreatePlantRequest): Promise<CreatePlantResponse> => {
  return fetcher<CreatePlantResponse>("/api/v1/user/seller/plants", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Update plant details
 */
export const updatePlant = async (id: string, data: Partial<CreatePlantRequest>): Promise<PlantListItem> => {
  return fetcher<PlantListItem>(`/api/v1/user/seller/plants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * Delete a plant
 */
export const deletePlant = async (id: string): Promise<void> => {
  return fetcher<void>(`/api/v1/user/seller/plants/${id}`, {
    method: "DELETE",
  });
};

/**
 * Plant/Product API endpoints
 */
export const plantsApi = {
  getAll: getPlants,
  getById: getPlantById,
  create: createPlant,
  update: updatePlant,
  delete: deletePlant,
};
