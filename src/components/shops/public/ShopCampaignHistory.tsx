import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import type {
  PublicShopCampaign,
  PublicShopCampaignHighlights,
} from "~/lib/types/public/shops.types";
import { formatPrice } from "~/routes/(app)/plants/constants";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  UPCOMING: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  COMPLETED: "bg-gray-100 text-gray-700 dark:bg-forest-900 dark:text-gray-400",
};

export const ShopCampaignHistory: Component<{
  shopSlug: string;
  campaigns: PublicShopCampaign[];
  highlights: PublicShopCampaignHighlights;
  labels: Record<string, string>;
}> = (props) => {
  const showEngagementHighlights = () =>
    props.highlights.totalSavingsBdt > 0 ||
    props.highlights.totalParticipants > 0 ||
    props.highlights.mostSuccessfulReach > 0;

  return (
    <div class="space-y-6">
      <div class="p-4 rounded-2xl bg-gradient-to-r from-forest-50 to-sage-50 dark:from-forest-900/40 dark:to-forest-800/40 border border-cream-200 dark:border-forest-700">
        <p class="text-sm font-medium text-forest-700 dark:text-forest-300">
          {props.labels.highlightPrefix} {props.highlights.campaignsLast12Months}{" "}
          {props.labels.highlightCampaigns}
        </p>
        <Show when={showEngagementHighlights()}>
          <div class="grid sm:grid-cols-3 gap-3 mt-3">
            <Show when={props.highlights.totalSavingsBdt > 0}>
              <div class="text-center sm:text-left">
                <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                  {formatPrice(props.highlights.totalSavingsBdt)}
                </p>
                <p class="text-xs text-gray-500">{props.labels.totalSavings}</p>
              </div>
            </Show>
            <Show when={props.highlights.totalParticipants > 0}>
              <div class="text-center sm:text-left">
                <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                  {props.highlights.totalParticipants.toLocaleString()}+
                </p>
                <p class="text-xs text-gray-500">{props.labels.totalParticipants}</p>
              </div>
            </Show>
            <Show when={props.highlights.mostSuccessfulReach > 0}>
              <div class="text-center sm:text-left">
                <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                  {props.highlights.mostSuccessfulReach.toLocaleString()}
                </p>
                <p class="text-xs text-gray-500">{props.labels.mostSuccessful}</p>
              </div>
            </Show>
          </div>
        </Show>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <For each={props.campaigns}>
          {(campaign) => (
            <article class="rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 overflow-hidden">
              <A href={`/shops/${props.shopSlug}/campaigns/${campaign.slug}`} class="block">
                <div class="h-32 overflow-hidden">
                  <img src={campaign.bannerUrl} alt="" class="w-full h-full object-cover" loading="lazy" />
                </div>
                <div class="p-4">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <h3 class="font-bold text-forest-800 dark:text-cream-50">{campaign.title}</h3>
                    <span
                      class={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[campaign.status]}`}
                    >
                      {props.labels[`status_${campaign.status.toLowerCase()}` as keyof typeof props.labels] ??
                        campaign.status}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {campaign.description}
                  </p>
                  <Show when={campaign.discountPercent}>
                    <p class="text-sm font-semibold text-terracotta-600 dark:text-terracotta-400">
                      {campaign.discountPercent}% {props.labels.off}
                    </p>
                  </Show>
                  <Show when={campaign.productsIncluded > 0}>
                    <p class="text-xs text-gray-500 mt-2">
                      {campaign.productsIncluded} {props.labels.productsIncluded}
                    </p>
                  </Show>
                </div>
              </A>
            </article>
          )}
        </For>
      </div>
    </div>
  );
};
