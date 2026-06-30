import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { ApiSuccessEnvelope } from "../../types/public/shops.api.types";

export interface WishlistItem {
  id: string;
  variantId: string;
  addedAt: string;
  variant: {
    id: string;
    sku: string;
    price: number;
  } | null;
  product: {
    id: string;
    slug: string;
    name: string;
    thumbnail: { id: string; url: string } | null;
  } | null;
  shop: {
    id: string;
    slug: string;
    name: string;
  } | null;
}

export const getWishlist = query(
  async () => {
    "use server";
    return fetcher<ApiSuccessEnvelope<WishlistItem[]>>(
      "/api/v1/user/buyer/wishlist",
      { unwrapData: false },
    );
  },
  "buyer-wishlist",
);

export async function addWishlistItem(variantId: string) {
  const response = await fetcher<ApiSuccessEnvelope<{ id: string | null; variantId: string }>>(
    "/api/v1/user/buyer/wishlist/items",
    { method: "POST", body: JSON.stringify({ variantId }), unwrapData: false },
  );
  invalidateWishlist();
  return response.data;
}

export async function removeWishlistItem(variantId: string) {
  const response = await fetcher<ApiSuccessEnvelope<{ removed: boolean; variantId: string }>>(
    `/api/v1/user/buyer/wishlist/items/${variantId}`,
    { method: "DELETE", unwrapData: false },
  );
  invalidateWishlist();
  return response.data;
}

export const invalidateWishlist = () => revalidate(getWishlist.keyFor());
