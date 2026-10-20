import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { PublicShopArticle } from "~/lib/types/public/shops.types";
import { cloudinaryUrl } from "~/lib/media/cloudinary-url";

export const ShopArticleCard: Component<{
  shopSlug: string;
  article: PublicShopArticle;
  shopName?: string;
}> = (props) => {
  const { t } = useI18n();

  return (
    <A
      href={`/shops/${props.shopSlug}/articles/${props.article.slug}`}
      class="block rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div class="aspect-[16/9] overflow-hidden">
        <img
          src={cloudinaryUrl(props.article.coverUrl, "card")}
          alt=""
          class="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="p-4">
        <Show when={props.shopName}>
          <p class="text-xs font-semibold text-forest-700 dark:text-forest-300 mb-1 truncate">
            {props.shopName}
          </p>
        </Show>
        <span class="text-xs font-medium text-forest-600 dark:text-forest-400">
          {props.article.category}
        </span>
        <h4 class="font-bold text-forest-800 dark:text-cream-50 mt-1 mb-2 line-clamp-2">
          {props.article.title}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {props.article.excerpt}
        </p>
        <p class="text-xs text-gray-500">
          {t("public.shops.detail.readTime", props.article.readMinutes)}
        </p>
      </div>
    </A>
  );
};
