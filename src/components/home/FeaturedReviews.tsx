import { For, Show } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getFeaturedPublicReviews } from "~/lib/api/endpoints/public/reviews.api";
import type { FeaturedPublicReview } from "~/lib/api/types/review.types";
import {
  HOME_ANALYTICS_SECTIONS,
  homeClickAttrs,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";

function ReviewCard(props: { review: FeaturedPublicReview }) {
  const { t } = useI18n();
  const review = props.review;
  const title = () => review.title ?? t("landing.featuredReviews.fallbackTitle");
  const comment = () => review.comment ?? t("landing.featuredReviews.fallbackComment");
  const productSlug = () => review.product?.slug;

  const cardInner = (
    <>
      <div class="flex flex-wrap items-center gap-2">
        <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">{title()}</p>
        <Show when={review.isVerifiedPurchase}>
          <span
            class="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-forest-100 dark:bg-forest-700 text-forest-700 dark:text-forest-200"
          >
            {t("landing.featuredReviews.verifiedPurchase")}
          </span>
        </Show>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">{comment()}</p>
      <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {t("landing.featuredReviews.ratingMeta", {
          rating: review.rating,
          name: review.customerName,
        })}
      </div>
    </>
  );

  return (
    <Show
      when={productSlug()}
      fallback={
        <article class="rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-4 h-full">
          {cardInner}
        </article>
      }
    >
      {(slug) => (
        <A
          href={`/plants/${slug()}`}
          class="block h-full rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-4 hover:border-forest-300 dark:hover:border-forest-500 hover:shadow-md transition-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
        >
          {cardInner}
        </A>
      )}
    </Show>
  );
}

export function FeaturedReviews() {
  const { t } = useI18n();
  const reviews = createAsync(() => getFeaturedPublicReviews(6), { deferStream: true });
  const headingId = "featured-reviews-heading";

  return (
    <Show when={(reviews()?.length ?? 0) > 0}>
      <section
        class="px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-forest-900/50 border-t border-cream-200 dark:border-forest-800"
        aria-labelledby={headingId}
        {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.featured_reviews)}
      >
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-6 gap-4">
            <h2 id={headingId} class="text-xl font-bold text-forest-800 dark:text-cream-50">
              {t("landing.featuredReviews.title")}
            </h2>
            <A
              href="/plants"
              class="text-sm text-forest-600 dark:text-forest-400 hover:underline shrink-0"
              {...homeClickAttrs("featured_reviews.explore_plants")}
            >
              {t("landing.featuredReviews.explorePlants")}
            </A>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <For each={reviews() ?? []}>{(review) => <ReviewCard review={review} />}</For>
          </div>
        </div>
      </section>
    </Show>
  );
}
