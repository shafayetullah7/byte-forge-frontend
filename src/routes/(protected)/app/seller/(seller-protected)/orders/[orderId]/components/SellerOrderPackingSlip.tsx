import { For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { SellerOrderDetail } from "~/lib/api/types/seller-orders.types";
import { formatAddressLines, formatPrice } from "./utils";

export function SellerOrderPackingSlip(props: { order: SellerOrderDetail }) {
  const { t } = useI18n();

  return (
    <section class="hidden print:block print:mt-8">
      <h2 class="text-lg font-bold mb-2">{t("seller.orders.detailPage.packingSlip")}</h2>
      <p class="font-mono text-sm mb-4">{props.order.orderNumber}</p>
      <Show when={props.order.notes}>
        {(notes) => (
          <p class="text-sm mb-4">
            {t("seller.orders.detailPage.buyerNotes")}: {notes()}
          </p>
        )}
      </Show>
      <Show when={props.order.address}>
        {(address) => (
          <pre class="text-sm whitespace-pre-wrap mb-4">{formatAddressLines(address())}</pre>
        )}
      </Show>
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2">{t("seller.orders.detailPage.items")}</th>
            <th class="text-right py-2">{t("seller.orders.detailPage.qty")}</th>
            <th class="text-right py-2">{t("seller.orders.detail.total")}</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.order.items}>
            {(item) => (
              <tr class="border-b">
                <td class="py-2">{item.productName}</td>
                <td class="text-right py-2">{item.quantity}</td>
                <td class="text-right py-2">{formatPrice(item.subtotal)}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </section>
  );
}
