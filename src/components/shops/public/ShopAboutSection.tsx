import { For, Show } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopProfile } from "~/lib/types/public/shops.types";
import { ReputationBadge, getBadgeLabel } from "./ReputationBadge";

export const ShopAboutSection: Component<{
  shop: PublicShopProfile;
  labels: Record<string, string>;
  t: (key: string) => string;
}> = (props) => (
  <section class="space-y-8">
    <div>
      <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-3">{props.labels.about}</h2>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{props.shop.about}</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">{props.labels.story}</h3>
      <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{props.shop.sellerStory}</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">{props.labels.mission}</h3>
      <p class="text-gray-600 dark:text-gray-400">{props.shop.brandMission}</p>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">{props.labels.categories}</h3>
      <div class="flex flex-wrap gap-2">
        <For each={props.shop.categoriesServed}>
          {(cat) => (
            <span class="px-3 py-1 rounded-full text-sm bg-cream-100 dark:bg-forest-900 text-forest-700 dark:text-forest-300">
              {cat}
            </span>
          )}
        </For>
      </div>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">{props.labels.whyChoose}</h3>
      <ul class="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
        <For each={props.shop.whyChooseUs}>{(item) => <li>{item}</li>}</For>
      </ul>
    </div>
    <Show when={props.shop.values.length > 0}>
      <div>
        <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">{props.labels.values}</h3>
        <div class="flex flex-wrap gap-2">
          <For each={props.shop.values}>
            {(v) => (
              <span class="px-3 py-1 rounded-lg text-sm border border-cream-200 dark:border-forest-600 text-forest-700 dark:text-cream-200">
                {v}
              </span>
            )}
          </For>
        </div>
      </div>
    </Show>
  </section>
);

export const ShopReputationSection: Component<{
  shop: PublicShopProfile;
  summary: import("~/lib/types/public/shops.types").PublicShopReviewSummary;
  labels: Record<string, string>;
  t: (key: string) => string;
}> = (props) => (
  <section class="rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-6">
    <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-6">{props.labels.reputation}</h2>
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">{props.labels.satisfaction}</h3>
        <div class="flex items-center gap-4 mb-4">
          <span class="text-4xl font-bold text-forest-800 dark:text-cream-50">
            {(props.summary.average ?? 0).toFixed(1)}
          </span>
          <span class="text-sm text-gray-500">{props.summary.total} {props.labels.reviews}</span>
        </div>
        <div class="space-y-2">
          <For each={props.summary.distribution}>
            {(row) => (
              <div class="flex items-center gap-2 text-sm">
                <span class="w-3 text-gray-500">{row.rating}</span>
                <div class="flex-1 h-2 bg-cream-200 dark:bg-forest-700 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style={{ width: `${row.percentage}%` }} />
                </div>
                <span class="w-8 text-right text-gray-500">{row.count}</span>
              </div>
            )}
          </For>
        </div>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">{props.labels.performance}</h3>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div><dt class="text-gray-500">{props.labels.orders}</dt><dd class="font-semibold text-forest-800 dark:text-cream-50">{props.shop.metrics.completedOrders.toLocaleString()}</dd></div>
          <div><dt class="text-gray-500">{props.labels.repeatBuyers}</dt><dd class="font-semibold">{props.labels.repeatBuyersValue}</dd></div>
          <div><dt class="text-gray-500">{props.labels.responseRate}</dt><dd class="font-semibold">{props.shop.metrics.responseRate}%</dd></div>
          <div><dt class="text-gray-500">{props.labels.deliverySuccess}</dt><dd class="font-semibold">{props.shop.metrics.deliverySuccessRate}%</dd></div>
          <div><dt class="text-gray-500">{props.labels.cancellationRate}</dt><dd class="font-semibold">{props.shop.metrics.cancellationRate}%</dd></div>
        </dl>
        <div class="mt-4 flex flex-wrap gap-2">
          <For each={props.shop.badges}>
            {(badge) => <ReputationBadge badge={badge} label={getBadgeLabel(badge, props.t)} />}
          </For>
        </div>
      </div>
    </div>
  </section>
);
