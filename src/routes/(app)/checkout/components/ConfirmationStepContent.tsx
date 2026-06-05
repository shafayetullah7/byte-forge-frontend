import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { PaymentMethod } from "~/lib/api/types/checkout.types";
import { CheckCircleIcon } from "~/components/icons";
import { Button } from "~/components/ui";

const PaymentMethodIcon: Record<PaymentMethod, string> = {
  COD: "💵",
  CARD: "💳",
  BKASH: "📱",
  NAGAD: "📱",
  SSLCOMMERCE: "🌐",
};

const PaymentMethodLabel: Record<PaymentMethod, string> = {
  COD: "Cash on Delivery",
  CARD: "Credit/Debit Card",
  BKASH: "bKash",
  NAGAD: "Nagad",
  SSLCOMMERCE: "SSLCommerz",
};

interface ConfirmationStepContentProps {
  navigate: (path: string) => void;
  orderNumber: string;
  paymentMethod: PaymentMethod | null;
}

const ConfirmationStepContent: Component<ConfirmationStepContentProps> = (props) => {
  const { t } = useI18n();

  const getPaymentLabel = (method: PaymentMethod): string => {
    const key = `checkout.payment.${method.toLowerCase()}` as const;
    return t(key) || PaymentMethodLabel[method];
  };

  return (
    <div class="max-w-lg mx-auto text-center py-12">
      <div class="w-20 h-20 rounded-full bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon class="w-12 h-12 text-forest-600 dark:text-forest-400" />
      </div>
      <h2 class="text-2xl font-bold text-forest-800 dark:text-cream-50 mb-2">
        {t("checkout.orderPlaced")}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-2">
        {t("checkout.orderNumber")}: {props.orderNumber}
      </p>

      <Show when={props.paymentMethod}>
        {(method) => (
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-cream-50 dark:bg-forest-800 rounded-lg border border-cream-200 dark:border-forest-700 mb-6">
            <span class="text-lg">{PaymentMethodIcon[method()]}</span>
            <span class="text-sm font-medium text-forest-800 dark:text-cream-50">
              {t("checkout.paymentMethod")}: {getPaymentLabel(method())}
            </span>
          </div>
        )}
      </Show>

      <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
        {t("checkout.orderConfirmationMessage")}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          onClick={() => props.navigate("/app/orders")}
        >
          {t("checkout.viewOrders")}
        </Button>
        <Button
          variant="outline"
          onClick={() => props.navigate("/plants")}
        >
          {t("checkout.continueShopping")}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStepContent;
