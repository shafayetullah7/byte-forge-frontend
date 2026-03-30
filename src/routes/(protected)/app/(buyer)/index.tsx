import { Component } from "solid-js";
import { useSession } from "~/lib/auth";
import { useI18n } from "~/i18n";
import { A } from "@solidjs/router";

const BuyerDashboard: Component = () => {
    const user = useSession();
    const { t } = useI18n();

    // Arrow icon for links
    const ArrowIcon = () => (
        <svg class="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    );

    return (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
            {/* Hero Section */}
            <section class="bg-linear-to-br from-forest-400 via-forest-500 to-forest-600 dark:from-forest-600 dark:via-forest-700 dark:to-sage-700 text-white py-12 md:py-16 px-4">
                <div class="max-w-7xl mx-auto">
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight">
                        {t("buyer.dashboard.welcome")}, {user()?.userName}! 👋
                    </h1>
                    <p class="text-base md:text-lg text-white/90 max-w-2xl">
                        {t("buyer.dashboard.subtitle")}
                    </p>
                </div>
            </section>

            {/* Stats Cards */}
            <section class="max-w-7xl mx-auto px-4 -mt-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Orders Card */}
                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-forest-100 dark:bg-forest-900/40 rounded-lg">
                                <svg class="w-6 h-6 text-forest-600 dark:text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span class="text-3xl font-bold text-forest-800 dark:text-cream-50">12</span>
                        </div>
                        <h6 class="body-small text-forest-700 dark:text-cream-200/80 mb-2">
                            {t("buyer.dashboard.stats.orders")}
                        </h6>
                        <A
                            href="/app/orders"
                            class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                        >
                            {t("buyer.dashboard.viewAll")} <ArrowIcon />
                        </A>
                    </div>

                    {/* Favorites Card */}
                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-terracotta-100 dark:bg-terracotta-900/40 rounded-lg">
                                <svg class="w-6 h-6 text-terracotta-600 dark:text-terracotta-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span class="text-3xl font-bold text-terracotta-800 dark:text-terracotta-100">5</span>
                        </div>
                        <h6 class="body-small text-forest-700 dark:text-cream-200/80 mb-2">
                            {t("buyer.dashboard.stats.favorites")}
                        </h6>
                        <A
                            href="/app/favorites"
                            class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                        >
                            {t("buyer.dashboard.viewAll")} <ArrowIcon />
                        </A>
                    </div>

                    {/* Reviews Card */}
                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-sage-100 dark:bg-sage-900/40 rounded-lg">
                                <svg class="w-6 h-6 text-sage-600 dark:text-sage-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            </div>
                            <span class="text-3xl font-bold text-sage-800 dark:text-sage-100">3</span>
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

            {/* Quick Actions */}
            <section class="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
                <h2 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50 mb-6">
                    {t("buyer.dashboard.quickActions.title")}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Browse Shops */}
                    <A
                        href="/shops"
                        class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-forest-100 dark:bg-forest-900/40 rounded-lg group-hover:bg-forest-500 dark:group-hover:bg-sage-500 transition-colors">
                                <svg class="w-6 h-6 text-forest-600 dark:text-sage-400 group-hover:text-white dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
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

                    {/* Browse Plants */}
                    <A
                        href="/plants"
                        class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-sage-100 dark:bg-sage-900/40 rounded-lg group-hover:bg-sage-500 dark:group-hover:bg-sage-600 transition-colors">
                                <svg class="w-6 h-6 text-sage-600 dark:text-sage-400 group-hover:text-white dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
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

                    {/* View Orders */}
                    <A
                        href="/app/orders"
                        class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-forest-100 dark:bg-forest-900/40 rounded-lg group-hover:bg-forest-500 dark:group-hover:bg-sage-500 transition-colors">
                                <svg class="w-6 h-6 text-forest-600 dark:text-sage-400 group-hover:text-white dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
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

                    {/* View Profile */}
                    <A
                        href="/app/profile"
                        class="group flat-card flat-card-hover p-6 block bg-white dark:bg-forest-800 dark:border-forest-600"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-terracotta-100 dark:bg-terracotta-900/40 rounded-lg group-hover:bg-terracotta-500 dark:group-hover:bg-terracotta-600 transition-colors">
                                <svg class="w-6 h-6 text-terracotta-600 dark:text-terracotta-300 group-hover:text-white dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
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

            {/* Recent Orders */}
            <section class="max-w-7xl mx-auto px-4 mt-8 md:mt-12 pb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                        {t("buyer.dashboard.recentOrders")}
                    </h2>
                    <A
                        href="/app/orders"
                        class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                    >
                        {t("buyer.dashboard.viewAll")} <ArrowIcon />
                    </A>
                </div>

                {/* Order Cards */}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Sample Order 1 - Shipped */}
                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <h5 class="text-forest-800 dark:text-cream-50 mb-1">
                                    🌿 Monstera Deliciosa
                                </h5>
                                <p class="body-small text-forest-700 dark:text-cream-200/80">
                                    Order #12345
                                </p>
                            </div>
                            <span class="px-3 py-1 bg-forest-100 dark:bg-forest-900/40 text-forest-800 dark:text-forest-300 body-small font-semibold rounded-full whitespace-nowrap">
                                {t("buyer.dashboard.orderStatus.shipped")}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold text-forest-700 dark:text-cream-100">$45.00</span>
                            <A
                                href="/app/orders/12345"
                                class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                            >
                                {t("buyer.dashboard.viewDetails")} <ArrowIcon />
                            </A>
                        </div>
                    </div>

                    {/* Sample Order 2 - Delivered */}
                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <h5 class="text-forest-800 dark:text-cream-50 mb-1">
                                    🪴 Plant Pot Set
                                </h5>
                                <p class="body-small text-forest-700 dark:text-cream-200/80">
                                    Order #12344
                                </p>
                            </div>
                            <span class="px-3 py-1 bg-sage-100 dark:bg-sage-900/40 text-sage-800 dark:text-sage-300 body-small font-semibold rounded-full whitespace-nowrap">
                                {t("buyer.dashboard.orderStatus.delivered")}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold text-forest-700 dark:text-cream-100">$32.00</span>
                            <A
                                href="/app/orders/12344"
                                class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                            >
                                {t("buyer.dashboard.viewDetails")} <ArrowIcon />
                            </A>
                        </div>
                    </div>

                    {/* Sample Order 3 - Pending */}
                    <div class="flat-card flat-card-hover p-6 bg-white dark:bg-forest-800 dark:border-forest-600">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex-1">
                                <h5 class="text-forest-800 dark:text-cream-50 mb-1">
                                    🌱 Succulent Collection
                                </h5>
                                <p class="body-small text-forest-700 dark:text-cream-200/80">
                                    Order #12343
                                </p>
                            </div>
                            <span class="px-3 py-1 bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-800 dark:text-terracotta-300 body-small font-semibold rounded-full whitespace-nowrap">
                                {t("buyer.dashboard.orderStatus.pending")}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold text-forest-700 dark:text-cream-100">$28.00</span>
                            <A
                                href="/app/orders/12343"
                                class="body-small font-semibold text-forest-600 dark:text-cream-100 hover:underline flex items-center gap-1"
                            >
                                {t("buyer.dashboard.viewDetails")} <ArrowIcon />
                            </A>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BuyerDashboard;
