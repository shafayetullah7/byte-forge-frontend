import { createEffect } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import { createForm } from "@modular-forms/solid";
import { useI18n } from "~/i18n";
import type { Shop } from "~/lib/api/endpoints/seller-shop.api";
import { shopInfoSchema, type ShopInfoFormData } from "~/schemas/shop-info.schema";

export interface ShopInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    translations: {
      en: { name: string; description?: string; businessHours?: string };
      bn: { name: string; description?: string; businessHours?: string };
    };
  }) => Promise<any>;
  shop: Shop | null;
  isSaving?: boolean;
  shouldClose?: boolean;
}

export default function ShopInfoEditModal(props: ShopInfoEditModalProps) {
  const { t } = useI18n();

  // Close modal when parent signals success
  createEffect(() => {
    if (props.shouldClose) {
      props.onClose();
    }
  });

  // Get existing translations
  const enTranslation = () => props.shop?.translations?.find(t => t.locale === "en");
  const bnTranslation = () => props.shop?.translations?.find(t => t.locale === "bn");

  // Initialize form with existing shop data
  const [shopForm, { Form, Field }] = createForm<ShopInfoFormData>({
    initialValues: {
      nameEn: enTranslation()?.name || "",
      descriptionEn: enTranslation()?.description || "",
      businessHoursEn: enTranslation()?.businessHours || "",
      nameBn: bnTranslation()?.name || "",
      descriptionBn: bnTranslation()?.description || "",
      businessHoursBn: bnTranslation()?.businessHours || "",
    },
    validate: (values) => {
      const result = shopInfoSchema.safeParse(values);
      if (result.success) {
        return {};
      }
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const fieldPath = issue.path.join(".");
          const message = issue.message;
          errors[fieldPath] = message.includes(".") ? t(message) : message;
        }
      });
      return errors;
    },
  });

  const handleSubmit = async (values: ShopInfoFormData) => {
    try {
      await props.onSave({
        translations: {
          en: {
            name: values.nameEn.trim(),
            description: values.descriptionEn?.trim() || undefined,
            businessHours: values.businessHoursEn?.trim() || undefined,
          },
          bn: {
            name: values.nameBn.trim(),
            description: values.descriptionBn?.trim() || undefined,
            businessHours: values.businessHoursBn?.trim() || undefined,
          },
        },
      });
      // Modal will close only if parent's createEffect sees success
    } catch (error) {
      // Modal stays open on error
    }
  };

  return (
    <Modal 
      isOpen={props.isOpen} 
      onClose={props.onClose} 
      title={t("seller.shop.myShop.shopInfo.editTitle")}
      size="2xl"
    >
      <div class="overflow-y-auto px-1 space-y-4 custom-scrollbar" style="max-height: 70vh;">
        <Form onSubmit={handleSubmit} class="space-y-6">
          {/* Side-by-Side Language Columns */}
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* English Section */}
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
                  <span class="text-white text-xs font-bold">EN</span>
                </div>
                <h6 class="font-bold text-gray-900 dark:text-gray-100">{t("seller.shop.myShop.shopInfo.english")}</h6>
              </div>

              <Field name="nameEn">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.name")}
                    value={field.value || ""}
                    placeholder="My Shop"
                    error={field.error}
                    required
                  />
                )}
              </Field>

              <Field name="descriptionEn">
                {(field, props) => (
                  <Textarea
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.description")}
                    value={field.value || ""}
                    placeholder="Best shop in town..."
                    error={field.error}
                    rows={4}
                  />
                )}
              </Field>

              <Field name="businessHoursEn">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.businessHours")}
                    value={field.value || ""}
                    placeholder="9 AM - 9 PM"
                    error={field.error}
                  />
                )}
              </Field>
            </div>

            {/* Bengali Section */}
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
                  <span class="text-white text-xs font-bold">বা</span>
                </div>
                <h6 class="font-bold text-gray-900 dark:text-gray-100">{t("seller.shop.myShop.shopInfo.bengali")}</h6>
              </div>

              <Field name="nameBn">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.name")}
                    value={field.value || ""}
                    placeholder="আমার দোকান"
                    error={field.error}
                    required
                  />
                )}
              </Field>

              <Field name="descriptionBn">
                {(field, props) => (
                  <Textarea
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.description")}
                    value={field.value || ""}
                    placeholder="শহরের সেরা দোকান..."
                    error={field.error}
                    rows={4}
                  />
                )}
              </Field>

              <Field name="businessHoursBn">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.businessHours")}
                    value={field.value || ""}
                    placeholder="সকাল ৯টা - রাত ৯টা"
                    error={field.error}
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              type="button"
              onClick={props.onClose}
              disabled={props.isSaving}
              class="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={props.isSaving}
              class="flex-1"
            >
              {props.isSaving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
