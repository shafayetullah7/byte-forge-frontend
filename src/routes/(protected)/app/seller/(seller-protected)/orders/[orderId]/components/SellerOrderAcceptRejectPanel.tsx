import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import Button from "~/components/ui/Button";
import { CheckCircleIcon, XCircleIcon } from "~/components/icons";
import { getSellerOrderAction } from "~/lib/orders/seller-order.utils";
import type { SellerOrderActionDescriptor, SellerOrderDetail } from "~/lib/api/types/seller-orders.types";

export function SellerOrderAcceptRejectPanel(props: {
  order: SellerOrderDetail;
  pending: boolean;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const { t } = useI18n();
  const acceptAction = () => getSellerOrderAction(props.order.availableActions, "ACCEPT");
  const rejectAction = () => getSellerOrderAction(props.order.availableActions, "REJECT");

  return (
    <Show when={props.order.status === "PENDING_PAYMENT" && (acceptAction() || rejectAction())}>
      <div class="rounded-xl border border-cream-300 dark:border-cream-700 bg-cream-50 dark:bg-cream-900/20 p-4 mb-6 print:hidden">
        <p class="text-sm font-semibold text-cream-900 dark:text-cream-100 mb-4">
          {t("seller.orders.detailPage.newOrderBanner")}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Show when={acceptAction()}>
            {(action) => (
              <div class="rounded-xl border border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-800 p-4">
                <Button
                  variant="primary"
                  class="w-full"
                  loading={props.pending}
                  disabled={props.pending || action().disabled}
                  title={action().disabled ? action().disabledReason ?? undefined : undefined}
                  onClick={props.onAccept}
                >
                  <CheckCircleIcon class="w-4 h-4" />
                  {t("seller.orders.detailPage.acceptOrder")}
                </Button>
              </div>
            )}
          </Show>

          <Show when={rejectAction()}>
            {(action) => (
              <div class="rounded-xl border border-terracotta-200 dark:border-terracotta-800 bg-white dark:bg-forest-800 p-4 space-y-3">
                <p class="text-sm font-semibold text-terracotta-800 dark:text-terracotta-200">
                  {t("seller.orders.detailPage.rejectOrder")}
                </p>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t("seller.orders.detailPage.rejectReasonLabel")}
                </label>
                <textarea
                  placeholder={t("seller.orders.detailPage.rejectReasonPlaceholder")}
                  value={props.rejectReason}
                  onInput={(e) => props.onRejectReasonChange(e.currentTarget.value)}
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm min-h-20"
                />
                <Button
                  variant="outline"
                  class="w-full border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50"
                  loading={props.pending}
                  disabled={
                    props.pending || action().disabled || !props.rejectReason.trim()
                  }
                  title={action().disabled ? action().disabledReason ?? undefined : undefined}
                  onClick={props.onReject}
                >
                  <XCircleIcon class="w-4 h-4" />
                  {t("seller.orders.detailPage.confirmRejection")}
                </Button>
              </div>
            )}
          </Show>
        </div>
      </div>
    </Show>
  );
}

export function SellerOrderConfirmPaymentPanel(props: {
  order: SellerOrderDetail;
  pending: boolean;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  const confirmAction = () =>
    getSellerOrderAction(props.order.availableActions, "CONFIRM_PAYMENT");

  return (
    <Show when={confirmAction()}>
      {(action) => (
        <div class="rounded-xl border border-forest-300 dark:border-forest-700 bg-forest-50 dark:bg-forest-900/20 p-4 print:hidden">
          <p class="text-sm font-semibold text-forest-900 dark:text-forest-100 mb-1">
            {t("seller.orders.detailPage.codPaymentConfirmationBanner")}
          </p>
          <p class="text-sm text-forest-700 dark:text-forest-300 mb-4">
            {t("seller.orders.detailPage.codPaymentConfirmationDesc", {
              amount: props.order.total,
            })}
          </p>
          <Button
            variant="primary"
            loading={props.pending}
            disabled={props.pending || action().disabled}
            title={action().disabled ? action().disabledReason ?? undefined : undefined}
            onClick={props.onConfirm}
          >
            {t("seller.orders.detailPage.confirmPaymentReceived")}
          </Button>
        </div>
      )}
    </Show>
  );
}

export type { SellerOrderActionDescriptor };
