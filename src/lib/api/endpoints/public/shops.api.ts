import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  ApiPaginatedEnvelope,
  ApiPublicShopListItem,
  ApiPublicShopProduct,
  ApiPublicShopProfile,
  ApiPublicShopReview,
  ApiPublicShopReviewSummary,
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
};

export const publicShopsApi = {
  getAll: getPublicShops,
  getBySlug: getPublicShopBySlug,
  getProducts: getPublicShopProducts,
  getReviews: getPublicShopReviews,
  invalidateAll: invalidatePublicShops,
  invalidateShop: invalidatePublicShop,

  getShippingRate: async (
    shopId: string,
    districtId: string,
  ): Promise<PublicShippingRate | null> => {
    try {
      return await fetcher<PublicShippingRate>(
        `/api/v1/public/shops/${shopId}/shipping-rate/${districtId}`,
      );
    } catch {
      return null;
    }
  },
};

// Legacy aliases for OrderSummary shipping rate import
export type { ApiPublicShopListItem as PublicShop };
export const getShops = getPublicShops;
export const getShopById = getPublicShopBySlug;
export const getShopProducts = getPublicShopProducts;
