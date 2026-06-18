import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import { XCircleIcon } from "~/components/icons";
import { formatFullDate } from "./utils";

export function SellerOrderCancelledBanner(props: {
  status: string;
  cancelledReason: string | null;
  cancelledAt: string | null;
}) {
  const { t } = useI18n();
  const isCancelled = props.status === "CANCELLED" || props.status === "EXPIRED";

  return (
    <Show when={isCancelled}>
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-start gap-3">
          <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-semibold text-red-800 dark:text-red-300">
              {props.status === "EXPIRED"
                ? t("seller.orders.detailPage.expiredBanner")
                : t("seller.orders.detailPage.cancelledBanner")}
            </p>
            <Show when={props.cancelledReason}>
              {(reason) => (
                <p class="text-sm text-red-600 dark:text-red-400 mt-1">{reason()}</p>
              )}
            </Show>
            <Show when={props.cancelledAt}>
              {(date) => (
                <p class="text-xs text-red-500 dark:text-red-400 mt-1">
                  {t("seller.orders.detailPage.cancelledOn")} {formatFullDate(date())}
                </p>
              )}
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
