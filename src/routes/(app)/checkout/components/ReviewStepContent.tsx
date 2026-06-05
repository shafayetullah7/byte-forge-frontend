import type { Component } from "solid-js";
import { createMemo, Show, For } from "solid-js";
import { useI18n } from "~/i18n";
import type { Address } from "~/lib/api/types/address.types";
import type { PriceBreakdown } from "~/lib/api/types/checkout.types";
import { formatPrice } from "../../plants/constants";
import { LeafIcon, ChevronLeftIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { A } from "@solidjs/router";
import { mapShopBreakdownToShopOrderReview } from "../utils/mappings";
import ShopOrderReview from "./ShopOrderReview";

interface ReviewStepContentProps {
  selectedAddressId: string | null;
  addresses: Address[];
  canPlaceOrder: boolean;
  priceBreakdown: PriceBreakdown | undefined;
  onBack: () => void;
  onContinue: () => void;
}

const ReviewStepContent: Component<ReviewStepContentProps> = (props) => {
  const { t } = useI18n();
  const selectedAddress = createMemo(() =>
    props.addresses.find((a) => a.id === props.selectedAddressId)
  );

  const shopBreakdowns = createMemo(() => {
    if (!props.priceBreakdown) return [];
    return props.priceBreakdown.shopBreakdowns.map(mapShopBreakdownToShopOrderReview);
  });

  const total = () => props.priceBreakdown ? parseFloat(props.priceBreakdown.total) : 0;

  return (
    <div class="space-y-6">
      {/* Selected address summary */}
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-forest-100 dark:bg-forest-900/40 rounded-lg">
              <LeafIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("checkout.deliverTo")}
              </p>
              <Show when={selectedAddress()}>
                {(addr) => (
                  <>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {addr().addressLine1}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {addr().city}
                    </p>
                  </>
                )}
              </Show>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={props.onBack}
          >
            {t("checkout.change")}
          </Button>
        </div>
      </div>

      {/* Shop order reviews */}
      <Show when={shopBreakdowns().length > 0}>
        <div class="space-y-4">
          <For each={shopBreakdowns()}>
            {(shop) => <ShopOrderReview shop={shop} />}
          </For>
        </div>
      </Show>

      {/* Order total */}
      <div class="bg-cream-50 dark:bg-forest-900/40 rounded-xl border border-cream-200 dark:border-forest-700 p-4">
        <div class="flex justify-between items-center">
          <span class="text-base font-bold text-forest-800 dark:text-cream-50">
            {t("checkout.orderTotal")}
          </span>
          <span class="text-2xl font-bold text-forest-800 dark:text-cream-50">
            {formatPrice(total())}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div class="flex justify-between items-center pt-4">
        <A
          href="/cart"
          class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 font-medium transition-colors"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          {t("checkout.backToCart")}
        </A>
        <div class="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={props.onBack}
          >
            {t("checkout.back")}
          </Button>
          <Button
            variant="primary"
            size="lg"
            disabled={!props.canPlaceOrder}
            onClick={props.onContinue}
          >
            {t("checkout.continueToPayment")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStepContent;
