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
  ClipboardListIcon,
  ClockIcon,
} from "~/components/icons";
import { getStatusVariant, getProductTypeLabel, getProductTypeColor, formatPrice, getStatusLabel } from "./[productId]/helpers";
import { StatCard } from "./[productId]/components/StatCard";
import { MOCK_PRODUCT, MOCK_PRODUCT_STATS } from "./[productId]/mock-data";

const tabs = [
  { id: "overview", label: "Overview", path: "" },
  { id: "orders", label: "Orders", path: "orders" },
  { id: "reviews", label: "Reviews", path: "reviews" },
  { id: "inventory", label: "Inventory", path: "inventory" },
  { id: "activity", label: "Activity", path: "activity" },
];

export default function ProductDetailLayout(props: RouteSectionProps) {
  const { t } = useI18n();
  const params = useParams();
  const location = useLocation();

  const product = MOCK_PRODUCT;
  const stats = MOCK_PRODUCT_STATS;
  const typeColors = getProductTypeColor(product.productType);

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
          <div class="min-h-screen flex items-center justify-center p-6">
            <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full">
              <div class="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h2 class="text-lg font-semibold text-red-900">Failed to Load Product Details</h2>
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
                  href="/app/seller/products"
                  class="flex-1 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors text-center"
                >
                  Back to Products
                </A>
              </div>
            </div>
          </div>
        )}
      >
        <Suspense fallback={<div class="p-6">Loading product details...</div>}>
          <Show when={product}>
            {(productData) => (
              <>
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
                    <span class="text-forest-800 dark:text-cream-50 font-medium truncate">{productData().name}</span>
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
                            {productData().name}
                          </h1>
                          <Badge variant={getStatusVariant(productData().status)}>
                            {getStatusLabel(productData().status)}
                          </Badge>
                          <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors.bg} ${typeColors.text} ${typeColors.border}`}>
                            {getProductTypeLabel(productData().productType)}
                          </span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {productData().shortDescription}
                        </p>
                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Slug: <span class="font-mono text-xs">{productData().slug}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <A
                        href={`/app/seller/products/${productData().id}/edit`}
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

                {/* Product Thumbnail + Quick Info Card */}
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6 overflow-hidden">
                  <div class="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div class="sm:w-48 md:w-56 h-48 sm:h-auto bg-cream-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 border-b sm:border-b-0 sm:border-r border-cream-200 dark:border-forest-700">
                      {productData().thumbnail ? (
                        <div class="w-full h-full flex items-center justify-center">
                          <PackageIcon class="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        </div>
                      ) : (
                        <div class="w-full h-full flex items-center justify-center">
                          <PackageIcon class="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Quick Info */}
                    <div class="flex-1 p-5">
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</p>
                          <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
                            {formatPrice(productData().price)}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Inventory</p>
                          <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
                            {productData().inventoryCount}
                          </p>
                          <p class="text-xs text-gray-400 dark:text-gray-500">units total</p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Variants</p>
                          <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
                            {productData().totalVariants}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created</p>
                          <p class="text-sm font-medium text-forest-800 dark:text-cream-50 mt-1">
                            {new Date(productData().createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    icon={<EyeIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />}
                    label="Total Views"
                    value={stats.totalViews.toLocaleString()}
                    change={`+${stats.viewsThisMonth} this month`}
                    changeType="positive"
                    color="forest"
                  />
                  <StatCard
                    icon={<ShoppingBagIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />}
                    label="Total Orders"
                    value={stats.totalOrders}
                    change={`+${stats.ordersThisMonth} this month`}
                    changeType="positive"
                    color="cream"
                  />
                  <StatCard
                    icon={<DollarSignIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />}
                    label="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    change={`+${formatPrice(stats.revenueThisMonth)} this month`}
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
                            href={`/app/seller/products/${productData().id}/${tab.path}`}
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
              </>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
