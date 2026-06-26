import type { Component } from "solid-js";
import { createSignal, createMemo, Show, createEffect } from "solid-js";
import { useI18n } from "~/i18n";
import type { CartItem } from "~/lib/api/types/cart.types";
import { formatPrice } from "../../plants/constants";
import { Button } from "~/components/ui";
import { toaster } from "~/components/ui/Toast";
import { publicShopsApi } from "~/lib/api/endpoints/public/shops.api";
import { A } from "@solidjs/router";
import {
  TagIcon,
  ShieldCheckIcon,
  PackageIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "~/components/icons";

const OrderSummary: Component<{
  items: CartItem[];
  deliveryDistrictId?: string | null;
}> = (props) => {
  const { t } = useI18n();
  const [promoCode, setPromoCode] = createSignal("");
  const [promoApplied, setPromoApplied] = createSignal(false);

  // Group items by shopId
  const shopGroups = createMemo(() => {
    const groups = new Map<string, CartItem[]>();
    props.items.forEach((item) => {
      const existing = groups.get(item.shopId) || [];
      existing.push(item);
      groups.set(item.shopId, existing);
    });
    return groups;
  });

  const subtotal = createMemo(() =>
    props.items.reduce((sum, item) => sum + parseFloat(item.lineTotal), 0)
  );

  const discount = createMemo(() =>
    promoApplied() ? Math.round(subtotal() * 0.1) : 0
  );

  // Shipping rates cache: shopId -> cost
  const [shippingRates, setShippingRates] = createSignal<
    Map<string, number>
  >(new Map());
  const [shippingLoading, setShippingLoading] = createSignal(false);

  // Fetch shipping rates when district changes
  createEffect(async () => {
    const districtId = props.deliveryDistrictId;
    if (!districtId || shopGroups().size === 0) {
      setShippingRates(new Map());
      return;
    }

    setShippingLoading(true);
    const rates = new Map<string, number>();

    for (const [shopId] of shopGroups()) {
      try {
        const rate = await publicShopsApi.getShippingRate(shopId, districtId);
        if (rate) {
          rates.set(shopId, parseFloat(rate.cost));
        }
      } catch {
        // Rate not configured for this shop/district
      }
    }

    setShippingRates(rates);
    setShippingLoading(false);
  });

  const totalShipping = createMemo(() => {
    let sum = 0;
    for (const [shopId, cost] of shippingRates()) {
      sum += cost;
    }
    return sum;
  });

  const hasShippingConfigured = createMemo(() => {
    return shippingRates().size > 0;
  });

  const total = createMemo(() => subtotal() - discount() + totalShipping());

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6 shadow-sm sticky top-24">
      <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-4">
        {t("cart.orderSummary")}
      </h2>

      {/* Promo Code */}
      <div class="mb-5">
        <Show
          when={promoApplied()}
          fallback={
            <div class="flex gap-2">
              <input
                type="text"
                value={promoCode()}
                onInput={(e) => setPromoCode(e.currentTarget.value)}
                placeholder={t("cart.promoPlaceholder")}
                class="flex-1 px-3 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-forest-500 dark:focus:border-forest-400 focus:ring-1 focus:ring-forest-500 dark:focus:ring-forest-400 transition-colors"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (promoCode().trim()) {
                    setPromoApplied(true);
                    toaster.success(t("cart.promoApplied"));
                  }
                }}
                disabled={!promoCode().trim()}
              >
                {t("cart.apply")}
              </Button>
            </div>
          }
        >
          <div class="flex items-center justify-between px-3 py-2.5 rounded-lg bg-forest-50 dark:bg-forest-700/40 border border-forest-200 dark:border-forest-600">
            <div class="flex items-center gap-2">
              <TagIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
              <span class="text-sm font-medium text-forest-700 dark:text-forest-300">
                SAVE10
              </span>
              <CheckCircleIcon class="w-4 h-4 text-forest-500" />
            </div>
            <button
              onClick={() => {
                setPromoApplied(false);
                setPromoCode("");
              }}
              class="text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline"
            >
              {t("cart.remove")}
            </button>
          </div>
        </Show>
      </div>

      {/* Price Breakdown */}
      <div class="space-y-3 text-sm">
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("cart.subtotal")}</span>
          <span class="font-medium text-forest-800 dark:text-cream-50">
            {formatPrice(subtotal())}
          </span>
        </div>

        <Show when={discount() > 0}>
          <div class="flex justify-between text-forest-600 dark:text-forest-400">
            <span>{t("cart.discount")}</span>
            <span class="font-medium">-{formatPrice(discount())}</span>
          </div>
        </Show>

        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("cart.shipping")}</span>
          <Show
            when={props.deliveryDistrictId}
            fallback={
              <span class="text-xs text-amber-600 dark:text-amber-400">
                {t("cart.selectDistrict")}
              </span>
            }
          >
            <Show
              when={shippingLoading()}
              fallback={
                <Show
                  when={totalShipping() > 0}
                  fallback={
                    <span class="font-medium text-forest-600 dark:text-forest-400">
                      {hasShippingConfigured() ? t("cart.free") : t("cart.selectDistrict")}
                    </span>
                  }
                >
                  <span class="font-medium">{formatPrice(totalShipping())}</span>
                </Show>
              }
            >
              <span class="text-xs text-gray-400">...</span>
            </Show>
          </Show>
        </div>

        <Show when={totalShipping() === 0 && props.deliveryDistrictId && hasShippingConfigured()}>
          <div class="flex items-center gap-1.5 text-xs text-forest-600 dark:text-forest-400">
            <PackageIcon class="w-3.5 h-3.5" />
            <span>{t("cart.freeShipping")}</span>
          </div>
        </Show>

        <div class="border-t border-cream-200 dark:border-forest-700 pt-3 flex justify-between">
          <span class="text-base font-bold text-forest-800 dark:text-cream-50">
            {t("cart.total")}
          </span>
          <span class="text-xl font-bold text-forest-800 dark:text-cream-50">
            {formatPrice(total())}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <div class="mt-5">
        <A href="/checkout">
          <Button
            variant="primary"
            size="lg"
            class="w-full"
            disabled={props.items.length === 0}
          >
            {props.items.length > 0
              ? t("cart.checkout", { count: props.items.length })
              : t("cart.selectItems")}
          </Button>
        </A>
      </div>

      {/* Trust Badges */}
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

      <div class="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-center">
        <A href="/help/shipping-and-returns" class="text-xs text-forest-600 dark:text-forest-400 hover:underline">
          {t("cart.policyLinks")}
        </A>
        <A href="/help/cod" class="text-xs text-forest-600 dark:text-forest-400 hover:underline">
          {t("cart.codPolicy")}
        </A>
      </div>
    </div>
  );
};

export default OrderSummary;
