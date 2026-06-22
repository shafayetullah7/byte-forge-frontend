import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { useI18n } from "~/i18n";
import { getShopBySlug, getShopReviews } from "~/lib/public-shops/public-shop.service";
import { ShopReviewsPreview } from "~/components/shops/public";

export default function ShopReviewsPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  const slug = () => params.slug;

  const [shop] = createResource(slug, getShopBySlug);
  const [reviews] = createResource(slug, getShopReviews);

  return (
    <Show when={shop()}>
      {(shopData) => (
        <Show when={reviews()}>
          {(reviewData) => (
            <>
              <Title>
                {t("public.shops.detail.tabs.reviews")} | {shopData().name} | Byte Forge
              </Title>
              <ShopReviewsPreview
                summary={reviewData().summary}
                reviews={reviewData().reviews}
                showAll
                labels={{
                  reviews: t("public.shops.detail.reviews"),
                  verifiedPurchase: t("public.shops.detail.verifiedPurchase"),
                }}
              />
            </>
          )}
        </Show>
      )}
    </Show>
  );
}
