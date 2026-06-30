import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import type { PublicShopArticle } from "~/lib/types/public/shops.types";

export const ShopEducationalContent: Component<{
  shopSlug: string;
  articles: PublicShopArticle[];
  labels: Record<string, string>;
}> = (props) => {
  const popular = () => props.articles.filter((a) => a.isPopular).slice(0, 3);
  const editorsPicks = () => props.articles.filter((a) => a.isEditorsPick);
  const totalViews = () => props.articles.reduce((s, a) => s + a.viewCount, 0);
  const totalLikes = () => props.articles.reduce((s, a) => s + a.likeCount, 0);

  return (
    <div class="space-y-6">
      <div class="grid sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800">
        <div>
          <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">{props.articles.length}</p>
          <p class="text-xs text-gray-500">{props.labels.totalArticles}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">{totalViews().toLocaleString()}</p>
          <p class="text-xs text-gray-500">{props.labels.totalViews}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">{totalLikes().toLocaleString()}</p>
          <p class="text-xs text-gray-500">{props.labels.totalLikes}</p>
        </div>
      </div>

      <Show when={editorsPicks().length > 0}>
        <div>
          <h3 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-3">{props.labels.editorsPick}</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <For each={editorsPicks()}>
              {(article) => (
                <ShopArticleCard
                  shopSlug={props.shopSlug}
                  article={article}
                  readLabel={props.labels.readTime}
                />
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
                <ShopArticleCard
                  shopSlug={props.shopSlug}
                  article={article}
                  readLabel={props.labels.readTime}
                />
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
              <ShopArticleCard
                shopSlug={props.shopSlug}
                article={article}
                readLabel={props.labels.readTime}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

const ShopArticleCard: Component<{
  shopSlug: string;
  article: PublicShopArticle;
  readLabel: string;
}> = (props) => (
  <A
    href={`/shops/${props.shopSlug}/articles/${props.article.slug}`}
    class="block rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 overflow-hidden hover:shadow-md transition-shadow"
  >
    <div class="aspect-[16/9] overflow-hidden">
      <img src={props.article.coverUrl} alt="" class="w-full h-full object-cover" loading="lazy" />
    </div>
    <div class="p-4">
      <span class="text-xs font-medium text-forest-600 dark:text-forest-400">{props.article.category}</span>
      <h4 class="font-bold text-forest-800 dark:text-cream-50 mt-1 mb-2 line-clamp-2">{props.article.title}</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{props.article.excerpt}</p>
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>{props.readLabel.replace("{n}", String(props.article.readMinutes))}</span>
        <span>{props.article.viewCount.toLocaleString()} views</span>
      </div>
    </div>
  </A>
);
