import { PackageIcon, TagIcon, DollarSignIcon, CubeIcon, CalendarIcon, CheckBadgeIcon, ClockIcon, TrendingUpIcon, ClipboardListIcon, PencilIcon, ArchiveIcon, ArrowPathIcon, TrashIcon } from "~/components/icons";
import { SectionCard } from "./components/SectionCard";
import { DetailRow } from "./components/DetailRow";
import { getStatusVariant, formatPrice, formatDateTime, formatNumber, getStatusLabel } from "./helpers";
import { MOCK_PRODUCT, MOCK_PRODUCT_STATS } from "./mock-data";
import Badge from "~/components/ui/Badge";

export default function ProductOverviewRoute() {
  const product = MOCK_PRODUCT;
  const stats = MOCK_PRODUCT_STATS;

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Product Info */}
      <div class="lg:col-span-2 space-y-6">
        {/* Description */}
        <SectionCard
          title="Description"
          icon={<PackageIcon class="w-4 h-4 text-gray-400" />}
        >
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>
        </SectionCard>

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
                <Badge variant={product.inventoryCount === 0 ? "terracotta" : product.inventoryCount <= 10 ? "cream" : "forest"} class="text-xs">
                  {product.inventoryCount === 0 ? "Out of Stock" : product.inventoryCount <= 10 ? "Low Stock" : "In Stock"}
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
            value={product.productType.charAt(0).toUpperCase() + product.productType.slice(1)}
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

        {/* Quick Stats */}
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
  );
}
