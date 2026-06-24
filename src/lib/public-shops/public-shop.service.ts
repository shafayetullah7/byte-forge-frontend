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
import { config } from "~/lib/config";
import {
  getPublicShops,
  getPublicShopBySlug,
  getPublicShopProducts,
  getPublicShopReviews,
} from "~/lib/api/endpoints/public/shops.api";
import {
  mapApiListItem,
  mapApiProfile,
  mapApiProduct,
  mapApiReview,
  mapApiReviewSummary,
  mapPaginatedEnvelope,
  unwrapSuccess,
} from "~/lib/public-shops/shop.mappers";
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

type PublicShopApiSlice = keyof typeof config.publicShopApi;

async function maybeDelay(simulateNetwork = true): Promise<void> {
  if (!simulateNetwork) return;
  await new Promise((r) => setTimeout(r, DEFAULT_DELAY_MS));
}

function logApiFallback(slice: PublicShopApiSlice, error: unknown) {
  if (config.isDev) {
    console.warn(`[public-shop] ${slice} API failed, using mock`, error);
  }
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
  const envelope = await getPublicShops({
    page: params.page,
    limit: params.limit,
    search: params.search,
    sort: params.sort,
  });
  return mapPaginatedEnvelope(envelope, mapApiListItem);
}

async function getShopBySlugMock(slug: string): Promise<PublicShopProfile | null> {
  await maybeDelay();
  return getMockShopProfileBySlug(slug) ?? null;
}

export async function getShopBySlug(slug: string): Promise<PublicShopProfile | null> {
  if (!config.publicShopApi.profile) {
    return getShopBySlugMock(slug);
  }

  try {
    const envelope = await getPublicShopBySlug(slug);
    return mapApiProfile(unwrapSuccess(envelope));
  } catch (error) {
    logApiFallback("profile", error);
    return getShopBySlugMock(slug);
  }
}

async function getShopProductsMock(
  slug: string,
  params: ListShopProductsParams = {},
): Promise<PaginatedResult<PublicShopProduct>> {
  await maybeDelay();
  const products = MOCK_SHOP_PRODUCTS[slug] ?? [];
  const filtered = filterProducts(products, params);
  return paginate(filtered, params.page ?? 1, params.limit ?? 12);
}

export async function getShopProducts(
  slug: string,
  params: ListShopProductsParams = {},
): Promise<PaginatedResult<PublicShopProduct>> {
  if (!config.publicShopApi.products) {
    return getShopProductsMock(slug, params);
  }

  try {
    const envelope = await getPublicShopProducts(slug, {
      page: params.page,
      limit: params.limit,
      search: params.search,
      sort: params.sort,
    });
    return mapPaginatedEnvelope(envelope, mapApiProduct);
  } catch (error) {
    logApiFallback("products", error);
    return getShopProductsMock(slug, params);
  }
}

async function getShopReviewsMock(
  slug: string,
): Promise<{ summary: PublicShopReviewSummary; reviews: PublicShopReview[] }> {
  await maybeDelay();
  return {
    summary: getMockReviewSummary(slug),
    reviews: MOCK_SHOP_REVIEWS[slug] ?? [],
  };
}

export async function getShopReviews(
  slug: string,
  params: { page?: number; limit?: number } = {},
): Promise<{ summary: PublicShopReviewSummary; reviews: PublicShopReview[] }> {
  if (!config.publicShopApi.reviews) {
    return getShopReviewsMock(slug);
  }

  try {
    const envelope = await getPublicShopReviews(slug, params);
    const data = unwrapSuccess(envelope);
    return {
      summary: mapApiReviewSummary(data.summary),
      reviews: data.reviews.map(mapApiReview),
    };
  } catch (error) {
    logApiFallback("reviews", error);
    return getShopReviewsMock(slug);
  }
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
