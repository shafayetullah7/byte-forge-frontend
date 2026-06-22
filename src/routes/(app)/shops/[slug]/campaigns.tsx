import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { useI18n } from "~/i18n";
import {
  getShopBySlug,
  getShopCampaigns,
  getShopCampaignHighlights,
} from "~/lib/public-shops/public-shop.service";
import { ShopCampaignHistory } from "~/components/shops/public";

export default function ShopCampaignsPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  const slug = () => params.slug;

  const [shop] = createResource(slug, getShopBySlug);
  const [campaigns] = createResource(slug, getShopCampaigns);
  const [highlights] = createResource(slug, getShopCampaignHighlights);

  return (
    <Show when={shop()}>
      {(shopData) => (
        <Show when={campaigns()}>
          {(campaignData) => (
            <Show when={highlights()}>
              {(highlightData) => (
                <>
                  <Title>
                    {t("public.shops.detail.tabs.campaigns")} | {shopData().name} | Byte Forge
                  </Title>
                  <ShopCampaignHistory
                    campaigns={campaignData()}
                    highlights={highlightData()}
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
                </>
              )}
            </Show>
          )}
        </Show>
      )}
    </Show>
  );
}
