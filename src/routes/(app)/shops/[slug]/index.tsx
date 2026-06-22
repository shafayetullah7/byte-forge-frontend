import {
  createResource,
  createSignal,
  createMemo,
  Show,
  onMount,
} from "solid-js";
import { useParams, useSearchParams, A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { useI18n } from "~/i18n";
import {
  getShopBySlug,
  getShopProducts,
  getShopReviews,
  getShopCampaigns,
  getShopCampaignHighlights,
  getShopArticles,
  getShopStatistics,
  getShopCommunityMetrics,
  getSimilarShops,
} from "~/lib/public-shops/public-shop.service";
import type { PublicShopDetailTab, PublicProductSortOption } from "~/lib/types/public/shops.types";
import {
  ShopHero,
  ShopDetailTabs,
  ShopAboutSection,
  ShopReputationSection,
  ShopStatisticsSection,
  ShopCommunitySection,
  SimilarShops,
  ShopFeaturedProducts,
  ShopProductCatalog,
  ShopReviewsPreview,
  ShopCampaignHistory,
  ShopEducationalContent,
} from "~/components/shops/public";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export default function ShopDetailPage() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useI18n();

  const slug = () => params.slug!;

  const activeTab = createMemo<PublicShopDetailTab>(() => {
    const tab = searchParams.tab;
    const valid: PublicShopDetailTab[] = ["overview", "products", "reviews", "campaigns", "articles"];
    return valid.includes(tab as PublicShopDetailTab) ? (tab as PublicShopDetailTab) : "overview";
  });

  const setTab = (tab: PublicShopDetailTab) => setSearchParams({ tab });

  const [shop] = createResource(slug, getShopBySlug);
  const [reviews] = createResource(slug, getShopReviews);
  const [campaigns] = createResource(slug, getShopCampaigns);
  const [highlights] = createResource(slug, getShopCampaignHighlights);
  const [articles] = createResource(slug, getShopArticles);
  const [statistics] = createResource(slug, getShopStatistics);
  const [community] = createResource(slug, getShopCommunityMetrics);
  const [similar] = createResource(slug, (s) => getSimilarShops(s, 4));

  const [productSearch, setProductSearch] = createSignal("");
  const [productCategory, setProductCategory] = createSignal("");
  const [productSort, setProductSort] = createSignal<PublicProductSortOption>("popular");

  const [products] = createResource(
    () => ({
      slug: slug(),
      search: productSearch(),
      category: productCategory(),
      sort: productSort(),
    }),
    (p) => getShopProducts(p.slug, { search: p.search, category: p.category || undefined, sort: p.sort, limit: 50 }),
  );

  const tabs = () => [
    { id: "overview" as const, label: t("public.shops.detail.tabs.overview") },
    { id: "products" as const, label: t("public.shops.detail.tabs.products") },
    { id: "reviews" as const, label: t("public.shops.detail.tabs.reviews") },
    { id: "campaigns" as const, label: t("public.shops.detail.tabs.campaigns") },
    { id: "articles" as const, label: t("public.shops.detail.tabs.articles") },
  ];

  const heroLabels = () => ({
    verified: t("public.shops.directory.verified"),
    active: t("public.shops.directory.active"),
    follow: t("public.shops.detail.follow"),
    share: t("public.shops.detail.share"),
    followSoon: t("public.shops.detail.followSoon"),
    memberSince: t("public.shops.detail.memberSince"),
    products: t("public.shops.detail.productsKpi"),
    orders: t("public.shops.detail.ordersKpi"),
    rating: t("public.shops.detail.ratingKpi"),
    reviews: t("public.shops.detail.reviewsKpi"),
    followers: t("public.shops.detail.followersKpi"),
    deliverySuccess: t("public.shops.detail.deliverySuccess"),
    responseRate: t("public.shops.detail.responseRate"),
    campaigns: t("public.shops.detail.campaignsKpi"),
    campaignParticipants: t("public.shops.detail.campaignParticipantsKpi"),
    articles: t("public.shops.detail.articlesKpi"),
    shopAge: t("public.shops.detail.shopAge"),
    years: t("public.shops.detail.years"),
    satisfaction: t("public.shops.detail.satisfactionKpi"),
  });

  const aboutLabels = () => ({
    about: t("public.shops.detail.about"),
    story: t("public.shops.detail.story"),
    mission: t("public.shops.detail.mission"),
    categories: t("public.shops.detail.categories"),
    whyChoose: t("public.shops.detail.whyChoose"),
    values: t("public.shops.detail.values"),
    reputation: t("public.shops.detail.reputation"),
    satisfaction: t("public.shops.detail.satisfaction"),
    performance: t("public.shops.detail.performance"),
    repeatBuyers: t("public.shops.detail.repeatBuyers"),
    repeatBuyersValue: community()
      ? `${community()!.repeatBuyerPercent}%`
      : t("public.shops.detail.repeatBuyersValue"),
    responseRate: t("public.shops.detail.responseRate"),
    deliverySuccess: t("public.shops.detail.deliverySuccess"),
    cancellationRate: t("public.shops.detail.cancellationRate"),
    reviews: t("public.shops.detail.reviews"),
    orders: t("public.shops.detail.orders"),
  });

  const productCategories = createMemo(() => {
    const items = products()?.data ?? [];
    return [...new Set(items.map((p) => p.category))].sort();
  });

  onMount(() => {
    if (searchParams.tab === "products") setTab("products");
  });

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="shop detail" />
      )}
    >
      <Show
        when={!shop.loading && shop()}
        fallback={
          <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
            <div class="h-64 bg-cream-200 dark:bg-forest-800 animate-pulse" />
            <div class="max-w-7xl mx-auto px-4 py-8 space-y-4">
              <div class="h-8 w-64 bg-cream-200 dark:bg-forest-800 rounded animate-pulse" />
              <div class="h-32 bg-cream-200 dark:bg-forest-800 rounded animate-pulse" />
            </div>
          </div>
        }
      >
        {(shopData) => (
          <>
            <Title>{shopData().name} | Byte Forge</Title>
            <Meta name="description" content={shopData().tagline} />
            <Meta property="og:title" content={`${shopData().name} | Byte Forge`} />
            <Meta property="og:description" content={shopData().tagline} />
            <Show when={shopData().banner?.url}>
              <Meta property="og:image" content={shopData().banner!.url} />
            </Show>

            <div class="min-h-screen bg-cream-50 dark:bg-forest-900 pb-16">
              <div class="max-w-7xl mx-auto px-4 pt-4">
                <A
                  href="/shops"
                  class="inline-flex items-center text-sm text-forest-600 dark:text-forest-400 hover:underline"
                >
                  ← {t("public.shops.directory.backToShops")}
                </A>
              </div>

              <ShopHero shop={shopData()} labels={heroLabels()} />

              <ShopDetailTabs tabs={tabs()} activeTab={activeTab()} onTabChange={setTab} />

              <div class="max-w-7xl mx-auto px-4 py-8">
                <div
                  id={`panel-${activeTab()}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeTab()}`}
                  class="space-y-10"
                >
                  <Show when={activeTab() === "overview"}>
                    <ShopAboutSection shop={shopData()} labels={aboutLabels()} t={t} />
                    <Show when={reviews()?.summary}>
                      {(summary) => (
                        <ShopReputationSection
                          shop={shopData()}
                          summary={summary()}
                          labels={aboutLabels()}
                          t={t}
                        />
                      )}
                    </Show>
                    <Show when={statistics()}>
                      {(stats) => (
                        <ShopStatisticsSection
                          statistics={stats()}
                          labels={{
                            title: t("public.shops.detail.statistics"),
                            ordersTrend: t("public.shops.detail.ordersTrend"),
                            followersTrend: t("public.shops.detail.followersTrend"),
                            ratingTrend: t("public.shops.detail.ratingTrend"),
                            campaignTrend: t("public.shops.detail.campaignTrend"),
                            contentTrend: t("public.shops.detail.contentTrend"),
                          }}
                        />
                      )}
                    </Show>
                    <Show when={community()}>
                      {(metrics) => (
                        <ShopCommunitySection
                          metrics={metrics()}
                          labels={{
                            title: t("public.shops.detail.community"),
                            profileViews: t("public.shops.detail.profileViews"),
                            productViews: t("public.shops.detail.productViews"),
                            wishlistAdds: t("public.shops.detail.wishlistAdds"),
                            repeatBuyers: t("public.shops.detail.repeatBuyers"),
                            campaignParticipants: t("public.shops.detail.campaignParticipants"),
                            articleViews: t("public.shops.detail.articleViews"),
                            engagementScore: t("public.shops.detail.engagementScore"),
                          }}
                        />
                      )}
                    </Show>
                    <SimilarShops
                      shops={similar() ?? []}
                      title={t("public.shops.detail.similarShops")}
                      verifiedLabel={t("public.shops.directory.verified")}
                      activeLabel={t("public.shops.directory.active")}
                      productsLabel={t("public.shops.directory.products")}
                      ordersLabel={t("public.shops.directory.orders")}
                    />
                  </Show>

                  <Show when={activeTab() === "products"}>
                    <ShopFeaturedProducts
                      products={products()?.data ?? []}
                      title={t("public.shops.detail.featuredProducts")}
                      outOfStockLabel={t("public.shops.detail.outOfStock")}
                    />
                    <ShopProductCatalog
                      products={products()?.data ?? []}
                      search={productSearch()}
                      category={productCategory()}
                      sort={productSort()}
                      categories={productCategories()}
                      outOfStockLabel={t("public.shops.detail.outOfStock")}
                      labels={{
                        searchProducts: t("public.shops.detail.searchProducts"),
                        allCategories: t("public.shops.directory.allCategories"),
                        sortPopular: t("public.shops.detail.sortPopular"),
                        sortNewest: t("public.shops.detail.sortNewest"),
                        sortPriceAsc: t("public.shops.detail.sortPriceAsc"),
                        sortPriceDesc: t("public.shops.detail.sortPriceDesc"),
                        sortRating: t("public.shops.detail.sortRating"),
                        noProducts: t("public.shops.detail.noProducts"),
                      }}
                      onSearchChange={setProductSearch}
                      onCategoryChange={setProductCategory}
                      onSortChange={(v) => setProductSort(v as PublicProductSortOption)}
                    />
                  </Show>

                  <Show when={activeTab() === "reviews" && reviews()}>
                    {(data) => (
                      <ShopReviewsPreview
                        summary={data().summary}
                        reviews={data().reviews}
                        showAll
                        labels={{
                          reviews: t("public.shops.detail.reviews"),
                          verifiedPurchase: t("public.shops.detail.verifiedPurchase"),
                        }}
                      />
                    )}
                  </Show>

                  <Show when={activeTab() === "campaigns" && campaigns() && highlights()}>
                    <ShopCampaignHistory
                      campaigns={campaigns()!}
                      highlights={highlights()!}
                      labels={{
                        highlightPrefix: t("public.shops.detail.highlightPrefix"),
                        highlightCampaigns: t("public.shops.detail.highlightCampaigns"),
                        totalSavings: t("public.shops.detail.totalSavings"),
                        totalParticipants: t("public.shops.detail.totalParticipants"),
                        mostSuccessful: t("public.shops.detail.mostSuccessful"),
                        off: t("public.shops.detail.off"),
                        participants: t("public.shops.detail.participants"),
                        views: t("public.shops.detail.views"),
                        orders: t("public.shops.detail.orders"),
                        savings: t("public.shops.detail.savings"),
                        likes: t("public.shops.detail.likes"),
                        bookmarks: t("public.shops.detail.bookmarks"),
                        status_active: t("public.shops.detail.status_active"),
                        status_upcoming: t("public.shops.detail.status_upcoming"),
                        status_completed: t("public.shops.detail.status_completed"),
                      }}
                    />
                  </Show>

                  <Show when={activeTab() === "articles" && articles()}>
                    {(items) => (
                      <ShopEducationalContent
                        articles={items()}
                        labels={{
                          totalArticles: t("public.shops.detail.totalArticles"),
                          totalViews: t("public.shops.detail.totalViews"),
                          totalLikes: t("public.shops.detail.totalLikes"),
                          editorsPick: t("public.shops.detail.editorsPick"),
                          popular: t("public.shops.detail.popular"),
                          allArticles: t("public.shops.detail.allArticles"),
                          readTime: t("public.shops.detail.readTime"),
                        }}
                      />
                    )}
                  </Show>
                </div>
              </div>
            </div>
          </>
        )}
      </Show>

      <Show when={!shop.loading && !shop()}>
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center px-4">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
              {t("public.shops.directory.notFound")}
            </h1>
            <p class="text-gray-500 mt-2">{t("public.shops.directory.notFoundDescription")}</p>
            <A href="/shops" class="inline-block mt-4 text-forest-600 hover:underline">
              {t("public.shops.directory.backToShops")}
            </A>
          </div>
        </div>
      </Show>
    </SafeErrorBoundary>
  );
}
