import { createContext, useContext, ParentComponent, createResource } from "solid-js";
import { sellerApi, ApiError } from "~/lib/api";
import type { BusinessAccount } from "~/lib/api/types/seller.types";

interface BusinessAccountContextValue {
    businessAccount: () => BusinessAccount | null | undefined;
    refetch: () => void;
    isLoading: () => boolean;
}

const BusinessAccountContext = createContext<BusinessAccountContextValue>();

export const BusinessAccountProvider: ParentComponent = (props) => {
    const [businessAccount, { refetch }] = createResource(async () => {
        try {
            const response = await sellerApi.businessAccount.get();
            return response.data;
        } catch (error) {
            // Only handle 404 (no business account exists)
            if (error instanceof ApiError && error.statusCode === 404) {
                return null;
            }

            // Let all other errors propagate (including 401)
            // The API client will handle 401 automatically
            // The error boundary will catch other errors
            throw error;
        }
    });

    const value: BusinessAccountContextValue = {
        businessAccount,
        refetch,
        isLoading: () => businessAccount.loading,
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
