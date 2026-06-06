import { useI18n } from "~/i18n";
import { ShoppingBagIcon } from "~/components/icons";

export function OrdersLoading() {
  const { t } = useI18n();
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
      <ShoppingBagIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {t("buyer.orders.loading")}
      </h3>
      <p class="text-gray-500 dark:text-gray-400">{t("buyer.orders.loadingDescription")}</p>
    </div>
  );
}
