import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import type { PublicShopListItem } from "~/lib/types/public/shops.types";
import { VerifiedBadge, ActiveStatusBadge } from "./ReputationBadge";
import { formatPrice } from "~/routes/(app)/plants/constants";

export const ShopDiscoveryCard: Component<{
  shop: PublicShopListItem;
  compact?: boolean;
  verifiedLabel: string;
  activeLabel: string;
  productsLabel: string;
  ordersLabel: string;
}> = (props) => {
  const m = () => props.shop.metrics;

  return (
    <article class="group h-full flex flex-col rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 overflow-hidden hover:shadow-lg hover:border-forest-300 dark:hover:border-forest-600 transition-all duration-300">
      <div class="relative h-36 sm:h-40 overflow-hidden bg-gradient-to-r from-forest-500 to-sage-600">
        <Show
          when={props.shop.banner?.url}
          fallback={
            <div class="w-full h-full flex items-center justify-center text-white/40">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
          }
        >
          <img
            src={props.shop.banner!.url}
            alt=""
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Show>
        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Show when={props.shop.isVerified}>
            <VerifiedBadge label={props.verifiedLabel} />
          </Show>
          <ActiveStatusBadge label={props.activeLabel} />
        </div>
        <Show when={props.shop.logo?.url}>
          <div class="absolute -bottom-6 left-4 w-14 h-14 rounded-xl border-2 border-white dark:border-forest-800 bg-white dark:bg-forest-800 overflow-hidden shadow-md">
            <img src={props.shop.logo!.url} alt="" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </Show>
      </div>

      <div class={`flex-1 flex flex-col p-4 ${props.shop.logo?.url ? "pt-8" : "pt-4"}`}>
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="text-lg font-bold text-forest-800 dark:text-cream-50 line-clamp-1">
            {props.shop.name}
          </h3>
          <span class="flex items-center gap-0.5 text-sm font-semibold text-amber-600 dark:text-amber-400 shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {m().averageRating.toFixed(1)}
          </span>
        </div>

        <p class="text-xs font-medium text-forest-600 dark:text-forest-400 mb-1">{props.shop.category}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{props.shop.tagline}</p>

        <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1 mb-3">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {props.shop.city}, {props.shop.division}
        </div>

        <Show when={!props.compact}>
          <div class="grid grid-cols-3 gap-2 text-center text-xs mb-3 py-2 border-y border-cream-100 dark:border-forest-700">
            <div>
              <p class="font-bold text-forest-800 dark:text-cream-50">{m().totalProducts}</p>
              <p class="text-gray-500 dark:text-gray-400">{props.productsLabel}</p>
            </div>
            <div>
              <p class="font-bold text-forest-800 dark:text-cream-50">{m().completedOrders.toLocaleString()}</p>
              <p class="text-gray-500 dark:text-gray-400">{props.ordersLabel}</p>
            </div>
            <div>
              <p class="font-bold text-forest-800 dark:text-cream-50">{m().followerCount.toLocaleString()}</p>
              <p class="text-gray-500 dark:text-gray-400">Followers</p>
            </div>
          </div>

          <Show when={props.shop.featuredProductPreviews.length > 0}>
            <div class="flex gap-2 mt-auto">
              <For each={props.shop.featuredProductPreviews.slice(0, 3)}>
                {(product) => (
                  <div class="flex-1 min-w-0">
                    <div class="aspect-square rounded-lg overflow-hidden bg-cream-100 dark:bg-forest-900">
                      <img src={product.thumbnailUrl} alt="" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-1">{formatPrice(product.price)}</p>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </article>
  );
};

export const ShopDiscoveryCardLink: Component<{
  shop: PublicShopListItem;
  children: import("solid-js").JSX.Element;
}> = (props) => (
  <A href={`/shops/${props.shop.slug}`} class="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 rounded-2xl">
    {props.children}
  </A>
);
