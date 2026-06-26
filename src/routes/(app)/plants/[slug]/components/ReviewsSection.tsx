import { For, createMemo, type Component } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { StarRatingIcon, ChatBubbleLeftRightIcon } from "~/components/icons";
import SectionHeader from "./SectionHeader";
import type { ReviewSummary } from "~/lib/api/types/review.types";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

const ReviewsSection: Component<{
  reviews: ReviewItem[];
  summary?: ReviewSummary;
}> = (props) => {
  const { t } = useI18n();

  const avgRating = createMemo(() => {
    if (props.summary) return props.summary.average.toFixed(1);
    if (props.reviews.length === 0) return "0.0";
    const total = props.reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / props.reviews.length).toFixed(1);
  });

  const ratingDistribution = createMemo(() => {
    if (props.summary) {
      return props.summary.distribution.map((item) => ({
        star: item.rating,
        count: item.count,
        pct: item.percentage,
      }));
    }

    return [5, 4, 3, 2, 1].map((star) => {
      const count = props.reviews.filter((r) => r.rating === star).length;
      const pct = props.reviews.length > 0 ? (count / props.reviews.length) * 100 : 0;
      return { star, count, pct };
    });
  });

  return (
    <div class="mt-12 mb-12">
      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6">
        <SectionHeader
          icon={ChatBubbleLeftRightIcon}
          title={t("public.plants.detail.reviewsTitle")}
          subtitle={t("public.plants.detail.reviewsCount", {
            count: props.summary?.total ?? props.reviews.length,
          })}
          action={{ label: t("public.plants.detail.reviewAfterPurchase"), href: "/app/orders" }}
        />

        <div class="flex items-center gap-4 p-4 bg-cream-50 dark:bg-forest-900/30 rounded-xl mb-6">
          <div class="text-center">
            <p class="text-4xl font-bold text-forest-800 dark:text-cream-50">{avgRating()}</p>
            <StarRatingIcon rating={Math.round(parseFloat(avgRating()))} />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("public.plants.detail.outOfFive")}
            </p>
          </div>
          <div class="flex-1 space-y-1.5">
            <For each={ratingDistribution()}>
              {(item) => (
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400 w-4">{item.star}</span>
                  <svg class="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div class="flex-1 h-2 bg-cream-200 dark:bg-forest-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">{item.count}</span>
                </div>
              )}
            </For>
          </div>
        </div>

        <div class="space-y-4">
          <For
            each={props.reviews}
            fallback={
              <div class="rounded-xl border border-dashed border-cream-300 dark:border-forest-700 p-8 text-center">
                <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                  {t("public.plants.detail.noReviewsTitle")}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("public.plants.detail.noReviewsDescription")}
                </p>
              </div>
            }
          >
            {(review) => (
              <div class="p-4 rounded-xl border border-cream-200 dark:border-forest-700 hover:border-forest-300 dark:hover:border-forest-600 transition-colors">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-forest-100 dark:bg-forest-700 flex items-center justify-center">
                      <span class="text-sm font-semibold text-forest-700 dark:text-forest-300">
                        {review.author[0]}
                      </span>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">{review.author}</span>
                        {review.verified && (
                          <span class="text-[10px] px-1.5 py-0.5 bg-forest-100 dark:bg-forest-900/40 text-forest-700 dark:text-forest-300 rounded font-medium">
                            {t("public.plants.detail.verifiedPurchase")}
                          </span>
                        )}
                      </div>
                      <div class="flex items-center gap-2 mt-0.5">
                        <StarRatingIcon rating={review.rating} />
                        <span class="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{review.title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.content}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
