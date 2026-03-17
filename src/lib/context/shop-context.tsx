import { createContext, useContext, ParentComponent } from "solid-js";
import { query, createAsync, revalidate } from "@solidjs/router";
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
}, "shop");

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
}, "shop-status");

interface ShopContextValue {
    /**
     * Shop data accessor
     * Returns: undefined while loading, null if no shop exists, Shop if shop exists
     */
    shop: () => Shop | null | undefined;
    /**
     * Shop status accessor (for routing decisions)
     * Returns: undefined while loading, null if no shop exists, ShopStatus if shop exists
     */
    shopStatus: () => ShopStatus | null | undefined;
    refetch: () => Promise<void>;
    fetchShopStatus: () => Promise<void>;
    /**
     * Returns true while shop data is being fetched
     */
    isLoading: () => boolean;
    /**
     * Returns true while shop status is being fetched
     */
    isStatusLoading: () => boolean;
    /**
     * Returns true if either shop or status is still loading
     * Useful for UI that needs both data sources
     */
    isAnyLoading: () => boolean;
}

const ShopContext = createContext<ShopContextValue>();

export const ShopProvider: ParentComponent = (props) => {
    const data = createAsync(() => getShop());
    const statusData = createAsync(() => getShopStatus());

    /**
     * Track initial load completion to avoid flickering loading state
     * Both shop and status need to load before we consider initial load complete
     */
    const isInitialLoad = () => data() === undefined || statusData() === undefined;

    const value: ShopContextValue = {
        shop: () => data(),
        shopStatus: () => statusData(),
        refetch: () => revalidate("shop"),
        fetchShopStatus: () => revalidate("shop-status"),
        isLoading: () => data() === undefined,
        isStatusLoading: () => statusData() === undefined,
        /**
         * Combined loading state for UI that needs both shop and status
         * Returns true only during initial load when either shop or status is still loading
         * This prevents flickering when one resolves before the other
         */
        isAnyLoading: isInitialLoad,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error("useShop must be used within ShopProvider");
    }
    return context;
};
