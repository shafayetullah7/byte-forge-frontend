/**
 * Tree Category structure
 */
export interface TreeCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconId: string | null;
  icon: {
    id: string;
    url: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter options for categories
 */
export interface CategoryFilter {
  name?: string;
  slug?: string;
}

/**
 * Create category request
 */
export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  iconId?: string;
}

/**
 * Update category request
 */
export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  iconId?: string;
}
