import { ErrorBoundary, Suspense, For, Show } from "solid-js";
import { A, useParams, useLocation, createAsync, type RouteSectionProps } from "@solidjs/router";
import Badge from "~/components/ui/Badge";
import { PageErrorFallback } from "~/components/seller/PageErrorFallback";
import { getProductSummary } from "~/lib/api/endpoints/seller/products.api";
import { getProductTypeColor, getProductTypeLabel, getStatusVariant, getStatusLabel } from "./[productId]/helpers";
import {
  ChevronLeftIcon,
  PencilIcon,
  ShareIcon,
  DotsVerticalIcon,
  ChevronRightIcon,
} from "~/components/icons";

const tabs = [
  { id: "overview", label: "Overview", path: "" },
  { id: "orders", label: "Orders", path: "orders" },
  { id: "reviews", label: "Reviews", path: "reviews" },
  { id: "inventory", label: "Inventory", path: "inventory" },
  { id: "activity", label: "Activity", path: "activity" },
];

export default function ProductDetailLayout(props: RouteSectionProps) {
  const params = useParams();
  const location = useLocation();

  const product = createAsync(
    () => getProductSummary(params.productId as string),
    { deferStream: true },
  );

  const isActiveTab = (path: string) => {
    if (path === "") {
      return location.pathname === `/app/seller/products/${params.productId}` ||
              location.pathname === `/app/seller/products/${params.productId}/`;
    }
    return location.pathname.startsWith(`/app/seller/products/${params.productId}/${path}`);
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      <ErrorBoundary
        fallback={(error) => (
          <PageErrorFallback
            error={error}
            title="Failed to Load Product Details"
            backHref="/app/seller/products"
            backLabel="Back to Products"
          />
        )}
      >
        <Suspense fallback={<div class="p-6">Loading product details...</div>}>
          <Show when={product()}>
            {/* Breadcrumb & Header */}
              <div class="mb-6">
                <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <A href="/app/seller" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                    Dashboard
                  </A>
                  <ChevronRightIcon class="w-4 h-4" />
                  <A href="/app/seller/products" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                    Products
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
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {product()!.shortDescription}
                      </p>
                      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Slug: <span class="font-mono text-xs">{product()!.slug}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <A
                      href={`/app/seller/products/${product()!.id}/edit`}
                      class="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
                    >
                      <PencilIcon class="w-4 h-4" />
                      Edit Product
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

              {/* Tab Navigation */}
              <div class="mb-6">
                <div class="border-b border-cream-200 dark:border-forest-700">
                  <nav class="flex gap-0 -mb-px overflow-x-auto">
                    <For each={tabs}>
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
