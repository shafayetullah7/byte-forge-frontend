import type { Component } from "solid-js";

export const ShopDirectoryToolbar: Component<{
  search: string;
  sort: string;
  sortOptions: Array<{ value: string; label: string }>;
  resultsCount: number;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}> = (props) => (
  <div class="flex flex-col lg:flex-row gap-4 mb-8 items-stretch lg:items-center justify-between bg-white dark:bg-forest-800 p-4 rounded-xl shadow-sm border border-cream-200 dark:border-forest-700">
    <div class="flex-1 max-w-md">
      <label class="sr-only" for="shop-search">{props.searchPlaceholder}</label>
      <input
        id="shop-search"
        type="search"
        placeholder={props.searchPlaceholder}
        value={props.search}
        onInput={(e) => props.onSearchChange(e.currentTarget.value)}
        class="w-full h-11 px-4 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none"
      />
    </div>
    <div class="flex flex-wrap gap-3 items-center">
      <select
        aria-label="Sort shops"
        value={props.sort}
        onChange={(e) => props.onSortChange(e.currentTarget.value)}
        class="h-11 px-3 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm text-forest-800 dark:text-cream-50 outline-none focus:ring-2 focus:ring-forest-500/20"
      >
        {props.sortOptions.map((opt) => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {props.resultsCount} results
      </span>
    </div>
  </div>
);

export const ShopDirectoryGridSkeleton: Component = () => (
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading shops">
    {Array.from({ length: 6 }).map(() => (
      <div class="h-80 rounded-2xl bg-cream-100 dark:bg-forest-800 animate-pulse" />
    ))}
  </div>
);
