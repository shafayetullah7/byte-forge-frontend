import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  InventoryDetail,
  InventoryMovementsResponse,
  InventoryMovementFilter,
  InventoryOperationResponse,
  RestockVariantRequest,
  AdjustStockRequest,
  MarkDamagedRequest,
} from "../../types/seller.types";

/**
 * Get product inventory detail (variants + stock breakdown)
 */
export const getProductInventory = query(
  async (productId: string) => {
    return fetcher<InventoryDetail>(
      `/api/v1/user/seller/products/${productId}/inventory`
    );
  },
  "seller-product-inventory"
);

/**
 * Get stock movements with filtering and pagination
 */
export const getStockMovements = query(
  async (productId: string, filter?: InventoryMovementFilter) => {
    const params: Record<string, string | number | undefined> = {};
    if (filter) {
      if (filter.page !== undefined) params.page = filter.page;
      if (filter.limit !== undefined) params.limit = filter.limit;
      if (filter.variantId !== undefined) params.variantId = filter.variantId;
      if (filter.movementType !== undefined) params.movementType = filter.movementType;
      if (filter.startDate !== undefined) params.startDate = filter.startDate;
      if (filter.endDate !== undefined) params.endDate = filter.endDate;
    }
    return fetcher<InventoryMovementsResponse>(
      `/api/v1/user/seller/products/${productId}/inventory/movements`,
      { params, unwrapData: false }
    );
  },
  "seller-stock-movements"
);

/**
 * Invalidate inventory cache for a product
 */
export const invalidateInventory = (productId: string) =>
  revalidate(getProductInventory.keyFor(productId));

/**
 * Invalidate stock movements cache for a product
 */
export const invalidateMovements = (productId: string) =>
  revalidate(getStockMovements.keyFor(productId));

/**
 * Restock a variant (positive stock addition)
 */
export const restockVariant = async (
  productId: string,
  data: RestockVariantRequest
): Promise<InventoryOperationResponse> => {
  const result = await fetcher<InventoryOperationResponse>(
    `/api/v1/user/seller/products/${productId}/inventory/restock`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return result;
};

/**
 * Adjust stock (arbitrary positive or negative change)
 */
export const adjustStock = async (
  productId: string,
  data: AdjustStockRequest
): Promise<InventoryOperationResponse> => {
  const result = await fetcher<InventoryOperationResponse>(
    `/api/v1/user/seller/products/${productId}/inventory/adjust`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return result;
};

/**
 * Mark stock as damaged (negative stock removal)
 */
export const markDamaged = async (
  productId: string,
  data: MarkDamagedRequest
): Promise<InventoryOperationResponse> => {
  const result = await fetcher<InventoryOperationResponse>(
    `/api/v1/user/seller/products/${productId}/inventory/damaged`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return result;
};

/**
 * Inventory API endpoints
 */
export const inventoryApi = {
  getDetail: getProductInventory,
  getMovements: getStockMovements,
  restock: restockVariant,
  adjust: adjustStock,
  damaged: markDamaged,
};
