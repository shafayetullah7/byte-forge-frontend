import { createSignal, createEffect } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { createForm } from "@modular-forms/solid";
import { useI18n } from "~/i18n";
import type { Shop, UpdateShopInfoDto } from "~/lib/api/endpoints/seller-shop.api";
import { shopInfoSchema, type ShopInfoFormData } from "~/schemas/shop-info.schema";

export interface ShopInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateShopInfoDto) => Promise<any>;
  shop: Shop | null;
  isSaving: boolean;
  shouldClose?: boolean;
}

export default function ShopInfoEditModal(props: ShopInfoEditModalProps) {
  const { t } = useI18n();
  const [hasSubmitted, setHasSubmitted] = createSignal(false);
  const [logoFile, setLogoFile] = createSignal<File | null>(null);
  const [bannerFile, setBannerFile] = createSignal<File | null>(null);

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
      slug: props.shop?.slug || "",
      nameEn: enTranslation()?.name || "",
      descriptionEn: enTranslation()?.description || "",
      businessHoursEn: enTranslation()?.businessHours || "",
      nameBn: bnTranslation()?.name || "",
      descriptionBn: bnTranslation()?.description || "",
      businessHoursBn: bnTranslation()?.businessHours || "",
      primaryColor: props.shop?.primaryColor || "",
      secondaryColor: props.shop?.secondaryColor || "",
      accentColor: props.shop?.accentColor || "",
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
    setHasSubmitted(true);
    
    // Prepare DTO
    const dto: UpdateShopInfoDto = {
      slug: values.slug.trim() || undefined,
      branding: {
        primaryColor: values.primaryColor || undefined,
        secondaryColor: values.secondaryColor || undefined,
        accentColor: values.accentColor || undefined,
      },
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
    };
    
    try {
      await props.onSave(dto);
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
          {/* Shop Name Section (Bilingual) */}
          <div>
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* English */}
              <div class="space-y-4">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
                    <span class="text-white text-xs font-bold">EN</span>
                  </div>
                  <h6 class="font-bold text-gray-900 dark:text-gray-100">English</h6>
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
                    <Input
                      {...props}
                      label={t("seller.shop.myShop.shopInfo.description")}
                      value={field.value || ""}
                      placeholder="Best shop in town..."
                      error={field.error}
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

              {/* Bengali */}
              <div class="space-y-4">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
                    <span class="text-white text-xs font-bold">বা</span>
                  </div>
                  <h6 class="font-bold text-gray-900 dark:text-gray-100">বাংলা</h6>
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
                    <Input
                      {...props}
                      label={t("seller.shop.myShop.shopInfo.description")}
                      value={field.value || ""}
                      placeholder="শহরের সেরা দোকান..."
                      error={field.error}
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
          </div>

          {/* Branding Colors Section */}
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h6 class="font-bold text-gray-900 dark:text-gray-100">{t("seller.shop.myShop.shopInfo.brandingColors")}</h6>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field name="primaryColor">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.primaryColor")}
                    value={field.value || ""}
                    placeholder="#FF5733"
                    type="color"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="secondaryColor">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.secondaryColor")}
                    value={field.value || ""}
                    placeholder="#33FF57"
                    type="color"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="accentColor">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.shopInfo.accentColor")}
                    value={field.value || ""}
                    placeholder="#3357FF"
                    type="color"
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
              disabled={props.isSaving}
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
