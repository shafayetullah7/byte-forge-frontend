import { ErrorBoundary, Suspense, Show, For, createMemo } from "solid-js";
import { A, useParams, useLocation, createAsync, type RouteSectionProps, type RouteDefinition } from "@solidjs/router";
import { ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, ArrowTopRightOnSquareIcon } from "~/components/icons";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import { useI18n } from "~/i18n";
import Badge from "~/components/ui/Badge";
import { getStatusVariant, getStatusLabel } from "./[plantId]/utils";
import type { ProductStatus } from "~/lib/api/types/seller.types";

export const route = {
  preload: ({ params }) => getPlantById(params.plantId as string),
} satisfies RouteDefinition;

export default function PlantDetailLayout(props: RouteSectionProps) {
  const { t } = useI18n();
  const params = useParams();
  const location = useLocation();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  const tabs = createMemo(() => [
    { id: "overview", label: t("seller.products.plantDetail.tabs.overview"), path: "" },
    { id: "variants", label: t("seller.products.plantDetail.tabs.variants"), path: "variants" },
    { id: "care", label: t("seller.products.plantDetail.tabs.care"), path: "care" },
  ]);

  const isActiveTab = (path: string) => {
    if (path === "") {
      return location.pathname === `/app/seller/products/plants/${params.plantId}` ||
              location.pathname === `/app/seller/products/plants/${params.plantId}/`;
    }
    return location.pathname.startsWith(`/app/seller/products/plants/${params.plantId}/${path}`);
  };

  return (
    <div class="mx-auto max-w-[1400px]">
      <ErrorBoundary
        fallback={(error) => (
          <div class="min-h-screen flex items-center justify-center p-6">
            <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full">
              <div class="flex items-center gap-3 mb-4">
                <ExclamationCircleIcon class="w-6 h-6 text-red-600" />
                <h2 class="text-lg font-semibold text-red-900">{t("seller.products.plantDetail.loadFailed")}</h2>
              </div>
              <p class="text-sm text-red-700 mb-4">{error.toString()}</p>
              <div class="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  class="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  {t("seller.products.plantDetail.retry")}
                </button>
                <A
                  href="/app/seller/products/plants"
                  class="flex-1 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors text-center"
                >
                  {t("seller.products.plantDetail.backToPlants")}
                </A>
              </div>
            </div>
          </div>
        )}
      >
        <Suspense fallback={<div class="p-6">{t("seller.products.plantDetail.loading")}</div>}>
          <Show when={plant()}>
            {(plantData) => (
              <>
                <div class="mb-4">
                  <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <A href="/app/seller" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                      {t("seller.products.plantDetail.breadcrumb.dashboard")}
                    </A>
                    <ChevronRightIcon class="w-4 h-4" />
                    <A href="/app/seller/products/plants" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                      {t("seller.products.plantDetail.breadcrumb.plants")}
                    </A>
                    <ChevronRightIcon class="w-4 h-4" />
                    <span class="text-forest-800 dark:text-cream-50 font-medium truncate">
                      {plantData().translations.en.name || plantData().translations.bn.name}
                    </span>
                  </nav>

                  <div class="flex items-start gap-3">
                      <A
                        href="/app/seller/products/plants"
                        class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-forest-700 transition-colors flex-shrink-0"
                      >
                        <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </A>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-3 flex-wrap">
                          <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                            {plantData().translations.en.name || plantData().translations.bn.name}
                          </h1>
                          <Badge variant={getStatusVariant(plantData().status as ProductStatus)}>
                            {getStatusLabel(plantData().status as ProductStatus, t)}
                          </Badge>
                          <A
                            href={`/app/seller/products/${plantData().id}`}
                            class="inline-flex items-center gap-1 text-xs text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 hover:underline transition-colors"
                          >
                            <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                            {t("seller.products.plantDetail.ordersAndReviews")}
                          </A>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {plantData().plantDetails?.scientificName && (
                            <span>{plantData().plantDetails!.scientificName}</span>
                          )}
                          {plantData().plantDetails?.scientificName && plantData().slug && (
                            <span class="text-gray-400 dark:text-gray-500"> · </span>
                          )}
                          {plantData().slug && (
                            <span class="text-gray-400 dark:text-gray-500">
                              {t("seller.products.plantDetail.slug")}:{" "}
                              <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{plantData().slug}</span>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                </div>

                <div class="mb-6">
                  <div class="border-b border-cream-200 dark:border-forest-700">
                    <nav class="flex gap-0 -mb-px overflow-x-auto">
                      <For each={tabs()}>
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
