import { createSignal, For, Show } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { action, createAsync, useAction, useParams, useSubmission } from "@solidjs/router";
import {
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  StarIcon,
  UserIcon,
} from "~/components/icons";
import { SectionCard } from "../components/SectionCard";
import { StarRatingDisplay } from "../components/StarRatingDisplay";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import { formatDate } from "../helpers";
import { getSellerProductReviews, reportSellerReview } from "~/lib/api/endpoints/seller/reviews.api";
import { ApiError } from "~/lib/api/types";

const reportReviewAction = action(
  async (input: { reviewId: string; reason: string; details?: string }) => {
    "use server";
    try {
      await reportSellerReview(input.reviewId, {
        reason: input.reason,
        details: input.details,
      });
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.response?.message ?? apiError.message,
      };
    }
  },
  "seller-report-review-action"
);

export default function ProductReviewsRoute() {
  const params = useParams<{ productId: string }>();
  const [reviewFilter, setReviewFilter] = createSignal<number | null>(null);
  const reviewsData = createAsync(() =>
    getSellerProductReviews(params.productId, {
      rating: reviewFilter() ?? undefined,
    }),
  );

  const summary = () => reviewsData()?.summary;
  const reviews = () => reviewsData()?.reviews ?? [];
  const reportTrigger = useAction(reportReviewAction);
  const reportSubmission = useSubmission(reportReviewAction);
  const [reportingId, setReportingId] = createSignal<string | null>(null);

  return (
    <ErrorBoundary
      fallback={(error) => <SectionErrorFallback error={error} title="reviews" />}
    >
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="space-y-6">
          <SectionCard title="Rating Summary">
            <div class="text-center mb-4">
              <p class="text-5xl font-bold text-forest-800 dark:text-cream-50">
                {(summary()?.average ?? 0).toFixed(1)}
              </p>
              <div class="flex justify-center mt-2">
                <StarRatingDisplay
                  rating={summary()?.average ?? 0}
                  size="w-5 h-5"
                />
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {summary()?.total ?? 0} reviews
              </p>
            </div>
            <div class="space-y-2">
              <For each={summary()?.distribution ?? []}>
                {(dist) => (
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600 dark:text-gray-400 w-6">
                      {dist.rating} <StarIcon class="inline w-3 h-3 text-cream-500" />
                    </span>
                    <div class="flex-1 h-2.5 bg-cream-100 dark:bg-forest-700 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-cream-500 rounded-full transition-all"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {dist.count}
                    </span>
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
                <span>All Reviews ({summary()?.total ?? 0})</span>
              </button>
              <For each={[5, 4, 3, 2, 1]}>
                {(stars) => {
                  const count =
                    summary()?.distribution.find((d) => d.rating === stars)
                      ?.count || 0;
                  return (
                    <button
                      onClick={() =>
                        setReviewFilter(reviewFilter() === stars ? null : stars)
                      }
                      class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        reviewFilter() === stars
                          ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                      }`}
                    >
                      <span class="flex items-center gap-1">
                        {stars} <StarIcon class="w-3.5 h-3.5 text-cream-500" />
                      </span>
                      <span class="text-gray-500 dark:text-gray-400">
                        {count}
                      </span>
                    </button>
                  );
                }}
              </For>
            </div>
          </SectionCard>

          <SectionCard title="Review Trust">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Verified purchase reviews
              </span>
              <span class="text-xs font-medium text-forest-600 dark:text-forest-400 bg-forest-100 dark:bg-forest-900/40 px-2 py-0.5 rounded-full">
                {summary()?.total ?? 0}
              </span>
            </div>
          </SectionCard>
        </div>

        <div class="lg:col-span-2 space-y-4">
          <For
            each={reviews()}
            fallback={
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center">
                <ChatBubbleLeftRightIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                  No reviews found
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  No reviews match the selected filter.
                </p>
              </div>
            }
          >
            {(review) => (
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-forest-100 dark:bg-forest-700 flex items-center justify-center">
                      <UserIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                          {review.customerName}
                        </p>
                        {review.isVerifiedPurchase && (
                          <CheckBadgeIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
                        )}
                        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-cream-100 dark:bg-forest-700 text-forest-700 dark:text-cream-100">
                          {review.status}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StarRatingDisplay rating={review.rating} size="w-4 h-4" />
                </div>
                <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">
                  {review.title ?? "Verified purchase review"}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  {review.comment ?? "No written comment provided."}
                </p>
                <div class="flex items-center gap-4 pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <span class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <CheckBadgeIcon class="w-3.5 h-3.5" /> Verified purchase
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReportingId(review.id);
                      reportTrigger({
                        reviewId: review.id,
                        reason: "Seller requested policy review",
                      });
                    }}
                    disabled={reportSubmission.pending === true && reportingId() === review.id}
                    class="ml-auto text-xs rounded-md border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60"
                  >
                    {reportSubmission.pending === true && reportingId() === review.id
                      ? "Reporting..."
                      : "Report to Admin"}
                  </button>
                </div>
                <Show when={reportSubmission.result && reportingId() === review.id}>
                  <p
                    class={`mt-2 text-xs ${
                      reportSubmission.result?.success === true
                        ? "text-forest-700 dark:text-forest-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {reportSubmission.result?.success === true
                      ? "Reported successfully"
                      : reportSubmission.result?.error ?? "Failed to report"}
                  </p>
                </Show>
              </div>
            )}
          </For>
        </div>
      </div>
    </ErrorBoundary>
  );
}
