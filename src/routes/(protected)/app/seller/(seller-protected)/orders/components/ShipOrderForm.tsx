import { useI18n } from "~/i18n";
import Button from "~/components/ui/Button";
import { TruckIcon } from "~/components/icons";

export function ShipOrderForm(props: {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  loading: boolean;
  onCarrierChange: (value: string) => void;
  onTrackingChange: (value: string) => void;
  onEstimatedDeliveryChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();

  return (
    <div class="space-y-2 border rounded-xl p-4 border-gray-200 dark:border-forest-700">
      <h3 class="text-sm font-semibold">{t("seller.orders.detail.shipOrder")}</h3>
      <input
        placeholder={t("seller.orders.detail.carrierPlaceholder")}
        value={props.carrier}
        onInput={(e) => props.onCarrierChange(e.currentTarget.value)}
        class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm"
      />
      <input
        placeholder={t("seller.orders.detail.trackingPlaceholder")}
        value={props.trackingNumber}
        onInput={(e) => props.onTrackingChange(e.currentTarget.value)}
        class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm"
      />
      <input
        type="date"
        value={props.estimatedDelivery}
        onInput={(e) => props.onEstimatedDeliveryChange(e.currentTarget.value)}
        class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-sm"
        aria-label={t("seller.orders.detail.estimatedDelivery")}
      />
      <Button
        loading={props.loading}
        disabled={!props.carrier.trim() || !props.trackingNumber.trim()}
        onClick={props.onSubmit}
      >
        <TruckIcon class="w-4 h-4" />
        {t("seller.orders.detail.markShipped")}
      </Button>
    </div>
  );
}
