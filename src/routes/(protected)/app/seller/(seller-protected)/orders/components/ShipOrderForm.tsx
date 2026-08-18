import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import Button from "~/components/ui/Button";
import { Input, Select, Textarea } from "~/components/ui";
import { TruckIcon } from "~/components/icons";
import type { ShippingMethod } from "~/lib/api/types/seller-orders.types";

export function ShipOrderForm(props: {
  shippingMethod: ShippingMethod;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  notes: string;
  loading: boolean;
  disabled?: boolean;
  disabledReason?: string | null;
  onShippingMethodChange: (value: ShippingMethod) => void;
  onCarrierChange: (value: string) => void;
  onTrackingChange: (value: string) => void;
  onEstimatedDeliveryChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();

  const isCourier = () => props.shippingMethod === "COURIER";

  const canSubmit = () => {
    if (isCourier()) {
      return props.carrier.trim() && props.trackingNumber.trim();
    }
    return true;
  };

  return (
    <div class="space-y-3 border rounded-xl p-4 border-gray-200 dark:border-forest-700">
      <h3 class="text-sm font-semibold">{t("seller.orders.detailPage.shipOrderSection")}</h3>

      <Select
        size="sm"
        label={t("seller.orders.detailPage.shippingMethodLabel")}
        value={props.shippingMethod}
        onChange={(e) =>
          props.onShippingMethodChange(e.currentTarget.value as ShippingMethod)
        }
        options={[
          { value: "COURIER", label: t("seller.orders.detailPage.shippingMethodCourier") },
          { value: "SELF_DELIVERY", label: t("seller.orders.detailPage.shippingMethodSelfDelivery") },
          { value: "CUSTOMER_PICKUP", label: t("seller.orders.detailPage.shippingMethodPickup") },
        ]}
      />

      <Show when={isCourier()}>
        <Input
          size="sm"
          placeholder={t("seller.orders.detailPage.courierNameLabel")}
          value={props.carrier}
          onInput={(e) => props.onCarrierChange(e.currentTarget.value)}
        />
        <Input
          size="sm"
          placeholder={t("seller.orders.detail.trackingPlaceholder")}
          value={props.trackingNumber}
          onInput={(e) => props.onTrackingChange(e.currentTarget.value)}
        />
      </Show>

      <Input
        size="sm"
        type="date"
        value={props.estimatedDelivery}
        onInput={(e) => props.onEstimatedDeliveryChange(e.currentTarget.value)}
        aria-label={t("seller.orders.detail.estimatedDelivery")}
      />

      <Textarea
        size="sm"
        placeholder={t("seller.orders.detailPage.noteTobuyer")}
        value={props.notes}
        onInput={(e) => props.onNotesChange(e.currentTarget.value)}
        class="min-h-16"
        rows={3}
      />

      <Button
        loading={props.loading}
        disabled={props.disabled || !canSubmit()}
        title={props.disabled ? props.disabledReason ?? undefined : undefined}
        onClick={props.onSubmit}
      >
        <TruckIcon class="w-4 h-4" />
        {t("seller.orders.detail.markShipped")}
      </Button>
    </div>
  );
}
