import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import { getSellerAnalyticsOverview } from "~/lib/api/endpoints/seller/analytics.api";
import { formatPrice } from "~/routes/(app)/plants/constants";

export const route = {
  preload: () => getSellerAnalyticsOverview(),
} satisfies RouteDefinition;

export default function SellerDashboard() {
  const { t } = useI18n();
  const analytics = createAsync(() => getSellerAnalyticsOverview(), { deferStream: true });

  return (
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t("common.dashboard")}
      </h1>

      <Show
        when={analytics()}
        fallback={
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="h-28 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />
            <div class="h-28 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />
            <div class="h-28 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />
          </div>
        }
      >
        {(data) => (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-2">{t("seller.dashboard.orders30d")}</h3>
              <p class="text-3xl font-bold text-terracotta-600 dark:text-terracotta-400">
                {data().ordersLast30Days.count}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                {formatPrice(Number(data().ordersLast30Days.revenue))}
              </p>
            </div>
            <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-2">{t("seller.dashboard.followers")}</h3>
              <p class="text-3xl font-bold text-terracotta-600 dark:text-terracotta-400">
                {data().followerCount.toLocaleString()}
              </p>
            </div>
            <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-2">{t("seller.dashboard.campaigns")}</h3>
              <p class="text-3xl font-bold text-terracotta-600 dark:text-terracotta-400">
                {data().publishedCampaignsCount}
              </p>
            </div>
            <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-2">{t("seller.dashboard.articles")}</h3>
              <p class="text-3xl font-bold text-terracotta-600 dark:text-terracotta-400">
                {data().publishedArticlesCount}
              </p>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}
