import { Component } from "solid-js";
import { useSession } from "~/lib/auth";
import { useI18n } from "~/i18n";
import { A } from "@solidjs/router";

const BuyerDashboard: Component = () => {
    const user = useSession();
    const { t } = useI18n();

    return (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
            {/* Hero Section */}
            <section class="bg-gradient-to-br from-forest-600 to-sage-500 dark:from-forest-800 dark:to-sage-700 text-white py-16 px-4">
                <div class="max-w-7xl mx-auto">
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">
                        {t("buyer.dashboard.welcome")}, {user()?.userName}! 👋
                    </h1>
                    <p class="text-lg md:text-xl text-white/90">
                        {t("buyer.dashboard.subtitle")}
                    </p>
                </div>
            </section>

            {/* Stats Cards */}
            <section class="max-w-7xl mx-auto px-4 -mt-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Orders Card */}
                    <div class="bg-white dark:bg-forest-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span class="text-3xl font-bold text-gray-900 dark:text-white">12</span>
                        </div>
                        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {t("buyer.dashboard.stats.orders")}
                        </h3>
                        <A
                            href="/app/orders"
                            class="text-sm text-forest-600 dark:text-sage-400 hover:underline"
                        >
                            {t("buyer.dashboard.viewAll")} →
                        </A>
                    </div>

                    {/* Favorites Card */}
                    <div class="bg-white dark:bg-forest-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span class="text-3xl font-bold text-gray-900 dark:text-white">5</span>
                        </div>
                        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {t("buyer.dashboard.stats.favorites")}
                        </h3>
                        <A
                            href="/app/favorites"
                            class="text-sm text-forest-600 dark:text-sage-400 hover:underline"
                        >
                            {t("buyer.dashboard.viewAll")} →
                        </A>
                    </div>

                    {/* Reviews Card */}
                    <div class="bg-white dark:bg-forest-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            </div>
                            <span class="text-3xl font-bold text-gray-900 dark:text-white">3</span>
                        </div>
                        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {t("buyer.dashboard.stats.reviews")}
                        </h3>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            {t("buyer.dashboard.reviewsGiven")}
                        </span>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section class="max-w-7xl mx-auto px-4 mt-12">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {t("buyer.dashboard.quickActions.title")}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <A
                        href="/shops"
                        class="group bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-forest-600 dark:hover:border-sage-400 hover:shadow-lg transition-all"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-forest-100 dark:bg-forest-700 rounded-lg group-hover:bg-forest-600 dark:group-hover:bg-sage-500 transition-colors">
                                <svg class="w-6 h-6 text-forest-600 dark:text-sage-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.browseShops")}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {t("buyer.dashboard.quickActions.browseShopsDesc")}
                                </p>
                            </div>
                        </div>
                    </A>

                    <A
                        href="/plants"
                        class="group bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-forest-600 dark:hover:border-sage-400 hover:shadow-lg transition-all"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-600 transition-colors">
                                <svg class="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.browsePlants")}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {t("buyer.dashboard.quickActions.browsePlantsDesc")}
                                </p>
                            </div>
                        </div>
                    </A>

                    <A
                        href="/app/orders"
                        class="group bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-forest-600 dark:hover:border-sage-400 hover:shadow-lg transition-all"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-600 transition-colors">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.viewOrders")}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {t("buyer.dashboard.quickActions.viewOrdersDesc")}
                                </p>
                            </div>
                        </div>
                    </A>

                    <A
                        href="/app/profile"
                        class="group bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-forest-600 dark:hover:border-sage-400 hover:shadow-lg transition-all"
                    >
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-600 transition-colors">
                                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-sage-400 transition-colors">
                                    {t("buyer.dashboard.quickActions.viewProfile")}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {t("buyer.dashboard.quickActions.viewProfileDesc")}
                                </p>
                            </div>
                        </div>
                    </A>
                </div>
            </section>

            {/* Recent Orders */}
            <section class="max-w-7xl mx-auto px-4 mt-12 pb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                        {t("buyer.dashboard.recentOrders")}
                    </h2>
                    <A
                        href="/app/orders"
                        class="text-sm font-medium text-forest-600 dark:text-sage-400 hover:underline"
                    >
                        {t("buyer.dashboard.viewAll")} →
                    </A>
                </div>

                {/* Order Cards */}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Sample Order 1 */}
                    <div class="bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                                    🌿 Monstera Deliciosa
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Order #12345
                                </p>
                            </div>
                            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                                {t("buyer.dashboard.orderStatus.shipped")}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">$45.00</span>
                            <A
                                href="/app/orders/12345"
                                class="text-sm text-forest-600 dark:text-sage-400 hover:underline"
                            >
                                {t("buyer.dashboard.viewDetails")} →
                            </A>
                        </div>
                    </div>

                    {/* Sample Order 2 */}
                    <div class="bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                                    🪴 Plant Pot Set
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Order #12344
                                </p>
                            </div>
                            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                                {t("buyer.dashboard.orderStatus.delivered")}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">$32.00</span>
                            <A
                                href="/app/orders/12344"
                                class="text-sm text-forest-600 dark:text-sage-400 hover:underline"
                            >
                                {t("buyer.dashboard.viewDetails")} →
                            </A>
                        </div>
                    </div>

                    {/* Sample Order 3 */}
                    <div class="bg-white dark:bg-forest-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                                    🌱 Succulent Collection
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Order #12343
                                </p>
                            </div>
                            <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full">
                                {t("buyer.dashboard.orderStatus.pending")}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">$28.00</span>
                            <A
                                href="/app/orders/12343"
                                class="text-sm text-forest-600 dark:text-sage-400 hover:underline"
                            >
                                {t("buyer.dashboard.viewDetails")} →
                            </A>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BuyerDashboard;
