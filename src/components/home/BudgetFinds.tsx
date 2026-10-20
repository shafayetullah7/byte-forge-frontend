import { Show, For, createMemo } from "solid-js";
import { createAsync } from "@solidjs/router";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";
import {
  BUDGET_FINDS_MIN_DISPLAY,
  excludePlantIds,
} from "~/lib/home/budget-finds";
import { HOME_BUDGET_MAX_PRICE_BDT } from "~/lib/home/discovery-presets";
import {
  HOME_ANALYTICS_SECTIONS,
  homeClickAttrs,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";
import { buildPlantsFilterHref } from "~/lib/plants/plants-url";
import {
  listBudgetFindPlants,
  listFeaturedPlants,
} from "~/lib/public-plants/public-plant.service";
import { PlantCard } from "~/routes/(app)/plants/plant-card";

export function BudgetFinds() {
  const { t } = useI18n();
  const featured = createAsync(() => listFeaturedPlants(), { deferStream: true });
  const budget = createAsync(() => listBudgetFindPlants(), { deferStream: true });

  const displayItems = createMemo(() => {
    const featuredData = featured()?.data;
    const budgetData = budget()?.data;
    if (featuredData === undefined || budgetData === undefined) {
      return undefined;
    }
    const featuredIds = new Set(featuredData.map((p) => p.id));
    return excludePlantIds(budgetData, featuredIds);
  });

  const headingId = "budget-finds-heading";
  const browseHref = () =>
    buildPlantsFilterHref({
      maxPrice: HOME_BUDGET_MAX_PRICE_BDT,
      inStockOnly: true,
    });

  return (
    <Show when={(displayItems()?.length ?? 0) >= BUDGET_FINDS_MIN_DISPLAY}>
      <section
        class="py-24 px-4 bg-cream-50 dark:bg-forest-950"
        aria-labelledby={headingId}
        {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.budget_finds)}
      >
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
              {t("landing.budgetFinds.label")}
            </span>
            <h2 id={headingId} class="h2 mt-3 mb-4">
              {t("landing.budgetFinds.title", { maxPrice: HOME_BUDGET_MAX_PRICE_BDT })}
            </h2>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("landing.budgetFinds.description")}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <For each={displayItems() ?? []}>
              {(plant, index) => (
                <PlantCard plant={plant} priority={index() < 2} />
              )}
            </For>
          </div>

          <div class="text-center mt-12">
            <LinkButton
              href={browseHref()}
              variant="primary"
              size="lg"
              {...homeClickAttrs("budget_finds.browse_all")}
            >
              {t("landing.budgetFinds.browseAll", { maxPrice: HOME_BUDGET_MAX_PRICE_BDT })} →
            </LinkButton>
          </div>
        </div>
      </section>
    </Show>
  );
}
