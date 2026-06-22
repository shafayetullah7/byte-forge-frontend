import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import type { PublicShopProduct } from "~/lib/types/public/shops.types";
import { formatPrice } from "~/routes/(app)/plants/constants";

export const ShopProductCard: Component<{
  product: PublicShopProduct;
  outOfStockLabel: string;
}> = (props) => (
  <A
    href={`/plants/${props.product.slug}`}
    class="group flex flex-col rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 overflow-hidden hover:shadow-md hover:border-forest-300 dark:hover:border-forest-600 transition-all"
  >
    <div class="relative aspect-[4/3] bg-cream-100 dark:bg-forest-900 overflow-hidden">
      <img
        src={props.product.thumbnailUrl}
        alt={props.product.name}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <Show when={!props.product.inStock}>
        <span class="absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold bg-terracotta-500 text-white">
          {props.outOfStockLabel}
        </span>
      </Show>
      <Show when={props.product.compareAtPrice && props.product.compareAtPrice > props.product.price}>
        <span class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-amber-500 text-white">
          -{Math.round((1 - props.product.price / props.product.compareAtPrice!) * 100)}%
        </span>
      </Show>
    </div>
    <div class="p-3 flex-1 flex flex-col">
      <h3 class="font-semibold text-forest-800 dark:text-cream-50 text-sm line-clamp-2 mb-1">{props.product.name}</h3>
      <div class="flex items-baseline gap-2 mb-1">
        <span class="font-bold text-forest-700 dark:text-forest-300">{formatPrice(props.product.price)}</span>
        <Show when={props.product.compareAtPrice}>
          <span class="text-xs text-gray-400 line-through">{formatPrice(props.product.compareAtPrice)}</span>
        </Show>
      </div>
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
        <span class="flex items-center gap-0.5">
          <svg class="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {props.product.rating.toFixed(1)}
        </span>
        <span>{props.product.soldCount} sold</span>
      </div>
    </div>
  </A>
);

export const ShopFeaturedProducts: Component<{
  products: PublicShopProduct[];
  title: string;
  outOfStockLabel: string;
}> = (props) => {
  const featured = () =>
    props.products.filter((p) => p.isFeatured || p.isTrending || p.isStaffPick || p.isCampaignProduct).slice(0, 8);

  return (
    <Show when={featured().length > 0}>
      <section class="mb-8">
        <h3 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-3">{props.title}</h3>
        <div class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          <For each={featured()}>
            {(product) => (
              <div class="w-44 sm:w-52 shrink-0 snap-start">
                <ShopProductCard product={product} outOfStockLabel={props.outOfStockLabel} />
              </div>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
};

export const ShopProductCatalog: Component<{
  products: PublicShopProduct[];
  search: string;
  category: string;
  sort: string;
  categories: string[];
  labels: Record<string, string>;
  outOfStockLabel: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSortChange: (v: string) => void;
}> = (props) => (
  <div>
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="search"
        placeholder={props.labels.searchProducts}
        value={props.search}
        onInput={(e) => props.onSearchChange(e.currentTarget.value)}
        class="flex-1 h-10 px-3 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm outline-none focus:ring-2 focus:ring-forest-500/20"
      />
      <select
        value={props.category}
        onChange={(e) => props.onCategoryChange(e.currentTarget.value)}
        class="h-10 px-3 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm"
      >
        <option value="">{props.labels.allCategories}</option>
        {props.categories.map((c) => (
          <option value={c}>{c}</option>
        ))}
      </select>
      <select
        value={props.sort}
        onChange={(e) => props.onSortChange(e.currentTarget.value)}
        class="h-10 px-3 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm"
      >
        <option value="popular">{props.labels.sortPopular}</option>
        <option value="newest">{props.labels.sortNewest}</option>
        <option value="price_asc">{props.labels.sortPriceAsc}</option>
        <option value="price_desc">{props.labels.sortPriceDesc}</option>
        <option value="rating">{props.labels.sortRating}</option>
      </select>
    </div>
    <Show
      when={props.products.length > 0}
      fallback={
        <p class="text-center py-12 text-gray-500 dark:text-gray-400">{props.labels.noProducts}</p>
      }
    >
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <For each={props.products}>
          {(product) => <ShopProductCard product={product} outOfStockLabel={props.outOfStockLabel} />}
        </For>
      </div>
    </Show>
  </div>
);
