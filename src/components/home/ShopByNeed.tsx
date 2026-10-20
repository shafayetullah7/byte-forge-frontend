import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import {
  DollarSignIcon,
  LeafIcon,
  SparklesIcon,
  SproutIcon,
  SunIcon,
} from "~/components/icons";
import { useI18n } from "~/i18n";
import {
  SHOP_BY_NEED_PRESETS,
  type NeedPresetIconId,
} from "~/lib/home/need-presets";
import {
  HOME_ANALYTICS_SECTIONS,
  homeClickAttrs,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";
import { buildPlantsFilterHref } from "~/lib/plants/plants-url";

const NEED_PRESET_ICONS: Record<NeedPresetIconId, Component<{ class?: string }>> = {
  sparkles: SparklesIcon,
  leaf: LeafIcon,
  sun: SunIcon,
  sprout: SproutIcon,
  dollar: DollarSignIcon,
};

export function ShopByNeed() {
  const { t } = useI18n();
  const headingId = "shop-by-need-heading";

  return (
    <Show when={SHOP_BY_NEED_PRESETS.length > 0}>
      <section
        class="py-16 px-4 bg-white dark:bg-forest-950 border-b border-cream-200 dark:border-forest-700"
        aria-labelledby={headingId}
        {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.shop_by_need)}
      >
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-10">
            <h2 id={headingId} class="h3 mb-2">
              {t("landing.shopByNeed.title")}
            </h2>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("landing.shopByNeed.subtitle")}
            </p>
            <p class="body-small text-gray-500 dark:text-gray-500 max-w-xl mx-auto mt-3">
              {t("landing.shopByNeed.guidance")}
            </p>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            role="list"
          >
            <For each={SHOP_BY_NEED_PRESETS}>
              {(preset) => {
                const Icon = NEED_PRESET_ICONS[preset.icon];
                return (
                  <A
                    href={buildPlantsFilterHref(preset.filter)}
                    class="group flex flex-col gap-3 rounded-xl border border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900 p-5 shadow-sm hover:border-forest-300 dark:hover:border-forest-500 hover:shadow-md transition-standard"
                    role="listitem"
                    {...homeClickAttrs(`shop_by_need.${preset.id}`)}
                  >
                    <span
                      class="flex h-11 w-11 items-center justify-center rounded-full bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300 group-hover:bg-forest-200/80 dark:group-hover:bg-forest-700 transition-standard"
                      aria-hidden="true"
                    >
                      <Icon class="h-5 w-5" />
                    </span>
                    <span class="font-semibold text-forest-900 dark:text-cream-100 body-small">
                      {t(preset.labelKey)}
                    </span>
                    <span class="text-gray-600 dark:text-gray-400 text-sm leading-snug">
                      {t(preset.descriptionKey)}
                    </span>
                  </A>
                );
              }}
            </For>
          </div>
        </div>
      </section>
    </Show>
  );
}
