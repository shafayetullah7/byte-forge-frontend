/**
 * Tree Category structure (matches backend PublicCategoryResponse)
 */
export interface TreeCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isActive: boolean;
  childrenCount: number;
  usageCount: number;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tree Category node (for tree endpoint)
 */
export interface TreeCategoryNode extends TreeCategory {
  children: TreeCategoryNode[];
}

/**
 * Filter options for categories
 */
export interface CategoryFilter {
  locale?: 'en' | 'bn';
}

/**
 * Public Tag structure (matches backend PublicTagResponse)
 */
export interface PublicTag {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  usageCount: number;
}

/**
 * Public Tag Group structure (matches backend PublicTagGroupResponse)
 */
export interface PublicTagGroup {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tags: PublicTag[];
}

/**
 * Filter options for tags
 */
export interface TagFilter {
  locale?: 'en' | 'bn';
}

export interface CategoryTranslationInput {
  locale: string;
  name: string;
  description?: string | null;
}

export interface CreateCategoryRequest {
  slug: string;
  parentId?: string | null;
  isActive?: boolean;
  commissionRate?: number;
  translations: CategoryTranslationInput[];
}

export interface UpdateCategoryRequest {
  slug?: string;
  parentId?: string | null;
  isActive?: boolean;
  commissionRate?: number;
  translations?: CategoryTranslationInput[];
}
