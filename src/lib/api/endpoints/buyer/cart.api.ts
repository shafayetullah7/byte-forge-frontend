import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type {
  Cart,
  CartItem,
  CartValidationResult,
  BulkUpdateResult,
  BulkRemoveResult,
  MergeCartResult,
  AddToCartRequest,
  UpdateCartItemRequest,
  BulkUpdateCartRequest,
  BulkRemoveCartRequest,
  MergeCartRequest,
} from "../../types/cart.types";

/**
 * Get current cart
 */
export const getCart = query(
  async (): Promise<Cart | null> => {
    return fetcher<Cart | null>("/api/v1/user/buyer/cart");
  },
  "buyer-cart"
);

/**
 * Get lightweight cart count (for navbar badge)
 */
export const getCartCount = query(
  async (): Promise<{ itemsCount: number; totalQuantity: number }> => {
    return fetcher<{ itemsCount: number; totalQuantity: number }>("/api/v1/user/buyer/cart/count");
  },
  "buyer-cart-count"
);

/**
 * Invalidate cart cache
 */
export const invalidateCart = () => revalidate(getCart.keyFor());

/**
 * Invalidate cart count cache
 */
export const invalidateCartCount = () => revalidate(getCartCount.keyFor());

/**
 * Invalidate all cart-related caches
 */
export const invalidateAllCart = () => {
  revalidate(getCart.keyFor());
  revalidate(getCartCount.keyFor());
};

/**
 * Add item to cart
 */
export const addToCart = async (
  data: AddToCartRequest
): Promise<CartItem> => {
  return fetcher<CartItem>("/api/v1/user/buyer/cart/items", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemRequest
): Promise<CartItem> => {
  return fetcher<CartItem>(`/api/v1/user/buyer/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (itemId: string): Promise<void> => {
  return fetcher<void>(`/api/v1/user/buyer/cart/items/${itemId}`, {
    method: "DELETE",
  });
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<void> => {
  return fetcher<void>("/api/v1/user/buyer/cart", {
    method: "DELETE",
  });
};

/**
 * Validate cart
 */
export const validateCart = query(
  async (): Promise<CartValidationResult> => {
    return fetcher<CartValidationResult>("/api/v1/user/buyer/cart/validate", {
      method: "POST",
    });
  },
  "buyer-cart-validation"
);

/**
 * Invalidate cart validation cache
 */
export const invalidateCartValidation = () =>
  revalidate(validateCart.keyFor());

/**
 * Bulk update cart items
 */
export const bulkUpdateCartItems = async (
  data: BulkUpdateCartRequest
): Promise<BulkUpdateResult> => {
  return fetcher<BulkUpdateResult>("/api/v1/user/buyer/cart/items/bulk", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * Bulk remove cart items
 */
export const bulkRemoveCartItems = async (
  data: BulkRemoveCartRequest
): Promise<BulkRemoveResult> => {
  return fetcher<BulkRemoveResult>("/api/v1/user/buyer/cart/items/bulk", {
    method: "DELETE",
    body: JSON.stringify(data),
  });
};

/**
 * Merge guest cart items
 */
export const mergeCart = async (
  data: MergeCartRequest
): Promise<MergeCartResult> => {
  return fetcher<MergeCartResult>("/api/v1/user/buyer/cart/merge", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Cart API endpoints
 */
export const cartApi = {
  get: getCart,
  add: addToCart,
  updateItem: updateCartItem,
  removeItem: removeCartItem,
  clear: clearCart,
  validate: validateCart,
  bulkUpdate: bulkUpdateCartItems,
  bulkRemove: bulkRemoveCartItems,
  merge: mergeCart,
};
