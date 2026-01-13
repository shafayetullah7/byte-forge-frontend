import { api } from "../api-client";
import type {
  TreeCategory,
  CategoryFilter,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/library.types";
import type { ApiResponse } from "../types";

/**
 * Admin API endpoints
 */
export const adminApi = {
  /**
   * Admin Tree Categories
   */
  treeCategories: {
    /**
     * Create a new category
     */
    create: async (
      data: CreateCategoryRequest
    ): Promise<ApiResponse<TreeCategory>> => {
      return api.post<ApiResponse<TreeCategory>>(
        "/api/v1/admin/tree-categories",
        data
      );
    },

    /**
     * Get all categories with filtering
     */
    getAll: async (
      filter?: CategoryFilter
    ): Promise<ApiResponse<TreeCategory[]>> => {
      return api.get<ApiResponse<TreeCategory[]>>(
        "/api/v1/admin/tree-categories",
        {
          params: filter as any,
        }
      );
    },

    /**
     * Get category by ID
     */
    getById: async (id: string): Promise<ApiResponse<TreeCategory>> => {
      return api.get<ApiResponse<TreeCategory>>(
        `/api/v1/admin/tree-categories/${id}`
      );
    },

    /**
     * Update category
     */
    update: async (
      id: string,
      data: UpdateCategoryRequest
    ): Promise<ApiResponse<TreeCategory>> => {
      return api.put<ApiResponse<TreeCategory>>(
        `/api/v1/admin/tree-categories/${id}`,
        data
      );
    },

    /**
     * Delete (soft delete) category
     */
    delete: async (id: string): Promise<void> => {
      return api.delete(`/api/v1/admin/tree-categories/${id}`);
    },
  },
};
