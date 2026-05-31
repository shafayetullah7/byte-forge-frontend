import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import { ApiError } from "../../types";
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  ListAddressesParams,
} from "../../types/address.types";

const BASE_PATH = "/api/v1/user/buyer/addresses";

// ========================
// Query Functions (read)
// ========================

/**
 * Get all addresses for the authenticated user
 * Supports filtering by type (shipping/billing/both)
 * Returns empty array on error (401/404) to prevent redirect
 */
export const getAddresses = query(
  async (params?: ListAddressesParams): Promise<Address[]> => {
    try {
      const queryParams: Record<string, string | number | boolean | undefined> = {};
      if (params) {
        if (params.page !== undefined) queryParams.page = params.page;
        if (params.limit !== undefined) queryParams.limit = params.limit;
        if (params.type !== undefined) queryParams.type = params.type;
        if (params.sortBy !== undefined) queryParams.sortBy = params.sortBy;
        if (params.sortOrder !== undefined) queryParams.sortOrder = params.sortOrder;
      }
      return await fetcher<Address[]>(BASE_PATH, {
        params: queryParams,
        strict: false, // Don't redirect on 401 - handle gracefully
      });
    } catch (error) {
      // Handle 401 and 404 gracefully - return empty array instead of throwing
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 404)) {
        return [];
      }
      throw error;
    }
  },
  "buyer-addresses"
);

/**
 * Get a single address by ID
 */
export const getAddressById = query(
  async (id: string): Promise<Address> => {
    return fetcher<Address>(`${BASE_PATH}/${id}`);
  },
  "buyer-address-by-id"
);

// ========================
// Cache Invalidation
// ========================

/**
 * Invalidate addresses list cache
 */
export const invalidateAddresses = () => revalidate(getAddresses.keyFor());

/**
 * Invalidate a specific address cache
 */
export const invalidateAddressById = (id: string) =>
  revalidate(getAddressById.keyFor(id));

/**
 * Invalidate all address-related caches
 */
export const invalidateAllAddresses = () => {
  revalidate(getAddresses.keyFor());
};

// ========================
// Mutation Functions (write)
// ========================

/**
 * Create a new address
 */
export const createAddress = async (
  data: CreateAddressRequest
): Promise<Address> => {
  const result = await fetcher<Address>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(data),
  });
  invalidateAddresses();
  return result;
};

/**
 * Update an existing address
 */
export const updateAddress = async (
  id: string,
  data: UpdateAddressRequest
): Promise<Address> => {
  const result = await fetcher<Address>(`${BASE_PATH}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  invalidateAddresses();
  invalidateAddressById(id);
  return result;
};

/**
 * Delete an address
 */
export const deleteAddress = async (id: string): Promise<void> => {
  await fetcher<void>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
  invalidateAddresses();
  invalidateAddressById(id);
};

/**
 * Set an address as the default
 */
export const setDefaultAddress = async (id: string): Promise<Address> => {
  const result = await fetcher<Address>(`${BASE_PATH}/${id}/default`, {
    method: "PATCH",
  });
  invalidateAddresses();
  invalidateAddressById(id);
  return result;
};

// ========================
// Namespace Export
// ========================

/**
 * Address API endpoints
 */
export const addressApi = {
  list: getAddresses,
  getById: getAddressById,
  create: createAddress,
  update: updateAddress,
  delete: deleteAddress,
  setDefault: setDefaultAddress,
  invalidate: invalidateAllAddresses,
};
