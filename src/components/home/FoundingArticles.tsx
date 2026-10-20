import { For, Show } from "solid-js";
import { createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import { listHomeFoundingArticles } from "~/lib/public-shops/home-founding-articles";
import { ShopArticleCard } from "~/components/shops/public/ShopArticleCard";
import {
  HOME_ANALYTICS_SECTIONS,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";

export function FoundingArticles() {
  const { t } = useI18n();
  const items = createAsync(() => listHomeFoundingArticles(), { deferStream: true });
  const headingId = "founding-articles-heading";

  return (
    <Show when={config.articlesEnabled && (items()?.length ?? 0) > 0}>
      <section
        class="py-24 px-4 bg-white dark:bg-forest-900/50"
        aria-labelledby={headingId}
        {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.founding_articles)}
      >
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
              {t("landing.foundingArticles.label")}
            </span>
            <h2 id={headingId} class="h2 mt-3 mb-4">
              {t("landing.foundingArticles.title")}
            </h2>
            <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("landing.foundingArticles.description")}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={items() ?? []}>
              {(item) => (
                <ShopArticleCard
                  shopSlug={item.shopSlug}
                  shopName={item.shopName}
                  article={item.article}
                />
              )}
            </For>
          </div>
        </div>
      </section>
    </Show>
  );
}
