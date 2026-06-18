import { Component, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { formatPrice } from "../../plants/constants";
import {
  ShieldCheckIcon,
  PackageIcon,
  SparklesIcon,
  TruckIcon,
} from "~/components/icons";
import type { PriceBreakdown, PaymentMethod, CheckoutPaymentMethodOption } from "~/lib/api/types/checkout.types";

interface PriceBreakdownSidebarProps {
  breakdown: PriceBreakdown | undefined;
  paymentMethod?: PaymentMethod;
  paymentMethods?: CheckoutPaymentMethodOption[];
}

const PriceBreakdownSidebar: Component<PriceBreakdownSidebarProps> = (props) => {
  const { t } = useI18n();

  const selectedPaymentLabel = () => {
    const method = props.paymentMethod;
    if (!method) return "";
    const catalog = props.paymentMethods?.find((m) => m.key === method);
    if (catalog?.displayName) return catalog.displayName;
    return method.replace(/_/g, " ");
  };

  const subtotal = () => props.breakdown ? parseFloat(props.breakdown.subtotal) : 0;
  const shipping = () => props.breakdown ? parseFloat(props.breakdown.shipping) : 0;
  const tax = () => props.breakdown ? parseFloat(props.breakdown.tax) : 0;
  const total = () => props.breakdown ? parseFloat(props.breakdown.total) : 0;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6 shadow-sm sticky top-24">
      <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-4">
        {t("checkout.priceBreakdown")}
      </h2>

      {/* Loading state */}
      <Show
        when={props.breakdown}
        fallback={
          <div class="space-y-3">
            <div class="h-4 bg-cream-200 dark:bg-forest-700 rounded animate-pulse" />
            <div class="h-4 bg-cream-200 dark:bg-forest-700 rounded animate-pulse w-3/4" />
            <div class="h-4 bg-cream-200 dark:bg-forest-700 rounded animate-pulse w-1/2" />
            <div class="h-8 bg-cream-200 dark:bg-forest-700 rounded animate-pulse w-full mt-4" />
          </div>
        }
      >
        {/* Price details */}
        <div class="space-y-3 text-sm">
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{t("cart.subtotal")}</span>
            <span class="font-medium text-forest-800 dark:text-cream-50">
              {formatPrice(subtotal())}
            </span>
          </div>

          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span class="flex items-center gap-1.5">
              <TruckIcon class="w-3.5 h-3.5" />
              {t("checkout.shipping")}
            </span>
            <Show
              when={shipping() > 0}
              fallback={
                <span class="font-medium text-forest-600 dark:text-forest-400">
                  {t("checkout.freeShipping")}
                </span>
              }
            >
              <span class="font-medium text-forest-800 dark:text-cream-50">
                {formatPrice(shipping())}
              </span>
            </Show>
          </div>

          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{t("checkout.tax")}</span>
            <span class="font-medium text-forest-800 dark:text-cream-50">
              {formatPrice(tax())}
            </span>
          </div>

          {/* Total */}
          <div class="border-t border-cream-200 dark:border-forest-700 pt-3 flex justify-between">
            <span class="text-base font-bold text-forest-800 dark:text-cream-50">
              {t("checkout.orderTotal")}
            </span>
            <span class="text-xl font-bold text-forest-800 dark:text-cream-50">
              {formatPrice(total())}
            </span>
          </div>
        </div>

        {/* Selected payment method */}
        <Show when={props.paymentMethod}>
          <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {t("checkout.paymentMethod")}
            </span>
            <div class="flex items-center gap-2 mt-1">
              <Show
                when={props.paymentMethods?.find((m) => m.key === props.paymentMethod)?.logoUrl}
                fallback={<span class="text-base">{props.paymentMethod === "COD" ? "💵" : "💰"}</span>}
              >
                {(logoUrl) => (
                  <img src={logoUrl()} alt={selectedPaymentLabel()} class="w-5 h-5 object-contain" />
                )}
              </Show>
              <span class="text-sm font-medium text-forest-800 dark:text-cream-50">
                {selectedPaymentLabel()}
              </span>
            </div>
          </div>
        </Show>
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
