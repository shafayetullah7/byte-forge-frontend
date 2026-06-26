import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Title, Meta, Link } from "@solidjs/meta";
import {
  Hero,
  TrustBar,
  FeaturedPlants,
  FeaturedShops,
  HowItWorks,
  WhyChooseByteForge,
  SellerCTA,
  Footer,
} from "~/components/home";
import { getFeaturedPublicReviews } from "~/lib/api/endpoints/public/reviews.api";
import { listShops } from "~/lib/public-shops/public-shop.service";
import { useI18n } from "~/i18n";
import HreflangLinks from "~/components/seo/HreflangLinks";
import { absoluteUrl, formatPageTitle } from "~/lib/seo/meta";

export const route = {
  preload: () => {
    getFeaturedPublicReviews(6);
    listShops({ sort: "popular", limit: 3 });
  },
} satisfies RouteDefinition;

export default function Home() {
  const { t } = useI18n();
  const featuredReviews = createAsync(() => getFeaturedPublicReviews(6));

  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <Title>{formatPageTitle(t("seo.home.title"))}</Title>
      <Meta name="description" content={t("seo.home.description")} />
      <Meta property="og:title" content={formatPageTitle(t("seo.home.title"))} />
      <Meta property="og:description" content={t("seo.home.description")} />
      <Link rel="canonical" href={absoluteUrl("/")} />
      <HreflangLinks path="/" />
      <Hero />
      <TrustBar />
      <FeaturedPlants />
      <FeaturedShops />
      <HowItWorks />
      <WhyChooseByteForge />
      <SellerCTA />
      <Show when={(featuredReviews()?.length ?? 0) > 0}>
        <section class="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50">
              Featured Buyer Reviews
            </h2>
            <A href="/plants" class="text-sm text-forest-600 dark:text-forest-400 hover:underline">
              Explore plants
            </A>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <For each={featuredReviews() ?? []}>
              {(review) => (
                <article class="rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-4">
                  <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                    {review.title ?? "Verified purchase review"}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                    {review.comment ?? "No written comment provided."}
                  </p>
                  <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    {review.rating}/5 · {review.customerName}
                  </div>
                </article>
              )}
            </For>
          </div>
        </section>
      </Show>
      <Footer />
    </main>
  );
}
