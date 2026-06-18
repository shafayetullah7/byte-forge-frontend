import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import Button from "~/components/ui/Button";
import type { SellerOrderActionDescriptor } from "~/lib/api/types/seller-orders.types";

export function SellerOrderActionBar(props: {
  actions: SellerOrderActionDescriptor[];
  pending: boolean;
  onAction: (action: SellerOrderActionDescriptor) => void;
}) {
  const { t } = useI18n();

  const labelFor = (key: SellerOrderActionDescriptor["key"]) => {
    switch (key) {
      case "ACCEPT":
        return t("seller.orders.detailPage.acceptOrder");
      case "REJECT":
        return t("seller.orders.detailPage.rejectOrder");
      case "MARK_PACKED":
        return t("seller.orders.detailPage.markPacked");
      case "SHIP":
        return t("seller.orders.detail.shipOrder");
      case "MARK_DELIVERED":
        return t("seller.orders.detailPage.selfDeliveryMarkDelivered");
      case "CONFIRM_PAYMENT":
        return t("seller.orders.detailPage.confirmPaymentReceived");
      case "CANCEL":
        return t("seller.orders.detail.cancelOrder");
      default:
        return key;
    }
  };

  const barActions = () =>
    props.actions.filter(
      (action) =>
        action.key !== "SHIP" &&
        action.key !== "CANCEL" &&
        action.key !== "REJECT" &&
        action.key !== "ACCEPT",
    );

  return (
    <Show when={barActions().length > 0}>
      <div class="sticky top-0 z-10 -mx-1 px-1 py-3 mb-4 bg-gray-50/95 dark:bg-forest-900/95 backdrop-blur border-b border-gray-200 dark:border-forest-700 print:hidden">
        <div class="flex flex-wrap gap-2">
          <For each={barActions()}>
            {(action) => (
              <Button
                variant={action.primary ? "primary" : "outline"}
                loading={props.pending}
                disabled={props.pending || action.disabled}
                title={action.disabled ? action.disabledReason ?? undefined : undefined}
                onClick={() => props.onAction(action)}
              >
                {labelFor(action.key)}
              </Button>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
}
