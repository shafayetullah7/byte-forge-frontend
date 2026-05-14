import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  ProductListItem,
  ProductListResponse,
  ProductFilter,
  ProductDetail,
  ProductSummary,
  ProductOverview,
} from "../../types/seller.types";

/**
 * Get all products (paginated, with filtering)
 * Returns full response with data array and pagination meta
 */
export const getProducts = query(
  async (filter?: ProductFilter) => {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filter) {
      if (filter.page !== undefined) params.page = filter.page;
      if (filter.limit !== undefined) params.limit = filter.limit;
      if (filter.search !== undefined) params.search = filter.search;
      if (filter.productType !== undefined) params.productType = filter.productType;
      if (filter.status !== undefined) params.status = filter.status;
      if (filter.sortBy !== undefined) params.sortBy = filter.sortBy;
      if (filter.sortOrder !== undefined) params.sortOrder = filter.sortOrder;
    }

    return fetcher<ProductListResponse>("/api/v1/user/seller/products", {
      params,
      unwrapData: false,
    });
  },
  "seller-products"
);

/**
 * Get product by ID (full detail)
 */
export const getProductById = query(
  async (id: string) => {
    return fetcher<ProductDetail>(`/api/v1/user/seller/products/${id}`);
  },
  "seller-product-detail"
);

/**
 * Get product summary (lightweight - for layout header)
 */
export const getProductSummary = query(
  async (id: string) => {
    const response = await fetcher<ProductSummary>(`/api/v1/user/seller/products/${id}/summary`);
    console.log("[ProductSummary API Response]", response);
    return response;
  },
  "seller-product-summary"
);

/**
 * Get product overview (thumbnail, variants, stock - for overview tab)
 */
export const getProductOverview = query(
  async (id: string) => {
    return fetcher<ProductOverview>(`/api/v1/user/seller/products/${id}/overview`);
  },
  "seller-product-overview"
);

/**
 * Products API endpoints
 */
export const productsApi = {
  getAll: getProducts,
  getById: getProductById,
  getSummary: getProductSummary,
  getOverview: getProductOverview,
};
