import { For, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { useI18n } from "~/i18n";
import type { ProductListItem } from "~/lib/api/types/seller.types";
import { PRODUCT_STATUS } from "~/lib/api/types/seller.types";
import {
  PackageIcon,
  ClockIcon,
} from "~/components/icons";
import Badge from "~/components/ui/Badge";
import { getStatusVariant, formatPrice, formatDateTime, getTypeLabel, getInventoryLabel } from "./utils";

export function ProductsTable(props: {
  products: ProductListItem[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isRefetching: boolean;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <Show
      when={props.products.length > 0}
      fallback={
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
          <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
            {t("seller.products.noProductsFound")}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {props.hasActiveFilters
              ? t("seller.products.noProductsAdjustFilters")
              : t("seller.products.noProductsStart")}
          </p>
          <Show when={props.hasActiveFilters}>
            <button
              onClick={props.onClearFilters}
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
            >
              {t("seller.products.clearFilters")}
            </button>
          </Show>
        </div>
      }
    >
      <div class="relative">
        <div class="hidden lg:block bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50">
                <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("seller.products.tableHeaders.product")}
                </th>
                <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("seller.products.tableHeaders.type")}
                </th>
                <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("seller.products.tableHeaders.price")}
                </th>
                <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("seller.products.tableHeaders.inventory")}
                </th>
                <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("seller.products.tableHeaders.status")}
                </th>
                <th class="text-left px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("seller.products.tableHeaders.updated")}
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={props.products}>
                {(product: ProductListItem) => {
                  const inventory = getInventoryLabel(product.inventoryCount, t);
                  const productTypeLabel = getTypeLabel(product.productType);

                  return (
                    <tr
                      class="border-b border-cream-100 dark:border-forest-700/50 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors cursor-pointer"
                      onClick={() => {
                        navigate(`/app/seller/products/${product.id}`);
                      }}
                    >
                      <td class="px-5 py-3.5">
                        <div>
                          <p class="font-semibold text-forest-800 dark:text-cream-50">
                            {product.name || product.slug}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {product.shortDescription}
                          </p>
                        </div>
                      </td>
                      <td class="px-5 py-3.5">
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                          {productTypeLabel}
                        </span>
                      </td>
                      <td class="px-5 py-3.5">
                        <span class="font-semibold text-forest-800 dark:text-cream-50">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td class="px-5 py-3.5">
                        <Badge variant={inventory.variant}>
                          {inventory.label}
                        </Badge>
                      </td>
                      <td class="px-5 py-3.5">
                        <Badge variant={getStatusVariant(product.status)}>
                          {product.status === PRODUCT_STATUS.ACTIVE ? t("seller.products.statusLabels.active") : product.status === PRODUCT_STATUS.DRAFT ? t("seller.products.statusLabels.draft") : t("seller.products.statusLabels.archived")}
                        </Badge>
                      </td>
                      <td class="px-5 py-3.5">
                        <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <ClockIcon class="w-3.5 h-3.5" />
                          {t("seller.products.updated")} {formatDateTime(product.updatedAt)}
                        </span>
                      </td>
                    </tr>
                  );
                }}
              </For>
            </tbody>
          </table>
        </div>

        <div class="lg:hidden space-y-3">
          <For each={props.products}>
            {(product: ProductListItem) => {
              const inventory = getInventoryLabel(product.inventoryCount, t);
              const productTypeLabel = getTypeLabel(product.productType);

              return (
                <div
                  class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-4 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors cursor-pointer"
                  onClick={() => {
                    navigate(`/app/seller/products/${product.id}`);
                  }}
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-forest-800 dark:text-cream-50 truncate">
                          {product.name || product.slug}
                        </h3>
                        <Badge variant={getStatusVariant(product.status)} class="flex-shrink-0">
                          {product.status === PRODUCT_STATUS.ACTIVE ? t("seller.products.statusLabels.active") : product.status === PRODUCT_STATUS.DRAFT ? t("seller.products.statusLabels.draft") : t("seller.products.statusLabels.archived")}
                        </Badge>
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {product.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p class="text-gray-500 dark:text-gray-400 text-xs">{t("seller.products.mobileLabels.type")}</p>
                      <p class="font-medium text-forest-800 dark:text-cream-50">
                        {productTypeLabel}
                      </p>
                    </div>
                    <div>
                      <p class="text-gray-500 dark:text-gray-400 text-xs">{t("seller.products.mobileLabels.price")}</p>
                      <p class="font-semibold text-forest-800 dark:text-cream-50">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div>
                      <p class="text-gray-500 dark:text-gray-400 text-xs">{t("seller.products.mobileLabels.inventory")}</p>
                      <Badge variant={inventory.variant} class="mt-0.5">
                        {inventory.label}
                      </Badge>
                    </div>
                  </div>

                  <div class="mt-2 pt-2 border-t border-cream-100 dark:border-forest-700/50">
                    <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <ClockIcon class="w-3 h-3" />
                      {t("seller.products.updated")} {formatDateTime(product.updatedAt)}
                    </span>
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        <Show when={props.isRefetching}>
          <div class="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div class="flex items-center gap-2 text-forest-700 dark:text-cream-200">
              <span class="text-sm font-medium">{t("seller.products.updating")}</span>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}
