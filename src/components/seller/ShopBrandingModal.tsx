import { createEffect } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Button from "~/components/ui/Button";
import { ImageUpload } from "~/components/ui";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import { useI18n } from "~/i18n";
import type { Shop } from "~/lib/api/endpoints/seller-shop.api";

export interface ShopBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logoId: string | undefined, bannerId: string | undefined) => Promise<any>;
  shop: Shop | null;
  isSaving: boolean;
  shouldClose?: boolean;
}

export default function ShopBrandingModal(props: ShopBrandingModalProps) {
  const { t } = useI18n();

  // Use the same image upload hook as setup-shop
  const logoUpload = useImageUpload({
    maxSizeMB: 5,
    onSuccess: () => {
      // Media ID is already stored in the hook
    },
  });

  const bannerUpload = useImageUpload({
    maxSizeMB: 10,
    onSuccess: () => {
      // Media ID is already stored in the hook
    },
  });

  // Close modal when parent signals success
  createEffect(() => {
    if (props.shouldClose) {
      props.onClose();
    }
  });

  const handleSubmit = async () => {
    try {
      // Pass media IDs to parent (not files)
      await props.onSave(logoUpload.mediaId() || undefined, bannerUpload.mediaId() || undefined);
      // Modal will close only if parent's createEffect sees success
    } catch (error) {
      console.error("Failed to update branding:", error);
    }
  };

  const handleClose = () => {
    // Clear uploads but don't delete media (user might want to keep them)
    logoUpload.clear();
    bannerUpload.clear();
    props.onClose();
  };

  return (
    <Modal 
      isOpen={props.isOpen} 
      onClose={handleClose} 
      title={t("seller.shop.myShop.branding.editTitle")}
      size="2xl"
    >
      <div class="overflow-y-auto px-1 space-y-6 custom-scrollbar" style="max-height: 70vh;">
        {/* Logo Upload Section */}
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h6 class="font-bold text-gray-900 dark:text-gray-100">{t("seller.shop.myShop.branding.logo")}</h6>
          </div>

          <ImageUpload
            preview={logoUpload.preview()}
            isUploading={logoUpload.isUploading()}
            isDeleting={logoUpload.isDeleting()}
            onFileSelect={logoUpload.upload}
            onDelete={logoUpload.deleteMedia}
            accept="image/*"
            maxSizeText="PNG, JPG up to 5MB"
            requirementsText="Recommended: 500x500px, square format"
          />
        </div>

        {/* Banner Upload Section */}
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h6 class="font-bold text-gray-900 dark:text-gray-100">{t("seller.shop.myShop.branding.banner")}</h6>
          </div>

          <ImageUpload
            preview={bannerUpload.preview()}
            isUploading={bannerUpload.isUploading()}
            isDeleting={bannerUpload.isDeleting()}
            onFileSelect={bannerUpload.upload}
            onDelete={bannerUpload.deleteMedia}
            accept="image/*"
            maxSizeText="PNG, JPG up to 10MB"
            requirementsText="Recommended: 1920x400px, landscape format"
          />
        </div>

        {/* Action Buttons */}
        <div class="flex gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={props.isSaving}
            class="flex-1"
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!logoUpload.mediaId() && !bannerUpload.mediaId()}
            loading={props.isSaving}
            class="flex-1"
          >
            {props.isSaving ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
