import { createSignal, createMemo, createEffect, Show, For, onCleanup } from "solid-js";
import { createAsync, A, type RouteDefinition } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { listShops } from "~/lib/public-shops/public-shop.service";
import type { PublicShopSortOption } from "~/lib/types/public/shops.types";
import {
  ShopDiscoveryCard,
  ShopDiscoveryCardLink,
  ShopDirectoryToolbar,
  ShopDirectoryGridSkeleton,
} from "~/components/shops/public";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import Button from "~/components/ui/Button";

export const route = {
  preload: () =>
    listShops({
      sort: "popular",
      page: 1,
      limit: 9,
    }),
} satisfies RouteDefinition;

export default function ShopsDirectoryPage() {
  const { t } = useI18n();
  const [search, setSearch] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [sort, setSort] = createSignal<PublicShopSortOption>("popular");
  const [page, setPage] = createSignal(1);

  let debounceTimer: ReturnType<typeof setTimeout>;
  createEffect(() => {
    const query = search();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setDebouncedSearch(query);
      setPage(1);
    }, 300);
    onCleanup(() => clearTimeout(debounceTimer));
  });

  const filterParams = createMemo(() => ({
    search: debouncedSearch(),
    sort: sort(),
    page: page(),
    limit: 9,
  }));

  const shopsResult = createAsync(() => listShops(filterParams()), { deferStream: true });

  const sortOptions = () => [
    { value: "popular", label: t("public.shops.directory.sortPopular") },
    { value: "rating", label: t("public.shops.directory.sortRating") },
    { value: "products", label: t("public.shops.directory.sortProducts") },
    { value: "newest", label: t("public.shops.directory.sortNewest") },
  ];

  const cardLabels = () => ({
    verifiedLabel: t("public.shops.directory.verified"),
    activeLabel: t("public.shops.directory.active"),
    productsLabel: t("public.shops.directory.products"),
    ordersLabel: t("public.shops.directory.orders"),
  });

  const resetPage = () => setPage(1);

  return (
    <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <div class="bg-gradient-to-br from-forest-700 via-forest-600 to-sage-700 dark:from-forest-900 dark:via-forest-800 dark:to-forest-900">
        <div class="max-w-7xl mx-auto px-4 py-14 sm:py-16">
          <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t("public.shops.directory.title")}
          </h1>
          <p class="text-lg text-cream-100/90 max-w-2xl">
            {t("public.shops.directory.subtitle")}
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-10">
        <ShopDirectoryToolbar
          search={search()}
          sort={sort()}
          sortOptions={sortOptions()}
          resultsCount={shopsResult()?.meta.total ?? 0}
          searchPlaceholder={t("public.shops.directory.searchPlaceholder")}
          onSearchChange={(v) => { setSearch(v); }}
          onSortChange={(v) => { setSort(v as PublicShopSortOption); resetPage(); }}
        />

        <SafeErrorBoundary
          fallback={(err, reset) => (
            <InlineErrorFallback error={err} reset={reset} label="shop directory" />
          )}
        >
          <Show when={shopsResult() !== undefined} fallback={<ShopDirectoryGridSkeleton />}>
            <Show
              when={(shopsResult()?.data.length ?? 0) > 0}
              fallback={
                <div class="rounded-2xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-12 text-center">
                  <h2 class="text-lg font-semibold text-forest-800 dark:text-cream-50">
                    {t("public.shops.directory.emptyTitle")}
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t("public.shops.directory.emptyDescription")}
                  </p>
                </div>
              }
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={shopsResult()?.data ?? []}>
                  {(shop) => (
                    <ShopDiscoveryCardLink shop={shop}>
                      <ShopDiscoveryCard shop={shop} {...cardLabels()} />
                    </ShopDiscoveryCardLink>
                  )}
                </For>
              </div>

              <Show when={(shopsResult()?.meta.totalPages ?? 0) > 1}>
                <div class="flex items-center justify-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page() <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t("common.previous")}
                  </Button>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {shopsResult()?.meta.page} / {shopsResult()?.meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page() >= (shopsResult()?.meta.totalPages ?? 1)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {t("common.next")}
                  </Button>
                </div>
              </Show>
            </Show>
          </Show>
        </SafeErrorBoundary>
      </div>
    </div>
  );
}
