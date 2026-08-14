import { Show, For } from "solid-js";
import { createAsync } from "@solidjs/router";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";
import { listFeaturedPlants } from "~/lib/public-plants/public-plant.service";
import { PlantCard } from "~/routes/(app)/plants/plant-card";

export function FeaturedListings() {
  const { t } = useI18n();
  const plants = createAsync(() => listFeaturedPlants(), { deferStream: true });

  const headingId = "featured-listings-heading";

  return (
    <Show when={plants() !== undefined && (plants()?.data.length ?? 0) > 0}>
      <section
        class="py-24 px-4 bg-white dark:bg-forest-900/50"
        aria-labelledby={headingId}
      >
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
              {t("landing.featuredListings.label")}
            </span>
            <h2 id={headingId} class="h2 mt-3 mb-4">
              {t("landing.featuredListings.title")}
            </h2>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("landing.featuredListings.description")}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <For each={plants()?.data ?? []}>
              {(plant, index) => (
                <PlantCard plant={plant} priority={index() < 2} />
              )}
            </For>
          </div>

          <div class="text-center mt-12">
            <LinkButton href="/plants" variant="primary" size="lg">
              {t("landing.featuredListings.browseAll")} →
            </LinkButton>
          </div>
        </div>
      </section>
    </Show>
  );
}
