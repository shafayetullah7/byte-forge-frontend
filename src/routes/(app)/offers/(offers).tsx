import { For, Show } from "solid-js";
import { A, createAsync, Navigate, type RouteDefinition } from "@solidjs/router";
import { Title, Meta, Link } from "@solidjs/meta";
import { SparklesIcon } from "~/components/icons";
import { CampaignOfferCard } from "~/components/offers/CampaignOfferCard";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import HreflangLinks from "~/components/seo/HreflangLinks";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import { listOffersCampaigns } from "~/lib/public-shops/home-campaigns";
import { absoluteUrl, formatPageTitle } from "~/lib/seo/meta";

export const route = {
  preload: () => listOffersCampaigns(),
} satisfies RouteDefinition;

export default function OffersPage() {
  const { t } = useI18n();
  const campaigns = createAsync(() => listOffersCampaigns(), { deferStream: true });

  if (!config.campaignsEnabled) {
    return <Navigate href="/" />;
  }

  return (
    <SafeErrorBoundary
      fallback={(error, reset) => (
        <InlineErrorFallback error={error} reset={reset} label="nursery offers" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-10 px-4">
        <Title>{formatPageTitle(t("seo.offers.title"))}</Title>
        <Meta name="description" content={t("seo.offers.description")} />
        <Meta property="og:title" content={formatPageTitle(t("seo.offers.title"))} />
        <Meta property="og:description" content={t("seo.offers.description")} />
        <Link rel="canonical" href={absoluteUrl("/offers")} />
        <HreflangLinks path="/offers" />

        <div class="max-w-7xl mx-auto">
          <div class="mb-10">
            <div class="flex items-center gap-2 mb-2">
              <SparklesIcon class="w-5 h-5 text-terracotta-500" />
              <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
                {t("landing.campaigns.label")}
              </span>
            </div>
            <h1 class="h2 mb-3">{t("landing.campaigns.title")}</h1>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl">
              {t("landing.offers.pageDescription")}
            </p>
          </div>

          <Show
            when={campaigns() !== undefined}
            fallback={
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map(() => (
                  <div class="h-64 rounded-xl bg-cream-200 dark:bg-forest-800 animate-pulse" />
                ))}
              </div>
            }
          >
            <Show
              when={(campaigns()?.length ?? 0) > 0}
              fallback={
                <div
                  class="rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-10 text-center max-w-lg mx-auto"
                >
                  <h2 class="h4 mb-3">{t("landing.offers.emptyTitle")}</h2>
                  <p class="body-small text-gray-600 dark:text-gray-400 mb-6">
                    {t("landing.offers.emptyDescription")}
                  </p>
                  <A
                    href="/shops"
                    class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-forest-600 text-white font-semibold body-small hover:bg-forest-700 transition-standard"
                  >
                    {t("landing.offers.browseShops")}
                  </A>
                </div>
              }
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <For each={campaigns() ?? []}>
                  {(item) => <CampaignOfferCard item={item} />}
                </For>
              </div>
            </Show>
          </Show>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
