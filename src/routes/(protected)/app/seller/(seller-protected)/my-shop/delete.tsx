import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { sellerShopApi } from "~/lib/api/endpoints/seller/shop-detail.api";
import { createAsync } from "@solidjs/router";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export default function DeleteShopPage() {
  const navigate = useNavigate();
  const shopData = createAsync(() => sellerShopApi.getMyShop());
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [showConfirm, setShowConfirm] = createSignal(false);
  const [confirmText, setConfirmText] = createSignal("");
  const [hasPendingOrders, setHasPendingOrders] = createSignal(false);

  const handleDelete = async () => {
    if (confirmText() !== "DELETE") {
      alert("Please type 'DELETE' to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      // Check for pending orders (placeholder - orders module not implemented)
      // const orders = await checkPendingOrders();
      // if (orders.length > 0) {
      //   setHasPendingOrders(true);
      //   return;
      // }

      await sellerShopApi.delete();
      navigate("/seller");
    } catch (error) {
      console.error("Failed to delete shop:", error);
      alert("Failed to delete shop. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="delete shop" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-2xl mx-auto px-4">
          <Card title="Delete Shop">
            <div class="space-y-6">
              {/* Warning */}
              <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 class="font-semibold text-red-800 dark:text-red-400 mb-2">
                  ⚠️ Warning: This action cannot be undone
                </h3>
                <ul class="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                  <li>Your shop will be permanently deleted</li>
                  <li>All products will be deactivated</li>
                  <li>You cannot create a new shop for 30 days</li>
                  <li>Pending orders must be completed first</li>
                </ul>
              </div>

              {/* Pending Orders Check */}
              {hasPendingOrders() && (
                <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h3 class="font-semibold text-amber-800 dark:text-amber-400 mb-2">
                    Cannot Delete Shop
                  </h3>
                  <p class="text-sm text-amber-700 dark:text-amber-300">
                    You have pending orders that must be completed before deleting your shop.
                    Please complete or cancel all pending orders, or contact admin for assistance.
                  </p>
                </div>
              )}

              {/* Shop Info */}
              {shopData() && (
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Shop:</strong> {shopData()?.translations?.find(t => t.locale === "en")?.name}
                  </p>
                  <p>
                    <strong>Slug:</strong> {shopData()?.slug}
                  </p>
                  <p>
                    <strong>Status:</strong> {shopData()?.status}
                  </p>
                </div>
              )}

              {/* Confirmation */}
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type "DELETE" to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText()}
                  onInput={(e) => setConfirmText(e.currentTarget.value)}
                  class="w-full px-3 py-2 border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="DELETE"
                />
              </div>

              {/* Actions */}
              <div class="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => navigate("/seller/my-shop")}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  loading={isDeleting()}
                  disabled={confirmText() !== "DELETE" || hasPendingOrders()}
                >
                  Delete Shop
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
