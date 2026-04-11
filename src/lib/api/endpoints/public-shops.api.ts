import { apiClient } from '../api-client';

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
export const getShops = async (params?: {
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
  const url = qs ? `/shops?${qs}` : '/shops';
  return apiClient<{ data: PublicShop[]; pagination: any }>(url);
};

/**
 * Get single shop detail (public)
 */
export const getShopById = async (id: string) => {
  return apiClient<PublicShop>(`/shops/${id}`);
};

/**
 * Get products by shop (public)
 */
export const getShopProducts = async (shopId: string, params?: {
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params) {
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
  }
  const qs = searchParams.toString();
  const url = qs ? `/shops/${shopId}/products?${qs}` : `/shops/${shopId}/products`;
  return apiClient<{ data: PublicProduct[]; pagination: any }>(url);
};

export const publicShopsApi = {
  getAll: getShops,
  getById: getShopById,
  getProducts: getShopProducts,
};
