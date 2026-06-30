import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  ApiPaginatedEnvelope,
  ApiPublicShopListItem,
  ApiPublicShopProduct,
  ApiPublicShopProfile,
  ApiPublicShopReview,
  ApiPublicShopReviewSummary,
  ApiPublicShopCampaign,
  ApiPublicShopCampaignHighlights,
  ApiPublicShopArticle,
  ApiSuccessEnvelope,
  PublicShopListFilter,
  PublicShopProductsFilter,
  PublicShopReviewsFilter,
} from "../../types/public/shops.api.types";

export interface PublicShippingRate {
  shopId: string;
  districtId: string;
  cost: string;
}

function buildParams(
  params?: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> | undefined {
  if (!params) return undefined;
  const out: Record<string, string | number | boolean | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      out[key] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export const getPublicShops = query(
  async (filter?: PublicShopListFilter) => {
    "use server";
    return fetcher<ApiPaginatedEnvelope<ApiPublicShopListItem>>("/api/v1/shops", {
      params: buildParams(filter as Record<string, string | number | undefined>),
      unwrapData: false,
    });
  },
  "public-shops",
);

export const getPublicShopBySlug = query(
  async (slug: string) => {
    "use server";
    return fetcher<ApiSuccessEnvelope<ApiPublicShopProfile>>(
      `/api/v1/shops/${slug}`,
      { unwrapData: false },
    );
  },
  "public-shop-detail",
);

export const getPublicShopProducts = query(
  async (slug: string, filter?: PublicShopProductsFilter) => {
    "use server";
    return fetcher<ApiPaginatedEnvelope<ApiPublicShopProduct>>(
      `/api/v1/shops/${slug}/products`,
      {
        params: buildParams(filter as Record<string, string | number | undefined>),
        unwrapData: false,
      },
    );
  },
  "public-shop-products",
);

export const getPublicShopReviews = query(
  async (slug: string, filter?: PublicShopReviewsFilter) => {
    "use server";
    return fetcher<
      ApiSuccessEnvelope<{
        summary: ApiPublicShopReviewSummary;
        reviews: ApiPublicShopReview[];
        meta: { page: number; limit: number; total: number; pages: number };
      }>
    >(`/api/v1/shops/${slug}/reviews`, {
      params: buildParams(filter as Record<string, string | number | undefined>),
      unwrapData: false,
    });
  },
  "public-shop-reviews",
);

export const invalidatePublicShops = () => revalidate(getPublicShops.keyFor());

export const invalidatePublicShop = (slug: string) => {
  revalidate(getPublicShopBySlug.keyFor(slug));
  revalidate(getPublicShopProducts.keyFor(slug));
  revalidate(getPublicShopReviews.keyFor(slug));
  revalidate(listShopCampaigns.keyFor(slug));
  revalidate(getShopCampaignHighlights.keyFor(slug));
  revalidate(listShopArticles.keyFor(slug));
};

export const listShopCampaigns = query(
  async (slug: string) => {
    "use server";
    return fetcher<ApiSuccessEnvelope<ApiPublicShopCampaign[]>>(
      `/api/v1/shops/${slug}/campaigns`,
      { unwrapData: false },
    );
  },
  "public-shop-campaigns",
);

export const getShopCampaignHighlights = query(
  async (slug: string) => {
    "use server";
    return fetcher<ApiSuccessEnvelope<ApiPublicShopCampaignHighlights>>(
      `/api/v1/shops/${slug}/campaigns/highlights`,
      { unwrapData: false },
    );
  },
  "public-shop-campaign-highlights",
);

export const getCampaignDetail = query(
  async (slug: string, campaignSlug: string) => {
    "use server";
    return fetcher<ApiSuccessEnvelope<ApiPublicShopCampaign>>(
      `/api/v1/shops/${slug}/campaigns/${campaignSlug}`,
      { unwrapData: false },
    );
  },
  "public-shop-campaign-detail",
);

export const listShopArticles = query(
  async (slug: string) => {
    "use server";
    return fetcher<ApiSuccessEnvelope<ApiPublicShopArticle[]>>(
      `/api/v1/shops/${slug}/articles`,
      { unwrapData: false },
    );
  },
  "public-shop-articles",
);

export const getArticleDetail = query(
  async (slug: string, articleSlug: string) => {
    "use server";
    return fetcher<ApiSuccessEnvelope<ApiPublicShopArticle>>(
      `/api/v1/shops/${slug}/articles/${articleSlug}`,
      { unwrapData: false },
    );
  },
  "public-shop-article-detail",
);

export const getPublicShippingRate = query(
  async (shopId: string, districtId: string) => {
    "use server";
    try {
      return await fetcher<PublicShippingRate>(
        `/api/v1/public/shops/${shopId}/shipping-rate/${districtId}`,
      );
    } catch {
      return null;
    }
  },
  "public-shipping-rate",
);

export const publicShopsApi = {
  getAll: getPublicShops,
  getBySlug: getPublicShopBySlug,
  getProducts: getPublicShopProducts,
  getReviews: getPublicShopReviews,
  getShippingRate: getPublicShippingRate,
  invalidateAll: invalidatePublicShops,
  invalidateShop: invalidatePublicShop,
};

// Legacy aliases for OrderSummary shipping rate import
export type { ApiPublicShopListItem as PublicShop };
export const getShops = getPublicShops;
export const getShopById = getPublicShopBySlug;
export const getShopProducts = getPublicShopProducts;
