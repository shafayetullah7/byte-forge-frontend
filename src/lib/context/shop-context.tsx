import { query, revalidate } from "@solidjs/router";
import { ApiError } from "~/lib/api/types";
import type { Shop, ShopStatus } from "~/lib/api/types/seller.types";
import { sellerApi } from "~/lib/api/endpoints/seller.api";

/**
 * Shop Data Loader
 *
 * Uses the sellerApi strategy.
 * Handles 404 (no shop) gracefully by returning null.
 */
export const getShop = query(async () => {
    "use server";
    try {
        return await sellerApi.shops.getMyShop();
    } catch (error) {
        if (error instanceof ApiError && error.statusCode === 404) {
            return null;
        }
        throw error;
    }
}, "seller-shop");

/**
 * Shop Status Data Loader (for routing decisions)
 *
 * Returns minimal shop status to check if user has a shop.
 * Handles 404 (no shop) gracefully by returning null.
 */
export const getShopStatus = query(async () => {
    "use server";
    try {
        return await sellerApi.shops.getMyShopStatus();
    } catch (error) {
        if (error instanceof ApiError && error.statusCode === 404) {
            return null;
        }
        throw error;
    }
}, "seller-shop-status");

/**
 * Revalidate the shop cache
 */
export const refetchShop = () => revalidate("seller-shop");

/**
 * Revalidate the shop status cache
 */
export const refetchShopStatus = () => revalidate("seller-shop-status");
