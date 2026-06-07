import { ErrorBoundary, Suspense, For, Show, createMemo } from "solid-js";
import { A, useParams, useLocation, createAsync, type RouteSectionProps } from "@solidjs/router";
import Badge from "~/components/ui/Badge";
import { PageErrorFallback } from "~/components/seller/PageErrorFallback";
import { getProductSummary } from "~/lib/api/endpoints/seller/products.api";
import { getProductTypeColor, getProductTypeLabel, getStatusVariant, getStatusLabel } from "./[productId]/helpers";
import { PRODUCT_TYPE } from "~/lib/api/types/seller.types";
import { useI18n } from "~/i18n";
import {
  ChevronLeftIcon,
  ShareIcon,
  DotsVerticalIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
} from "~/components/icons";

export default function ProductDetailLayout(props: RouteSectionProps) {
  const { t } = useI18n();
  const params = useParams();
  const location = useLocation();

  const product = createAsync(
    () => getProductSummary(params.productId as string),
    { deferStream: true },
  );

  const tabs = createMemo(() => [
    { id: "overview", label: t("seller.products.productDetail.tabs.overview"), path: "" },
    { id: "orders", label: t("seller.products.productDetail.tabs.orders"), path: "orders" },
    { id: "reviews", label: t("seller.products.productDetail.tabs.reviews"), path: "reviews" },
    { id: "inventory", label: t("seller.products.productDetail.tabs.inventory"), path: "inventory" },
    { id: "activity", label: t("seller.products.productDetail.tabs.activity"), path: "activity" },
  ]);

  const isActiveTab = (path: string) => {
    if (path === "") {
      return location.pathname === `/app/seller/products/${params.productId}` ||
              location.pathname === `/app/seller/products/${params.productId}/`;
    }
    return location.pathname.startsWith(`/app/seller/products/${params.productId}/${path}`);
  };

  return (
    <div class="mx-auto max-w-[1400px]">
      <ErrorBoundary
        fallback={(error) => (
          <PageErrorFallback
            error={error}
            title={t("seller.products.productDetail.loadFailed")}
            backHref="/app/seller/products"
            backLabel={t("seller.products.productDetail.backToProducts")}
          />
        )}
      >
        <Suspense fallback={<div class="p-6">{t("seller.products.productDetail.loading")}</div>}>
          <Show when={product()}>
            {/* Breadcrumb & Header */}
              <div class="mb-6">
                <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <A href="/app/seller" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                    {t("seller.products.productDetail.breadcrumb.dashboard")}
                  </A>
                  <ChevronRightIcon class="w-4 h-4" />
                  <A href="/app/seller/products" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                    {t("seller.products.productDetail.breadcrumb.products")}
                  </A>
                  <ChevronRightIcon class="w-4 h-4" />
                  <span class="text-forest-800 dark:text-cream-50 font-medium truncate">{product()!.name}</span>
                </nav>

                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left: Back + Product Info */}
                  <div class="flex items-start gap-4">
                    <A
                      href="/app/seller/products"
                      class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-forest-700 transition-colors flex-shrink-0 mt-1"
                    >
                      <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </A>
                    <div>
                      <div class="flex items-center gap-3 flex-wrap mb-2">
                        <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                          {product()!.name}
                        </h1>
                        <Badge variant={getStatusVariant(product()!.status)}>
                          {getStatusLabel(product()!.status)}
                        </Badge>
                        <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProductTypeColor(product()!.productType).bg} ${getProductTypeColor(product()!.productType).text} ${getProductTypeColor(product()!.productType).border}`}>
                          {getProductTypeLabel(product()!.productType)}
                        </span>
                        {product()!.productType === PRODUCT_TYPE.PLANT && (
                          <A
                            href={`/app/seller/products/plants/${product()!.id}`}
                            class="inline-flex items-center gap-1 text-xs text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 hover:underline transition-colors"
                          >
                            <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                            {t("seller.products.productDetail.plantDetails")}
                          </A>
                        )}
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {product()!.shortDescription}
                      </p>
                      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {t("seller.products.productDetail.slug")}: <span class="font-mono text-xs">{product()!.slug}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button
                      class="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
                      title={t("seller.products.productDetail.share")}
                    >
                      <ShareIcon class="w-4 h-4" />
                    </button>
                    <button
                      class="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
                      title={t("seller.products.productDetail.moreActions")}
                    >
                      <DotsVerticalIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div class="mb-6">
                <div class="border-b border-cream-200 dark:border-forest-700">
                  <nav class="flex gap-0 -mb-px overflow-x-auto">
                    <For each={tabs()}>
                      {(tab) => (
                        <A
                          href={`/app/seller/products/${product()!.id}/${tab.path}`}
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

              {/* Child Routes */}
              {props.children}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
