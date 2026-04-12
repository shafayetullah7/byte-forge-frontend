import { createSignal, createMemo, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Card from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { createForm, Field } from "@modular-forms/solid";
import { z } from "zod";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { toaster } from "~/components/ui/Toast";

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
});

type ShopFormData = z.infer<typeof shopSchema>;

const divisions = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export default function SetupShopPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal(1);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showPreview, setShowPreview] = createSignal(false);
  const [logoFile, setLogoFile] = createSignal<File | null>(null);
  const [bannerFile, setBannerFile] = createSignal<File | null>(null);
  const [logoId, setLogoId] = createSignal<string | undefined>();
  const [bannerId, setBannerId] = createSignal<string | undefined>();
  const [formErrors, setFormErrors] = createSignal<Record<string, string>>({});
  
  // Store form values for preview
  const [formValues, setFormValues] = createSignal<ShopFormData | null>(null);

  const [form, { Form, Field }] = createForm<ShopFormData>({
    validate: (values) => {
      const result = shopSchema.safeParse(values);
      if (result.success) {
        return {};
      }
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path.join(".")] = issue.message;
        }
      });
      return errors;
    },
    initialValues: {
      division: "",
      city: "",
    },
  });

  const totalSteps = 5;

  const isLastStep = createMemo(() => currentStep() === totalSteps);
  const isFirstStep = createMemo(() => currentStep() === 1);

  const handleFileUpload = async (type: "logo" | "banner", file: File) => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      const result = await sellerShopApi.uploadImages(formData);
      if (type === "logo" && result.logoId) {
        setLogoId(result.logoId);
      }
      if (type === "banner" && result.bannerId) {
        setBannerId(result.bannerId);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      toaster.error("Failed to upload image");
    }
  };

  const handleNext = () => {
    if (currentStep() < totalSteps) {
      setCurrentStep(currentStep() + 1);
    } else {
      // Store current form values for preview
      setFormValues(form as ShopFormData);
      setShowPreview(true);
    }
  };

  const handleBack = () => {
    if (currentStep() > 1) {
      setCurrentStep(currentStep() - 1);
      setFormErrors({});
    }
  };

  const handleSubmit = async (values: ShopFormData) => {
    setIsSubmitting(true);
    try {
      if (logoFile()) {
        await handleFileUpload("logo", logoFile()!);
      }
      if (bannerFile()) {
        await handleFileUpload("banner", bannerFile()!);
      }

      await sellerShopApi.create({
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

      toaster.success("Shop submitted for verification!");
      navigate("/seller/my-shop");
    } catch (error: any) {
      console.error("Failed to create shop:", error);
      toaster.error(error?.message || "Failed to create shop");
    } finally {
      setIsSubmitting(false);
      setShowPreview(false);
    }
  };

  const textareaBaseClasses = "w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed body-base bg-white dark:bg-forest-900/30 border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400 outline-none";

  const renderStep = () => {
    switch (currentStep()) {
      case 1:
        return (
          <Card title="Step 1: Shop Name & Description" description="Enter your shop information in both languages">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* English */}
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-3 border-b border-cream-200 dark:border-forest-700">
                  <span class="text-2xl">🇬🇧</span>
                  <h3 class="h5 text-forest-700 dark:text-sage-400">
                    English
                  </h3>
                </div>
                
                <Field name="nameEn">
                  {(field, props) => (
                    <Input
                      {...props}
                      label="Shop Name *"
                      type="text"
                      placeholder="e.g., Green Plants Dhaka"
                      value={field.value || ""}
                      error={formErrors().nameEn}
                    />
                  )}
                </Field>

                <Field name="descriptionEn">
                  {(field, props) => (
                    <div>
                      <label class="block h6 mb-2">
                        Description *
                      </label>
                      <textarea
                        {...props}
                        rows={4}
                        class={`${textareaBaseClasses} ${formErrors().descriptionEn ? "border-red-500 focus:border-red-600" : ""}`}
                        placeholder="Describe your shop, specialty, and what makes it unique..."
                        value={field.value || ""}
                      />
                      {formErrors().descriptionEn && (
                        <p class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">
                          {formErrors().descriptionEn}
                        </p>
                      )}
                    </div>
                  )}
                </Field>
              </div>

              {/* Bengali */}
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-3 border-b border-cream-200 dark:border-forest-700">
                  <span class="text-2xl">🇧🇩</span>
                  <h3 class="h5 text-forest-700 dark:text-sage-400">
                    বাংলা
                  </h3>
                </div>
                
                <Field name="nameBn">
                  {(field, props) => (
                    <Input
                      {...props}
                      label="দোকানের নাম *"
                      type="text"
                      placeholder="যেমন, গ্রিন প্ল্যান্টস ঢাকা"
                      value={field.value || ""}
                      error={formErrors().nameBn}
                    />
                  )}
                </Field>

                <Field name="descriptionBn">
                  {(field, props) => (
                    <div>
                      <label class="block h6 mb-2">
                        বিবরণ *
                      </label>
                      <textarea
                        {...props}
                        rows={4}
                        class={`${textareaBaseClasses} ${formErrors().descriptionBn ? "border-red-500 focus:border-red-600" : ""}`}
                        placeholder="আপনার দোকান সম্পর্কে লিখুন, বিশেষত্ব, এবং কি এটি অনন্য করে তোলে..."
                        value={field.value || ""}
                      />
                      {formErrors().descriptionBn && (
                        <p class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">
                          {formErrors().descriptionBn}
                        </p>
                      )}
                    </div>
                  )}
                </Field>
              </div>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card title="Step 2: Contact Information" description="How customers can reach you">
            <div class="max-w-xl mx-auto space-y-6">
              <Field name="contactEmail">
                {(field, props) => (
                  <Input
                    {...props}
                    label="Contact Email *"
                    type="email"
                    placeholder="your@email.com"
                    value={field.value || ""}
                    error={formErrors().contactEmail}
                  />
                )}
              </Field>

              <Field name="contactPhone">
                {(field, props) => (
                  <Input
                    {...props}
                    label="Contact Phone *"
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    value={field.value || ""}
                    error={formErrors().contactPhone}
                  />
                )}
              </Field>
            </div>
          </Card>
        );

      case 3:
        return (
          <Card title="Step 3: Shop Address" description="Where your shop is located">
            <div class="max-w-xl mx-auto space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field name="division">
                  {(field, props) => (
                    <div>
                      <label class="block h6 mb-2">
                        Division *
                      </label>
                      <select
                        {...props}
                        value={field.value || ""}
                        class={`${textareaBaseClasses} ${formErrors().division ? "border-red-500 focus:border-red-600" : ""}`}
                      >
                        <option value="">Select Division</option>
                        <For each={divisions}>
                          {(div) => <option value={div}>{div}</option>}
                        </For>
                      </select>
                      {formErrors().division && (
                        <p class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">
                          {formErrors().division}
                        </p>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="city">
                  {(field, props) => (
                    <Input
                      {...props}
                      label="City *"
                      type="text"
                      placeholder="e.g., Dhaka"
                      value={field.value || ""}
                      error={formErrors().city}
                    />
                  )}
                </Field>
              </div>

              <Field name="address">
                {(field, props) => (
                  <div>
                    <label class="block h6 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      {...props}
                      rows={3}
                      class={`${textareaBaseClasses} ${formErrors().address ? "border-red-500 focus:border-red-600" : ""}`}
                      placeholder="House/Building, Road, Area..."
                      value={field.value || ""}
                    />
                    {formErrors().address && (
                      <p class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">
                        {formErrors().address}
                      </p>
                    )}
                  </div>
                )}
              </Field>
            </div>
          </Card>
        );

      case 4:
        return (
          <Card title="Step 4: Shop Branding" description="Add logo and banner to make your shop stand out">
            <div class="max-w-xl mx-auto space-y-8">
              {/* Logo Upload */}
              <div>
                <label class="block h6 mb-3">
                  Shop Logo
                </label>
                <div class="flex items-center gap-6">
                  <div class="w-24 h-24 bg-cream-100 dark:bg-forest-800 rounded-xl flex items-center justify-center border-2 border-dashed border-cream-300 dark:border-forest-600 overflow-hidden">
                    {logoFile() ? (
                      <img
                        src={URL.createObjectURL(logoFile()!)}
                        alt="Logo preview"
                        class="w-full h-full object-contain"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-forest-400 dark:text-forest-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    )}
                  </div>
                  <div class="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      class="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-forest-100 file:text-forest-700
                        dark:file:bg-forest-700 dark:file:text-sage-400
                        hover:file:bg-forest-200 dark:hover:file:bg-forest-600
                        cursor-pointer"
                    />
                    <p class="mt-2 body-small text-gray-500 dark:text-gray-400">
                      Recommended: 500x500px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>

              {/* Banner Upload */}
              <div>
                <label class="block h6 mb-3">
                  Shop Banner
                </label>
                <div class="flex items-center gap-6">
                  <div class="w-48 h-24 bg-cream-100 dark:bg-forest-800 rounded-xl flex items-center justify-center border-2 border-dashed border-cream-300 dark:border-forest-600 overflow-hidden">
                    {bannerFile() ? (
                      <img
                        src={URL.createObjectURL(bannerFile()!)}
                        alt="Banner preview"
                        class="w-full h-full object-cover"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-forest-400 dark:text-forest-500">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    )}
                  </div>
                  <div class="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                      class="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-forest-100 file:text-forest-700
                        dark:file:bg-forest-700 dark:file:text-sage-400
                        hover:file:bg-forest-200 dark:hover:file:bg-forest-600
                        cursor-pointer"
                    />
                    <p class="mt-2 body-small text-gray-500 dark:text-gray-400">
                      Recommended: 1200x400px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );

      case 5:
        return (
          <Card title="Step 5: Review & Submit" description="Please review before submitting for verification">
            <div class="max-w-xl mx-auto space-y-6">
              <div class="p-5 bg-cream-50 dark:bg-forest-800/50 rounded-xl border border-cream-200 dark:border-forest-700">
                <h4 class="h6 mb-4 text-forest-700 dark:text-sage-400">Important Information</h4>
                <ul class="space-y-3 body-base text-gray-700 dark:text-gray-300">
                  <li class="flex items-start gap-3">
                    <span class="text-green-600 dark:text-sage-400 flex-shrink-0 mt-0.5">✓</span>
                    <span>Both English and Bengali translations are required</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-green-600 dark:text-sage-400 flex-shrink-0 mt-0.5">✓</span>
                    <span>Shop will be submitted for admin verification</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-green-600 dark:text-sage-400 flex-shrink-0 mt-0.5">✓</span>
                    <span>Verification typically takes 24-48 hours</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">⚠</span>
                    <span>You cannot create another shop after submission (one shop per user)</span>
                  </li>
                </ul>
              </div>
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
          <div class="mb-10">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Create Your Shop
            </h1>
            <p class="body-large text-gray-600 dark:text-gray-400">
              Set up your shop in 5 easy steps. All fields marked with * are required.
            </p>
          </div>

          {/* Progress Bar */}
          <div class="mb-10">
            <div class="flex items-center justify-between mb-3">
              <For each={Array.from({ length: totalSteps })}>
                {(_, i) => (
                  <div class="flex items-center">
                    <div
                      class={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        i() + 1 <= currentStep()
                          ? "bg-forest-600 text-white dark:bg-forest-500"
                          : "bg-cream-200 text-gray-500 dark:bg-forest-700 dark:text-gray-400"
                      }`}
                    >
                      {i() + 1}
                    </div>
                    {i() < totalSteps - 1 && (
                      <div
                        class={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-all ${
                          i() + 1 < currentStep()
                            ? "bg-forest-600 dark:bg-forest-500"
                            : "bg-cream-200 dark:bg-forest-700"
                        }`}
                      />
                    )}
                  </div>
                )}
              </For>
            </div>
            <div class="text-center body-small text-gray-600 dark:text-gray-400">
              Step {currentStep()} of {totalSteps}
            </div>
          </div>

          {/* Form */}
          <Form onSubmit={handleSubmit} class="space-y-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div class="flex justify-between pt-8 border-t border-cream-200 dark:border-forest-700">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={isFirstStep()}
              >
                Back
              </Button>
              <div class="flex gap-4">
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
          </Form>

          {/* Preview Modal */}
          <Modal
            isOpen={showPreview()}
            onClose={() => setShowPreview(false)}
            title="Review Your Shop Information"
            size="lg"
          >
            <div class="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p class="body-small text-amber-800 dark:text-amber-400">
                  ⚠ After submission, your shop will be reviewed by our admin team. You will be notified once verified (typically within 24-48 hours).
                </p>
              </div>

              {/* Basic Information */}
              <div>
                <h4 class="h6 mb-3 flex items-center gap-2">
                  <span>📝</span> Basic Information
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cream-50 dark:bg-forest-800/50 rounded-lg">
                  <div>
                    <p class="body-small text-gray-500 dark:text-gray-400">Shop Name (English)</p>
                    <p class="body-base font-medium text-gray-900 dark:text-gray-100">{formValues()?.nameEn}</p>
                  </div>
                  <div>
                    <p class="body-small text-gray-500 dark:text-gray-400">Shop Name (বাংলা)</p>
                    <p class="body-base font-medium text-gray-900 dark:text-gray-100">{formValues()?.nameBn}</p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="body-small text-gray-500 dark:text-gray-400">Description (English)</p>
                    <p class="body-base text-gray-700 dark:text-gray-300">{formValues()?.descriptionEn}</p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="body-small text-gray-500 dark:text-gray-400">Description (বাংলা)</p>
                    <p class="body-base text-gray-700 dark:text-gray-300">{formValues()?.descriptionBn}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 class="h6 mb-3 flex items-center gap-2">
                  <span>📞</span> Contact Information
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cream-50 dark:bg-forest-800/50 rounded-lg">
                  <div>
                    <p class="body-small text-gray-500 dark:text-gray-400">Email</p>
                    <p class="body-base font-medium text-gray-900 dark:text-gray-100">{formValues()?.contactEmail}</p>
                  </div>
                  <div>
                    <p class="body-small text-gray-500 dark:text-gray-400">Phone</p>
                    <p class="body-base font-medium text-gray-900 dark:text-gray-100">{formValues()?.contactPhone}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 class="h6 mb-3 flex items-center gap-2">
                  <span>📍</span> Address
                </h4>
                <div class="p-4 bg-cream-50 dark:bg-forest-800/50 rounded-lg space-y-3">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="body-small text-gray-500 dark:text-gray-400">Division</p>
                      <p class="body-base font-medium text-gray-900 dark:text-gray-100">{formValues()?.division}</p>
                    </div>
                    <div>
                      <p class="body-small text-gray-500 dark:text-gray-400">City</p>
                      <p class="body-base font-medium text-gray-900 dark:text-gray-100">{formValues()?.city}</p>
                    </div>
                  </div>
                  <div>
                    <p class="body-small text-gray-500 dark:text-gray-400">Full Address</p>
                    <p class="body-base text-gray-700 dark:text-gray-300">{formValues()?.address}</p>
                  </div>
                </div>
              </div>

              {/* Branding */}
              {(logoFile() || logoId()) || (bannerFile() || bannerId()) ? (
                <div>
                  <h4 class="h6 mb-3 flex items-center gap-2">
                    <span>🎨</span> Branding
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cream-50 dark:bg-forest-800/50 rounded-lg">
                    {(logoFile() || logoId()) && (
                      <div>
                        <p class="body-small text-gray-500 dark:text-gray-400 mb-2">Shop Logo</p>
                        <div class="w-24 h-24 bg-white dark:bg-forest-700 rounded-lg overflow-hidden border border-cream-200 dark:border-forest-600">
                          {logoFile() ? (
                            <img src={URL.createObjectURL(logoFile()!)} alt="Logo" class="w-full h-full object-contain" />
                          ) : (
                            <div class="w-full h-full flex items-center justify-center text-forest-400">✓</div>
                          )}
                        </div>
                      </div>
                    )}
                    {(bannerFile() || bannerId()) && (
                      <div>
                        <p class="body-small text-gray-500 dark:text-gray-400 mb-2">Shop Banner</p>
                        <div class="w-full h-24 bg-white dark:bg-forest-700 rounded-lg overflow-hidden border border-cream-200 dark:border-forest-600">
                          {bannerFile() ? (
                            <img src={URL.createObjectURL(bannerFile()!)} alt="Banner" class="w-full h-full object-cover" />
                          ) : (
                            <div class="w-full h-full flex items-center justify-center text-forest-400">✓</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Important Notice */}
              <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 class="h6 mb-2 text-red-800 dark:text-red-400">⚠️ Important Notice</h4>
                <ul class="body-small text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  <li>You can only create ONE shop per account</li>
                  <li>Both English and Bengali information is required</li>
                  <li>Admin verification is required before your shop goes live</li>
                  <li>Incorrect information may delay the verification process</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div class="flex gap-4 justify-end pt-4 border-t border-cream-200 dark:border-forest-700">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Go Back to Edit
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting()}
                >
                  Confirm & Submit for Verification
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
