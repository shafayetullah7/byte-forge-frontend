import { PackageIcon, TagIcon, DollarSignIcon, CubeIcon, CalendarIcon, CheckBadgeIcon, ClockIcon, TrendingUpIcon, ClipboardListIcon, PencilIcon, ArchiveIcon, ArrowPathIcon, TrashIcon, EyeIcon, ShoppingBagIcon, StarIcon } from "~/components/icons";
import { SectionCard } from "./components/SectionCard";
import { DetailRow } from "./components/DetailRow";
import { StatCard } from "./components/StatCard";
import { getStatusVariant, formatPrice, formatDateTime, formatNumber, getStatusLabel, getProductTypeLabel, getInventoryLabel } from "./helpers";
import { MOCK_PRODUCT, MOCK_PRODUCT_STATS } from "./mock-data";
import Badge from "~/components/ui/Badge";

export default function ProductOverviewRoute() {
  const product = MOCK_PRODUCT;
  const stats = MOCK_PRODUCT_STATS;
  const inventory = getInventoryLabel(product.inventoryCount);

  return (
    <>
      {/* Product Thumbnail + Quick Info Card */}
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6 overflow-hidden">
        <div class="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div class="sm:w-48 md:w-56 h-48 sm:h-auto bg-cream-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 border-b sm:border-b-0 sm:border-r border-cream-200 dark:border-forest-700">
            <div class="w-full h-full flex items-center justify-center">
              <PackageIcon class="w-16 h-16 text-gray-300 dark:text-gray-600" />
            </div>
          </div>

          {/* Quick Info */}
          <div class="flex-1 p-5">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</p>
                <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Inventory</p>
                <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
                  {product.inventoryCount}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">units total</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Variants</p>
                <p class="text-lg font-bold text-forest-800 dark:text-cream-50 mt-1">
                  {product.totalVariants}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created</p>
                <p class="text-sm font-medium text-forest-800 dark:text-cream-50 mt-1">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
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

      {/* Content Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Product Info */}
      <div class="lg:col-span-2 space-y-6">
        {/* Pricing & Inventory */}
        <SectionCard
          title="Pricing & Inventory"
          icon={<DollarSignIcon class="w-4 h-4 text-gray-400" />}
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Base Price</p>
              <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                {formatPrice(product.price)}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Inventory</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                  {product.inventoryCount}
                </p>
                <Badge variant={inventory.variant} class="text-xs">
                  {inventory.label}
                </Badge>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Variants</p>
              <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                {product.totalVariants}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Performance Summary */}
        <SectionCard
          title="Performance Summary"
          icon={<TrendingUpIcon class="w-4 h-4 text-gray-400" />}
        >
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DetailRow
              label="Total Views"
              value={formatNumber(stats.totalViews)}
              icon={<ClipboardListIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="Total Orders"
              value={stats.totalOrders}
              icon={<ClipboardListIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="Total Revenue"
              value={formatPrice(stats.totalRevenue)}
              icon={<DollarSignIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="Avg. Rating"
              value={`${stats.avgRating} / 5.0`}
              icon={<ClipboardListIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="Conversion Rate"
              value={`${stats.conversionRate}%`}
              icon={<ClipboardListIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="Stock Turnover"
              value={stats.stockTurnover}
              icon={<ClipboardListIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="This Month Views"
              value={`${stats.viewsThisMonth} (${stats.viewsChange})`}
              icon={<ClipboardListIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="This Month Orders"
              value={`${stats.ordersThisMonth} (${stats.ordersChange})`}
              icon={<ClipboardListIcon class="w-4 h-4" />}
            />
          </div>
        </SectionCard>
      </div>

      {/* Right Column - Product Details & Actions */}
      <div class="space-y-6">
        {/* Product Details */}
        <SectionCard
          title="Product Details"
          icon={<TagIcon class="w-4 h-4 text-gray-400" />}
        >
          <DetailRow
            label="Product ID"
            value={product.id}
            icon={<CheckBadgeIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Product Type"
            value={getProductTypeLabel(product.productType)}
            icon={<CubeIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Status"
            value={
              <Badge variant={getStatusVariant(product.status)}>
                {getStatusLabel(product.status)}
              </Badge>
            }
            icon={<CheckBadgeIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Slug"
            value={product.slug}
            icon={<TagIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Created"
            value={formatDateTime(product.createdAt)}
            icon={<CalendarIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Last Updated"
            value={formatDateTime(product.updatedAt)}
            icon={<ClockIcon class="w-4 h-4" />}
          />
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard
          title="Recent Activity"
          icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
        >
          <DetailRow
            label="Views (7 days)"
            value={`${stats.viewsThisWeek} (${stats.viewsChange})`}
            icon={<ClipboardListIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Orders (7 days)"
            value={`${stats.ordersThisWeek} (${stats.ordersChange})`}
            icon={<ClipboardListIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Revenue (7 days)"
            value={formatPrice(stats.revenueThisWeek)}
            icon={<DollarSignIcon class="w-4 h-4" />}
          />
        </SectionCard>

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
  );
}
