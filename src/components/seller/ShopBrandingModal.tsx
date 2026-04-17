import { createSignal, createEffect } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import type { Shop } from "~/lib/api/endpoints/seller-shop.api";

export interface ShopBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logoFile: File | null, bannerFile: File | null) => Promise<any>;
  shop: Shop | null;
  isSaving: boolean;
  shouldClose?: boolean;
}

export default function ShopBrandingModal(props: ShopBrandingModalProps) {
  const { t } = useI18n();
  const [logoFile, setLogoFile] = createSignal<File | null>(null);
  const [bannerFile, setBannerFile] = createSignal<File | null>(null);
  const [logoPreview, setLogoPreview] = createSignal<string | null>(null);
  const [bannerPreview, setBannerPreview] = createSignal<string | null>(null);

  // Close modal when parent signals success
  createEffect(() => {
    if (props.shouldClose) {
      props.onClose();
    }
  });

  // Set previews from existing shop data
  createEffect(() => {
    if (props.shop) {
      setLogoPreview(props.shop.logo?.url || null);
      setBannerPreview(props.shop.banner?.url || null);
    }
  });

  // Cleanup previews on unmount
  const cleanup = () => {
    if (logoPreview() && logoPreview()?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview()!);
    }
    if (bannerPreview() && bannerPreview()?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview()!);
    }
  };

  const handleLogoChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      if (logoPreview() && logoPreview()?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview()!);
      }
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      setBannerFile(file);
      // Create preview
      if (bannerPreview() && bannerPreview()?.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview()!);
      }
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      await props.onSave(logoFile(), bannerFile());
      // Cleanup previews
      cleanup();
      // Modal will close only if parent's createEffect sees success
    } catch (error) {
      console.error("Failed to update branding:", error);
    }
  };

  const handleClose = () => {
    cleanup();
    setLogoFile(null);
    setBannerFile(null);
    setLogoPreview(props.shop?.logo?.url || null);
    setBannerPreview(props.shop?.banner?.url || null);
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

          <div class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:border-terracotta-500 dark:hover:border-terracotta-500 transition-colors">
            {logoPreview() ? (
              <div class="relative group">
                <img
                  src={logoPreview()}
                  alt="Logo Preview"
                  class="w-32 h-32 rounded-xl object-cover shadow-lg"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <label class="cursor-pointer text-white text-sm font-medium">
                    Change Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      class="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label class="cursor-pointer text-center">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-terracotta-100 dark:bg-terracotta-900/30 flex items-center justify-center">
                  <svg class="w-8 h-8 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p class="text-gray-600 dark:text-gray-400 font-medium">Upload Logo</p>
                <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  class="hidden"
                />
              </label>
            )}
          </div>

          {/* Logo Requirements */}
          <div class="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Recommended: 500x500px, square format</span>
          </div>
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

          <div class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:border-forest-500 dark:hover:border-forest-500 transition-colors">
            {bannerPreview() ? (
              <div class="relative group w-full">
                <img
                  src={bannerPreview()}
                  alt="Banner Preview"
                  class="w-full h-48 rounded-xl object-cover shadow-lg"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <label class="cursor-pointer text-white text-sm font-medium">
                    Change Banner
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      class="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label class="cursor-pointer text-center">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center">
                  <svg class="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p class="text-gray-600 dark:text-gray-400 font-medium">Upload Banner</p>
                <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  class="hidden"
                />
              </label>
            )}
          </div>

          {/* Banner Requirements */}
          <div class="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Recommended: 1920x400px, landscape format</span>
          </div>
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
            disabled={!logoFile() && !bannerFile()}
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
