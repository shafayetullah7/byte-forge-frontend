import { A, createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import {
  Hero,
  TrustBar,
  LiveCampaigns,
  FeaturedPlants,
  TrendingPlants,
  FeaturedShops,
  HowItWorks,
  SeasonalPicks,
  WhyChooseByteForge,
  SellerCTA,
  Testimonials,
  Newsletter,
  Footer,
} from "~/components/home";
import { getFeaturedPublicReviews } from "~/lib/api/endpoints/public/reviews.api";

export default function Home() {
  const featuredReviews = createAsync(() => getFeaturedPublicReviews(6));

  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <Hero />
      <TrustBar />
      <LiveCampaigns />
      <FeaturedPlants />
      <TrendingPlants />
      <FeaturedShops />
      <HowItWorks />
      <SeasonalPicks />
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
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
