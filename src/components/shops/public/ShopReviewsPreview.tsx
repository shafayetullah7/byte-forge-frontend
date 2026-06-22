import { For, Show } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopReview, PublicShopReviewSummary } from "~/lib/types/public/shops.types";

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });
}

export const ShopReviewsPreview: Component<{
  summary: PublicShopReviewSummary;
  reviews: PublicShopReview[];
  labels: Record<string, string>;
  showAll?: boolean;
}> = (props) => {
  const displayReviews = () =>
    props.showAll
      ? props.reviews
      : [...props.reviews].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div class="space-y-6">
      <div class="rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-6">
        <div class="flex items-center gap-6 mb-6">
          <div class="text-center">
            <p class="text-4xl font-bold text-forest-800 dark:text-cream-50">{props.summary.average.toFixed(1)}</p>
            <p class="text-sm text-gray-500">{props.summary.total} {props.labels.reviews}</p>
          </div>
          <div class="flex-1 space-y-1.5">
            <For each={props.summary.distribution}>
              {(row) => (
                <div class="flex items-center gap-2 text-sm">
                  <span class="w-3">{row.rating}</span>
                  <div class="flex-1 h-2 bg-cream-200 dark:bg-forest-700 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-400" style={{ width: `${row.percentage}%` }} />
                  </div>
                  <span class="w-6 text-gray-500">{row.count}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <For each={displayReviews()}>
          {(review) => (
            <article class="rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-sm text-forest-800 dark:text-cream-50">{review.customerName}</span>
                  <Show when={review.isVerifiedPurchase}>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-forest-100 dark:bg-forest-900 text-forest-600 dark:text-forest-400">
                      {props.labels.verifiedPurchase}
                    </span>
                  </Show>
                </div>
                <div class="flex text-amber-400 text-sm" aria-label={`${review.rating} stars`}>
                  {"★".repeat(review.rating)}
                </div>
              </div>
              <Show when={review.title}>
                <h4 class="font-medium text-sm text-forest-800 dark:text-cream-50 mb-1">{review.title}</h4>
              </Show>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{review.comment}</p>
              <p class="text-xs text-gray-400 mt-2">
                {review.productName} · {formatReviewDate(review.createdAt)}
              </p>
            </article>
          )}
        </For>
      </div>
    </div>
  );
};
