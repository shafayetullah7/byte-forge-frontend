import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getSellerSubscription } from "~/lib/api/endpoints/seller/subscription.api";
import { getShopStatus } from "~/lib/context/shop-context";
import { SHOP_STATUS } from "~/lib/api/types/seller.types";
import { SELLER_SUBSCRIPTION_PATH } from "~/lib/subscription/subscription-gate-ui";

export function SubscriptionDashboardBanner() {
  const { t } = useI18n();
  const shopStatus = createAsync(() => getShopStatus(), { deferStream: true });
  const subscription = createAsync(() => getSellerSubscription(), { deferStream: true });

  const shouldShow = () => {
    const shop = shopStatus();
    const sub = subscription();
    if (!shop || !sub) return false;
    if (shop.status !== SHOP_STATUS.ACTIVE) return false;
    return !sub.active;
  };

  return (
    <Show when={shouldShow()}>
      <div class="mb-6 rounded-xl border border-terracotta-200 bg-terracotta-50 dark:border-terracotta-800 dark:bg-terracotta-900/20 px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p class="font-semibold text-forest-800 dark:text-cream-50">
            {t("seller.subscription.dashboardBanner.title")}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {t("seller.subscription.dashboardBanner.body")}
          </p>
        </div>
        <A
          href={SELLER_SUBSCRIPTION_PATH}
          class="inline-flex items-center justify-center rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800 transition-standard"
        >
          {t("seller.subscription.dashboardBanner.cta")}
        </A>
      </div>
    </Show>
  );
}
