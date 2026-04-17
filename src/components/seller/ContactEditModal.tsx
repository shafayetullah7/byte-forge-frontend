import { createSignal, createEffect } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { createForm } from "@modular-forms/solid";
import { useI18n } from "~/i18n";
import type { ShopContact, UpdateContactDto } from "~/lib/api/endpoints/seller-shop.api";
import { contactSchema, type ContactFormData } from "~/schemas/contact.schema";

export interface ContactEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateContactDto) => Promise<any>;
  contact: ShopContact | null;
  isSaving?: boolean;
  shouldClose?: boolean;
}

export default function ContactEditModal(props: ContactEditModalProps) {
  const { t } = useI18n();
  const [hasSubmitted, setHasSubmitted] = createSignal(false);

  // Close modal when parent signals success
  createEffect(() => {
    if (props.shouldClose) {
      props.onClose();
    }
  });

  // Initialize form with existing contact data
  const [contactForm, { Form, Field }] = createForm<ContactFormData>({
    initialValues: {
      businessEmail: props.contact?.businessEmail || "",
      phone: props.contact?.phone || "",
      alternativePhone: props.contact?.alternativePhone || "",
      whatsapp: props.contact?.whatsapp || "",
      telegram: props.contact?.telegram || "",
      facebook: props.contact?.facebook || "",
      instagram: props.contact?.instagram || "",
      x: props.contact?.x || "",
    },
    validate: (values) => {
      const result = contactSchema.safeParse(values);
      if (result.success) {
        return {};
      }
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const fieldPath = issue.path.join(".");
          // Translate error messages using i18n
          const message = issue.message;
          errors[fieldPath] = message.includes(".") ? t(message) : message;
        }
      });
      return errors;
    },
  });

  const handleSubmit = async (values: ContactFormData) => {
    setHasSubmitted(true);
    
    // Clean up empty strings to undefined for optional fields
    const cleanedData: UpdateContactDto = {};
    (Object.keys(values) as Array<keyof ContactFormData>).forEach((key) => {
      const value = values[key];
      if (value && typeof value === 'string' && value.trim() !== '') {
        cleanedData[key] = value.trim();
      }
    });
    
    try {
      await props.onSave(cleanedData);
      // Modal will close only if parent's createEffect sees success
    } catch (error) {
      // Modal stays open on error
    }
  };

  // Section header component
  const SectionHeader = (props: { icon: string; title: string }) => (
    <div class="flex items-center gap-2 mb-4">
      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={props.icon} />
        </svg>
      </div>
      <h6 class="font-bold text-gray-900 dark:text-gray-100">{props.title}</h6>
    </div>
  );

  return (
    <Modal 
      isOpen={props.isOpen} 
      onClose={props.onClose} 
      title={t("seller.shop.myShop.contactAndSocial.editTitle")}
      size="2xl"
    >
      <div class="overflow-y-auto px-1 space-y-4 custom-scrollbar" style="max-height: 70vh;">
        <Form onSubmit={handleSubmit} class="space-y-6">
          {/* Contact Information Section */}
          <div>
            <SectionHeader
              icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              title={t("seller.shop.myShop.contactAndSocial.contactDetails")}
            />

            <div class="space-y-4">
              <Field name="businessEmail">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.email")}
                    value={field.value || ""}
                    placeholder="shop@example.com"
                    type="email"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="phone">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.phone")}
                    value={field.value || ""}
                    placeholder="+8801XXXXXXXXX"
                    type="tel"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="alternativePhone">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.alternativePhone")}
                    value={field.value || ""}
                    placeholder="+8801XXXXXXXXX"
                    type="tel"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="whatsapp">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.whatsapp")}
                    value={field.value || ""}
                    placeholder="+8801XXXXXXXXX"
                    type="tel"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="telegram">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.telegram")}
                    value={field.value || ""}
                    placeholder="@username"
                    error={field.error}
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <SectionHeader
              icon="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.5-1.5"
              title={t("seller.shop.myShop.contactAndSocial.socialMedia")}
            />

            <div class="space-y-4">
              <Field name="facebook">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.facebook")}
                    value={field.value || ""}
                    placeholder="https://facebook.com/your-page"
                    type="url"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="instagram">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.instagram")}
                    value={field.value || ""}
                    placeholder="https://instagram.com/your-profile"
                    type="url"
                    error={field.error}
                  />
                )}
              </Field>

              <Field name="x">
                {(field, props) => (
                  <Input
                    {...props}
                    label={t("seller.shop.myShop.contactAndSocial.x")}
                    value={field.value || ""}
                    placeholder="https://twitter.com/your-profile"
                    type="url"
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
