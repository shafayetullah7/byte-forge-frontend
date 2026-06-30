/**
 * Public Shops API Types
 * Aligned with byte-forge-auth shop schema and future public endpoints.
 */

export const PUBLIC_SHOP_STATUS = {
  ACTIVE: "ACTIVE",
} as const;

export type PublicShopStatus =
  (typeof PUBLIC_SHOP_STATUS)[keyof typeof PUBLIC_SHOP_STATUS];

export const PUBLIC_SHOP_BADGE = {
  TOP_SELLER: "TOP_SELLER",
  FAST_RESPONDER: "FAST_RESPONDER",
  HIGHLY_RATED: "HIGHLY_RATED",
  TRUSTED_SHOP: "TRUSTED_SHOP",
  RISING_SELLER: "RISING_SELLER",
  COMMUNITY_FAVORITE: "COMMUNITY_FAVORITE",
  BUYER_FRIENDLY: "BUYER_FRIENDLY",
  CAMPAIGN_CHAMPION: "CAMPAIGN_CHAMPION",
} as const;

export type PublicShopBadge =
  (typeof PUBLIC_SHOP_BADGE)[keyof typeof PUBLIC_SHOP_BADGE];

export const PUBLIC_CAMPAIGN_STATUS = {
  ACTIVE: "ACTIVE",
  UPCOMING: "UPCOMING",
  COMPLETED: "COMPLETED",
} as const;

export type PublicCampaignStatus =
  (typeof PUBLIC_CAMPAIGN_STATUS)[keyof typeof PUBLIC_CAMPAIGN_STATUS];

export const PUBLIC_CAMPAIGN_TYPE = {
  DISCOUNT: "DISCOUNT",
  BUNDLE: "BUNDLE",
  FLASH_SALE: "FLASH_SALE",
  SEASONAL: "SEASONAL",
  FREE_SHIPPING: "FREE_SHIPPING",
} as const;

export type PublicCampaignType =
  (typeof PUBLIC_CAMPAIGN_TYPE)[keyof typeof PUBLIC_CAMPAIGN_TYPE];

export interface PublicShopMedia {
  id: string;
  url: string;
}

export interface PublicShopTrustMetrics {
  totalProducts: number;
  completedOrders: number;
  averageRating: number;
  reviewCount: number;
  followerCount: number;
  deliverySuccessRate: number;
  responseRate: number;
  cancellationRate: number;
  memberSince: string;
  campaignsRun: number;
  campaignParticipants: number;
  blogCount: number;
  buyerSatisfactionScore: number;
}

export interface PublicShopFeaturedPreview {
  id: string;
  slug: string;
  name: string;
  thumbnailUrl: string;
  price: number;
}

export interface PublicShopListItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  division: string;
  city: string;
  isVerified: boolean;
  status: PublicShopStatus;
  primaryColor?: string | null;
  logo?: PublicShopMedia | null;
  banner?: PublicShopMedia | null;
  createdAt: string;
  metrics: PublicShopTrustMetrics;
  engagementScore: number;
  featuredProductPreviews: PublicShopFeaturedPreview[];
}

export interface PublicShopProfile extends PublicShopListItem {
  about: string;
  sellerStory: string;
  brandMission: string;
  categoriesServed: string[];
  whyChooseUs: string[];
  values: string[];
  badges: PublicShopBadge[];
  isFollowedByViewer?: boolean;
}

export interface PublicShopCommunityMetrics {
  profileViews: number;
  productViews: number;
  wishlistAdds: number;
  repeatBuyerPercent: number;
  campaignParticipants: number;
  articleViews: number;
  articleLikes: number;
  articleShares: number;
  engagementScore: number;
}

export interface PublicShopProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  inStock: boolean;
  productType: string;
  category: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isStaffPick?: boolean;
  isCampaignProduct?: boolean;
}

export interface PublicShopReview {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  productName: string;
}

export interface PublicShopReviewSummary {
  average: number;
  total: number;
  distribution: Array<{ rating: number; count: number; percentage: number }>;
}

export interface PublicShopCampaign {
  id: string;
  slug: string;
  title: string;
  type: PublicCampaignType;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  discountPercent?: number | null;
  description: string;
  status: PublicCampaignStatus;
  participants: number;
  views: number;
  productsIncluded: number;
  ordersGenerated: number;
  savingsProvided: number;
  likes: number;
  bookmarks: number;
}

export interface PublicShopCampaignHighlights {
  campaignsLast12Months: number;
  totalSavingsBdt: number;
  totalParticipants: number;
  mostSuccessfulReach: number;
}

export interface PublicShopArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  publishedAt: string;
  readMinutes: number;
  category: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  isEditorsPick?: boolean;
  isPopular?: boolean;
}

export interface PublicShopStatisticsPoint {
  label: string;
  value: number;
}

export interface PublicShopStatistics {
  ordersCompleted: PublicShopStatisticsPoint[];
  followersGrowth: PublicShopStatisticsPoint[];
  ratingTrend: PublicShopStatisticsPoint[];
  campaignTrend: PublicShopStatisticsPoint[];
  contentViewsTrend: PublicShopStatisticsPoint[];
}

export type PublicShopSortOption =
  | "popular"
  | "rating"
  | "products"
  | "followers"
  | "engagement"
  | "newest";

export type PublicProductSortOption =
  | "popular"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating";

export interface ListShopsParams {
  search?: string;
  category?: string;
  sort?: PublicShopSortOption;
  page?: number;
  limit?: number;
}

export interface ListShopProductsParams {
  search?: string;
  category?: string;
  sort?: PublicProductSortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type PublicShopDetailSection =
  | ""
  | "products"
  | "reviews"
  | "campaigns"
  | "articles";
