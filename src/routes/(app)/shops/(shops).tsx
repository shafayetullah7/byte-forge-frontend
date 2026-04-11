import { createAsync, A } from "@solidjs/router";
import { Suspense, createSignal, createMemo } from "solid-js";
import { publicShopsApi, type PublicShop } from "~/lib/api/endpoints/public-shops";
import { ShopCard } from "~/components/shops/ShopCard";
import { Input } from "~/components/ui/Input";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export default function ShopsPage() {
  const shopsData = createAsync(() => publicShopsApi.getAll());
  const [searchTerm, setSearchTerm] = createSignal("");
  const [divisionFilter, setDivisionFilter] = createSignal<string | undefined>(undefined);

  const filteredShops = createMemo(() => {
    const data = shopsData()?.data;
    if (!data) return [];

    const search = searchTerm().toLowerCase().trim();
    const division = divisionFilter();

    if (!search && !division) return data;

    return data.filter((shop: PublicShop) => {
      const matchesSearch =
        !search ||
        shop.name.toLowerCase().includes(search) ||
        shop.city.toLowerCase().includes(search);
      const matchesDivision = !division || shop.division === division;
      return matchesSearch && matchesDivision;
    });
  });

  const divisions = createMemo(() => {
    const data = shopsData()?.data;
    if (!data) return [];
    const uniqueDivisions = Array.from(new Set(data.map((s: PublicShop) => s.division)));
    return uniqueDivisions;
  });

  return (
    <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
      {/* Header */}
      <div class="bg-gradient-to-r from-green-600 to-blue-600 dark:from-forest-700 dark:to-sage-700">
        <div class="max-w-7xl mx-auto px-4 py-16">
          <h1 class="text-5xl font-bold text-white mb-4">Our Shops</h1>
          <p class="text-xl text-white/90">
            Discover local plant shops across Bangladesh
          </p>
        </div>
      </div>

      {/* Content */}
      <div class="max-w-7xl mx-auto px-4 py-12">
        {/* Toolbar */}
        <div class="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between bg-white dark:bg-forest-800 p-4 rounded-xl shadow-sm">
          <div class="relative w-full sm:max-w-[400px]">
            <Input
              label="Search"
              placeholder="Search shops by name or city..."
              class="w-full"
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <select
              class="h-11 px-3 py-2 text-sm border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-auto"
              value={divisionFilter() || ""}
              onChange={(e) => setDivisionFilter(e.currentTarget.value || undefined)}
            >
              <option value="">All Divisions</option>
              {divisions().map((division: string) => (
                <option value={division}>{division}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shop Grid */}
        <SafeErrorBoundary
          fallback={(err, reset) => (
            <InlineErrorFallback error={err} reset={reset} label="shop list" />
          )}
        >
          <Suspense fallback={<div class="h-96 bg-cream-100 dark:bg-forest-800 rounded-2xl animate-pulse" />}>
            {filteredShops().length === 0 ? (
              <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center">
                <div class="text-gray-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">No shops found</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShops().map((shop: PublicShop) => (
                  <A href={`/shops/${shop.id}`}>
                    <ShopCard shop={shop} />
                  </A>
                ))}
              </div>
            )}
          </Suspense>
        </SafeErrorBoundary>
      </div>
    </div>
  );
}
