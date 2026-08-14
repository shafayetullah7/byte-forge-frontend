import { useNavigate, createAsync, useAction } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { toaster } from "~/components/ui/Toast";
import { getShop } from "~/lib/context/shop-context";
import { deleteShopAction } from "./shop.actions";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { useI18n } from "~/i18n";

const DELETE_CONFIRM = "DELETE";

export default function DeleteShopPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const shopData = createAsync(() => getShop(), { deferStream: true });
  const deleteShopTrigger = useAction(deleteShopAction);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [confirmText, setConfirmText] = createSignal("");
  const [hasPendingOrders] = createSignal(false);

  const handleDelete = async () => {
    if (confirmText() !== DELETE_CONFIRM) {
      toaster.error(t("seller.shop.deletePage.confirmTypeMismatch"));
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteShopTrigger();
      if (result?.success === true) {
        navigate("/app/seller");
      } else {
        toaster.error(result?.error?.message ?? t("seller.shop.deletePage.deleteFailed"));
      }
    } catch {
      toaster.error(t("seller.shop.deletePage.deleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  const shopName = () =>
    shopData()?.translations?.find((row) => row.locale === "en")?.name ?? "";

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="delete shop" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
        <div class="mx-auto max-w-2xl">
          <Card title={t("seller.shop.deletePage.pageTitle")}>
            <div class="space-y-6">
              <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 class="font-semibold text-red-800 dark:text-red-400 mb-2">
                  {t("seller.shop.deletePage.warningTitle")}
                </h3>
                <ul class="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                  <li>{t("seller.shop.deletePage.warningItem1")}</li>
                  <li>{t("seller.shop.deletePage.warningItem2")}</li>
                  <li>{t("seller.shop.deletePage.warningItem3")}</li>
                  <li>{t("seller.shop.deletePage.warningItem4")}</li>
                </ul>
              </div>

              <Show when={hasPendingOrders()}>
                <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h3 class="font-semibold text-amber-800 dark:text-amber-400 mb-2">
                    {t("seller.shop.deletePage.cannotDeleteTitle")}
                  </h3>
                  <p class="text-sm text-amber-700 dark:text-amber-300">
                    {t("seller.shop.deletePage.cannotDeleteBody")}
                  </p>
                </div>
              </Show>

              <Show when={shopData()}>
                {(shop) => (
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <strong>{t("seller.shop.deletePage.shopLabel")}:</strong> {shopName()}
                    </p>
                    <p>
                      <strong>{t("seller.shop.deletePage.slugLabel")}:</strong> {shop().slug}
                    </p>
                    <p>
                      <strong>{t("seller.shop.deletePage.statusLabel")}:</strong> {shop().status}
                    </p>
                  </div>
                )}
              </Show>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("seller.shop.deletePage.confirmPrompt")}
                </label>
                <input
                  type="text"
                  value={confirmText()}
                  onInput={(e) => setConfirmText(e.currentTarget.value)}
                  class="w-full px-3 py-2 border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={t("seller.shop.deletePage.confirmPlaceholder")}
                />
              </div>

              <div class="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => navigate("/app/seller/my-shop")}
                >
                  {t("seller.shop.deletePage.cancel")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  loading={isDeleting()}
                  disabled={confirmText() !== DELETE_CONFIRM || hasPendingOrders()}
                >
                  {t("seller.shop.deletePage.deleteButton")}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
