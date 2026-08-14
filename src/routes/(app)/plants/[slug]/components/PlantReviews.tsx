import { Suspense, type Component } from "solid-js";
import { createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getPublicPlantReviews } from "~/lib/api/endpoints/public/reviews.api";
import ReviewsSection from "./ReviewsSection";

function ReviewsLoadingFallback() {
  const { t } = useI18n();
  return (
    <div class="mt-12 mb-12">
      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6 animate-pulse">
        <div class="h-6 w-48 bg-cream-200 dark:bg-forest-700 rounded mb-4" />
        <div class="h-24 bg-cream-100 dark:bg-forest-900/30 rounded-xl mb-6" />
        <div class="space-y-4">
          <div class="h-20 bg-cream-100 dark:bg-forest-900/30 rounded-xl" />
          <div class="h-20 bg-cream-100 dark:bg-forest-900/30 rounded-xl" />
        </div>
        <p class="sr-only">{t("common.loading")}</p>
      </div>
    </div>
  );
}

const PlantReviewsContent: Component<{ slug: string }> = (props) => {
  const { t } = useI18n();
  const reviewData = createAsync(() => getPublicPlantReviews(props.slug));

  return (
    <ReviewsSection
      summary={reviewData()?.summary}
      reviews={
        reviewData()?.reviews.map((review) => ({
          id: review.id,
          author: review.customerName,
          rating: review.rating,
          date: review.createdAt,
          title: review.title ?? t("public.plants.detail.verifiedPurchaseReview"),
          content: review.comment ?? "",
          verified: review.isVerifiedPurchase,
        })) ?? []
      }
    />
  );
};

const PlantReviews: Component<{ slug: string }> = (props) => (
  <Suspense fallback={<ReviewsLoadingFallback />}>
    <PlantReviewsContent slug={props.slug} />
  </Suspense>
);

export default PlantReviews;
