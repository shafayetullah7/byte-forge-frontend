import { A, createAsync } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { ShopIcon, HeartIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import { getCategoryTree } from "~/lib/api/endpoints/public/categories.api";
import {
  HOME_ANALYTICS_SECTIONS,
  homeClickAttrs,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";
import { listHomeHeroStats } from "~/lib/home/hero-public-stats";
import { buildPlantsCategoryHref } from "~/lib/plants/plants-url";

const HERO_CATEGORY_CHIP_LIMIT = 8;

export function Hero() {
  const { t } = useI18n();
  const categoryTree = createAsync(() => getCategoryTree(), { deferStream: true });
  const heroStats = createAsync(() => listHomeHeroStats(), { deferStream: true });

  const liveBadgeText = createMemo(() => {
    const stats = heroStats();
    if (stats?.mode === "numeric") {
      return t("landing.hero.liveBadgeWithStats", {
        shopCount: stats.shopCount,
        plantCount: stats.plantCount,
      });
    }
    return t("landing.hero.liveBadge");
  });

  const heroCategories = createMemo(() => {
    const tree = categoryTree();
    if (!tree?.length) return [];
    return tree.slice(0, HERO_CATEGORY_CHIP_LIMIT);
  });

  return (
    <div
      class="relative w-full min-h-[90dvh] flex items-center justify-center overflow-hidden"
      {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.hero)}
    >
      {/* Background */}
      <div
        class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-200 dark:opacity-70 dark:brightness-[0.8]"
        style={{ "background-image": "url('/bg-2.webp')" }}
      >
        <div class="absolute inset-0 bg-forest-900/30 dark:bg-forest-950/60 transition-colors duration-200"></div>
      </div>

      {/* Content */}
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-8 md:pt-10">
        {/* Live Badge */}
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-in fade-in duration-500">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-terracotta-500"></span>
          </span>
          <span class="body-small text-white font-medium">{liveBadgeText()}</span>
        </div>

        <h1 class="h1 text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {t("landing.hero.title")}
        </h1>

        <p class="body-large text-cream-100 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          {t("landing.hero.subtitle")}
        </p>

        <Show when={heroCategories().length > 0}>
          <div class="flex flex-wrap justify-center gap-2 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <For each={heroCategories()}>
              {(category) => (
                <A
                  href={buildPlantsCategoryHref(category.id)}
                  class="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white body-small font-medium hover:bg-white/20 hover:border-white/40 transition-standard"
                  {...homeClickAttrs(`hero.category_chip.${category.slug}`)}
                >
                  {category.name}
                </A>
              )}
            </For>
          </div>
        </Show>

        {/* Buyer primary CTAs */}
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <LinkButton
            href="/plants"
            size="lg"
            variant="primary"
            class="w-full sm:w-auto"
            {...homeClickAttrs("hero.explore_plants")}
          >
            <HeartIcon class="w-5 h-5 mr-2" />
            {t("landing.hero.explorePlants")}
          </LinkButton>
          <LinkButton
            href="/shops"
            size="lg"
            variant="primary"
            class="w-full sm:w-auto"
            {...homeClickAttrs("hero.explore_nurseries")}
          >
            <ShopIcon class="w-5 h-5 mr-2" />
            {t("landing.hero.exploreNurseries")}
          </LinkButton>
        </div>

        {/* Seller secondary CTA */}
        <div class="mt-4 mb-16 w-full sm:w-auto animate-in fade-in duration-700 delay-250">
          <LinkButton
            href={config.auth.registerUrl}
            variant="outline"
            size="lg"
            class="w-full sm:w-auto !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/60"
            {...homeClickAttrs("hero.start_selling")}
          >
            {t("landing.hero.startSelling")}
          </LinkButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div class="w-1 h-3 bg-white/80 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
