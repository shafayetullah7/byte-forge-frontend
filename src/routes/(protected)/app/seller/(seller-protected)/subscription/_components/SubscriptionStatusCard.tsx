import { Show } from "solid-js";
import Card from "~/components/ui/Card";
import Badge from "~/components/ui/Badge";
import { CalendarIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import type {
  SellerSubscription,
  SubscriptionBillingProvider,
  SubscriptionStatus,
} from "~/lib/api/types/seller/subscription.types";
import { formatSubscriptionDate } from "./subscription-formatters";

export interface SubscriptionStatusCardProps {
  subscription: SellerSubscription;
}

const statusBadgeVariant: Record<
  SubscriptionStatus,
  "forest" | "sage" | "terracotta" | "default"
> = {
  ACTIVE: "forest",
  EXPIRED: "terracotta",
  NONE: "default",
};

export function SubscriptionStatusCard(props: SubscriptionStatusCardProps) {
  const { t, locale } = useI18n();

  const statusLabel = () => {
    const key = props.subscription.status.toLowerCase() as "none" | "active" | "expired";
    return t(`seller.subscription.status.${key}`);
  };

  const providerLabel = (provider: SubscriptionBillingProvider) =>
    t(`seller.subscription.provider.${provider.toLowerCase() as "none" | "coupon" | "stripe" | "admin" | "wallet"}`);

  const StatusIcon = () => {
    if (props.subscription.status === "ACTIVE") {
      return <CheckCircleIcon class="w-8 h-8 text-white" />;
    }
    if (props.subscription.status === "EXPIRED") {
      return <XCircleIcon class="w-8 h-8 text-white" />;
    }
    return <ClockIcon class="w-8 h-8 text-white" />;
  };

  const iconBackground = () => {
    if (props.subscription.status === "ACTIVE") {
      return "bg-gradient-to-br from-forest-500 to-forest-600 shadow-lg shadow-forest-500/30";
    }
    if (props.subscription.status === "EXPIRED") {
      return "bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-lg shadow-terracotta-500/30";
    }
    return "bg-gradient-to-br from-sage-500 to-sage-600 shadow-lg shadow-sage-500/30";
  };

  return (
    <Card class="overflow-hidden">
      <div class="flex flex-col sm:flex-row sm:items-start gap-6">
        <div class={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${iconBackground()}`}>
          <StatusIcon />
        </div>

        <div class="flex-1 space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50">
              {t("seller.subscription.status.title")}
            </h2>
            <Badge variant={statusBadgeVariant[props.subscription.status]}>{statusLabel()}</Badge>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300">
            {props.subscription.active
              ? t("seller.subscription.status.activeDescription")
              : props.subscription.status === "EXPIRED"
                ? t("seller.subscription.status.expiredDescription")
                : t("seller.subscription.status.noneDescription")}
          </p>

          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="rounded-xl border border-cream-200 dark:border-forest-700 bg-cream-50/60 dark:bg-forest-900/30 p-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                <CalendarIcon class="w-4 h-4" />
                {t("seller.subscription.status.activeUntil")}
              </dt>
              <dd class="mt-2 text-base font-semibold text-forest-800 dark:text-cream-50">
                {formatSubscriptionDate(
                  props.subscription.currentPeriodEnd,
                  locale(),
                  t("common.notAvailable"),
                )}
              </dd>
            </div>

            <div class="rounded-xl border border-cream-200 dark:border-forest-700 bg-cream-50/60 dark:bg-forest-900/30 p-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("seller.subscription.status.billingProvider")}
              </dt>
              <dd class="mt-2 text-base font-semibold text-forest-800 dark:text-cream-50">
                {providerLabel(props.subscription.billingProvider)}
              </dd>
            </div>
          </dl>

          <Show when={props.subscription.cancelAtPeriodEnd}>
            <p class="text-sm text-terracotta-700 dark:text-terracotta-300 bg-terracotta-50 dark:bg-terracotta-900/20 border border-terracotta-200 dark:border-terracotta-800 rounded-xl px-4 py-3">
              {t("seller.subscription.status.cancelAtPeriodEnd")}
            </p>
          </Show>
        </div>
      </div>
    </Card>
  );
}
