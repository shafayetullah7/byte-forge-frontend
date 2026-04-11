import { createAsync, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { getMyShop, updateShop, submitShopForReview } from "~/lib/api/endpoints/seller-shop";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export default function EditShopPage() {
  const navigate = useNavigate();
  const shopData = createAsync(() => getMyShop());
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showConfirmModal, setShowConfirmModal] = createSignal(false);
  const [isMajorChange, setIsMajorChange] = createSignal(false);

  // Form state (simplified for demo)
  const [nameEn, setNameEn] = createSignal("");
  const [nameBn, setNameBn] = createSignal("");
  const [descriptionEn, setDescriptionEn] = createSignal("");
  const [descriptionBn, setDescriptionBn] = createSignal("");
  const [businessHours, setBusinessHours] = createSignal("");
  const [contactEmail, setContactEmail] = createSignal("");
  const [contactPhone, setContactPhone] = createSignal("");

  // Load existing data
  const shop = shopData();
  if (shop) {
    const en = shop.translations?.find(t => t.locale === "en");
    const bn = shop.translations?.find(t => t.locale === "bn");
    if (en) {
      setNameEn(en.name);
      setDescriptionEn(en.description);
      setBusinessHours(en.businessHours || "");
    }
    if (bn) {
      setNameBn(bn.name);
      setDescriptionBn(bn.description);
    }
  }

  const handleSubmit = async (isMajor: boolean) => {
    setIsMajorChange(isMajor);
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const dto = {
        translations: [
          { locale: "en", name: nameEn(), description: descriptionEn(), businessHours: businessHours() },
          { locale: "bn", name: nameBn(), description: descriptionBn() },
        ],
      };

      if (isMajorChange()) {
        await submitShopForReview(dto);
      } else {
        await updateShop(dto);
      }

      navigate("/seller/my-shop");
    } catch (error) {
      console.error("Failed to update shop:", error);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="edit shop" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Edit Shop
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Update your shop information
            </p>
          </div>

          <form class="space-y-6">
            {/* Shop Names */}
            <Card title="Shop Name (Requires Re-verification)">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Shop Name (English) *"
                    value={nameEn()}
                    onInput={(e) => setNameEn(e.currentTarget.value)}
                    required
                  />
                  <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ⚠ Changing name requires admin re-verification
                  </p>
                </div>
                <div>
                  <Input
                    label="Shop Name (Bengali) *"
                    value={nameBn()}
                    onInput={(e) => setNameBn(e.currentTarget.value)}
                    required
                  />
                  <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ⚠ Changing name requires admin re-verification
                  </p>
                </div>
              </div>
            </Card>

            {/* Descriptions */}
            <Card title="Description (Immediate Update)">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    value={descriptionEn()}
                    onInput={(e) => setDescriptionEn(e.currentTarget.value)}
                    rows={4}
                    class="w-full px-3 py-2 border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Bengali)
                  </label>
                  <textarea
                    value={descriptionBn()}
                    onInput={(e) => setDescriptionBn(e.currentTarget.value)}
                    rows={4}
                    class="w-full px-3 py-2 border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </Card>

            {/* Business Hours */}
            <Card title="Business Hours (Immediate Update)">
              <Input
                label="Business Hours"
                value={businessHours()}
                onInput={(e) => setBusinessHours(e.currentTarget.value)}
                placeholder="e.g., Mon-Sat 9AM-6PM"
              />
            </Card>

            {/* Contact Info */}
            <Card title="Contact Information (Immediate Update)">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={contactEmail()}
                  onInput={(e) => setContactEmail(e.currentTarget.value)}
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  value={contactPhone()}
                  onInput={(e) => setContactPhone(e.currentTarget.value)}
                />
              </div>
            </Card>

            {/* Submit Buttons */}
            <div class="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleSubmit(false)}
                loading={isSubmitting()}
              >
                Save Minor Changes
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => handleSubmit(true)}
                loading={isSubmitting()}
              >
                Submit Major Changes
              </Button>
            </div>
          </form>

          {/* Confirmation Modal */}
          <Modal
            isOpen={showConfirmModal()}
            onClose={() => setShowConfirmModal(false)}
            title={isMajorChange() ? "Submit for Review" : "Save Changes"}
          >
            <div class="space-y-4">
              {isMajorChange() ? (
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    You're submitting major changes (shop name) for admin review.
                  </p>
                  <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p class="text-sm text-amber-800 dark:text-amber-400">
                      ⚠ Your shop will be set to "Pending Verification" until admin approves the changes.
                    </p>
                  </div>
                </div>
              ) : (
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Your changes will be applied immediately.
                </p>
              )}
              <div class="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant={isMajorChange() ? "primary" : "outline"}
                  onClick={confirmSubmit}
                  loading={isSubmitting()}
                >
                  {isMajorChange() ? "Submit for Review" : "Save Changes"}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
