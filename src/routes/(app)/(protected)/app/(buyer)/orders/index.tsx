import { Component, For } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { PageHeader } from "~/components/layout/PageHeader";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { EmptyState } from "~/components/layout/EmptyState";

// Mock data (replace with API later)
const MOCK_ORDERS = [
    {
        id: "ORD-12345",
        date: "2024-03-15",
        total: 45.00,
        status: "shipped",
        items: ["Monstera Deliciosa", "Ceramic Pot"],
        itemCount: 2
    },
    {
        id: "ORD-12344",
        date: "2024-03-10",
        total: 32.50,
        status: "delivered",
        items: ["Snake Plant"],
        itemCount: 1
    },
    {
        id: "ORD-12343",
        date: "2024-03-05",
        total: 128.00,
        status: "pending",
        items: ["Fiddle Leaf Fig", "Plant Stand", "Fertilizer"],
        itemCount: 3
    },
    {
        id: "ORD-12342",
        date: "2024-02-28",
        total: 55.00,
        status: "cancelled",
        items: ["Pothos Neon"],
        itemCount: 1
    }
];

const Orders: Component = () => {
    const { t } = useI18n();

    return (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-8 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <PageHeader
                    title={t("buyer.orders.title")}
                    subtitle={t("buyer.orders.subtitle")}
                    actions={
                        <div class="flex gap-2">
                            <button class="px-4 py-2 bg-white dark:bg-forest-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-forest-700 transition-colors">
                                {t("common.filter")}
                            </button>
                        </div>
                    }
                />

                {MOCK_ORDERS.length > 0 ? (
                    <div class="grid gap-4 mt-8">
                        <For each={MOCK_ORDERS}>
                            {(order) => (
                                <div class="bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Order Info */}
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-2">
                                            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">
                                                {order.id}
                                            </h3>
                                            <StatusBadge status={order.status as any} />
                                        </div>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.date).toLocaleDateString()} • {order.itemCount} items
                                        </p>
                                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                            {order.items.join(", ")}
                                        </p>
                                    </div>

                                    {/* Price & Actions */}
                                    <div class="flex items-center justify-between md:justify-end gap-6 md:min-w-[200px]">
                                        <span class="text-lg font-bold text-gray-900 dark:text-white">
                                            ${order.total.toFixed(2)}
                                        </span>
                                        <A
                                            href={`/app/orders/${order.id}`}
                                            class="px-4 py-2 bg-forest-50 dark:bg-forest-900/50 text-forest-700 dark:text-sage-400 rounded-lg text-sm font-medium hover:bg-forest-100 dark:hover:bg-forest-900 transition-colors"
                                        >
                                            {t("common.details")}
                                        </A>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                ) : (
                    <div class="mt-12">
                        <EmptyState
                            title={t("buyer.orders.empty.title")}
                            description={t("buyer.orders.empty.description")}
                            action={
                                <A
                                    href="/plants"
                                    class="px-6 py-3 bg-forest-600 dark:bg-sage-600 text-white rounded-lg hover:bg-forest-700 dark:hover:bg-sage-700 transition-colors font-medium"
                                >
                                    {t("buyer.orders.empty.action")}
                                </A>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
