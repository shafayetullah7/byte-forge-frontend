import { For } from "solid-js";
import { useI18n } from "~/i18n";
import {
  ShoppingBagIcon,
  PackageIcon,
  CheckCircleIcon,
  XCircleIcon,
  DollarSignIcon,
} from "~/components/icons";
import { formatTotal } from "./utils";

export function StatsLoading() {
  return (
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <For each={Array.from({ length: 5 })}>
        {() => (
          <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 animate-pulse" />
        )}
      </For>
    </div>
  );
}

export function StatsDisplay(props: {
  total: number;
  active: number;
  delivered: number;
  cancelled: number;
  totalSpent: string;
}) {
  const { t } = useI18n();

  return (
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("buyer.orders.stats.total")}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{props.total}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
            <ShoppingBagIcon class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("buyer.orders.stats.active")}</p>
            <p class="text-2xl font-bold text-cream-600 dark:text-cream-400 mt-1">{props.active}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cream-400 to-cream-500 flex items-center justify-center shadow-sm">
            <PackageIcon class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("buyer.orders.stats.delivered")}</p>
            <p class="text-2xl font-bold text-forest-600 dark:text-forest-400 mt-1">{props.delivered}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
            <CheckCircleIcon class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("buyer.orders.stats.cancelled")}</p>
            <p class="text-2xl font-bold text-terracotta-600 dark:text-terracotta-400 mt-1">{props.cancelled}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-500 flex items-center justify-center shadow-sm">
            <XCircleIcon class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t("buyer.orders.stats.spent")}</p>
            <p class="text-lg font-bold text-forest-600 dark:text-forest-400 mt-1">{formatTotal(props.totalSpent)}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
            <DollarSignIcon class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
