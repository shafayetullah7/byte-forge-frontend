import { Component } from "solid-js";
import { useI18n } from "~/i18n";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/layout/EmptyState";
import { A } from "@solidjs/router";
import { Squares2x2Icon } from "~/components/icons";

const SellerDashboard: Component = () => {
    const { t } = useI18n();

    return (
        <div>
            <PageHeader
                title={t("common.sellerWorkspace")}
                subtitle="Manage your shops and products"
            />

            {/* Placeholder Content */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Sales</h3>
                    <p class="text-3xl font-bold text-forest-600 dark:text-sage-400">$0.00</p>
                </div>
                <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Shops</h3>
                    <p class="text-3xl font-bold text-forest-600 dark:text-sage-400">0</p>
                </div>
                <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pending Orders</h3>
                    <p class="text-3xl font-bold text-forest-600 dark:text-sage-400">0</p>
                </div>
            </div>

            <EmptyState
                title="No shops created yet"
                description="Start your journey by creating your first plant nursery."
                icon={<Squares2x2Icon class="w-12 h-12 text-forest-300" />}
                action={
                    <A
                        href="/app/seller/shops/new"
                        class="px-4 py-2 bg-forest-600 dark:bg-sage-600 text-white rounded-lg hover:bg-forest-700 dark:hover:bg-sage-700 transition-colors font-medium"
                    >
                        Create New Shop
                    </A>
                }
            />
        </div>
    );
};

export default SellerDashboard;
