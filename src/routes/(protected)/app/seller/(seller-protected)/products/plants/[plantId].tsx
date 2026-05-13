import { ErrorBoundary, Suspense, Show, For } from "solid-js";
import { A, useParams, useLocation, type RouteSectionProps } from "@solidjs/router";
import { useI18n } from "~/i18n";
import Badge from "~/components/ui/Badge";
import {
  ChevronLeftIcon,
  PencilIcon,
  ShareIcon,
  DotsVerticalIcon,
  ChevronRightIcon,
  PackageIcon,
  EyeIcon,
  ShoppingBagIcon,
  DollarSignIcon,
  StarIcon,
  ExclamationCircleIcon,
} from "~/components/icons";
import { getStatusVariant, formatPrice, getStatusLabel } from "./[plantId]/helpers";
import { StatCard } from "./[plantId]/components/StatCard";
import { MOCK_PLANT, MOCK_STATS } from "./[plantId]/mock-data";

const tabs = [
  { id: "overview", label: "Overview", path: "" },
  { id: "variants", label: "Variants", path: "variants" },
  { id: "care", label: "Care Guide", path: "care" },
  { id: "orders", label: "Orders", path: "orders" },
  { id: "reviews", label: "Reviews", path: "reviews" },
  { id: "activity", label: "Activity", path: "activity" },
];

export default function PlantDetailLayout(props: RouteSectionProps) {
  const { t } = useI18n();
  const params = useParams();
  const location = useLocation();

  const plant = MOCK_PLANT;
  const stats = MOCK_STATS;

  const isActiveTab = (path: string) => {
    if (path === "") {
      return location.pathname === `/app/seller/products/plants/${params.plantId}` ||
             location.pathname === `/app/seller/products/plants/${params.plantId}/`;
    }
    return location.pathname.startsWith(`/app/seller/products/plants/${params.plantId}/${path}`);
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      {/* Critical error boundary - plant data is required for entire page */}
      <ErrorBoundary
        fallback={(error) => (
          <div class="min-h-screen flex items-center justify-center p-6">
            <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full">
              <div class="flex items-center gap-3 mb-4">
                <ExclamationCircleIcon class="w-6 h-6 text-red-600" />
                <h2 class="text-lg font-semibold text-red-900">Failed to Load Plant Details</h2>
              </div>
              <p class="text-sm text-red-700 mb-4">{error.toString()}</p>
              <div class="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  class="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
                <A
                  href="/app/seller/products/plants"
                  class="flex-1 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors text-center"
                >
                  Back to Plants
                </A>
              </div>
            </div>
          </div>
        )}
      >
        <Suspense fallback={<div class="p-6">Loading plant details...</div>}>
          <Show when={plant}>
            {(plantData) => (
              <>
                {/* Breadcrumb & Header */}
                <div class="mb-6">
                  <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <A href="/app/seller" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                      Dashboard
                    </A>
                    <ChevronRightIcon class="w-4 h-4" />
                    <A href="/app/seller/products/plants" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                      Plants
                    </A>
                    <ChevronRightIcon class="w-4 h-4" />
                    <span class="text-forest-800 dark:text-cream-50 font-medium truncate">{plantData().name}</span>
                  </nav>

                  <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div class="flex items-start gap-4">
                      <A
                        href="/app/seller/products/plants"
                        class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-forest-700 transition-colors flex-shrink-0 mt-1"
                      >
                        <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </A>
                      <div>
                        <div class="flex items-center gap-3 flex-wrap">
                          <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                            {plantData().name}
                          </h1>
                          <Badge variant={getStatusVariant(plantData().status)}>
                            {getStatusLabel(plantData().status)}
                          </Badge>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {plantData().scientificName}
                        </p>
                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Slug: <span class="font-mono text-xs">{plantData().slug}</span>
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 flex-shrink-0">
                      <A
                        href={`/app/seller/products/plants/${plantData().id}/edit`}
                        class="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
                      >
                        <PencilIcon class="w-4 h-4" />
                        Edit Plant
                      </A>
                      <button
                        class="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
                        title="Share"
                      >
                        <ShareIcon class="w-4 h-4" />
                      </button>
                      <button
                        class="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
                        title="More actions"
                      >
                        <DotsVerticalIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={<EyeIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />}
                    label="Total Views"
                    value={stats.totalViews.toLocaleString()}
                    change={"+8%"}
                    changeType="positive"
                    color="forest"
                  />
                  <StatCard
                    icon={<ShoppingBagIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />}
                    label="Total Orders"
                    value={stats.totalOrders}
                    change={"+15%"}
                    changeType="positive"
                    color="cream"
                  />
                  <StatCard
                    icon={<DollarSignIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />}
                    label="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    change={"+31%"}
                    changeType="positive"
                    color="terracotta"
                  />
                  <StatCard
                    icon={<StarIcon class="w-5 h-5 text-cream-500" />}
                    label="Avg. Rating"
                    value={`${stats.avgRating} (${stats.totalReviews} reviews)`}
                    color="sage"
                  />
                </div>

                {/* Tab Navigation */}
                <div class="mb-6">
                  <div class="border-b border-cream-200 dark:border-forest-700">
                    <nav class="flex gap-0 -mb-px overflow-x-auto">
                      <For each={tabs}>
                        {(tab) => (
                          <A
                            href={`/app/seller/products/plants/${plantData().id}/${tab.path}`}
                            class={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                              isActiveTab(tab.path)
                                ? "border-forest-600 text-forest-600 dark:border-forest-400 dark:text-forest-400"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 hover:border-forest-300 dark:hover:border-forest-600"
                            }`}
                          >
                            {tab.label}
                          </A>
                        )}
                      </For>
                    </nav>
                  </div>
                </div>

                {/* Each child route has its own ErrorBoundary for route-specific errors */}
                {props.children}
              </>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
