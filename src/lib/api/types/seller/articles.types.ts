export interface ArticleTranslationFields {
  title: string;
  excerpt?: string | null;
  body?: string | null;
}

export interface SellerArticleTranslations {
  en: ArticleTranslationFields;
  bn: ArticleTranslationFields;
}

export interface SellerArticleListItem {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  readMinutes: number | null;
  moderationStatus: string;
  createdAt: string;
}

export interface SellerArticleDetail {
  id: string;
  slug: string;
  coverImage: { id: string; url: string } | null;
  category: string | null;
  readMinutes: number | null;
  moderationStatus: string;
  rejectedReason: string | null;
  translations: SellerArticleTranslations;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticlePayload {
  slug?: string;
  coverImageId?: string | null;
  category?: string | null;
  readMinutes?: number | null;
  translations: {
    en: ArticleTranslationFields;
    bn?: ArticleTranslationFields;
  };
}

export type UpdateArticlePayload = Partial<CreateArticlePayload>;

export interface SellerArticleListResponse {
  success: boolean;
  message: string;
  data: SellerArticleListItem[];
  meta: { page: number; limit: number; total: number; pages: number };
}
