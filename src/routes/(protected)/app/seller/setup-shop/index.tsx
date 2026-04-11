import { createSignal, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { createForm } from "@modular-forms/solid";
import { zodForm } from "@modular-forms/solid";
import { z } from "zod";
import { createShop, uploadShopImages } from "~/lib/api/endpoints/seller-shop";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

// Form validation schema
const shopSchema = z.object({
  // English
  nameEn: z.string().min(1, "Shop name (English) is required").max(255),
  descriptionEn: z.string().min(10, "Description must be at least 10 characters").max(2000),
  businessHoursEn: z.string().optional(),
  
  // Bengali
  nameBn: z.string().min(1, "Shop name (Bengali) is required").max(255),
  descriptionBn: z.string().min(10, "Description must be at least 10 characters").max(2000),
  businessHoursBn: z.string().optional(),
  
  // Contact
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  
  // Address
  division: z.string().min(1, "Division is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  
  // Branding
  logoId: z.string().optional(),
  bannerId: z.string().optional(),
  
  // Social Media (optional)
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
});

type ShopFormData = z.infer<typeof shopSchema>;

export default function SetupShopPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal(1);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showPreview, setShowPreview] = createSignal(false);
  const [logoFile, setLogoFile] = createSignal<File | null>(null);
  const [bannerFile, setBannerFile] = createSignal<File | null>(null);
  const [logoId, setLogoId] = createSignal<string | undefined>();
  const [bannerId, setBannerId] = createSignal<string | undefined>();

  const [form, { submit, validate }] = createForm<ShopFormData>({
    validate: zodForm(shopSchema),
  });

  const totalSteps = 5;

  const isLastStep = createMemo(() => currentStep() === totalSteps);
  const isFirstStep = createMemo(() => currentStep() === 1);

  const handleFileUpload = async (type: "logo" | "banner", file: File) => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      const result = await uploadShopImages(formData);
      if (type === "logo" && result.logoId) {
        setLogoId(result.logoId);
      }
      if (type === "banner" && result.bannerId) {
        setBannerId(result.bannerId);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleNext = async () => {
    if (currentStep() < totalSteps) {
      // Validate current step
      const { error } = await validate({
        shouldValidate: true,
        name: currentStep() === 1 ? ["nameEn", "nameBn", "descriptionEn", "descriptionBn"] :
                currentStep() === 2 ? ["contactEmail", "contactPhone"] :
                currentStep() === 3 ? ["division", "city", "address"] : [],
      });

      if (!error) {
        setCurrentStep(currentStep() + 1);
      }
    } else {
      setShowPreview(true);
    }
  };

  const handleBack = () => {
    if (currentStep() > 1) {
      setCurrentStep(currentStep() - 1);
    }
  };

  const handleSubmit = submit(async (values) => {
    setIsSubmitting(true);
    try {
      // Upload images first
      if (logoFile()) {
        await handleFileUpload("logo", logoFile()!);
      }
      if (bannerFile()) {
        await handleFileUpload("banner", bannerFile()!);
      }

      // Create shop
      await createShop({
        translations: [
          {
            locale: "en",
            name: values.nameEn,
            description: values.descriptionEn,
            businessHours: values.businessHoursEn,
          },
          {
            locale: "bn",
            name: values.nameBn,
            description: values.descriptionBn,
            businessHours: values.businessHoursBn,
          },
        ],
        logoId: logoId(),
        bannerId: bannerId(),
        address: values.address,
        division: values.division,
        city: values.city,
      });

      // Redirect to my shop page
      navigate("/seller/my-shop");
    } catch (error) {
      console.error("Failed to create shop:", error);
    } finally {
      setIsSubmitting(false);
      setShowPreview(false);
    }
  });

  const renderStep = () => {
    switch (currentStep()) {
      case 1:
        return (
          <Card title="Step 1: Basic Information">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-green-700 dark:text-sage-400">
                  English (EN)
                </h3>
                <Input
                  label="Shop Name (English) *"
                  name="nameEn"
                  type="text"
                  required
                  placeholder="e.g., Green Plants Dhaka"
                />
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (English) *
                  </label>
                  <textarea
                    name="descriptionEn"
                    rows={4}
                    class="w-full px-3 py-2 border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Describe your shop..."
                  />
                </div>
              </div>

              {/* Bengali */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-green-700 dark:text-sage-400">
                  Bengali (BN)
                </h3>
                <Input
                  label="Shop Name (Bengali) *"
                  name="nameBn"
                  type="text"
                  required
                  placeholder="যেমন, গ্রিন প্ল্যান্টস ঢাকা"
                />
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Bengali) *
                  </label>
                  <textarea
                    name="descriptionBn"
                    rows={4}
                    class="w-full px-3 py-2 border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="আপনার দোকান সম্পর্কে লিখুন..."
                  />
                </div>
              </div>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card title="Step 2: Contact Information">
            <div class="space-y-4">
              <Input
                label="Contact Email *"
                name="contactEmail"
                type="email"
                required
                placeholder="your@email.com"
              />
              <Input
                label="Contact Phone *"
                name="contactPhone"
                type="tel"
                required
                placeholder="+8801XXXXXXXXX"
              />
            </div>
          </Card>
        );

      case 3:
        return (
          <Card title="Step 3: Address">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Division *"
                  name="division"
                  type="text"
                  required
                  placeholder="e.g., Dhaka"
                />
                <Input
                  label="City *"
                  name="city"
                  type="text"
                  required
                  placeholder="e.g., Dhaka"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Address *
                </label>
                <textarea
                  name="address"
                  rows={3}
                  class="w-full px-3 py-2 border border-gray-200 dark:border-forest-600 rounded-lg bg-white dark:bg-forest-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="House, Road, Area..."
                />
              </div>
            </div>
          </Card>
        );

      case 4:
        return (
          <Card title="Step 4: Branding">
            <div class="space-y-6">
              {/* Logo Upload */}
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shop Logo
                </label>
                <div class="flex items-center gap-4">
                  <div class="w-24 h-24 bg-gray-100 dark:bg-forest-700 rounded-xl flex items-center justify-center">
                    {logoFile() ? (
                      <img
                        src={URL.createObjectURL(logoFile()!)}
                        alt="Logo preview"
                        class="w-full h-full object-contain"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    class="text-sm text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>

              {/* Banner Upload */}
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shop Banner
                </label>
                <div class="flex items-center gap-4">
                  <div class="w-48 h-24 bg-gray-100 dark:bg-forest-700 rounded-xl flex items-center justify-center">
                    {bannerFile() ? (
                      <img
                        src={URL.createObjectURL(bannerFile()!)}
                        alt="Banner preview"
                        class="w-full h-full object-cover"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                    class="text-sm text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </Card>
        );

      case 5:
        return (
          <Card title="Step 5: Review & Submit">
            <div class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Review your shop information before submitting.</p>
              <p class="text-green-600 dark:text-sage-400 font-medium">
                ✓ Both English and Bengali translations required
              </p>
              <p class="text-green-600 dark:text-sage-400 font-medium">
                ✓ Shop will be submitted for admin verification
              </p>
              <p class="text-amber-600 dark:text-amber-400 font-medium">
                ⚠ You cannot create another shop after submission
              </p>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="shop setup" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Create Your Shop
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Set up your shop in 5 easy steps. All fields marked with * are required.
            </p>
          </div>

          {/* Progress Bar */}
          <div class="mb-8">
            <div class="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  class={`flex-1 h-2 mx-1 rounded-full ${
                    i + 1 <= currentStep()
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-forest-700"
                  }`}
                />
              ))}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 text-center">
              Step {currentStep()} of {totalSteps}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} class="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div class="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={isFirstStep()}
              >
                Back
              </Button>
              <div class="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleNext}
                >
                  {isLastStep() ? "Preview" : "Next"}
                </Button>
                {isLastStep() && (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting()}
                  >
                    Submit for Review
                  </Button>
                )}
              </div>
            </div>
          </form>

          {/* Preview Modal */}
          <Modal
            isOpen={showPreview()}
            onClose={() => setShowPreview(false)}
            title="Review Your Shop"
          >
            <div class="space-y-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Please confirm that all information is correct before submitting.
              </p>
              <div class="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Go Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSubmit()}
                  loading={isSubmitting()}
                >
                  Confirm & Submit
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
