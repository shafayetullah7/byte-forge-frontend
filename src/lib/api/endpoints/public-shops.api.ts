import { query } from "@solidjs/router";
import { fetcher } from '../api-client';

export interface PublicShop {
  id: string;
  slug: string;
  name: string;
  description: string;
  businessHours: string | null;
  division: string;
  city: string;
  address: string | null;
  logo?: {
    id: string;
    url: string;
  } | null;
  banner?: {
    id: string;
    url: string;
  } | null;
}

export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  slug: string;
  images?: Array<{
    url: string;
    isPrimary: boolean;
  }>;
}

/**
 * Get all approved shops (public endpoint)
 */
export const getShops = query(
  async (params?: {
    division?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.division) searchParams.set('division', params.division);
      if (params.search) searchParams.set('search', params.search);
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
    }
    const qs = searchParams.toString();
    const url = qs ? `/api/v1/shops?${qs}` : '/api/v1/shops';
    return fetcher<{ data: PublicShop[]; pagination: any }>(url);
  },
  "public-shops"
);

/**
 * Get single shop detail (public)
 */
export const getShopById = query(
  async (id: string) => {
    return fetcher<PublicShop>(`/api/v1/shops/${id}`);
  },
  "public-shop-detail"
);

/**
 * Get products by shop (public)
 */
export const getShopProducts = query(
  async (shopId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
    }
    const qs = searchParams.toString();
    const url = qs ? `/api/v1/shops/${shopId}/products?${qs}` : `/api/v1/shops/${shopId}/products`;
    return fetcher<{ data: PublicProduct[]; pagination: any }>(url);
  },
  "public-shop-products"
);

export const publicShopsApi = {
  getAll: getShops,
  getById: getShopById,
  getProducts: getShopProducts,
};
