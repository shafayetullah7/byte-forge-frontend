import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";

export interface CategoryTranslation {
  locale: string;
  name: string;
  description: string | null;
}

export interface CategoryTree {
  id: string;
  slug: string;
  name: string;
  childrenCount: number;
  parentId: string | null;
  children: CategoryTree[] | null;
}

/**
 * Get category tree (public endpoint, localized)
 */
export const getCategoryTree = query(
  async () => {
    return fetcher<CategoryTree[]>("/api/v1/tree-categories/tree");
  },
  "public-category-tree"
);
