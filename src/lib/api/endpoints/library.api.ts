import { fetcher } from "../api-client";
import type { TreeCategory, CategoryFilter } from "../types/library.types";

/**
 * Library API endpoints
 * 
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const libraryApi = {
  /**
   * Tree Categories
   */
  treeCategories: {
    /**
     * Get all tree categories (public)
     */
    getAll: async (filter?: CategoryFilter): Promise<TreeCategory[]> => {
      return fetcher<TreeCategory[]>("/api/v1/tree-categories", {
        params: filter as any,
      });
    },

    /**
     * Get a single tree category by ID
     */
    getById: async (id: string): Promise<TreeCategory> => {
      return fetcher<TreeCategory>(`/api/v1/tree-categories/${id}`);
    },
  },
};
