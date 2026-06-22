import {
  MOCK_SHOP_LIST,
  getMockShopProfileBySlug,
  MOCK_SHOP_PRODUCTS,
  MOCK_COMMUNITY_METRICS,
  MOCK_SHOP_CAMPAIGNS,
  getMockCampaignHighlights,
  MOCK_SHOP_ARTICLES,
  MOCK_SHOP_REVIEWS,
  getMockReviewSummary,
  MOCK_SHOP_STATISTICS,
} from "~/lib/mocks/public-shops";
import type {
  ListShopProductsParams,
  ListShopsParams,
  PaginatedResult,
  PublicShopCampaign,
  PublicShopCampaignHighlights,
  PublicShopArticle,
  PublicShopCommunityMetrics,
  PublicShopListItem,
  PublicShopProduct,
  PublicShopProfile,
  PublicShopReview,
  PublicShopReviewSummary,
  PublicShopStatistics,
  PublicProductSortOption,
  PublicShopSortOption,
} from "~/lib/types/public/shops.types";

const DEFAULT_DELAY_MS = 200;

async function maybeDelay(simulateNetwork = true): Promise<void> {
  if (!simulateNetwork) return;
  await new Promise((r) => setTimeout(r, DEFAULT_DELAY_MS));
}

function paginate<T>(items: T[], page = 1, limit = 12): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page: safePage, limit, total, totalPages },
  };
}

function sortShops(
  items: PublicShopListItem[],
  sort: PublicShopSortOption = "popular",
): PublicShopListItem[] {
  const copy = [...items];
  switch (sort) {
    case "rating":
      return copy.sort((a, b) => b.metrics.averageRating - a.metrics.averageRating);
    case "products":
      return copy.sort((a, b) => b.metrics.totalProducts - a.metrics.totalProducts);
    case "followers":
      return copy.sort((a, b) => b.metrics.followerCount - a.metrics.followerCount);
    case "engagement":
      return copy.sort((a, b) => b.engagementScore - a.engagementScore);
    case "newest":
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "popular":
    default:
      return copy.sort((a, b) => {
        const scoreA =
          a.metrics.completedOrders * 0.4 +
          a.metrics.followerCount * 0.3 +
          a.engagementScore * 10;
        const scoreB =
          b.metrics.completedOrders * 0.4 +
          b.metrics.followerCount * 0.3 +
          b.engagementScore * 10;
        return scoreB - scoreA;
      });
  }
}

function sortProducts(
  items: PublicShopProduct[],
  sort: PublicProductSortOption = "popular",
): PublicShopProduct[] {
  const copy = [...items];
  switch (sort) {
    case "newest":
      return copy;
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "popular":
    default:
      return copy.sort((a, b) => b.soldCount - a.soldCount);
  }
}

function filterShops(
  items: PublicShopListItem[],
  params: ListShopsParams,
): PublicShopListItem[] {
  let result = items.filter((s) => s.isVerified && s.status === "ACTIVE");

  if (params.search?.trim()) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q),
    );
  }

  if (params.category) {
    result = result.filter((s) => s.category === params.category);
  }

  return sortShops(result, params.sort);
}

function filterProducts(
  items: PublicShopProduct[],
  params: ListShopProductsParams,
): PublicShopProduct[] {
  let result = [...items];

  if (params.search?.trim()) {
    const q = params.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (params.category) {
    result = result.filter((p) => p.category === params.category);
  }

  return sortProducts(result, params.sort);
}

export async function listShops(
  params: ListShopsParams = {},
): Promise<PaginatedResult<PublicShopListItem>> {
  await maybeDelay();
  const filtered = filterShops(MOCK_SHOP_LIST, params);
  return paginate(filtered, params.page ?? 1, params.limit ?? 9);
}

export async function getShopBySlug(slug: string): Promise<PublicShopProfile | null> {
  await maybeDelay();
  return getMockShopProfileBySlug(slug) ?? null;
}

export async function getShopProducts(
  slug: string,
  params: ListShopProductsParams = {},
): Promise<PaginatedResult<PublicShopProduct>> {
  await maybeDelay();
  const products = MOCK_SHOP_PRODUCTS[slug] ?? [];
  const filtered = filterProducts(products, params);
  return paginate(filtered, params.page ?? 1, params.limit ?? 12);
}

export async function getShopReviews(
  slug: string,
): Promise<{ summary: PublicShopReviewSummary; reviews: PublicShopReview[] }> {
  await maybeDelay();
  return {
    summary: getMockReviewSummary(slug),
    reviews: MOCK_SHOP_REVIEWS[slug] ?? [],
  };
}

export async function getShopCampaigns(slug: string): Promise<PublicShopCampaign[]> {
  await maybeDelay();
  return MOCK_SHOP_CAMPAIGNS[slug] ?? [];
}

export async function getShopCampaignHighlights(
  slug: string,
): Promise<PublicShopCampaignHighlights> {
  await maybeDelay();
  return getMockCampaignHighlights(slug);
}

export async function getShopArticles(slug: string): Promise<PublicShopArticle[]> {
  await maybeDelay();
  return MOCK_SHOP_ARTICLES[slug] ?? [];
}

export async function getShopStatistics(slug: string): Promise<PublicShopStatistics | null> {
  await maybeDelay();
  return MOCK_SHOP_STATISTICS[slug] ?? null;
}

export async function getShopCommunityMetrics(
  slug: string,
): Promise<PublicShopCommunityMetrics | null> {
  await maybeDelay();
  return MOCK_COMMUNITY_METRICS[slug] ?? null;
}

export async function getSimilarShops(
  slug: string,
  limit = 4,
): Promise<PublicShopListItem[]> {
  await maybeDelay();
  const current = MOCK_SHOP_LIST.find((s) => s.slug === slug);
  if (!current) return [];

  return MOCK_SHOP_LIST.filter(
    (s) =>
      s.slug !== slug &&
      s.isVerified &&
      (s.category === current.category || s.division === current.division),
  ).slice(0, limit);
}

export const publicShopService = {
  listShops,
  getShopBySlug,
  getShopProducts,
  getShopReviews,
  getShopCampaigns,
  getShopCampaignHighlights,
  getShopArticles,
  getShopStatistics,
  getShopCommunityMetrics,
  getSimilarShops,
};
