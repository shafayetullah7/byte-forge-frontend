import { Component } from "solid-js";

const FavoritesSkeleton: Component = () => {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map(() => (
        <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden animate-pulse">
          <div class="aspect-[4/3] bg-cream-200 dark:bg-forest-700" />
          <div class="p-4 space-y-3">
            <div class="h-4 w-3/4 rounded bg-cream-200 dark:bg-forest-700" />
            <div class="h-3 w-1/2 rounded bg-cream-200 dark:bg-forest-700" />
            <div class="h-8 w-full rounded-lg bg-cream-200 dark:bg-forest-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritesSkeleton;
