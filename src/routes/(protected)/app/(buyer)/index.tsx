import { Component, For, Show, Suspense, createMemo } from "solid-js";
import { createAsync } from "@solidjs/router";
import { useSession } from "~/lib/auth";
import { useI18n } from "~/i18n";
import { A } from "@solidjs/router";
import { getOrders, getOrdersStats } from "~/lib/api/endpoints/buyer/orders.api";
import { OrderStatusBadge } from "~/components/orders";
import { getOrderItemsPreview } from "./orders/components/utils";
import {
    ChevronRightIcon,
    ShoppingBagIcon,
    HeartIcon,
    StarIcon,
    ShopIcon,
    SparklesIcon,
    ClipboardDocumentIcon,
    UserIcon,
} from "~/components/icons";

const BuyerDashboard: Component = () => {
    const user = useSession();
    const { t } = useI18n();
    const stats = createAsync(() => getOrdersStats(), { deferStream: true });
    const recentOrders = createAsync(
        () => getOrders({ limit: 3, sortBy: "createdAt", sortOrder: "desc" }).then((res) => res.data),
        { deferStream: true },
    );

    const orderCount = createMemo(() => stats()?.total ?? 0);

    return (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
            <section class="bg-linear-to-br from-forest-400 via-forest-500 to-forest-600 dark:from-forest-600 dark:via-forest-700 dark:to-sage-700 text-white py-12 md:py-16">
                <div class="mx-auto max-w-[1400px]">
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight">
                        {t("buyer.dashboard.welcome")}, {user()?.userName}! 👋
                    </h1>
                    <p class="text-base md:text-lg text-white/90 max-w-2xl">
                        {t("buyer.dashboard.subtitle")}
                    </p>
                </div>
            </section>

            <section class="mx-auto max-w-[1400px] -mt-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-forest-100 dark:bg-forest-900/40 rounded-lg">
                                <ShoppingBagIcon class="w-6 h-6 text-forest-600 dark:text-sage-400" />
                            </div>
                            <Suspense fallback={<span class="text-3xl font-bold">—</span>}>
                                <span class="text-3xl font-bold text-forest-800 dark:text-cream-50">{orderCount()}</span>
                            </Suspense>
                        </div>
                        <h6 class="body-small text-forest-700 dark:text-cream-200/80 mb-2">
                            {t("buyer.dashboard.stats.orders")}
                        </h6>
                        <A
                            href="/app/orders"
                            class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                        >
                            {t("buyer.dashboard.viewAll")} <ChevronRightIcon class="w-4 h-4" />
                        </A>
                    </div>

                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-terracotta-100 dark:bg-terracotta-900/40 rounded-lg">
                                <HeartIcon class="w-6 h-6 text-terracotta-600 dark:text-terracotta-300" />
                            </div>
                            <span class="text-3xl font-bold text-terracotta-800 dark:text-terracotta-100">—</span>
                        </div>
                        <h6 class="body-small text-forest-700 dark:text-cream-200/80 mb-2">
                            {t("buyer.dashboard.stats.favorites")}
                        </h6>
                        <A
                            href="/app/favorites"
                            class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                        >
                            {t("buyer.dashboard.viewAll")} <ChevronRightIcon class="w-4 h-4" />
                        </A>
                    </div>

                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-sage-100 dark:bg-sage-900/40 rounded-lg">
                                <StarIcon class="w-6 h-6 text-sage-600 dark:text-sage-400" />
                            </div>
                            <span class="text-3xl font-bold text-sage-800 dark:text-sage-100">—</span>
                        </div>
                        <h6 class="body-small text-forest-700 dark:text-cream-200/80 mb-2">
                            {t("buyer.dashboard.stats.reviews")}
                        </h6>
                        <span class="body-small text-forest-700 dark:text-cream-200/60">
                            {t("buyer.dashboard.reviewsGiven")}
                        </span>
                    </div>
                </div>
            </section>

            <section class="mx-auto max-w-[1400px] mt-8 md:mt-12">
                <h2 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50 mb-6">
                    {t("buyer.dashboard.quickActions.title")}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <A href="/shops" class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-forest-100 dark:bg-forest-900/40 rounded-lg group-hover:bg-forest-500 dark:group-hover:bg-sage-500 transition-colors">
                                <ShopIcon class="w-6 h-6 text-forest-600 dark:text-sage-400 group-hover:text-white dark:group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h5 class="text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.browseShops")}
                                </h5>
                                <p class="body-small text-forest-700 dark:text-cream-200/80 mt-0.5">
                                    {t("buyer.dashboard.quickActions.browseShopsDesc")}
                                </p>
                            </div>
                        </div>
                    </A>
                    <A href="/plants" class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-sage-100 dark:bg-sage-900/40 rounded-lg group-hover:bg-sage-500 dark:group-hover:bg-sage-600 transition-colors">
                                <SparklesIcon class="w-6 h-6 text-sage-600 dark:text-sage-400 group-hover:text-white dark:group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h5 class="text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.browsePlants")}
                                </h5>
                                <p class="body-small text-forest-700 dark:text-cream-200/80 mt-0.5">
                                    {t("buyer.dashboard.quickActions.browsePlantsDesc")}
                                </p>
                            </div>
                        </div>
                    </A>
                    <A href="/app/orders" class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-forest-100 dark:bg-forest-900/40 rounded-lg group-hover:bg-forest-500 dark:group-hover:bg-sage-500 transition-colors">
                                <ClipboardDocumentIcon class="w-6 h-6 text-forest-600 dark:text-sage-400 group-hover:text-white dark:group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h5 class="text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.viewOrders")}
                                </h5>
                                <p class="body-small text-forest-700 dark:text-cream-200/80 mt-0.5">
                                    {t("buyer.dashboard.quickActions.viewOrdersDesc")}
                                </p>
                            </div>
                        </div>
                    </A>
                    <A href="/app/profile" class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-terracotta-100 dark:bg-terracotta-900/40 rounded-lg group-hover:bg-terracotta-500 dark:group-hover:bg-terracotta-600 transition-colors">
                                <UserIcon class="w-6 h-6 text-terracotta-600 dark:text-terracotta-300 group-hover:text-white dark:group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h5 class="text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.viewProfile")}
                                </h5>
                                <p class="body-small text-forest-700 dark:text-cream-200/80 mt-0.5">
                                    {t("buyer.dashboard.quickActions.viewProfileDesc")}
                                </p>
                            </div>
                        </div>
                    </A>
                </div>
            </section>

            <section class="mx-auto max-w-[1400px] mt-8 md:mt-12 pb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                        {t("buyer.dashboard.recentOrders")}
                    </h2>
                    <A
                        href="/app/orders"
                        class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                    >
                        {t("buyer.dashboard.viewAll")} <ChevronRightIcon class="w-4 h-4" />
                    </A>
                </div>

                <Suspense
                    fallback={
                        <div class="text-sm text-gray-500 dark:text-gray-400 py-8">
                            {t("common.loading")}
                        </div>
                    }
                >
                    <Show
                        when={(recentOrders()?.length ?? 0) > 0}
                        fallback={
                            <div class="flat-card p-8 text-center bg-white dark:bg-forest-800 dark:border-forest-600">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    {t("buyer.orders.empty.description")}
                                </p>
                                <A href="/plants" class="inline-block mt-4 text-sm font-semibold text-forest-600 dark:text-sage-400 hover:underline">
                                    {t("buyer.orders.empty.action")}
                                </A>
                            </div>
                        }
                    >
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <For each={recentOrders()}>
                                {(group) => {
                                    const primaryOrder = group.orders[0];
                                    const preview = getOrderItemsPreview(
                                        group.orders.flatMap((order) => order.items),
                                    );
                                    return (
                                        <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                                            <div class="flex items-start justify-between mb-4 gap-3">
                                                <div class="flex-1 min-w-0">
                                                    <h5 class="text-forest-800 dark:text-cream-50 mb-1 truncate">
                                                        {preview || primaryOrder?.shopName}
                                                    </h5>
                                                    <p class="body-small text-forest-700 dark:text-cream-200/80">
                                                        {group.orders.length > 1
                                                            ? `${group.orders.length} ${t("buyer.orders.shops")}`
                                                            : primaryOrder?.orderNumber}
                                                    </p>
                                                </div>
                                                <Show when={primaryOrder}>
                                                    {(order) => (
                                                        <OrderStatusBadge
                                                            status={order().status}
                                                            paymentMethodKey={order().paymentMethodKey}
                                                        />
                                                    )}
                                                </Show>
                                            </div>
                                            <div class="flex items-center justify-between">
                                                <span class="text-xl font-bold text-forest-700 dark:text-cream-100">
                                                    ৳{parseFloat(group.totalAmount).toFixed(2)}
                                                </span>
                                                <A
                                                    href={`/app/orders/${group.id}`}
                                                    class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                                                >
                                                    {t("buyer.dashboard.viewDetails")} <ChevronRightIcon class="w-4 h-4" />
                                                </A>
                                            </div>
                                        </div>
                                    );
                                }}
                            </For>
                        </div>
                    </Show>
                </Suspense>
            </section>
        </div>
    );
};

export default BuyerDashboard;
