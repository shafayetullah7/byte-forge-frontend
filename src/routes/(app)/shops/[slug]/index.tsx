import { Show, createMemo } from "solid-js";
import { createAsync, useParams } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getShopBySlug, getShopReviews } from "~/lib/public-shops/public-shop.service";
import { ShopAboutSection, ShopReputationSection } from "~/components/shops/public";

export default function ShopOverviewPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  const slug = () => params.slug;

  const shop = createAsync(() => getShopBySlug(slug()), { deferStream: true });
  const reviews = createAsync(() => getShopReviews(slug()), { deferStream: true });

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
    repeatBuyersValue: t("public.shops.detail.repeatBuyersValue"),
    responseRate: t("public.shops.detail.responseRate"),
    deliverySuccess: t("public.shops.detail.deliverySuccess"),
    cancellationRate: t("public.shops.detail.cancellationRate"),
    reviews: t("public.shops.detail.reviews"),
    orders: t("public.shops.detail.orders"),
  });

  const reviewSummary = createMemo(() => {
    const summary = reviews()?.summary;
    if (!summary || summary.total <= 0) return undefined;
    return summary;
  });

  return (
    <Show when={shop()}>
      {(shopData) => (
        <div class="space-y-10">
          <ShopAboutSection shop={shopData()} labels={aboutLabels()} t={t} />
          <Show when={reviewSummary()} keyed>
            {(summary) => (
              <ShopReputationSection
                shop={shopData()}
                summary={summary}
                labels={aboutLabels()}
                t={t}
              />
            )}
          </Show>
        </div>
      )}
    </Show>
  );
}
