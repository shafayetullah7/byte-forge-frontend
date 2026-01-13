import { api } from "../api-client";
import type { TreeCategory, CategoryFilter } from "../types/library.types";
import type { ApiResponse } from "../types";

/**
 * Library API endpoints
 */
export const libraryApi = {
  /**
   * Tree Categories
   */
  treeCategories: {
    /**
     * Get all tree categories (public)
     */
    getAll: async (
      filter?: CategoryFilter
    ): Promise<ApiResponse<TreeCategory[]>> => {
      return api.get<ApiResponse<TreeCategory[]>>("/api/v1/tree-categories", {
        params: filter as any,
      });
    },

    /**
     * Get a single tree category by ID
     */
    getById: async (id: string): Promise<ApiResponse<TreeCategory>> => {
      return api.get<ApiResponse<TreeCategory>>(
        `/api/v1/tree-categories/${id}`
      );
    },
  },
};
