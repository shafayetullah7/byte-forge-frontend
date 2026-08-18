import { createSignal } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { FieldGroup, Select, fieldControlClass } from "~/components/ui";
import { createStore } from "solid-js/store";
import { useI18n } from "~/i18n";
import type { ShopAddress, UpdateAddressDto } from "~/lib/api/endpoints/seller/shop-detail.api";
import { AddressFormData, addressSchema } from "~/schemas/address.schema";
import { BANGLADESH } from "~/data/bangladesh-addresses";

export interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateAddressDto) => Promise<any>;
  address: ShopAddress | null;
  isSaving?: boolean;
}

export default function AddressEditModal(props: AddressEditModalProps) {
  const { t } = useI18n();
  const [errors, setErrors] = createSignal<Record<string, string>>({});

  // Get existing translations
  const enTranslation = () => props.address?.translations?.find(t => t.locale === "en");
  const bnTranslation = () => props.address?.translations?.find(t => t.locale === "bn");

  // Form state using createStore for nested reactivity (like setup-shop)
  const [formData, setFormData] = createStore<AddressFormData>({
    postalCode: props.address?.postalCode || "",
    latitude: props.address?.latitude || "",
    longitude: props.address?.longitude || "",
    googleMapsLink: props.address?.googleMapsLink || "",
    translations: {
      en: {
        country: enTranslation()?.country || "Bangladesh",
        division: enTranslation()?.division || "",
        district: enTranslation()?.district || "",
        street: enTranslation()?.street || "",
      },
      bn: {
        country: bnTranslation()?.country || "বাংলাদেশ",
        division: bnTranslation()?.division || "",
        district: bnTranslation()?.district || "",
        street: bnTranslation()?.street || "",
      },
    },
  });

  const validateForm = (): boolean => {
    const result = addressSchema.safeParse(formData);
    
    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      // Simplify: "translations.en.division" → "enDivision"
      let simplePath = path
        .replace("translations.en.", "en")
        .replace("translations.bn.", "bn");
      
      // Capitalize first letter after prefix: "encountry" → "enCountry"
      simplePath = simplePath.replace(/(en|bn)(.)/, (match, prefix, char) => {
        return prefix + char.toUpperCase();
      });
      
      newErrors[simplePath] = issue.message.includes(".") 
        ? t(issue.message) 
        : issue.message;
    });
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    
    if (!isValid) {
      // Don't call onSave, modal stays open
      return;
    }
    
    try {
      await props.onSave(formData);
      // Modal will close only if parent's createEffect sees success
    } catch (error) {
      // Modal stays open on error
    }
  };

  // Helper to get districts for selected division
  const getDistricts = () => {
    if (!formData.translations.en.division) return [];
    const division = BANGLADESH.divisions.find(d => d.en === formData.translations.en.division);
    return division?.districts || [];
  };

  return (
    <Modal 
      isOpen={props.isOpen} 
      onClose={props.onClose} 
      title="Edit Address"
      size="2xl"
    >
      <div class="overflow-y-auto px-1 space-y-4 custom-scrollbar" style="max-height: 70vh;">
        <div class="space-y-4">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* English Section */}
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 text-white text-xs font-bold">
                  EN
                </div>
                <h6 class="font-bold text-gray-900 dark:text-gray-100">English Address</h6>
              </div>

              <FieldGroup
                label="Country"
                requirement="required"
                error={errors().enCountry}
              >
                <div class={fieldControlClass({ class: "cursor-not-allowed pointer-events-none bg-cream-50 dark:bg-forest-800" })}>
                  Bangladesh
                </div>
              </FieldGroup>

              <Select
                id="address-en-division"
                label="Division"
                required
                placeholder="Select Division"
                value={formData.translations.en.division}
                error={errors().enDivision}
                options={BANGLADESH.divisions.map((d) => ({ value: d.en, label: d.en }))}
                onChange={(e) => {
                    const selectedEn = e.currentTarget.value;
                    const division = BANGLADESH.divisions.find((d) => d.en === selectedEn);
                    if (division) {
                      setFormData("translations", "en", "division", division.en);
                      setFormData("translations", "bn", "division", division.bn);
                      setFormData("translations", "en", "district", "");
                      setFormData("translations", "bn", "district", "");
                    }
                  }}
              />

              <Select
                id="address-en-district"
                label="District"
                required
                placeholder={formData.translations.en.division ? "Select District" : "Select division first"}
                value={formData.translations.en.district}
                error={errors().enDistrict}
                disabled={!formData.translations.en.division}
                options={getDistricts().map((d) => ({ value: d.en, label: d.en }))}
                onChange={(e) => {
                    const selectedEn = e.currentTarget.value;
                    const division = BANGLADESH.divisions.find((d) => d.en === formData.translations.en.division);
                    const district = division?.districts.find((d) => d.en === selectedEn);
                    if (district) {
                      setFormData("translations", "en", "district", district.en);
                      setFormData("translations", "bn", "district", district.bn);
                    }
                  }}
              />

              {/* Street Input */}
              <Input
                label="Street Address"
                value={formData.translations.en.street || ""}
                onInput={(e) => setFormData("translations", "en", "street", e.currentTarget.value)}
                placeholder="House 123, Road 45, Dhanmondi"
                error={errors().enStreet}
                required
              />
            </div>

            {/* Bengali Section */}
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white text-xs font-bold">
                  বা
                </div>
                <h6 class="font-bold text-gray-900 dark:text-gray-100">বাংলা ঠিকানা</h6>
              </div>

              <FieldGroup
                label="দেশ"
                requirement="required"
                error={errors().bnCountry}
              >
                <div class={fieldControlClass({ class: "cursor-not-allowed pointer-events-none bg-cream-50 dark:bg-forest-800" })}>
                  বাংলাদেশ
                </div>
              </FieldGroup>

              <Select
                id="address-bn-division"
                label="বিভাগ"
                required
                placeholder="বিভাগ নির্বাচন করুন"
                value={formData.translations.bn.division}
                error={errors().bnDivision}
                options={BANGLADESH.divisions.map((d) => ({ value: d.bn, label: d.bn }))}
                onChange={(e) => {
                    const selectedBn = e.currentTarget.value;
                    const division = BANGLADESH.divisions.find((d) => d.bn === selectedBn);
                    if (division) {
                      setFormData("translations", "bn", "division", division.bn);
                      setFormData("translations", "en", "division", division.en);
                      setFormData("translations", "en", "district", "");
                      setFormData("translations", "bn", "district", "");
                    }
                  }}
              />

              <Select
                id="address-bn-district"
                label="জেলা"
                required
                placeholder={formData.translations.en.division ? "জেলা নির্বাচন করুন" : "প্রথমে বিভাগ নির্বাচন করুন"}
                value={formData.translations.bn.district}
                error={errors().bnDistrict}
                disabled={!formData.translations.en.division}
                options={getDistricts().map((d) => ({ value: d.bn, label: d.bn }))}
                onChange={(e) => {
                    const selectedBn = e.currentTarget.value;
                    const division = BANGLADESH.divisions.find((d) => d.en === formData.translations.en.division);
                    const district = division?.districts.find((d) => d.bn === selectedBn);
                    if (district) {
                      setFormData("translations", "bn", "district", district.bn);
                      setFormData("translations", "en", "district", district.en);
                    }
                  }}
              />

              {/* Street Input */}
              <Input
                label="রাস্তার ঠিকানা"
                value={formData.translations.bn.street}
                onInput={(e) => setFormData("translations", "bn", "street", e.currentTarget.value)}
                placeholder="বাড়ি ১২৩, রোড ৪৫, ধানমন্ডি"
                error={errors().bnStreet}
                required
              />
            </div>
          </div>

          {/* Location Details */}
          <div class="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl border border-sage-200 dark:border-sage-800">
            <div class="flex items-center gap-3 mb-3 pb-2 border-b border-sage-200 dark:border-sage-800">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h6 class="font-bold text-gray-900 dark:text-gray-100">Location Details</h6>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Postal Code"
                value={formData.postalCode}
                onInput={(e) => setFormData("postalCode", e.currentTarget.value)}
                placeholder="1209"
              />
              <Input
                label="Google Maps Link"
                value={formData.googleMapsLink}
                onInput={(e) => setFormData("googleMapsLink", e.currentTarget.value)}
                placeholder="https://maps.google.com/..."
                type="url"
              />
              <Input
                label="Latitude"
                value={formData.latitude}
                onInput={(e) => setFormData("latitude", e.currentTarget.value)}
                placeholder="23.8103"
                type="number"
                step="0.0000000001"
              />
              <Input
                label="Longitude"
                value={formData.longitude}
                onInput={(e) => setFormData("longitude", e.currentTarget.value)}
                placeholder="90.4125"
                type="number"
                step="0.0000000001"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={props.onClose}
              disabled={props.isSaving}
              class="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={props.isSaving}
              class="flex-1"
            >
              {props.isSaving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
