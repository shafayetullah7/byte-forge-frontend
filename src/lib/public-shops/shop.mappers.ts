import type {
  ApiPaginatedEnvelope,
  ApiPublicShopListItem,
  ApiPublicShopProduct,
  ApiPublicShopProfile,
  ApiPublicShopReview,
  ApiPublicShopReviewSummary,
  ApiSuccessEnvelope,
} from "~/lib/api/types/public/shops.api.types";
import type {
  PaginatedResult,
  PublicShopListItem,
  PublicShopProduct,
  PublicShopProfile,
  PublicShopReview,
  PublicShopReviewSummary,
  PublicShopTrustMetrics,
} from "~/lib/types/public/shops.types";
import { PUBLIC_SHOP_STATUS } from "~/lib/types/public/shops.types";

function defaultMetrics(
  partial: Partial<ApiPublicShopListItem["metrics"]> = {},
  createdAt?: string,
): PublicShopTrustMetrics {
  return {
    totalProducts: partial.totalProducts ?? 0,
    completedOrders: partial.completedOrders ?? 0,
    averageRating: partial.averageRating ?? 0,
    reviewCount: partial.reviewCount ?? 0,
    followerCount: partial.followerCount ?? 0,
    deliverySuccessRate: 0,
    responseRate: 0,
    cancellationRate: 0,
    memberSince: createdAt ?? new Date().toISOString(),
    campaignsRun: 0,
    campaignParticipants: 0,
    blogCount: 0,
    buyerSatisfactionScore: 0,
  };
}

function engagementScore(metrics: PublicShopTrustMetrics): number {
  return (
    metrics.completedOrders * 0.4 +
    metrics.averageRating * 0.3 +
    metrics.reviewCount * 0.1
  );
}

export function mapApiListItem(item: ApiPublicShopListItem): PublicShopListItem {
  const metrics = defaultMetrics(item.metrics, item.createdAt);

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    tagline: item.tagline ?? "",
    description: item.description ?? "",
    category: "",
    division: item.division ?? "",
    city: item.city ?? "",
    isVerified: item.isVerified,
    status: PUBLIC_SHOP_STATUS.ACTIVE,
    primaryColor: item.primaryColor,
    logo: item.logo,
    banner: item.banner,
    createdAt: item.createdAt,
    metrics,
    engagementScore: engagementScore(metrics),
    featuredProductPreviews: [],
  };
}

export function mapApiProfile(item: ApiPublicShopProfile): PublicShopProfile {
  const base = mapApiListItem(item);
  const categories = item.categoriesServed ?? [];
  const followerCount = item.followerCount ?? item.metrics?.followerCount ?? 0;
  return {
    ...base,
    category: categories[0] ?? base.category,
    about: item.about ?? item.description ?? "",
    sellerStory: item.sellerStory ?? "",
    brandMission: item.brandMission ?? "",
    categoriesServed: categories,
    whyChooseUs: item.whyChooseUs ?? [],
    values: item.values ?? [],
    badges: [],
    metrics: { ...base.metrics, followerCount },
    isFollowedByViewer: item.isFollowedByViewer ?? false,
  };
}

export function mapApiProduct(item: ApiPublicShopProduct): PublicShopProduct {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price,
    compareAtPrice: item.compareAtPrice,
    thumbnailUrl: item.thumbnailUrl ?? "",
    rating: item.rating,
    reviewCount: item.reviewCount,
    soldCount: item.soldCount,
    inStock: item.inStock,
    productType: item.productType,
    category: "",
    isFeatured: item.isFeatured,
    isTrending: false,
    isStaffPick: false,
    isCampaignProduct: false,
  };
}

export function mapApiReviewSummary(
  summary: ApiPublicShopReviewSummary,
): PublicShopReviewSummary {
  return {
    average: summary.average ?? 0,
    total: summary.total ?? 0,
    distribution: summary.distribution ?? [],
  };
}

export function mapApiReview(item: ApiPublicShopReview): PublicShopReview {
  return {
    id: item.id,
    customerName: item.customerName,
    rating: item.rating,
    title: item.title ?? "",
    comment: item.comment ?? "",
    createdAt: item.createdAt,
    isVerifiedPurchase: item.isVerifiedPurchase,
    productName: item.productName,
  };
}

export function mapPaginatedEnvelope<T, U>(
  envelope: ApiPaginatedEnvelope<T>,
  mapItem: (item: T) => U,
): PaginatedResult<U> {
  return {
    data: envelope.data.map(mapItem),
    meta: {
      page: envelope.meta.page,
      limit: envelope.meta.limit,
      total: envelope.meta.total,
      totalPages: envelope.meta.pages,
    },
  };
}

export function unwrapSuccess<T>(envelope: ApiSuccessEnvelope<T>): T {
  return envelope.data;
}

export { mergeProfileWithPlaceholders } from "./profile-placeholders";
export { mergeProductWithPlaceholders } from "./product-placeholders";
