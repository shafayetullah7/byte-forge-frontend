import { Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { SellerOrderStats } from "~/lib/api/types/seller-orders.types";
import { formatPrice } from "../components/utils";

export function SellerOrderStatsCards(props: { stats?: SellerOrderStats }) {
  const { t } = useI18n();

  return (
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">{t("seller.orders.stats.total")}</p>
        <p class="text-2xl font-bold mt-1">{props.stats?.total ?? "—"}</p>
      </div>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">{t("seller.orders.stats.pending")}</p>
        <p class="text-2xl font-bold mt-1 text-cream-600">{props.stats?.pending ?? "—"}</p>
      </div>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">{t("seller.orders.stats.delivered")}</p>
        <p class="text-2xl font-bold mt-1 text-forest-600">{props.stats?.delivered ?? "—"}</p>
      </div>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4">
        <p class="text-xs font-medium text-gray-500 uppercase">{t("seller.orders.stats.revenue")}</p>
        <p class="text-2xl font-bold mt-1">
          <Show when={props.stats} fallback="—">
            {(stats) => formatPrice(stats().revenue)}
          </Show>
        </p>
      </div>
    </div>
  );
}
