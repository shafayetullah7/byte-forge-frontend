import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { DISCOVERY_PRESETS } from "~/lib/home/discovery-presets";
import {
  HOME_ANALYTICS_SECTIONS,
  homeClickAttrs,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";
import { buildPlantsFilterHref } from "~/lib/plants/plants-url";

export function QuickDiscovery() {
  const { t } = useI18n();
  const headingId = "quick-discovery-heading";

  return (
    <Show when={DISCOVERY_PRESETS.length > 0}>
      <section
        class="py-16 px-4 bg-cream-50 dark:bg-forest-900 border-b border-cream-200 dark:border-forest-700"
        aria-labelledby={headingId}
        {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.quick_discovery)}
      >
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-10">
            <h2 id={headingId} class="h3 mb-2">
              {t("landing.quickDiscovery.title")}
            </h2>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("landing.quickDiscovery.subtitle")}
            </p>
          </div>

          <div
            class="flex flex-wrap justify-center gap-3 sm:gap-4"
            role="list"
          >
            <For each={DISCOVERY_PRESETS}>
              {(preset) => (
                <A
                  href={buildPlantsFilterHref(preset.filter)}
                  class="px-5 py-2.5 rounded-full border border-forest-200 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 body-small font-medium hover:border-forest-400 dark:hover:border-forest-500 hover:bg-forest-50 dark:hover:bg-forest-700 transition-standard"
                  role="listitem"
                  {...homeClickAttrs(`quick_discovery.preset.${preset.id}`)}
                >
                  {t(preset.labelKey)}
                </A>
              )}
            </For>
            <A
              href="/find"
              class="px-5 py-2.5 rounded-full border border-terracotta-300 dark:border-terracotta-600 bg-terracotta-50 dark:bg-terracotta-950/40 text-terracotta-800 dark:text-terracotta-200 body-small font-semibold hover:border-terracotta-400 dark:hover:border-terracotta-500 transition-standard"
              role="listitem"
              {...homeClickAttrs("quick_discovery.plant_finder")}
            >
              {t("landing.plantFinder.cta")}
            </A>
          </div>
        </div>
      </section>
    </Show>
  );
}
