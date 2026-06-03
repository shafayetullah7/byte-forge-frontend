import { Component, createMemo, Suspense } from "solid-js";
import { createStore } from "solid-js/store";
import { useI18n } from "~/i18n";
import { A, createAsync } from "@solidjs/router";
import { MapPinIcon, PlusIcon } from "~/components/icons";
import {
    getAddresses,
    deleteAddress,
    setDefaultAddress,
} from "~/lib/api/endpoints/buyer/address.api";
import type { Address, AddressType } from "~/lib/api/types/address.types";
import { toaster } from "~/components/ui/Toast";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import {
    AddressCard,
    AddressStats,
    AddressTabs,
    AddressEmptyState,
    AddressSkeleton,
    type AddressTab,
} from "./__components__";

interface FilterState {
    tab: AddressTab;
}

const AddressesPage: Component = () => {
    const { t } = useI18n();
    const [filters, setFilters] = createStore<FilterState>({
        tab: "all",
    });

    const apiType = createMemo<AddressType | "both">(() =>
        filters.tab === "all" ? "both" : filters.tab
    );

    const addresses = createAsync(
        () => getAddresses({ type: apiType() }),
        { deferStream: true }
    );

    const handleDelete = async (id: string) => {
        try {
            await deleteAddress(id);
            toaster.success("Address deleted successfully");
        } catch (error) {
            toaster.error("Failed to delete address");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultAddress(id);
            toaster.success("Default address updated");
        } catch (error) {
            toaster.error("Failed to set default address");
        }
    };

    const handleEdit = (address: Address) => {
        // Placeholder for future edit modal
        console.log("Edit address:", address);
    };

    return (
        <SafeErrorBoundary
            fallback={(err, reset) => (
                <InlineErrorFallback error={err} reset={reset} label={t("buyer.addresses.title")} />
            )}
        >
            <div class="min-h-screen py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div class="mb-8">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md shadow-forest-500/20">
                                <MapPinIcon class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {t("buyer.addresses.title")}
                                </h1>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {t("buyer.addresses.subtitle")}
                                </p>
                            </div>
                        </div>
                        <A
                            href="/app/addresses/new"
                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 dark:bg-sage-600 hover:bg-forest-700 dark:hover:bg-sage-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                        >
                            <PlusIcon class="w-4 h-4" />
                            {t("buyer.addresses.addNew")}
                        </A>
                    </div>
                </div>

                <Suspense fallback={<AddressSkeleton />}>
                    {(() => {
                        const list = addresses();
                        if (!list) return null;

                        const shipping = list.filter((a) => a.type === "shipping");
                        const billing = list.filter((a) => a.type === "billing");

                        return (
                            <>
                                {/* Stats */}
                                <AddressStats
                                    total={list.length}
                                    shipping={shipping.length}
                                    billing={billing.length}
                                />

                                {/* Tabs */}
                                <AddressTabs
                                    activeTab={filters.tab}
                                    onTabChange={(tab) => setFilters("tab", tab)}
                                    counts={{
                                        all: list.length,
                                        shipping: shipping.length,
                                        billing: billing.length,
                                    }}
                                />

                                {/* Address Cards */}
                                {list.length === 0 ? (
                                    <AddressEmptyState />
                                ) : (
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {list.map((address) => (
                                            <AddressCard
                                                address={address}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                onSetDefault={handleSetDefault}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </Suspense>
            </div>
            </div>
        </SafeErrorBoundary>
    );
};

export default AddressesPage;
