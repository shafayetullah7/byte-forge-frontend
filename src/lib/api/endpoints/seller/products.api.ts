import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  ProductListItem,
  ProductListResponse,
  ProductFilter,
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
 * Products API endpoints
 */
export const productsApi = {
  getAll: getProducts,
};
