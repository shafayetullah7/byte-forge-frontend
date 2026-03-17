import { createContext, useContext, ParentComponent } from "solid-js";
import { query, createAsync, revalidate } from "@solidjs/router";
import { ApiError } from "~/lib/api/types";
import type { Shop } from "~/lib/api/types/seller.types";
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

interface ShopContextValue {
    shop: () => Shop | null | undefined;
    refetch: () => Promise<void>;
    isLoading: () => boolean;
}

const ShopContext = createContext<ShopContextValue>();

export const ShopProvider: ParentComponent = (props) => {
    const data = createAsync(() => getShop());

    const value: ShopContextValue = {
        shop: () => data(),
        refetch: () => revalidate("shop"),
        isLoading: () => data() === undefined,
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
