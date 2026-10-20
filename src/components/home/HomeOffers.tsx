import { For, Show, createMemo } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { SparklesIcon } from "~/components/icons";
import { CampaignOfferCard } from "~/components/offers/CampaignOfferCard";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import {
  HOME_CAMPAIGNS_DISPLAY_CAP,
  listHomeCampaigns,
} from "~/lib/public-shops/home-campaigns";
import {
  HOME_ANALYTICS_SECTIONS,
  homeClickAttrs,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";

export function HomeOffers() {
  const { t } = useI18n();
  const allItems = createAsync(() => listHomeCampaigns(), { deferStream: true });
  const items = createMemo(() => (allItems() ?? []).slice(0, HOME_CAMPAIGNS_DISPLAY_CAP));
  const loaded = () => allItems() !== undefined;
  const hasDeals = () => (items()?.length ?? 0) > 0;
  const headingId = "home-offers-heading";

  return (
    <Show when={config.campaignsEnabled}>
      <section
        class="py-16 px-4 bg-cream-50 dark:bg-forest-900 border-b border-cream-200 dark:border-forest-700"
        aria-labelledby={headingId}
        {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.home_offers)}
      >
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <SparklesIcon class="w-5 h-5 text-terracotta-500" />
                <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
                  {t("landing.campaigns.label")}
                </span>
              </div>
              <h2 id={headingId} class="h3 mb-0 sm:mb-0">
                {t("landing.campaigns.title")}
              </h2>
            </div>
            <A
              href="/offers"
              class="body-small text-forest-600 dark:text-forest-400 font-semibold hover:underline mt-4 sm:mt-0"
              {...homeClickAttrs("home_offers.view_all")}
            >
              {t("landing.campaigns.viewAll")} →
            </A>
          </div>

          <Show
            when={loaded()}
            fallback={
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map(() => (
                  <div class="h-64 rounded-xl bg-cream-200/80 dark:bg-forest-800 animate-pulse" />
                ))}
              </div>
            }
          >
            <Show
              when={hasDeals()}
              fallback={
                <div
                  class="rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 px-6 py-8 text-center max-w-xl mx-auto"
                >
                  <p class="body-small text-gray-600 dark:text-gray-400 mb-4">
                    {t("landing.campaigns.homeEmptyHint")}
                  </p>
                  <A
                    href="/offers"
                    class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-forest-200 dark:border-forest-600 body-small font-semibold text-forest-700 dark:text-cream-100 hover:bg-forest-50 dark:hover:bg-forest-700 transition-standard"
                    {...homeClickAttrs("home_offers.view_all")}
                  >
                    {t("landing.campaigns.viewAll")}
                  </A>
                </div>
              }
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <For each={items()}>{(item) => <CampaignOfferCard item={item} />}</For>
              </div>
            </Show>
          </Show>
        </div>
      </section>
    </Show>
  );
}
