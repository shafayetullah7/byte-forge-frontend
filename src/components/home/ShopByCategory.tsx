import { For, Show } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getCategoryTree } from "~/lib/api/endpoints/public/categories.api";
import { getCategoryIcon } from "~/lib/home/category-icon";
import {
  HOME_ANALYTICS_SECTIONS,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";
import { buildPlantsCategoryHref } from "~/lib/plants/plants-url";

export function ShopByCategory() {
  const { t } = useI18n();
  const categoryTree = createAsync(() => getCategoryTree(), { deferStream: true });
  const headingId = "shop-by-category-heading";

  const roots = () => categoryTree() ?? [];

  return (
    <Show when={roots().length > 0}>
      <section
        class="py-16 px-4 bg-cream-50 dark:bg-forest-900 border-b border-cream-200 dark:border-forest-700"
        aria-labelledby={headingId}
        {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.shop_by_category)}
      >
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-10">
            <h2 id={headingId} class="h3 mb-2">
              {t("landing.shopByCategory.title")}
            </h2>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("landing.shopByCategory.subtitle")}
            </p>
          </div>

          <div
            class="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-thin md:grid md:grid-cols-4 lg:grid-cols-8 md:overflow-visible md:snap-none md:gap-3"
            role="list"
          >
            <For each={roots()}>
              {(category) => {
                const Icon = getCategoryIcon(category.slug);
                return (
                  <A
                    href={buildPlantsCategoryHref(category.id)}
                    class="group flex flex-shrink-0 snap-start flex-col items-center gap-2 rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 px-2 py-3 min-w-[5.25rem] md:min-w-0 shadow-sm hover:border-forest-200 dark:hover:border-forest-500 hover:shadow transition-standard"
                    role="listitem"
                    aria-label={category.name}
                  >
                    <span
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100 dark:bg-forest-700/80 text-forest-700 dark:text-forest-300 group-hover:bg-forest-200/80 dark:group-hover:bg-forest-600 transition-standard"
                      aria-hidden="true"
                    >
                      <Icon class="h-5 w-5" />
                    </span>
                    <span class="text-xs font-medium text-center text-forest-900 dark:text-cream-100 leading-tight line-clamp-2 px-0.5">
                      {category.name}
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
