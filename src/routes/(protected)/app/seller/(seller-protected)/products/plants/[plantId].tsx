import { ErrorBoundary, Suspense, Show, For } from "solid-js";
import { A, useParams, useLocation, createAsync, type RouteSectionProps, type RouteDefinition } from "@solidjs/router";
import { ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon } from "~/components/icons";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";

const tabs = [
  { id: "overview", label: "Overview", path: "" },
  { id: "variants", label: "Variants", path: "variants" },
  { id: "care", label: "Care Guide", path: "care" },
];

export const route = {
  preload: ({ params }) => getPlantById(params.plantId as string),
} satisfies RouteDefinition;

export default function PlantDetailLayout(props: RouteSectionProps) {
  const params = useParams();
  const location = useLocation();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  const isActiveTab = (path: string) => {
    if (path === "") {
      return location.pathname === `/app/seller/products/plants/${params.plantId}` ||
              location.pathname === `/app/seller/products/plants/${params.plantId}/`;
    }
    return location.pathname.startsWith(`/app/seller/products/plants/${params.plantId}/${path}`);
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
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
          <Show when={plant()}>
            {(plantData) => (
              <>
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
                    <span class="text-forest-800 dark:text-cream-50 font-medium truncate">
                      {plantData().translations?.find(t => t.locale === "en")?.name
                        ?? plantData().translations?.[0]?.name ?? ""}
                    </span>
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
                        <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                          {plantData().translations?.find(t => t.locale === "en")?.name
                            ?? plantData().translations?.[0]?.name ?? ""}
                        </h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {plantData().plantDetails?.scientificName ?? ""}
                        </p>
                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Slug: <span class="font-mono text-xs">{plantData().slug}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

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

                {props.children}
              </>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
