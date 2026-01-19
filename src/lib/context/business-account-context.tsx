import { createContext, useContext, createResource, ParentComponent, Accessor } from "solid-js";
import { sellerApi } from "~/lib/api";
import type { BusinessAccount } from "~/lib/api/types/seller.types";

type BusinessAccountContextType = {
    businessAccount: Accessor<BusinessAccount | null | undefined>;
    hasBusinessAccount: () => boolean;
    refetch: () => void;
    isLoading: () => boolean;
};

const BusinessAccountContext = createContext<BusinessAccountContextType>();

export const BusinessAccountProvider: ParentComponent = (props) => {
    const [businessAccount, { refetch }] = createResource(async () => {
        try {
            const response = await sellerApi.businessAccount.get();
            return response.data;
        } catch (error: any) {
            // If 404, user doesn't have a business account yet
            if (error.response?.status === 404) {
                return null;
            }
            // For other errors, rethrow
            throw error;
        }
    });

    const hasBusinessAccount = () => {
        const account = businessAccount();
        return account !== null && account !== undefined;
    };

    const isLoading = () => businessAccount.loading;

    return (
        <BusinessAccountContext.Provider
            value={{
                businessAccount,
                hasBusinessAccount,
                refetch,
                isLoading
            }}
        >
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
