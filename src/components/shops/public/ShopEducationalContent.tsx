import { For, Show } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopArticle } from "~/lib/types/public/shops.types";
import { ShopArticleCard } from "./ShopArticleCard";

export const ShopEducationalContent: Component<{
  shopSlug: string;
  articles: PublicShopArticle[];
  labels: Record<string, string>;
}> = (props) => {
  const popular = () => props.articles.filter((a) => a.isPopular).slice(0, 3);
  const editorsPicks = () => props.articles.filter((a) => a.isEditorsPick);

  return (
    <div class="space-y-6">
      <div class="p-4 rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800">
        <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">{props.articles.length}</p>
        <p class="text-xs text-gray-500">{props.labels.totalArticles}</p>
      </div>

      <Show when={editorsPicks().length > 0}>
        <div>
          <h3 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-3">{props.labels.editorsPick}</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <For each={editorsPicks()}>
              {(article) => (
                <ShopArticleCard shopSlug={props.shopSlug} article={article} />
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={popular().length > 0}>
        <div>
          <h3 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-3">{props.labels.popular}</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <For each={popular()}>
              {(article) => (
                <ShopArticleCard shopSlug={props.shopSlug} article={article} />
              )}
            </For>
          </div>
        </div>
      </Show>

      <div>
        <h3 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-3">{props.labels.allArticles}</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={props.articles}>
            {(article) => (
              <ShopArticleCard shopSlug={props.shopSlug} article={article} />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
