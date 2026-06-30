import { Meta } from "@solidjs/meta";
import { Navigate, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import {
  getShopBySlug,
  getShopCampaigns,
  getShopCampaignHighlights,
} from "~/lib/public-shops/public-shop.service";
import { ShopCampaignHistory } from "~/components/shops/public";

export const route = {
  preload: ({ params }) =>
    Promise.all([
      getShopBySlug(params.slug as string),
      getShopCampaigns(params.slug as string),
      getShopCampaignHighlights(params.slug as string),
    ]),
} satisfies RouteDefinition;

export default function ShopCampaignsPage() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();

  if (!config.campaignsEnabled) {
    return (
      <>
        <Meta name="robots" content="noindex, nofollow" />
        <Navigate href={`/shops/${params.slug}`} />
      </>
    );
  }

  const campaigns = createAsync(() => getShopCampaigns(params.slug), { deferStream: true });
  const highlights = createAsync(() => getShopCampaignHighlights(params.slug), { deferStream: true });

  const labels = () => ({
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
    status_active: t("public.shops.detail.statusActive"),
    status_upcoming: t("public.shops.detail.statusUpcoming"),
    status_completed: t("public.shops.detail.statusCompleted"),
  });

  return (
    <Show
      when={campaigns() && highlights()}
      fallback={<div class="h-48 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />}
    >
      <ShopCampaignHistory
        shopSlug={params.slug}
        campaigns={campaigns() ?? []}
        highlights={highlights()!}
        labels={labels()}
      />
    </Show>
  );
}
