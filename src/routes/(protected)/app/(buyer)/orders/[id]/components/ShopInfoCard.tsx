import { useI18n } from "~/i18n";
import { A } from "@solidjs/router";
import { ArrowTopRightOnSquareIcon } from "~/components/icons";

export function ShopInfoCard(props: { shopName: string; shopLogo: string | null; shopId: string }) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.seller")}
        </h3>
      </div>
      <div class="p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-forest-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {props.shopLogo ? (
              <img src={props.shopLogo} alt={props.shopName} class="w-full h-full object-cover" />
            ) : (
              <span class="text-sm font-bold text-gray-500 dark:text-gray-400">
                {(props.shopName || '?').charAt(0)}
              </span>
            )}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {props.shopName || 'Unknown Shop'}
            </p>
            <A
              href={`/app/shops/${props.shopId}`}
              class="text-xs text-forest-600 dark:text-forest-400 hover:underline flex items-center gap-0.5"
            >
              {t("buyer.orders.details.viewShop")}
              <ArrowTopRightOnSquareIcon class="w-3 h-3" />
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}
