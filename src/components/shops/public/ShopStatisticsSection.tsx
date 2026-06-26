import { For } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopStatistics } from "~/lib/types/public/shops.types";
import { MiniTrendChart } from "./MiniTrendChart";

export const ShopStatisticsSection: Component<{
  statistics: PublicShopStatistics;
  labels: Record<string, string>;
}> = (props) => (
  <section>
    <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-4">{props.labels.title}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <MiniTrendChart data={props.statistics.ordersCompleted} label={props.labels.ordersTrend} />
      <MiniTrendChart data={props.statistics.followersGrowth} label={props.labels.followersTrend} />
      <MiniTrendChart data={props.statistics.ratingTrend} label={props.labels.ratingTrend} />
      <MiniTrendChart data={props.statistics.campaignTrend} label={props.labels.campaignTrend} />
      <MiniTrendChart data={props.statistics.contentViewsTrend} label={props.labels.contentTrend} />
    </div>
  </section>
);

export const ShopCommunitySection: Component<{
  metrics: import("~/lib/types/public/shops.types").PublicShopCommunityMetrics;
  labels: Record<string, string>;
}> = (props) => {
  const m = () => props.metrics;
  const items = () => [
    { label: props.labels.profileViews, value: m().profileViews.toLocaleString() },
    { label: props.labels.productViews, value: m().productViews.toLocaleString() },
    { label: props.labels.wishlistAdds, value: m().wishlistAdds.toLocaleString() },
    { label: props.labels.repeatBuyers, value: `${m().repeatBuyerPercent}%` },
    { label: props.labels.campaignParticipants, value: m().campaignParticipants.toLocaleString() },
    { label: props.labels.articleViews, value: m().articleViews.toLocaleString() },
    { label: props.labels.engagementScore, value: `${m().engagementScore}/100` },
  ];

  return (
    <section>
      <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-4">{props.labels.title}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <For each={items()}>
          {(item) => (
            <div class="rounded-xl bg-gradient-to-br from-forest-50 to-sage-50 dark:from-forest-900/50 dark:to-forest-800 border border-cream-200 dark:border-forest-700 p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
              <p class="text-lg font-bold text-forest-800 dark:text-cream-50">{item.value}</p>
            </div>
          )}
        </For>
      </div>
    </section>
  );
};
