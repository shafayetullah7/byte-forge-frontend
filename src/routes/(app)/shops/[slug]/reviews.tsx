import { Show } from "solid-js";
import { createAsync, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { useI18n } from "~/i18n";
import { getShopBySlug } from "~/lib/public-shops/public-shop.service";
import { ShopReviewsTab } from "~/components/shops/public";

export default function ShopReviewsPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  const slug = () => params.slug;

  const shop = createAsync(() => getShopBySlug(slug()), { deferStream: true });

  const reviewLabels = () => ({
    reviews: t("public.shops.detail.reviews"),
    verifiedPurchase: t("public.shops.detail.verifiedPurchase"),
  });

  return (
    <Show when={shop()}>
      {(shopData) => (
        <>
          <Title>
            {t("public.shops.detail.tabs.reviews")} | {shopData().name} | Byte Forge
          </Title>
          <ShopReviewsTab slug={slug()} labels={reviewLabels()} />
        </>
      )}
    </Show>
  );
}
