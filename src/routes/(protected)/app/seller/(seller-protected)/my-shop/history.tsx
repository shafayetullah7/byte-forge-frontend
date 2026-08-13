import { createAsync } from "@solidjs/router";
import { For, Suspense } from "solid-js";
import Card from "~/components/ui/Card";
import Badge from "~/components/ui/Badge";
import { sellerShopApi } from "~/lib/api/endpoints/seller/shop-detail.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { useI18n } from "~/i18n";

const mockHistory = [
  {
    action: "submitted",
    previousStatus: "DRAFT",
    newStatus: "PENDING_VERIFICATION",
    createdAt: new Date("2026-04-01T10:30:00"),
    reason: null as string | null,
  },
  {
    action: "approved",
    previousStatus: "PENDING_VERIFICATION",
    newStatus: "APPROVED",
    createdAt: new Date("2026-04-02T14:00:00"),
    reason: null as string | null,
  },
  {
    action: "activated",
    previousStatus: "APPROVED",
    newStatus: "ACTIVE",
    createdAt: new Date("2026-04-02T15:00:00"),
    reason: null as string | null,
  },
];

const statusColors: Record<string, "default" | "forest" | "sage" | "terracotta" | "cream"> = {
  DRAFT: "default",
  PENDING_VERIFICATION: "sage",
  APPROVED: "forest",
  ACTIVE: "forest",
  INACTIVE: "default",
  REJECTED: "terracotta",
  SUSPENDED: "terracotta",
  DELETED: "default",
};

export default function VerificationHistoryPage() {
  const { t, locale } = useI18n();
  const shopData = createAsync(() => sellerShopApi.getMyShop());
  const history = mockHistory;

  const actionLabel = (action: string) => {
    const key = `seller.shop.historyPage.actions.${action}` as const;
    const label = t(key);
    return label === key ? action : label;
  };

  const formatDate = (date: Date) =>
    date.toLocaleString(locale() === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="verification history" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
        <div class="mx-auto max-w-4xl">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("seller.shop.historyPage.pageTitle")}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {t("seller.shop.historyPage.pageSubtitle")}
            </p>
          </div>

          <Suspense fallback={<div class="h-96 bg-cream-100 dark:bg-forest-800 animate-pulse rounded-2xl" />}>
            <div class="space-y-6">
              <Card title={t("seller.shop.historyPage.currentStatusTitle")}>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {shopData()?.translations?.find((row) => row.locale === "en")?.name
                        || t("seller.shop.historyPage.yourShop")}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {shopData()?.translations?.find((row) => row.locale === "bn")?.name}
                    </p>
                  </div>
                  <Badge variant={statusColors[shopData()?.status || "DRAFT"] || "default"}>
                    {shopData()?.status || "DRAFT"}
                  </Badge>
                </div>
              </Card>

              <Card title={t("seller.shop.historyPage.timelineTitle")}>
                <div class="space-y-6">
                  <For each={history}>
                    {(item, index) => (
                      <div class="flex gap-4">
                        <div class="flex flex-col items-center">
                          <div
                            class={`w-3 h-3 rounded-full ${
                              item.newStatus === "APPROVED" || item.newStatus === "ACTIVE"
                                ? "bg-green-500"
                                : item.newStatus === "REJECTED" || item.newStatus === "SUSPENDED"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                          {index() < history.length - 1 && (
                            <div class="w-px h-full bg-gray-200 dark:bg-forest-700 mt-2" />
                          )}
                        </div>

                        <div class="flex-1 pb-4">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="font-medium text-gray-900 dark:text-gray-100">
                                {actionLabel(item.action)}
                              </p>
                              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {item.previousStatus} →{" "}
                                <span class="font-medium">{item.newStatus}</span>
                              </p>
                            </div>
                            <p class="text-xs text-gray-500">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>

                          {item.reason && (
                            <div class="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                              <p class="text-sm text-amber-800 dark:text-amber-400">
                                {item.reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Card>

              {history.length === 0 && (
                <div class="text-center py-12">
                  <p class="text-gray-600 dark:text-gray-400">
                    {t("seller.shop.historyPage.empty")}
                  </p>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
