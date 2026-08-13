import { createAsync, useNavigate, useAction } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Card from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { toaster } from "~/components/ui/Toast";
import { getShop } from "~/lib/context/shop-context";
import {
  submitShopForReviewAction,
  updateShopInfoAction,
} from "./shop.actions";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { useI18n } from "~/i18n";

export default function EditShopPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const shopData = createAsync(() => getShop());
  const updateShopTrigger = useAction(updateShopInfoAction);
  const submitForReviewTrigger = useAction(submitShopForReviewAction);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showConfirmModal, setShowConfirmModal] = createSignal(false);
  const [isMajorChange, setIsMajorChange] = createSignal(false);

  const [nameEn, setNameEn] = createSignal("");
  const [nameBn, setNameBn] = createSignal("");
  const [descriptionEn, setDescriptionEn] = createSignal("");
  const [descriptionBn, setDescriptionBn] = createSignal("");
  const [businessHours, setBusinessHours] = createSignal("");
  const [contactEmail, setContactEmail] = createSignal("");
  const [contactPhone, setContactPhone] = createSignal("");

  createEffect(() => {
    const shop = shopData();
    if (!shop) return;

    const en = shop.translations?.find((row) => row.locale === "en");
    const bn = shop.translations?.find((row) => row.locale === "bn");
    if (en) {
      setNameEn(en.name);
      setDescriptionEn(en.description ?? "");
      setBusinessHours(en.businessHours || "");
    }
    if (bn) {
      setNameBn(bn.name);
      setDescriptionBn(bn.description ?? "");
    }
    setContactEmail(shop.contact?.businessEmail ?? "");
    setContactPhone(shop.contact?.phone ?? "");
  });

  const handleSubmit = (isMajor: boolean) => {
    setIsMajorChange(isMajor);
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const dto = {
        translations: {
          en: {
            name: nameEn(),
            description: descriptionEn(),
            businessHours: businessHours(),
          },
          bn: {
            name: nameBn(),
            description: descriptionBn(),
          },
        },
      };

      const result = isMajorChange()
        ? await submitForReviewTrigger(dto)
        : await updateShopTrigger(dto);

      if (result?.success === true) {
        navigate("/app/seller/my-shop");
      } else {
        toaster.error(result?.error?.message ?? t("seller.shop.editPage.updateFailed"));
      }
    } catch {
      toaster.error(t("seller.shop.editPage.updateFailed"));
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
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
        <div class="mx-auto max-w-4xl">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("seller.shop.editPage.pageTitle")}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {t("seller.shop.editPage.pageSubtitle")}
            </p>
          </div>

          <form class="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Card title={t("seller.shop.editPage.nameCardTitle")}>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label={t("seller.shop.editPage.nameEnLabel")}
                    value={nameEn()}
                    onInput={(e) => setNameEn(e.currentTarget.value)}
                    required
                  />
                  <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {t("seller.shop.editPage.nameChangeWarning")}
                  </p>
                </div>
                <div>
                  <Input
                    label={t("seller.shop.editPage.nameBnLabel")}
                    value={nameBn()}
                    onInput={(e) => setNameBn(e.currentTarget.value)}
                    required
                  />
                  <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {t("seller.shop.editPage.nameChangeWarning")}
                  </p>
                </div>
              </div>
            </Card>

            <Card title={t("seller.shop.editPage.descriptionCardTitle")}>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seller.shop.editPage.descriptionEnLabel")}
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
                    {t("seller.shop.editPage.descriptionBnLabel")}
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

            <Card title={t("seller.shop.editPage.businessHoursCardTitle")}>
              <Input
                label={t("seller.shop.editPage.businessHoursLabel")}
                value={businessHours()}
                onInput={(e) => setBusinessHours(e.currentTarget.value)}
                placeholder={t("seller.shop.editPage.businessHoursPlaceholder")}
              />
            </Card>

            <Card title={t("seller.shop.editPage.contactCardTitle")}>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t("seller.shop.editPage.contactEmailLabel")}
                  type="email"
                  value={contactEmail()}
                  onInput={(e) => setContactEmail(e.currentTarget.value)}
                />
                <Input
                  label={t("seller.shop.editPage.contactPhoneLabel")}
                  type="tel"
                  value={contactPhone()}
                  onInput={(e) => setContactPhone(e.currentTarget.value)}
                />
              </div>
            </Card>

            <div class="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleSubmit(false)}
                loading={isSubmitting()}
              >
                {t("seller.shop.editPage.saveMinorChanges")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => handleSubmit(true)}
                loading={isSubmitting()}
              >
                {t("seller.shop.editPage.submitMajorChanges")}
              </Button>
            </div>
          </form>

          <Modal
            isOpen={showConfirmModal()}
            onClose={() => setShowConfirmModal(false)}
            title={isMajorChange()
              ? t("seller.shop.editPage.modalSubmitTitle")
              : t("seller.shop.editPage.modalSaveTitle")}
          >
            <div class="space-y-4">
              <Show
                when={isMajorChange()}
                fallback={
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {t("seller.shop.editPage.modalMinorBody")}
                  </p>
                }
              >
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t("seller.shop.editPage.modalMajorBody")}
                  </p>
                  <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p class="text-sm text-amber-800 dark:text-amber-400">
                      {t("seller.shop.editPage.modalMajorWarning")}
                    </p>
                  </div>
                </div>
              </Show>
              <div class="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant={isMajorChange() ? "primary" : "outline"}
                  onClick={confirmSubmit}
                  loading={isSubmitting()}
                >
                  {isMajorChange()
                    ? t("seller.shop.editPage.modalSubmitTitle")
                    : t("seller.shop.editPage.modalSaveTitle")}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
