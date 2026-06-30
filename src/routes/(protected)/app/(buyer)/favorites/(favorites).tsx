import { Component, For, Show } from "solid-js";
import { Title } from "@solidjs/meta";
import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { HeartIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { formatPageTitle } from "~/lib/seo/meta";
import { getWishlist } from "~/lib/api/endpoints/buyer/wishlist.api";
import { formatPrice } from "~/routes/(app)/plants/constants";

export const route = {
  preload: () => getWishlist(),
} satisfies RouteDefinition;

const Favorites: Component = () => {
  const { t } = useI18n();
  const wishlist = createAsync(() => getWishlist(), { deferStream: true });
  const items = () => wishlist()?.data ?? [];

  return (
    <>
      <Title>{formatPageTitle(t("buyer.favorites.title"))}</Title>
      <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center">
            <HeartIcon class="w-6 h-6 text-forest-600 dark:text-forest-400" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
              {t("buyer.favorites.title")}
            </h1>
            <p class="text-sm text-gray-500">{t("buyer.favorites.subtitle")}</p>
          </div>
        </div>

        <Show
          when={wishlist() !== undefined}
          fallback={<div class="h-40 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />}
        >
          <Show
            when={items().length > 0}
            fallback={
              <div class="text-center py-16">
                <p class="text-gray-600 dark:text-gray-300 mb-6">{t("buyer.favorites.empty")}</p>
                <A
                  href="/plants"
                  class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold transition-colors"
                >
                  {t("buyer.favorites.browsePlants")}
                </A>
              </div>
            }
          >
            <div class="grid sm:grid-cols-2 gap-4">
              <For each={items()}>
                {(item) => (
                  <article class="flex gap-4 p-4 rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800">
                    <Show when={item.product?.thumbnail?.url}>
                      <img
                        src={item.product!.thumbnail!.url}
                        alt=""
                        class="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                    </Show>
                    <div class="min-w-0 flex-1">
                      <Show when={item.shop}>
                        {(shop) => (
                          <A
                            href={`/shops/${shop().slug}`}
                            class="text-xs text-forest-600 dark:text-forest-400 hover:underline"
                          >
                            {shop().name}
                          </A>
                        )}
                      </Show>
                      <Show when={item.product}>
                        {(product) => (
                          <A
                            href={`/plants/${product().slug}`}
                            class="block font-semibold text-forest-800 dark:text-cream-50 hover:underline truncate"
                          >
                            {product().name}
                          </A>
                        )}
                      </Show>
                      <Show when={item.variant}>
                        {(variant) => (
                          <p class="text-sm font-medium text-terracotta-600 mt-1">
                            {formatPrice(variant().price)}
                          </p>
                        )}
                      </Show>
                    </div>
                  </article>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </>
  );
};

export default Favorites;
