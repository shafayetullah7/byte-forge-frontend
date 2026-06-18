import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import Button from "~/components/ui/Button";
import { toaster } from "~/components/ui/Toast";
import type { SellerOrderDetail } from "~/lib/api/types/seller-orders.types";
import { copyToClipboard, formatPrice } from "./utils";

export function SellerOrderCustomerCard(props: {
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
}) {
  const { t } = useI18n();

  const handleCopyPhone = async () => {
    const copied = await copyToClipboard(props.customerPhone);
    if (copied) {
      toaster.success(t("seller.orders.detailPage.copy"));
    }
  };

  return (
    <section class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm p-5">
      <h2 class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
        {t("seller.orders.detail.customer")}
      </h2>
      <p class="text-sm font-medium text-gray-900 dark:text-white">{props.customerName}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{props.customerEmail ?? "—"}</p>
      <div class="flex items-center justify-between gap-2 mt-1">
        <p class="text-sm text-gray-600 dark:text-gray-300">{props.customerPhone || "—"}</p>
        <Show when={props.customerPhone}>
          <Button variant="outline" size="sm" onClick={handleCopyPhone}>
            {t("seller.orders.detailPage.copy")}
          </Button>
        </Show>
      </div>
    </section>
  );
}

export function SellerOrderShippingCard(props: { address: SellerOrderDetail["address"] }) {
  const { t } = useI18n();

  return (
    <Show when={props.address}>
      {(address) => {
        const formatted = [
          address().recipientName,
          address().companyName,
          address().addressLine1,
          address().addressLine2,
          [address().city, address().state, address().postalCode].filter(Boolean).join(", "),
          address().country,
          address().phone,
        ]
          .filter(Boolean)
          .join("\n");

        return (
          <section class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm p-5">
            <div class="flex items-center justify-between gap-2 mb-3">
              <h2 class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("seller.orders.detail.shipping")}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const copied = await copyToClipboard(formatted);
                  if (copied) toaster.success(t("seller.orders.detailPage.copy"));
                }}
              >
                {t("seller.orders.detailPage.copy")}
              </Button>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>{address().recipientName}</p>
              <Show when={address().companyName}>
                {(company) => <p>{company()}</p>}
              </Show>
              <p>{address().addressLine1}</p>
              <Show when={address().addressLine2}>
                {(line) => <p>{line()}</p>}
              </Show>
              <p>
                {[address().city, address().state, address().postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>{address().country}</p>
              <p>{address().phone}</p>
              <Show when={address().deliveryInstructions}>
                {(instructions) => (
                  <p class="mt-2 text-cream-700 dark:text-cream-300">
                    {t("seller.orders.detailPage.deliveryInstructions")}: {instructions()}
                  </p>
                )}
              </Show>
            </div>
          </section>
        );
      }}
    </Show>
  );
}

export function SellerOrderSummaryCard(props: {
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
}) {
  const { t } = useI18n();

  return (
    <section class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm p-5 space-y-2">
      <h2 class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
        {t("seller.orders.detailPage.summary")}
      </h2>
      <div class="flex justify-between text-sm">
        <span>{t("seller.orders.detail.subtotal")}</span>
        <span>{formatPrice(props.subtotal)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>{t("seller.orders.detail.shippingCost")}</span>
        <span>{formatPrice(props.shippingCost)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>{t("seller.orders.detailPage.tax")}</span>
        <span>{formatPrice(props.tax)}</span>
      </div>
      <div class="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-forest-700">
        <span>{t("seller.orders.detail.total")}</span>
        <span>{formatPrice(props.total)}</span>
      </div>
    </section>
  );
}
