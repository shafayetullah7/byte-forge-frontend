import { Component, Show, For } from "solid-js";
import { useParams, A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { PageHeader } from "~/components/layout/PageHeader";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { StatusType } from "~/components/ui/StatusBadge";

const OrderDetails: Component = () => {
    const params = useParams();
    const { t } = useI18n();

    // Mock data fetching based on params.id
    const order = {
        id: params.id || "ORD-00000",
        date: "2024-03-15",
        total: 45.00,
        status: "shipped",
        shippingAddress: "123 Green Lane, Plant City, PC 12345",
        items: [
            { name: "Monstera Deliciosa", price: 35.00, quantity: 1, image: "/images/monstera.jpg" },
            { name: "Ceramic Pot", price: 10.00, quantity: 1, image: "/images/pot.jpg" },
        ]
    };

    return (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-8 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                <PageHeader
                    title={`${t("buyer.orders.details.title")} #${order.id}`}
                    breadcrumbs={[
                        { label: t("buyer.orders.title"), href: "/app/orders" },
                        { label: `#${order.id}` }
                    ]}
                    actions={
                        <StatusBadge status={order.status as StatusType} class="text-sm px-3 py-1" />
                    }
                />

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div class="lg:col-span-2 space-y-6">
                        {/* Items List */}
                        <div class="bg-white dark:bg-forest-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 class="font-medium text-gray-900 dark:text-white">
                                    {t("buyer.orders.details.items")}
                                </h3>
                            </div>
                            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                                <For each={order.items}>
                                    {(item) => (
                                        <li class="p-6 flex items-center gap-4">
                                            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                {/* Image placeholder */}
                                                <div class="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            </div>
                                            <div class="flex-1">
                                                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                </h4>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <span class="font-medium text-gray-900 dark:text-white">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </li>
                                    )}
                                </For>
                            </ul>
                        </div>

                        {/* Timeline (Placeholder) */}
                        <div class="bg-white dark:bg-forest-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
                                {t("buyer.orders.details.timeline")}
                            </h3>
                            <div class="space-y-4">
                                <div class="flex gap-4">
                                    <div class="mt-1 relative">
                                        <div class="w-3 h-3 bg-forest-600 rounded-full"></div>
                                        <div class="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -z-10"></div>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                                        <p class="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div class="space-y-6">
                        <div class="bg-white dark:bg-forest-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
                                {t("buyer.orders.details.summary")}
                            </h3>
                            <dl class="space-y-3 text-sm">
                                <div class="flex justify-between">
                                    <dt class="text-gray-500 dark:text-gray-400">Subtotal</dt>
                                    <dd class="font-medium text-gray-900 dark:text-white">$45.00</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-gray-500 dark:text-gray-400">Shipping</dt>
                                    <dd class="font-medium text-gray-900 dark:text-white">$0.00</dd>
                                </div>
                                <div class="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                                    <dt class="font-bold text-gray-900 dark:text-white">Total</dt>
                                    <dd class="font-bold text-forest-600 dark:text-sage-400">$45.00</dd>
                                </div>
                            </dl>
                        </div>

                        <div class="bg-white dark:bg-forest-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                                {t("buyer.orders.details.shipping")}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {order.shippingAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
