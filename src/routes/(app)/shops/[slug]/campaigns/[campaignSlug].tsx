import { Show } from "solid-js";
import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Meta, Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import { getCampaignDetail } from "~/lib/api/endpoints/public/shops.api";
import { mapApiCampaign } from "~/lib/public-shops/content.mappers";
import { unwrapSuccess } from "~/lib/public-shops/shop.mappers";
import { formatPageTitle } from "~/lib/seo/meta";
import { ApiError } from "~/lib/api/types";

export const route = {
  preload: ({ params }) =>
    getCampaignDetail(params.slug as string, params.campaignSlug as string),
} satisfies RouteDefinition;

export default function ShopCampaignDetailPage() {
  const params = useParams<{ slug: string; campaignSlug: string }>();
  const { t } = useI18n();

  const campaignQuery = createAsync(async () => {
    try {
      const envelope = await getCampaignDetail(params.slug, params.campaignSlug);
      return mapApiCampaign(unwrapSuccess(envelope));
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) return null;
      throw error;
    }
  }, { deferStream: true });

  return (
    <Show
      when={campaignQuery() !== undefined}
      fallback={<div class="h-64 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />}
    >
      <Show
        when={campaignQuery()}
        fallback={
          <>
            <HttpStatusCode code={404} />
            <Meta name="robots" content="noindex, nofollow" />
            <p class="text-center text-gray-500 py-12">{t("public.shops.detail.campaignNotFound")}</p>
          </>
        }
      >
        {(campaign) => (
          <>
            <Title>{formatPageTitle(campaign().title)}</Title>
            <article class="max-w-3xl mx-auto space-y-6">
              <A
                href={`/shops/${params.slug}/campaigns`}
                class="text-sm text-forest-600 dark:text-forest-400 hover:underline"
              >
                ← {t("public.shops.detail.backToCampaigns")}
              </A>
              <Show when={campaign().bannerUrl}>
                <img
                  src={campaign().bannerUrl}
                  alt=""
                  class="w-full h-56 object-cover rounded-2xl"
                />
              </Show>
              <div>
                <span class="text-xs font-medium uppercase tracking-wide text-forest-600">
                  {campaign().type.replace(/_/g, " ")}
                </span>
                <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-2">
                  {campaign().title}
                </h1>
                <Show when={campaign().discountPercent}>
                  <p class="text-terracotta-600 font-semibold mt-2">
                    {campaign().discountPercent}% {t("public.shops.detail.off")}
                  </p>
                </Show>
              </div>
              <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {campaign().description}
              </p>
              <Show when={config.campaignsEnabled}>
                <p class="text-sm text-gray-500">
                  {new Date(campaign().startDate).toLocaleDateString()} –{" "}
                  {new Date(campaign().endDate).toLocaleDateString()}
                </p>
              </Show>
            </article>
          </>
        )}
      </Show>
    </Show>
  );
}
