import { Component, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { formatPrice } from "../../plants/constants";
import { Button } from "~/components/ui";
import {
  ShieldCheckIcon,
  PackageIcon,
  SparklesIcon,
  TruckIcon,
} from "~/components/icons";
import type { MockPriceBreakdown } from "../mock-data";

interface PriceBreakdownSidebarProps {
  breakdown: MockPriceBreakdown;
  onPlaceOrder: () => void;
  isPlacingOrder?: boolean;
  canPlaceOrder: boolean;
}

const PriceBreakdownSidebar: Component<PriceBreakdownSidebarProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6 shadow-sm sticky top-24">
      <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-4">
        {t("checkout.priceBreakdown")}
      </h2>

      {/* Price details */}
      <div class="space-y-3 text-sm">
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("cart.subtotal")}</span>
          <span class="font-medium text-forest-800 dark:text-cream-50">
            {formatPrice(props.breakdown.subtotal)}
          </span>
        </div>

        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span class="flex items-center gap-1.5">
            <TruckIcon class="w-3.5 h-3.5" />
            {t("checkout.shipping")}
          </span>
          <Show
            when={props.breakdown.shipping > 0}
            fallback={
              <span class="font-medium text-forest-600 dark:text-forest-400">
                {t("checkout.freeShipping")}
              </span>
            }
          >
            <span class="font-medium text-forest-800 dark:text-cream-50">
              {formatPrice(props.breakdown.shipping)}
            </span>
          </Show>
        </div>

        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("checkout.tax")}</span>
          <span class="font-medium text-forest-800 dark:text-cream-50">
            {formatPrice(props.breakdown.tax)}
          </span>
        </div>

        {/* Total */}
        <div class="border-t border-cream-200 dark:border-forest-700 pt-3 flex justify-between">
          <span class="text-base font-bold text-forest-800 dark:text-cream-50">
            {t("checkout.orderTotal")}
          </span>
          <span class="text-xl font-bold text-forest-800 dark:text-cream-50">
            {formatPrice(props.breakdown.total)}
          </span>
        </div>
      </div>

      {/* Place order button */}
      <div class="mt-5">
        <Button
          variant="primary"
          size="lg"
          class="w-full"
          onClick={props.onPlaceOrder}
          disabled={!props.canPlaceOrder || props.isPlacingOrder}
          loading={props.isPlacingOrder}
        >
          {props.isPlacingOrder
            ? t("checkout.placingOrder")
            : t("checkout.placeOrder", {
                total: formatPrice(props.breakdown.total),
              })}
        </Button>
      </div>

      {/* Security note */}
      <Show when={props.canPlaceOrder}>
        <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
          {t("checkout.secureCheckoutNote")}
        </p>
      </Show>

      {/* Trust badges */}
      <div class="mt-5 pt-4 border-t border-cream-200 dark:border-forest-700 grid grid-cols-3 gap-3 text-center">
        <div class="flex flex-col items-center gap-1">
          <ShieldCheckIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
          <span class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            {t("cart.secure")}
          </span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <PackageIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
          <span class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            {t("cart.fastDelivery")}
          </span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <SparklesIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
          <span class="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            {t("cart.quality")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdownSidebar;
