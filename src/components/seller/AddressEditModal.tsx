import { createSignal, Show } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import type { ShopAddress } from "~/lib/api/endpoints/seller-shop.api";

export interface AddressFormData {
  // Non-translatable
  postalCode: string;
  latitude?: string;
  longitude?: string;
  googleMapsLink?: string;
  
  // English
  country: string;
  division: string;
  district: string;
  street: string;
  
  // Bengali
  bnCountry: string;
  bnDivision: string;
  bnDistrict: string;
  bnStreet: string;
}

export interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressFormData) => Promise<void>;
  address: ShopAddress | null;
}

export default function AddressEditModal(props: AddressEditModalProps) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  
  // Get existing translations
  const enTranslation = () => props.address?.translations?.find(t => t.locale === "en");
  const bnTranslation = () => props.address?.translations?.find(t => t.locale === "bn");
  
  // Form state
  const [formData, setFormData] = createSignal<AddressFormData>({
    postalCode: props.address?.postalCode || "",
    latitude: props.address?.latitude || "",
    longitude: props.address?.longitude || "",
    googleMapsLink: props.address?.googleMapsLink || "",
    country: enTranslation()?.country || "",
    division: enTranslation()?.division || "",
    district: enTranslation()?.district || "",
    street: enTranslation()?.street || "",
    bnCountry: bnTranslation()?.country || "",
    bnDivision: bnTranslation()?.division || "",
    bnDistrict: bnTranslation()?.district || "",
    bnStreet: bnTranslation()?.street || "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await props.onSave(formData());
      props.onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof AddressFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={props.isOpen} 
      onClose={props.onClose} 
      title={t("seller.shop.myShop.shopAddress.editTitle")}
      size="2xl"
      labelledBy="modal-title"
      describedBy="modal-description"
    >
      <div id="modal-description" class="sr-only">
        Edit your shop address information in both English and Bengali
      </div>
      {/* Scrollable Content Area */}
      <div class="overflow-y-auto px-1 space-y-4 custom-scrollbar">
          {/* English and Bengali Address Sections - Side by Side on large screens */}
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* English Address Section */}
            <div class="p-4 bg-cream-50 dark:bg-forest-900/30 rounded-xl border border-cream-200 dark:border-forest-700">
              <div class="flex items-center gap-3 mb-3 pb-2 border-b border-cream-200 dark:border-forest-700">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 text-white text-xs font-bold shadow-md flex-shrink-0">
                  EN
                </div>
                <h6 class="font-bold text-gray-900 dark:text-gray-100">
                  {t("seller.shop.myShop.shopAddress.englishAddress")}
                </h6>
              </div>
              
              <div class="space-y-2.5">
                <Input
                  label={t("seller.shop.myShop.shopAddress.country")}
                  value={formData().country}
                  onInput={(e) => updateField("country", e.currentTarget.value)}
                  placeholder="Bangladesh"
                  required
                />
                <Input
                  label={t("seller.shop.myShop.shopAddress.division")}
                  value={formData().division}
                  onInput={(e) => updateField("division", e.currentTarget.value)}
                  placeholder="Dhaka"
                  required
                />
                <Input
                  label={t("seller.shop.myShop.shopAddress.district")}
                  value={formData().district}
                  onInput={(e) => updateField("district", e.currentTarget.value)}
                  placeholder="Dhaka"
                  required
                />
                <Input
                  label={t("seller.shop.myShop.shopAddress.street")}
                  value={formData().street}
                  onInput={(e) => updateField("street", e.currentTarget.value)}
                  placeholder="House 123, Road 45, Dhanmondi"
                  required
                />
              </div>
            </div>

            {/* Bengali Address Section */}
            <div class="p-4 bg-cream-50 dark:bg-forest-900/30 rounded-xl border border-cream-200 dark:border-forest-700">
              <div class="flex items-center gap-3 mb-3 pb-2 border-b border-cream-200 dark:border-forest-700">
                <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white text-xs font-bold shadow-md flex-shrink-0">
                  বা
                </div>
                <h6 class="font-bold text-gray-900 dark:text-gray-100">
                  {t("seller.shop.myShop.shopAddress.bengaliAddress")}
                </h6>
              </div>
              
              <div class="space-y-2.5">
                <Input
                  label={t("seller.shop.myShop.shopAddress.country")}
                  value={formData().bnCountry}
                  onInput={(e) => updateField("bnCountry", e.currentTarget.value)}
                  placeholder="বাংলাদেশ"
                />
                <Input
                  label={t("seller.shop.myShop.shopAddress.division")}
                  value={formData().bnDivision}
                  onInput={(e) => updateField("bnDivision", e.currentTarget.value)}
                  placeholder="ঢাকা"
                />
                <Input
                  label={t("seller.shop.myShop.shopAddress.district")}
                  value={formData().bnDistrict}
                  onInput={(e) => updateField("bnDistrict", e.currentTarget.value)}
                  placeholder="ঢাকা"
                />
                <Input
                  label={t("seller.shop.myShop.shopAddress.street")}
                  value={formData().bnStreet}
                  onInput={(e) => updateField("bnStreet", e.currentTarget.value)}
                  placeholder="বাড়ি ১২৩, রোড ৪৫, ধানমন্ডি"
                />
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div class="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl border border-sage-200 dark:border-sage-800">
            <div class="flex items-center gap-3 mb-3 pb-2 border-b border-sage-200 dark:border-sage-800">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-md flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h6 class="font-bold text-gray-900 dark:text-gray-100">
                {t("seller.shop.myShop.shopAddress.locationDetails")}
              </h6>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label={t("seller.shop.myShop.shopAddress.postalCode")}
                value={formData().postalCode}
                onInput={(e) => updateField("postalCode", e.currentTarget.value)}
                placeholder="1209"
              />
              <Input
                label={t("seller.shop.myShop.shopAddress.googleMapsLink")}
                value={formData().googleMapsLink}
                onInput={(e) => updateField("googleMapsLink", e.currentTarget.value)}
                placeholder="https://maps.google.com/..."
                type="url"
              />
              <Input
                label={t("seller.shop.myShop.shopAddress.latitude")}
                value={formData().latitude}
                onInput={(e) => updateField("latitude", e.currentTarget.value)}
                placeholder="23.8103"
                type="number"
                step="0.0000000001"
              />
              <Input
                label={t("seller.shop.myShop.shopAddress.longitude")}
                value={formData().longitude}
                onInput={(e) => updateField("longitude", e.currentTarget.value)}
                placeholder="90.4125"
                type="number"
                step="0.0000000001"
              />
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div class="flex gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Button
            variant="outline"
            onClick={props.onClose}
            disabled={isSubmitting()}
            class="flex-1"
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting()}
            class="flex-1"
          >
            {isSubmitting() ? (
              <span class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              t("common.save")
            )}
          </Button>
        </div>
    </Modal>
  );
}
