import { createAsync } from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import Card from "~/components/ui/Card";
import Badge from "~/components/ui/Badge";
import { ChevronRightIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { getSellerSubscriptionInvoices } from "~/lib/api/endpoints/seller/subscription.api";
import type { SubscriptionBillingProvider } from "~/lib/api/types/seller/subscription.types";
import { formatBdtAmount, formatSubscriptionDate } from "./subscription-formatters";

const PAGE_SIZE = 10;

const providerKeys = new Set(["none", "coupon", "stripe", "admin", "wallet"]);

export function SubscriptionInvoicesTable() {
  const { t, locale } = useI18n();
  const [page, setPage] = createSignal(1);

  const invoicesResponse = createAsync(
    () => getSellerSubscriptionInvoices({ page: page(), limit: PAGE_SIZE }),
    { deferStream: true },
  );

  const invoices = () => invoicesResponse()?.data ?? [];
  const meta = () => invoicesResponse()?.meta;
  const totalPages = () => meta()?.pages ?? 1;

  const providerLabel = (provider: string) => {
    const key = provider.toLowerCase();
    if (providerKeys.has(key)) {
      return t(`seller.subscription.provider.${key as SubscriptionBillingProvider}`);
    }
    return provider;
  };

  const emptyLabel = () => t("common.notAvailable");

  return (
    <Card
      title={t("seller.subscription.invoices.title")}
      description={t("seller.subscription.invoices.subtitle")}
    >
      <Suspense
        fallback={
          <div class="h-32 rounded-xl bg-cream-100 dark:bg-forest-900/30 animate-pulse" />
        }
      >
        <Show
          when={invoices().length > 0}
          fallback={
            <p class="text-sm text-gray-600 dark:text-gray-300 py-8 text-center">
              {t("seller.subscription.invoices.empty")}
            </p>
          }
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-cream-200 dark:border-forest-700 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th class="px-3 py-2">{t("seller.subscription.invoices.date")}</th>
                  <th class="px-3 py-2">{t("seller.subscription.invoices.amount")}</th>
                  <th class="px-3 py-2">{t("seller.subscription.invoices.source")}</th>
                  <th class="px-3 py-2">{t("seller.subscription.invoices.status")}</th>
                  <th class="px-3 py-2">{t("seller.subscription.invoices.periodEnd")}</th>
                  <th class="px-3 py-2">{t("seller.subscription.invoices.receipt")}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cream-100 dark:divide-forest-700">
                <For each={invoices()}>
                  {(invoice) => (
                    <tr class="text-sm">
                      <td class="px-3 py-3 text-gray-600 dark:text-gray-300">
                        {formatSubscriptionDate(
                          invoice.paidAt ?? invoice.createdAt,
                          locale(),
                          emptyLabel(),
                        )}
                      </td>
                      <td class="px-3 py-3 font-medium text-forest-800 dark:text-cream-50">
                        {formatBdtAmount(invoice.amountBdt, invoice.currency, locale())}
                      </td>
                      <td class="px-3 py-3 text-gray-600 dark:text-gray-300">
                        {providerLabel(invoice.provider)}
                      </td>
                      <td class="px-3 py-3">
                        <InvoiceStatusBadge status={invoice.status} />
                      </td>
                      <td class="px-3 py-3 text-gray-600 dark:text-gray-300">
                        {formatSubscriptionDate(invoice.periodEnd, locale(), emptyLabel())}
                      </td>
                      <td class="px-3 py-3">
                        <Show
                          when={invoice.receiptUrl}
                          fallback={
                            <span class="text-gray-400 dark:text-gray-500">{emptyLabel()}</span>
                          }
                        >
                          <a
                            href={invoice.receiptUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-forest-700 dark:text-forest-300 font-medium hover:underline"
                          >
                            {t("seller.subscription.invoices.viewReceipt")}
                          </a>
                        </Show>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <Show when={totalPages() > 1}>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {t("seller.subscription.invoices.page", page(), totalPages())}
              </p>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page() <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 disabled:opacity-50"
                  aria-label={t("common.previous")}
                >
                  <ChevronRightIcon class="w-4 h-4 rotate-180" />
                </button>
                <button
                  type="button"
                  disabled={page() >= totalPages()}
                  onClick={() => setPage((current) => Math.min(totalPages(), current + 1))}
                  class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 disabled:opacity-50"
                  aria-label={t("common.next")}
                >
                  <ChevronRightIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </Show>
        </Show>
      </Suspense>
    </Card>
  );
}

function InvoiceStatusBadge(props: { status: string }) {
  const { t } = useI18n();

  const variant =
    props.status === "PAID"
      ? "forest"
      : props.status === "PENDING"
        ? "sage"
        : "default";

  const statusKey = props.status.toLowerCase() as "paid" | "pending" | "failed" | "void";
  const label =
    statusKey === "paid" ||
    statusKey === "pending" ||
    statusKey === "failed" ||
    statusKey === "void"
      ? t(`seller.subscription.invoices.statusValues.${statusKey}`)
      : props.status;

  return <Badge variant={variant}>{label}</Badge>;
}
