import { createContext, useContext, ParentComponent } from "solid-js";
import { query, createAsync, revalidate } from "@solidjs/router";
import { ApiError } from "~/lib/api/types";
import type { BusinessAccount } from "~/lib/api/types/seller.types";
import { sellerApi } from "~/lib/api/endpoints/seller.api";

/**
 * Business Account Data Loader
 * 
 * Uses the sellerApi strategy.
 * Handles 404 (no account) gracefully by returning null.
 */
export const getBusinessAccount = query(async () => {
    "use server";
    try {
        return await sellerApi.businessAccount.get();
    } catch (error) {
        if (error instanceof ApiError && error.statusCode === 404) {
            return null;
        }
        throw error;
    }
}, "business-account");

interface BusinessAccountContextValue {
    businessAccount: () => BusinessAccount | null | undefined;
    refetch: () => Promise<void>;
    isLoading: () => boolean;
}

const BusinessAccountContext = createContext<BusinessAccountContextValue>();

export const BusinessAccountProvider: ParentComponent = (props) => {
    const data = createAsync(() => getBusinessAccount());

    const value: BusinessAccountContextValue = {
        businessAccount: () => data(),
        refetch: () => revalidate("business-account"),
        isLoading: () => data() === undefined,
    };

    return (
        <BusinessAccountContext.Provider value={value}>
            {props.children}
        </BusinessAccountContext.Provider>
    );
};

export const useBusinessAccount = () => {
    const context = useContext(BusinessAccountContext);
    if (!context) {
        throw new Error("useBusinessAccount must be used within BusinessAccountProvider");
    }
    return context;
};
