import { For, createMemo } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { useParams, createAsync } from "@solidjs/router";
import { getProductSummary, getProductOverview } from "~/lib/api/endpoints/seller/products.api";
import { getStatusVariant, formatPrice, formatNumber, formatCurrency, getOrderStatusVariant, getOrderStatusLabel, getStatusLabel } from "./helpers";
import { MOCK_PRODUCT_STATS, MOCK_ORDERS, MOCK_REVIEWS_SUMMARY } from "./mock-data";
import Badge from "~/components/ui/Badge";
import { PackageIcon, DollarSignIcon, CubeIcon, EyeIcon, ShoppingBagIcon, StarIcon, AlertTriangleIcon, ClipboardListIcon, CheckCircleIcon, XCircleIcon, PencilIcon, ArchiveIcon, ArrowPathIcon, TrashIcon, ArrowTopRightOnSquareIcon } from "~/components/icons";
import { StatCard } from "./components/StatCard";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";

const ORDER_STATUS_ICONS: Record<string, any> = {
  DELIVERED: CheckCircleIcon,
  SHIPPED: ArrowTopRightOnSquareIcon,
  CANCELLED: XCircleIcon,
};

function timeAgo(dateStr: string): string {
  const now = new Date("2026-05-13T00:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default function ProductOverviewRoute() {
  const params = useParams();

  const summary = createAsync(
    () => getProductSummary(params.productId as string),
    { deferStream: true },
  );

  const overview = createAsync(
    () => getProductOverview(params.productId as string),
    { deferStream: true },
  );

  const stats = MOCK_PRODUCT_STATS;
  const recentOrders = MOCK_ORDERS.slice(0, 5);

  const lowStockVariants = createMemo(() =>
    (overview()?.variants ?? []).filter((v) => v.inventoryCount > 0 && v.inventoryCount <= v.lowStockThreshold),
  );
  const outOfStockVariants = createMemo(() =>
    (overview()?.variants ?? []).filter((v) => v.inventoryCount === 0),
  );

  return (
    <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="product overview" />}>
    <>
      {/* Product Thumbnail + Quick Info Card */}
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6 overflow-hidden">
        <div class="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div class="sm:w-48 md:w-56 h-48 sm:h-auto bg-cream-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 border-b sm:border-b-0 sm:border-r border-cream-200 dark:border-forest-700">
            <div class="w-full h-full flex items-center justify-center">
              {overview()?.thumbnail?.url ? (
                <img
                  src={overview()!.thumbnail!.url}
                  alt={summary()?.name ?? ""}
                  class="w-full h-full object-cover"
                />
              ) : (
                <PackageIcon class="w-16 h-16 text-gray-300 dark:text-gray-600" />
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div class="flex-1 p-5">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Inventory</p>
                <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
                  {overview()?.stockBreakdown?.totalStock ?? 0}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">units total</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Variants</p>
                <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
{overview()?.variants?.length ?? 0}
                </p>
              </div>
                <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created</p>
                <p class="text-sm font-medium text-forest-800 dark:text-cream-50 mt-1">
                  {overview()?.createdAt
                    ? new Date(overview()!.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</p>
                <div class="mt-1">
                  <Badge variant={getStatusVariant(summary()?.status || "DRAFT")}>
                    {getStatusLabel(summary()?.status || "DRAFT")}
                  </Badge>
                </div>
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

      {/* Content Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div class="lg:col-span-2 space-y-6">
          {/* Variant Breakdown */}
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
            <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700">
              <div class="flex items-center gap-2">
                <CubeIcon class="w-4 h-4 text-gray-400" />
                <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
                  Variants ({overview()?.variants?.length ?? 0})
                </h3>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-cream-200 dark:border-forest-700">
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-cream-100 dark:divide-forest-700/50">
                  <For each={overview()?.variants ?? []}>
                    {(variant) => (
                      <tr class="hover:bg-cream-50 dark:hover:bg-forest-700/30 transition-colors">
                        <td class="px-6 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{variant.sku || "—"}</td>
                        <td class="px-6 py-3 font-medium text-forest-800 dark:text-cream-50">
                          {variant.isBase ? "Base" : variant.sku || variant.id}
                        </td>
                        <td class="px-6 py-3 text-forest-800 dark:text-cream-50">{formatPrice(variant.price)}</td>
                        <td class="px-6 py-3">
                          <span class={variant.inventoryCount === 0
                            ? "text-terracotta-600 dark:text-terracotta-400 font-semibold"
                            : variant.inventoryCount <= variant.lowStockThreshold
                              ? "text-cream-600 dark:text-cream-400 font-semibold"
                              : "text-forest-800 dark:text-cream-50"
                          }>
                            {variant.inventoryCount}
                          </span>
                        </td>
                        <td class="px-6 py-3">
                          <Badge
                            variant={variant.inventoryCount === 0 ? "terracotta" : variant.inventoryCount <= variant.lowStockThreshold ? "cream" : "forest"}
                          >
                            {variant.inventoryCount === 0 ? "Out of Stock" : variant.inventoryCount <= variant.lowStockThreshold ? "Low Stock" : "In Stock"}
                          </Badge>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
            <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ShoppingBagIcon class="w-4 h-4 text-gray-400" />
                <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
                  Recent Orders
                </h3>
              </div>
              <a href={`/app/seller/products/${summary()?.id || params.productId}/orders`} class="text-xs text-forest-600 dark:text-forest-400 hover:underline">
                View All
              </a>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-cream-200 dark:border-forest-700">
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-cream-100 dark:divide-forest-700/50">
                  <For each={recentOrders}>
                    {(order) => {
                      const StatusIcon = ORDER_STATUS_ICONS[order.status] || ClipboardListIcon;
                      return (
                        <tr class="hover:bg-cream-50 dark:hover:bg-forest-700/30 transition-colors">
                          <td class="px-6 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{order.id}</td>
                          <td class="px-6 py-3 text-gray-700 dark:text-gray-300 hidden sm:table-cell">{order.customerName}</td>
                          <td class="px-6 py-3 font-medium text-forest-800 dark:text-cream-50">{formatCurrency(order.totalAmount)}</td>
                          <td class="px-6 py-3">
                            <div class="flex items-center gap-1.5">
                              <StatusIcon class="w-3.5 h-3.5" />
                              <Badge variant={getOrderStatusVariant(order.status)}>
                                {getOrderStatusLabel(order.status)}
                              </Badge>
                            </div>
                          </td>
                          <td class="px-6 py-3 text-gray-500 dark:text-gray-400 text-xs">{timeAgo(order.orderDate)}</td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div class="space-y-6">
          {/* Stock Alert */}
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
            <h3 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-4">Stock Summary</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Available</span>
                <span class="text-lg font-bold text-forest-800 dark:text-cream-50">{overview()?.stockBreakdown?.availableStock ?? 0}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Reserved</span>
                <span class="text-lg font-bold text-cream-600 dark:text-cream-400">{overview()?.stockBreakdown?.reservedStock ?? 0}</span>
              </div>
              <div class="border-t border-cream-200 dark:border-forest-700 pt-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Total</span>
                  <span class="text-lg font-bold text-forest-800 dark:text-cream-50">{overview()?.stockBreakdown?.totalStock ?? 0}</span>
                </div>
              </div>
            </div>
            {(lowStockVariants().length > 0 || outOfStockVariants().length > 0) && (
              <div class="mt-4 p-3 bg-cream-50 dark:bg-cream-900/20 border border-cream-200 dark:border-cream-800 rounded-lg">
                <div class="flex items-start gap-2">
                  <AlertTriangleIcon class="w-4 h-4 text-cream-600 dark:text-cream-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p class="text-xs font-medium text-cream-800 dark:text-cream-300">
                      {outOfStockVariants().length > 0
                        ? `${outOfStockVariants().length} variant${outOfStockVariants().length > 1 ? "s" : ""} out of stock`
                        : `${lowStockVariants().length} variant${lowStockVariants().length > 1 ? "s" : ""} low on stock`}
                    </p>
                    <div class="mt-1 space-y-0.5">
                      <For each={[...outOfStockVariants(), ...lowStockVariants()]}>
                        {(v) => (
                          <p class="text-xs text-cream-700 dark:text-cream-400">
                            {v.sku || v.id} — {v.inventoryCount} remaining
                          </p>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Review Summary */}
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <StarIcon class="w-4 h-4 text-cream-500" />
                <h3 class="text-sm font-semibold text-forest-800 dark:text-cream-50">Reviews</h3>
              </div>
              <a href={`/app/seller/products/${summary()?.id || params.productId}/reviews`} class="text-xs text-forest-600 dark:text-forest-400 hover:underline">
                View All
              </a>
            </div>
            <div class="flex items-center gap-4 mb-4">
              <div class="text-center">
                <p class="text-3xl font-bold text-forest-800 dark:text-cream-50">{MOCK_REVIEWS_SUMMARY.average}</p>
                <div class="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                      class={`w-3.5 h-3.5 ${
                        i < Math.round(MOCK_REVIEWS_SUMMARY.average)
                          ? "text-cream-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{MOCK_REVIEWS_SUMMARY.total} reviews</p>
              </div>
              <div class="flex-1 space-y-1.5">
                <For each={MOCK_REVIEWS_SUMMARY.distribution}>
                  {(dist) => (
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">{dist.stars}★</span>
                      <div class="flex-1 h-2 bg-cream-100 dark:bg-forest-700 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-cream-500 rounded-full"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                      <span class="text-xs text-gray-400 dark:text-gray-500 w-8">{dist.percentage}%</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
            <div class="border-t border-cream-200 dark:border-forest-700 pt-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Common mentions</p>
              <div class="flex flex-wrap gap-1.5">
                <For each={MOCK_REVIEWS_SUMMARY.highlights}>
                  {(highlight) => (
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-cream-50 dark:bg-cream-900/20 text-cream-700 dark:text-cream-400 rounded-full text-xs">
                      {highlight.label}
                      <span class="text-gray-400 dark:text-gray-500">({highlight.count})</span>
                    </span>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
            <h3 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                <PencilIcon class="w-4 h-4" />
                Edit Product
              </button>
              <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                <ArchiveIcon class="w-4 h-4" />
                Archive Product
              </button>
              <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                <ArrowPathIcon class="w-4 h-4" />
                Duplicate Product
              </button>
              <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-terracotta-600 dark:text-terracotta-400">
                <TrashIcon class="w-4 h-4" />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
    </ErrorBoundary>
  );
}
