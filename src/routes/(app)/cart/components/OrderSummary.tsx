import type { Component } from "solid-js";
import { createSignal, createMemo, Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { CartItem } from "~/lib/api/types/cart.types";
import { formatPrice } from "../../plants/constants";
import { Button } from "~/components/ui";
import { toaster } from "~/components/ui/Toast";
import {
  TagIcon,
  ShieldCheckIcon,
  PackageIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "~/components/icons";

const OrderSummary: Component<{
  items: CartItem[];
}> = (props) => {
  const { t } = useI18n();
  const [promoCode, setPromoCode] = createSignal("");
  const [promoApplied, setPromoApplied] = createSignal(false);

  const subtotal = createMemo(() =>
    props.items.reduce((sum, item) => sum + parseFloat(item.lineTotal), 0)
  );

  const discount = createMemo(() =>
    promoApplied() ? Math.round(subtotal() * 0.1) : 0
  );

  const shipping = createMemo(() => (subtotal() > 2000 ? 0 : 120));

  const total = createMemo(() => subtotal() - discount() + shipping());

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
            when={shipping() > 0}
            fallback={<span class="font-medium text-forest-600 dark:text-forest-400">{t("cart.free")}</span>}
          >
            <span class="font-medium">{formatPrice(shipping())}</span>
          </Show>
        </div>

        <Show when={shipping() === 0}>
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
    </div>
  );
};

export default OrderSummary;
