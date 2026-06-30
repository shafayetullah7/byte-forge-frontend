/**
 * Public Shops API response types (slim DTOs from byte-forge-auth).
 * Mapped to UI types in ~/lib/public-shops/shop.mappers.ts
 */

export interface ApiShopMedia {
  id: string;
  url: string;
}

export interface ApiShopMetrics {
  totalProducts: number;
  completedOrders: number;
  averageRating: number;
  reviewCount: number;
  followerCount?: number;
}

export interface ApiPublicShopListItem {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  division: string | null;
  city: string | null;
  isVerified: boolean;
  status: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  logo: ApiShopMedia | null;
  banner: ApiShopMedia | null;
  createdAt: string;
  metrics: ApiShopMetrics;
  businessHours?: string | null;
}

export interface ApiPublicShopProfile extends ApiPublicShopListItem {
  businessHours: string | null;
  about: string | null;
  sellerStory: string | null;
  brandMission: string | null;
  whyChooseUs: string[];
  values: string[];
  categoriesServed: string[];
  followerCount?: number;
  isFollowedByViewer?: boolean;
}

export interface ApiPublicShopCampaign {
  id: string;
  slug?: string;
  title: string;
  type: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  discountPercent: number | null;
  description: string;
  status: string;
  participants: number;
  views: number;
  productsIncluded: number;
  ordersGenerated: number;
  savingsProvided: number;
  likes: number;
  bookmarks: number;
  products?: Array<{
    id: string;
    slug: string;
    name: string;
    thumbnailUrl: string;
    price: number;
  }>;
}

export interface ApiPublicShopCampaignHighlights {
  campaignsLast12Months: number;
  totalSavingsBdt: number;
  totalParticipants: number;
  mostSuccessfulReach: number;
}

export interface ApiPublicShopArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  coverUrl: string;
  publishedAt: string;
  readMinutes: number;
  category: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isEditorsPick: boolean;
  isPopular: boolean;
}

export interface ApiPublicShopProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  thumbnailUrl: string | null;
  rating: number;
  reviewCount: number;
  soldCount: number;
  inStock: boolean;
  productType: string;
  isFeatured: boolean;
}

export interface ApiPublicShopReviewSummary {
  average: number;
  total: number;
  distribution: Array<{ rating: number; count: number; percentage: number }>;
}

export interface ApiPublicShopReview {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  isVerifiedPurchase: boolean;
  productName: string;
}

export interface ApiPaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiPaginatedEnvelope<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: ApiPaginationMeta;
}

export interface ApiSuccessEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type PublicShopListFilter = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "popular" | "rating" | "products" | "followers" | "engagement" | "newest";
};

export type PublicShopProductsFilter = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "popular" | "price_asc" | "price_desc" | "newest" | "rating";
};

export type PublicShopReviewsFilter = {
  page?: number;
  limit?: number;
};
