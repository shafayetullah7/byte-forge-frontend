import { Show, Suspense, type Component } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getShopReviews } from "~/lib/public-shops/public-shop.service";
import { ShopReviewsPreview } from "./ShopReviewsPreview";

function ReviewsTabLoading() {
  return (
    <div class="space-y-4 animate-pulse">
      <div class="h-32 rounded-2xl bg-cream-100 dark:bg-forest-800" />
      <div class="h-24 rounded-2xl bg-cream-100 dark:bg-forest-800" />
      <div class="h-24 rounded-2xl bg-cream-100 dark:bg-forest-800" />
    </div>
  );
}

const ShopReviewsTabContent: Component<{
  slug: string;
  labels: {
    reviews: string;
    verifiedPurchase: string;
  };
}> = (props) => {
  const reviews = createAsync(() => getShopReviews(props.slug));

  return (
    <Show when={reviews()}>
      {(data) => (
        <ShopReviewsPreview
          summary={data().summary}
          reviews={data().reviews}
          showAll
          labels={props.labels}
        />
      )}
    </Show>
  );
};

export const ShopReviewsTab: Component<{
  slug: string;
  labels: {
    reviews: string;
    verifiedPurchase: string;
  };
}> = (props) => (
  <Suspense fallback={<ReviewsTabLoading />}>
    <ShopReviewsTabContent slug={props.slug} labels={props.labels} />
  </Suspense>
);
