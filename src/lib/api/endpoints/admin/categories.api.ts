import { fetcher } from "../../api-client";
import type {
  TreeCategory,
  CategoryFilter,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../types/library.types";

/**
 * Admin API endpoints
 * 
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const adminApi = {
  /**
   * Admin Tree Categories
   */
  treeCategories: {
    /**
     * Create a new category
     */
    create: async (data: CreateCategoryRequest): Promise<TreeCategory> => {
      return fetcher<TreeCategory>("/api/v1/admin/tree-categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Get all categories with filtering
     */
    getAll: async (filter?: CategoryFilter): Promise<TreeCategory[]> => {
      return fetcher<TreeCategory[]>("/api/v1/admin/tree-categories", {
        params: filter as any,
      });
    },

    /**
     * Get category by ID
     */
    getById: async (id: string): Promise<TreeCategory> => {
      return fetcher<TreeCategory>(`/api/v1/admin/tree-categories/${id}`);
    },

    /**
     * Update category
     */
    update: async (id: string, data: UpdateCategoryRequest): Promise<TreeCategory> => {
      return fetcher<TreeCategory>(`/api/v1/admin/tree-categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    /**
     * Delete (soft delete) category
     */
    delete: async (id: string): Promise<void> => {
      return fetcher<void>(`/api/v1/admin/tree-categories/${id}`, {
        method: "DELETE",
      });
    },
  },
};
