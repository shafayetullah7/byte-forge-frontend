import { type RouteDefinition } from "@solidjs/router";
import { Title, Meta, Link } from "@solidjs/meta";
import {
  Hero,
  TrustBar,
  QuickDiscovery,
  HomeOffers,
  ShopByCategory,
  FeaturedListings,
  BudgetFinds,
  FeaturedShops,
  ShopByNeed,
  FoundingArticles,
  FeaturedReviews,
  HowItWorks,
  WhyChooseByteForge,
  SellerCTA,
  Footer,
} from "~/components/home";
import { HomeSectionAnalytics } from "~/components/home/HomeSectionAnalytics";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { getFeaturedPublicReviews } from "~/lib/api/endpoints/public/reviews.api";
import { listFeaturedShopsForHome } from "~/lib/public-shops/featured-shops-home";
import {
  listBudgetFindPlants,
  listFeaturedPlants,
} from "~/lib/public-plants/public-plant.service";
import { getCategoryTree } from "~/lib/api/endpoints/public/categories.api";
import { listHomeCampaigns } from "~/lib/public-shops/home-campaigns";
import { listHomeFoundingArticles } from "~/lib/public-shops/home-founding-articles";
import { listHomeHeroStats } from "~/lib/home/hero-public-stats";
import { useI18n } from "~/i18n";
import HreflangLinks from "~/components/seo/HreflangLinks";
import { absoluteUrl, formatPageTitle } from "~/lib/seo/meta";

export const route = {
  preload: () => {
    getFeaturedPublicReviews(6);
    listFeaturedShopsForHome();
    listFeaturedPlants();
    listBudgetFindPlants();
    getCategoryTree();
    listHomeCampaigns();
    listHomeFoundingArticles();
    listHomeHeroStats();
  },
} satisfies RouteDefinition;

export default function Home() {
  const { t } = useI18n();

  return (
    <div id="home-analytics-root" class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <HomeSectionAnalytics />
      <Title>{formatPageTitle(t("seo.home.title"))}</Title>
      <Meta name="description" content={t("seo.home.description")} />
      <Meta property="og:title" content={formatPageTitle(t("seo.home.title"))} />
      <Meta property="og:description" content={t("seo.home.description")} />
      <Link rel="canonical" href={absoluteUrl("/")} />
      <HreflangLinks path="/" />
      <Hero />
      <TrustBar />
      <QuickDiscovery />
      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="nursery offers" />
        )}
      >
        <HomeOffers />
      </SafeErrorBoundary>
      <ShopByCategory />
      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="featured plants" />
        )}
      >
        <FeaturedListings />
      </SafeErrorBoundary>
      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="budget finds" />
        )}
      >
        <BudgetFinds />
      </SafeErrorBoundary>
      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="featured shops" />
        )}
      >
        <FeaturedShops />
      </SafeErrorBoundary>
      <ShopByNeed />
      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="founding articles" />
        )}
      >
        <FoundingArticles />
      </SafeErrorBoundary>
      <HowItWorks />
      <WhyChooseByteForge />
      <SellerCTA />
      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="featured reviews" />
        )}
      >
        <FeaturedReviews />
      </SafeErrorBoundary>
      <Footer />
    </div>
  );
}
