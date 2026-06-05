import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { PaymentMethod } from "~/lib/api/types/checkout.types";
import { ChevronLeftIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { A } from "@solidjs/router";

interface PaymentStepContentProps {
  selectedPaymentMethod: PaymentMethod;
  paymentMethods: PaymentMethod[];
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
  canPlaceOrder: boolean;
  isPlacingOrder?: boolean;
}

const PaymentStepContent: Component<PaymentStepContentProps> = (props) => {
  const { t } = useI18n();

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    switch (method) {
      case "COD":
        return t("checkout.payment.cod");
      case "CARD":
        return t("checkout.payment.card");
      case "BKASH":
        return t("checkout.payment.bkash");
      case "NAGAD":
        return t("checkout.payment.nagad");
      case "SSLCOMMERCE":
        return t("checkout.payment.sslcommerce");
      default:
        return method;
    }
  };

  const getPaymentMethodDescription = (method: PaymentMethod): string => {
    switch (method) {
      case "COD":
        return t("checkout.payment.codDescription");
      case "CARD":
        return t("checkout.payment.cardDescription");
      case "BKASH":
        return t("checkout.payment.bkashDescription");
      case "NAGAD":
        return t("checkout.payment.nagadDescription");
      case "SSLCOMMERCE":
        return t("checkout.payment.sslcommerceDescription");
      default:
        return "";
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod): string => {
    switch (method) {
      case "COD":
        return "💵";
      case "CARD":
        return "💳";
      case "BKASH":
        return "📱";
      case "NAGAD":
        return "📱";
      case "SSLCOMMERCE":
        return "🌐";
      default:
        return "💰";
    }
  };

  return (
    <div class="space-y-6">
      {/* Payment Methods */}
      <div>
        <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-4">
          {t("checkout.paymentMethod")}
        </h2>

        <div class="space-y-3">
          <For each={props.paymentMethods}>
            {(method) => {
              const isSelected = () => props.selectedPaymentMethod === method;

              return (
                <button
                  type="button"
                  onClick={() => props.onSelectPaymentMethod(method)}
                  class={`relative text-left p-5 rounded-xl border-2 transition-all ${
                    isSelected()
                      ? "border-forest-600 dark:border-forest-400 bg-forest-50 dark:bg-forest-800/80 shadow-sm"
                      : "border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 hover:border-cream-300 dark:hover:border-forest-600"
                  }`}
                >
                  <div class="flex items-center gap-4">
                    {/* Icon */}
                    <div class={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isSelected()
                        ? "bg-forest-100 dark:bg-forest-900/60"
                        : "bg-cream-100 dark:bg-forest-900/40"
                    }`}>
                      {getPaymentMethodIcon(method)}
                    </div>

                    {/* Details */}
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <p class="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {getPaymentMethodLabel(method)}
                        </p>
                        {/* Selected indicator */}
                        <Show when={isSelected()}>
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-forest-100 dark:bg-forest-900/40 text-forest-700 dark:text-forest-300">
                            {t("checkout.payment.selected")}
                          </span>
                        </Show>
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {getPaymentMethodDescription(method)}
                      </p>
                    </div>

                    {/* Radio indicator */}
                    <div class={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected()
                        ? "border-forest-600 dark:border-forest-400"
                        : "border-gray-300 dark:border-gray-600"
                    }`}>
                      <Show when={isSelected()}>
                        <div class="w-2.5 h-2.5 rounded-full bg-forest-600 dark:bg-forest-400" />
                      </Show>
                    </div>
                  </div>
                </button>
              );
            }}
          </For>
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
            disabled={!props.canPlaceOrder || props.isPlacingOrder}
            loading={props.isPlacingOrder}
            onClick={props.onPlaceOrder}
          >
            {props.isPlacingOrder
              ? t("checkout.placingOrder")
              : t("checkout.placeOrderNow")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStepContent;
