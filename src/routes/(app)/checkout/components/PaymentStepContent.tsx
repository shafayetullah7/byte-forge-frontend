import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import type {
  PaymentMethod,
  CheckoutPaymentMethodOption,
} from "~/lib/api/types/checkout.types";
import { ChevronLeftIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { A } from "@solidjs/router";

interface PaymentStepContentProps {
  selectedPaymentMethod: PaymentMethod;
  paymentMethods: CheckoutPaymentMethodOption[];
  paymentMethodsLoading?: boolean;
  orderNotes?: string;
  onOrderNotesChange?: (notes: string) => void;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
  canPlaceOrder: boolean;
  isPlacingOrder?: boolean;
}

const PaymentStepContent: Component<PaymentStepContentProps> = (props) => {
  const { t } = useI18n();

  const getPaymentMethodLabel = (method: CheckoutPaymentMethodOption): string => {
    if (method.displayName) return method.displayName;
    return method.key;
  };

  const getPaymentMethodDescription = (method: CheckoutPaymentMethodOption): string => {
    if (method.description) return method.description;
    switch (method.key) {
      case "COD":
        return t("checkout.payment.codDescription");
      default:
        return "";
    }
  };

  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-4">
          {t("checkout.paymentMethod")}
        </h2>

        <Show
          when={!props.paymentMethodsLoading}
          fallback={
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {t("checkout.loadingPaymentMethods")}
            </p>
          }
        >
          <Show
            when={props.paymentMethods.length > 0}
            fallback={
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {t("checkout.noPaymentMethods")}
              </p>
            }
          >
            <div class="space-y-3">
              <For each={props.paymentMethods}>
                {(method) => {
                  const isSelected = () => props.selectedPaymentMethod === method.key;

                  return (
                    <button
                      type="button"
                      onClick={() => props.onSelectPaymentMethod(method.key)}
                      class={`relative text-left p-5 rounded-xl border-2 transition-all ${
                        isSelected()
                          ? "border-forest-600 dark:border-forest-400 bg-forest-50 dark:bg-forest-800/80 shadow-sm"
                          : "border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 hover:border-cream-300 dark:hover:border-forest-600"
                      }`}
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden ${
                            isSelected()
                              ? "bg-forest-100 dark:bg-forest-900/60"
                              : "bg-cream-100 dark:bg-forest-900/40"
                          }`}
                        >
                          <Show
                            when={method.logoUrl}
                            fallback={
                              <span class="text-2xl">
                                {method.key === "COD" ? "💵" : "💰"}
                              </span>
                            }
                          >
                            {(logoUrl) => (
                              <img
                                src={logoUrl()}
                                alt={method.displayName}
                                class="w-full h-full object-contain p-1"
                              />
                            )}
                          </Show>
                        </div>

                        <div class="flex-1">
                          <div class="flex items-center gap-2">
                            <p class="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {getPaymentMethodLabel(method)}
                            </p>
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

                        <div
                          class={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected()
                              ? "border-forest-600 dark:border-forest-400"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
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
          </Show>
        </Show>
      </div>

      <div class="text-sm">
        <A href="/help/cod" class="text-forest-600 dark:text-forest-400 hover:underline">
          {t("checkout.payment.codPolicyLink")}
        </A>
      </div>

      <Show when={props.onOrderNotesChange}>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("checkout.orderNotes")}
          </label>
          <textarea
            value={props.orderNotes ?? ""}
            onInput={(e) => props.onOrderNotesChange?.(e.currentTarget.value)}
            placeholder={t("checkout.orderNotesPlaceholder")}
            class="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-sm min-h-24 resize-y"
          />
        </div>
      </Show>

      <div class="flex justify-between items-center pt-4">
        <A
          href="/cart"
          class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 font-medium transition-colors"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          {t("checkout.backToCart")}
        </A>
        <div class="flex gap-3">
          <Button variant="outline" size="lg" onClick={props.onBack}>
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
