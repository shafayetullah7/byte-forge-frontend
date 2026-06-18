import { Show } from "solid-js";
import type { OrderPaymentFields } from "~/lib/api/types/order.types";
import { getPaymentMethodLabel } from "~/lib/orders/order-display.utils";
import Badge from "~/components/ui/Badge";

export function PaymentMethodBadge(props: OrderPaymentFields & { class?: string }) {
  const label = () => getPaymentMethodLabel(props);

  return (
    <span class={`inline-flex items-center gap-2 ${props.class ?? ""}`}>
      <Show when={props.paymentMethodLogoUrl}>
        {(logoUrl) => (
          <img
            src={logoUrl()}
            alt={label()}
            class="w-5 h-5 object-contain rounded"
          />
        )}
      </Show>
      <Badge variant="default">{label()}</Badge>
    </span>
  );
}
