import { useI18n } from "~/i18n";
import Badge from "~/components/ui/Badge";
import { getOrderStatusLabel, getOrderStatusVariant } from "~/lib/orders/order-display.utils";

export function OrderStatusBadge(props: {
  status: string;
  paymentMethodKey?: string | null;
  labelOverride?: string;
  class?: string;
}) {
  const { t } = useI18n();

  return (
    <Badge variant={getOrderStatusVariant(props.status)} class={props.class}>
      {props.labelOverride ?? getOrderStatusLabel(props.status, t, props.paymentMethodKey)}
    </Badge>
  );
}
