import { fetcher } from '../../api-client';
import type { TreeCategory, TreeCategoryNode, CategoryFilter, PublicTagGroup, PublicTag, TagFilter } from '../../types/library.types';

/**
 * Library API endpoints
 * 
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const libraryApi = {
  /**
   * Tree Categories (public)
   */
  treeCategories: {
    /**
     * Get all active categories
     */
    getAll: async (filter?: CategoryFilter): Promise<TreeCategory[]> => {
      return fetcher<TreeCategory[]>("/api/v1/tree-categories", {
        params: filter as any,
      });
    },

    /**
     * Get category tree (hierarchical)
     */
    getTree: async (filter?: CategoryFilter): Promise<TreeCategoryNode[]> => {
      return fetcher<TreeCategoryNode[]>("/api/v1/tree-categories/tree", {
        params: filter as any,
      });
    },

    /**
     * Get a single category by ID
     */
    getById: async (id: string, filter?: CategoryFilter): Promise<TreeCategory> => {
      return fetcher<TreeCategory>(`/api/v1/tree-categories/${id}`, {
        params: filter as any,
      });
    },
  },

  /**
   * Tags (public)
   */
  tags: {
    /**
     * Get all active tags grouped by group
     */
    getAll: async (filter?: TagFilter): Promise<PublicTagGroup[]> => {
      return fetcher<PublicTagGroup[]>("/api/v1/tags", {
        params: filter as any,
      });
    },

    /**
     * Get a single tag by ID
     */
    getById: async (id: string, filter?: TagFilter): Promise<PublicTag> => {
      return fetcher<PublicTag>(`/api/v1/tags/${id}`, {
        params: filter as any,
      });
    },
  },
};
