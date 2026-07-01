import { query, revalidate } from "@solidjs/router";
import {
  MOCK_SHOP_LIST,
  MOCK_COMMUNITY_METRICS,
  MOCK_SHOP_STATISTICS,
} from "~/lib/mocks/public-shops";
import {
  getPublicShops,
  getPublicShopBySlug,
  getPublicShopProducts,
  getPublicShopReviews,
  listShopCampaigns,
  getShopCampaignHighlights as fetchShopCampaignHighlights,
  listShopArticles,
} from "~/lib/api/endpoints/public/shops.api";
import {
  mapApiListItem,
  mapApiProfile,
  mapApiProduct,
  mapApiReview,
  mapApiReviewSummary,
  mapPaginatedEnvelope,
  mergeProductWithPlaceholders,
  mergeProfileWithPlaceholders,
  unwrapSuccess,
} from "~/lib/public-shops/shop.mappers";
import {
  mapApiArticle,
  mapApiCampaign,
  mapApiCampaignHighlights,
} from "~/lib/public-shops/content.mappers";
import { mergeReviewsWithPlaceholders } from "~/lib/public-shops/review-placeholders";
import { ApiError } from "~/lib/api/types";
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
} from "~/lib/types/public/shops.types";

const DEFAULT_DELAY_MS = 200;

async function maybeDelay(simulateNetwork = true): Promise<void> {
  if (!simulateNetwork) return;
  await new Promise((r) => setTimeout(r, DEFAULT_DELAY_MS));
}

function applyProductCategoryFilter(
  result: PaginatedResult<PublicShopProduct>,
  category?: string,
): PaginatedResult<PublicShopProduct> {
  if (!category?.trim()) return result;

  const data = result.data.filter((p) => p.category === category);
  return {
    data,
    meta: {
      ...result.meta,
      total: data.length,
      totalPages: Math.max(1, Math.ceil(data.length / result.meta.limit)),
    },
  };
}

export const listShops = query(
  async (params: ListShopsParams = {}) => {
    "use server";
    const envelope = await getPublicShops({
      page: params.page,
      limit: params.limit,
      search: params.search?.trim() || undefined,
      sort: params.sort,
    });
    return mapPaginatedEnvelope(envelope, mapApiListItem);
  },
  "public-shops-list",
);

export const getShopBySlug = query(
  async (slug: string): Promise<PublicShopProfile | null> => {
    "use server";
    try {
      const envelope = await getPublicShopBySlug(slug);
      return mergeProfileWithPlaceholders(mapApiProfile(unwrapSuccess(envelope)));
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
  "public-shop-profile",
);

export const invalidatePublicShopProfile = (slug: string) => {
  revalidate(getShopBySlug.keyFor(slug));
};

export const getShopProducts = query(
  async (
    slug: string,
    params: ListShopProductsParams = {},
  ): Promise<PaginatedResult<PublicShopProduct>> => {
    "use server";
    const category = params.category?.trim() || undefined;
    const envelope = await getPublicShopProducts(slug, {
      page: params.page,
      limit: params.limit,
      search: params.search?.trim() || undefined,
      sort: params.sort,
    });
    const result = mapPaginatedEnvelope(envelope, (item) =>
      mergeProductWithPlaceholders(mapApiProduct(item)),
    );
    return applyProductCategoryFilter(result, category);
  },
  "public-shop-products-mapped",
);

export const getShopReviews = query(
  async (
    slug: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<{ summary: PublicShopReviewSummary; reviews: PublicShopReview[] }> => {
    "use server";
    const envelope = await getPublicShopReviews(slug, params);
    const data = unwrapSuccess(envelope);
    return mergeReviewsWithPlaceholders(
      slug,
      mapApiReviewSummary(data.summary),
      data.reviews.map(mapApiReview),
    );
  },
  "public-shop-reviews-mapped",
);

export const getShopCampaigns = query(
  async (slug: string): Promise<PublicShopCampaign[]> => {
    "use server";
    const envelope = await listShopCampaigns(slug);
    return unwrapSuccess(envelope).map(mapApiCampaign);
  },
  "public-shop-campaigns-mapped",
);

export const getShopCampaignHighlights = query(
  async (slug: string): Promise<PublicShopCampaignHighlights> => {
    "use server";
    const envelope = await fetchShopCampaignHighlights(slug);
    return mapApiCampaignHighlights(unwrapSuccess(envelope));
  },
  "public-shop-campaign-highlights-mapped",
);

export const getShopArticles = query(
  async (slug: string): Promise<PublicShopArticle[]> => {
    "use server";
    const envelope = await listShopArticles(slug);
    return unwrapSuccess(envelope).map(mapApiArticle);
  },
  "public-shop-articles-mapped",
);

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
