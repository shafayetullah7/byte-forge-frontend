import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { useI18n } from "~/i18n";
import {
  getShopBySlug,
  getShopReviews,
  getShopStatistics,
  getShopCommunityMetrics,
  getSimilarShops,
} from "~/lib/public-shops/public-shop.service";
import {
  ShopAboutSection,
  ShopReputationSection,
  ShopStatisticsSection,
  ShopCommunitySection,
  SimilarShops,
} from "~/components/shops/public";

export default function ShopOverviewPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  const slug = () => params.slug;

  const [shop] = createResource(slug, getShopBySlug);
  const [reviews] = createResource(slug, getShopReviews);
  const [statistics] = createResource(slug, getShopStatistics);
  const [community] = createResource(slug, getShopCommunityMetrics);
  const [similar] = createResource(slug, (s) => getSimilarShops(s, 4));

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

  return (
    <Show when={shop()}>
      {(shopData) => (
        <div class="space-y-10">
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
        </div>
      )}
    </Show>
  );
}
