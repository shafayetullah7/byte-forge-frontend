import { createSignal, createMemo, For } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { UserIcon, CheckBadgeIcon, StarIcon, HeartIcon, ChatBubbleLeftRightIcon } from "~/components/icons";
import { SectionCard } from "../components/SectionCard";
import { StarRatingDisplay } from "../components/StarRatingDisplay";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import { formatDate } from "../helpers";
import { MOCK_REVIEWS, MOCK_REVIEWS_SUMMARY } from "../mock-data";

export default function ProductReviewsRoute() {
  const [reviewFilter, setReviewFilter] = createSignal<number | null>(null);

  const filteredReviews = createMemo(() => {
    if (reviewFilter() === null) return MOCK_REVIEWS;
    return MOCK_REVIEWS.filter((r) => r.rating === reviewFilter());
  });

  return (
    <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="reviews" />}>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="space-y-6">
        <SectionCard title="Rating Summary">
          <div class="text-center mb-4">
            <p class="text-5xl font-bold text-forest-800 dark:text-cream-50">{MOCK_REVIEWS_SUMMARY.average}</p>
            <div class="flex justify-center mt-2">
              <StarRatingDisplay rating={MOCK_REVIEWS_SUMMARY.average} size="w-5 h-5" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{MOCK_REVIEWS_SUMMARY.total} reviews</p>
          </div>
          <div class="space-y-2">
            <For each={MOCK_REVIEWS_SUMMARY.distribution}>
              {(dist) => (
                <div class="flex items-center gap-3">
                  <span class="text-sm text-gray-600 dark:text-gray-400 w-6">{dist.stars} \u2605</span>
                  <div class="flex-1 h-2.5 bg-cream-100 dark:bg-forest-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-cream-500 rounded-full transition-all"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">{dist.count}</span>
                </div>
              )}
            </For>
          </div>
        </SectionCard>

        <SectionCard title="Filter Reviews">
          <div class="space-y-2">
            <button
              onClick={() => setReviewFilter(null)}
              class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                reviewFilter() === null
                  ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
              }`}
            >
              <span>All Reviews ({MOCK_REVIEWS.length})</span>
            </button>
            <For each={[5, 4, 3, 2, 1]}>
              {(stars) => {
                const count = MOCK_REVIEWS_SUMMARY.distribution.find((d) => d.stars === stars)?.count || 0;
                return (
                  <button
                    onClick={() => setReviewFilter(reviewFilter() === stars ? null : stars)}
                    class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      reviewFilter() === stars
                        ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                    }`}
                  >
                    <span class="flex items-center gap-1">
                      {stars} <StarIcon class="w-3.5 h-3.5 text-cream-500" />
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">{count}</span>
                  </button>
                );
              }}
            </For>
          </div>
        </SectionCard>

        <SectionCard title="Customer Highlights">
          <div class="space-y-3">
            <For each={MOCK_REVIEWS_SUMMARY.highlights}>
              {(highlight) => (
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700 dark:text-gray-300">{highlight.label}</span>
                  <span class="text-xs font-medium text-forest-600 dark:text-forest-400 bg-forest-100 dark:bg-forest-900/40 px-2 py-0.5 rounded-full">
                    {highlight.count}
                  </span>
                </div>
              )}
            </For>
          </div>
        </SectionCard>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <For each={filteredReviews()}>
          {(review) => (
            <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="review" />}>
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-forest-100 dark:bg-forest-700 flex items-center justify-center">
                      <UserIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">{review.customerName}</p>
                        {review.verifiedPurchase && (
                          <CheckBadgeIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
                        )}
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{formatDate(review.date)} \u00b7 {review.timeAgo}</p>
                    </div>
                  </div>
                  <StarRatingDisplay rating={review.rating} size="w-4 h-4" />
                </div>
                <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{review.title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{review.comment}</p>
                {review.images.length > 0 && (
                  <div class="flex gap-2 mb-3">
                    <For each={review.images}>
                      {(img) => (
                        <div class="w-16 h-16 rounded-lg bg-cream-100 dark:bg-forest-700 border border-cream-200 dark:border-forest-600 flex items-center justify-center" />
                      )}
                    </For>
                  </div>
                )}
                <div class="flex items-center gap-4 pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <button class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                    <HeartIcon class="w-3.5 h-3.5" /> Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </ErrorBoundary>
          )}
        </For>
        {filteredReviews().length === 0 && (
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center">
            <ChatBubbleLeftRightIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">No reviews found</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">No reviews match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
