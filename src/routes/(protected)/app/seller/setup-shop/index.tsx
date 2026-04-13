import { action, useAction, useSubmission, useNavigate } from "@solidjs/router";
import { createSignal, createEffect, Show, onCleanup } from "solid-js";
import { createForm, Field } from "@modular-forms/solid";
import { z } from "zod";
import { Button, Input, Card } from "~/components/ui";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { AdvancedSelect } from "~/components/ui/AdvancedSelect";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

// Simple validation schema
const shopSchema = z.object({
  // Shop Name
  nameEn: z.string().min(1, "Shop name (English) is required"),
  nameBn: z.string().min(1, "Shop name (Bengali) is required"),
  
  // Description
  descriptionEn: z.string().min(10, "Description must be at least 10 characters"),
  descriptionBn: z.string().min(10, "Description must be at least 10 characters"),
  
  // Business Hours (optional)
  businessHoursEn: z.string().optional(),
  businessHoursBn: z.string().optional(),
  
  // Contact
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  
  // Address
  division: z.string().min(1, "Division is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address is required"),
  
  // Trade License
  tradeLicenseNumber: z.string().min(1, "Trade license number is required"),
});

type ShopFormData = z.infer<typeof shopSchema>;

const divisions = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna",
  "Barisal", "Sylhet", "Rangpur", "Mymensingh",
];

// Step configuration
const steps = [
  { id: 1, title: 'Basic Info', subtitle: 'Tell us about your shop' },
  { id: 2, title: 'Contact', subtitle: 'Where customers can find you' },
  { id: 3, title: 'Verification', subtitle: 'Verify your business' },
  { id: 4, title: 'Branding', subtitle: 'Make your shop stand out' },
];

// Server action for shop creation
const createShopAction = action(async (data: {
  formData: ShopFormData;
  logoFile: File | null;
  bannerFile: File | null;
  tradeLicenseFile: File | null;
}) => {
  "use server";
  
  try {
    let logoId: string | undefined;
    let bannerId: string | undefined;
    let tradeLicenseId: string | undefined;
    
    // Upload files
    if (data.logoFile) {
      const formData = new FormData();
      formData.append("logo", data.logoFile);
      const result = await sellerShopApi.uploadImages(formData);
      logoId = result.logoId;
    }
    
    if (data.bannerFile) {
      const formData = new FormData();
      formData.append("banner", data.bannerFile);
      const result = await sellerShopApi.uploadImages(formData);
      bannerId = result.bannerId;
    }
    
    if (data.tradeLicenseFile) {
      const formData = new FormData();
      formData.append("tradeLicense", data.tradeLicenseFile);
      const result = await sellerShopApi.uploadImages(formData);
      tradeLicenseId = result.logoId;
    }
    
    // Create shop
    await sellerShopApi.create({
      translations: [
        {
          locale: "en",
          name: data.formData.nameEn,
          description: data.formData.descriptionEn,
          businessHours: data.formData.businessHoursEn,
        },
        {
          locale: "bn",
          name: data.formData.nameBn,
          description: data.formData.descriptionBn,
          businessHours: data.formData.businessHoursBn,
        },
      ],
      logoId,
      bannerId,
      address: data.formData.address,
      division: data.formData.division,
      city: data.formData.city,
      tradeLicenseNumber: data.formData.tradeLicenseNumber,
      tradeLicenseDocumentId: tradeLicenseId,
    });
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create shop",
    };
  }
}, "create-shop-action");

export default function SetupShopPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const createShopTrigger = useAction(createShopAction);
  const submission = useSubmission(createShopAction);
  
  // Wizard state
  const [currentStep, setCurrentStep] = createSignal(1);
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  
  // File state
  const [logoFile, setLogoFile] = createSignal<File | null>(null);
  const [bannerFile, setBannerFile] = createSignal<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = createSignal<File | null>(null);
  
  // File preview URLs (cleanup on unmount)
  const [logoPreview, setLogoPreview] = createSignal<string | undefined>();
  const [bannerPreview, setBannerPreview] = createSignal<string | undefined>();
  const [tradeLicensePreview, setTradeLicensePreview] = createSignal<string | undefined>();
  
  // Cleanup preview URLs
  onCleanup(() => {
    if (logoPreview()) URL.revokeObjectURL(logoPreview()!);
    if (bannerPreview()) URL.revokeObjectURL(bannerPreview()!);
    if (tradeLicensePreview()) URL.revokeObjectURL(tradeLicensePreview()!);
  });

  const [form, { Form, Field }] = createForm<ShopFormData>({
    validate: (values) => {
      const result = shopSchema.safeParse(values);
      if (result.success) return {};
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path.join(".")] = issue.message;
        }
      });
      return errors;
    },
  });

  // Handle submission result
  createEffect(() => {
    if (submission.result) {
      const result = submission.result as any;
      if (result.success) {
        toaster.success("Shop submitted for verification!");
        navigate("/seller/my-shop");
      } else if (result.error) {
        toaster.error(result.error);
      }
    }
  });

  const handleSubmit = async (values: ShopFormData) => {
    try {
      await createShopTrigger({
        formData: values,
        logoFile: logoFile(),
        bannerFile: bannerFile(),
        tradeLicenseFile: tradeLicenseFile(),
      });
    } catch (error: any) {
      toaster.error(error?.message || "Failed to create shop");
    }
  };

  // Validate current step
  const validateStep = async (stepNumber: number): Promise<boolean> => {
    const fieldsByStep = {
      1: ['nameEn', 'nameBn', 'descriptionEn', 'descriptionBn'],
      2: ['contactEmail', 'contactPhone', 'division', 'city', 'address'],
      3: ['tradeLicenseNumber'],
      4: [],
    };
    
    const fields = fieldsByStep[stepNumber as keyof typeof fieldsByStep];
    const errors = await validate({ name: fields });
    
    if (errors && Object.keys(errors).length > 0) {
      toaster.error('Please fill in all required fields');
      return false;
    }
    
    // Special validation for step 3 (file upload)
    if (stepNumber === 3 && !tradeLicenseFile()) {
      toaster.error('Please upload your trade license');
      return false;
    }
    
    // File size validation for step 3
    if (stepNumber === 3 && tradeLicenseFile() && tradeLicenseFile()!.size > 5 * 1024 * 1024) {
      toaster.error('File size must be less than 5MB');
      return false;
    }
    
    return true;
  };

  // Handle Next button
  const handleNext = async () => {
    setIsTransitioning(true);
    const isValid = await validateStep(currentStep());
    
    if (isValid) {
      if (currentStep() < 4) {
        setCurrentStep(s => s + 1);
      } else {
        // Final step - submit form
        handleSubmit(form as unknown as ShopFormData);
      }
    }
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Handle Back button
  const handleBack = () => {
    if (currentStep() > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const inputBaseClasses = "w-full px-4 py-3 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed body-base bg-white dark:bg-forest-900/30 border-gray-200 dark:border-forest-700 hover:border-gray-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400 outline-none";
  const textareaBaseClasses = "w-full px-4 py-3 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed body-base bg-white dark:bg-forest-900/30 border-gray-200 dark:border-forest-700 hover:border-gray-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400 outline-none";

  // Progress Bar Component
  const ProgressBar = () => (
    <div class="mb-10" role="progressbar" aria-label="Form progress" aria-valuenow={currentStep()} aria-valuemin={1} aria-valuemax={4}>
      {/* Step indicators */}
      <div class="flex items-center justify-between mb-4">
        <For each={steps}>
          {(step, i) => (
            <div class={`flex flex-col items-center ${
              currentStep() >= i() + 1 
                ? 'text-forest-600 dark:text-sage-400' 
                : 'text-gray-400 dark:text-gray-600'
            }`}>
              {/* Circle with number */}
              <div class={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all ${
                currentStep() >= i() + 1
                  ? 'bg-forest-100 dark:bg-forest-900 border-2 border-forest-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300'
              }`} aria-label={`Step ${i() + 1}: ${step.title}`}>
                {currentStep() > i() + 1 ? (
                  <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                ) : (
                  <span>{i() + 1}</span>
                )}
              </div>
              {/* Title */}
              <span class="text-sm font-medium hidden md:block">{step.title}</span>
            </div>
          )}
        </For>
      </div>
      
      {/* Progress line */}
      <div class="relative">
        <div class="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div 
          class="absolute top-0 left-0 h-1 bg-gradient-to-r from-forest-500 to-sage-400 rounded-full transition-all duration-500"
          style={`width: ${(currentStep() - 1) * 33.33}%`}
          aria-hidden="true"
        ></div>
      </div>
      
      {/* Step subtitle */}
      <p class="text-center text-gray-600 dark:text-gray-400 mt-4 body-large" aria-live="polite">
        {steps.find(s => s.id === currentStep())?.subtitle}
      </p>
    </div>
  );

  // Step 1: Basic Information
  const Step1_BasicInfo = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Tell us about your shop
      </h2>
      
      {/* Shop Name (stacked) */}
      <div class="space-y-4">
        <h3 class="h6 text-gray-700 dark:text-gray-300">Shop Name</h3>
        <Field name="nameEn">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label="Shop Name (English) *"
                type="text"
                placeholder="Green Plants Dhaka"
                value={field.value || ""}
                error={field.error}
                onInput={async (e) => {
                  props.onInput(e);
                  await props.validate?.("nameEn");
                }}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                  {field.error}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field name="nameBn">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label="দোকানের নাম (বাংলা) *"
                type="text"
                placeholder="গ্রিন প্ল্যান্টস ঢাকা"
                value={field.value || ""}
                error={field.error}
                onInput={async (e) => {
                  props.onInput(e);
                  await props.validate?.("nameBn");
                }}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                  {field.error}
                </p>
              )}
            </div>
          )}
        </Field>
      </div>
      
      {/* Description (stacked) */}
      <div class="space-y-4">
        <h3 class="h6 text-gray-700 dark:text-gray-300">Description</h3>
        <Field name="descriptionEn">
          {(field, props) => (
            <div>
              <label class="block h6 mb-2">Description (English) *</label>
              <textarea
                {...props}
                rows={4}
                class={`${textareaBaseClasses} ${field.error ? "border-red-500 focus:border-red-600" : ""}`}
                placeholder="Brief shop description"
                value={field.value || ""}
                onInput={async (e) => {
                  props.onInput(e);
                  await props.validate?.("descriptionEn");
                }}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                  {field.error}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field name="descriptionBn">
          {(field, props) => (
            <div>
              <label class="block h6 mb-2">বিবরণ (বাংলা) *</label>
              <textarea
                {...props}
                rows={4}
                class={`${textareaBaseClasses} ${field.error ? "border-red-500 focus:border-red-600" : ""}`}
                placeholder="সংক্ষিপ্ত বিবরণ"
                value={field.value || ""}
                onInput={async (e) => {
                  props.onInput(e);
                  await props.validate?.("descriptionBn");
                }}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                  {field.error}
                </p>
              )}
            </div>
          )}
        </Field>
      </div>
      
      {/* Business Hours (stacked) */}
      <div class="space-y-4">
        <h3 class="h6 text-gray-700 dark:text-gray-300">
          Business Hours <span class="font-normal text-gray-500">(Optional)</span>
        </h3>
        <Field name="businessHoursEn">
          {(field, props) => (
            <Input
              {...props}
              label="Business Hours (English)"
              type="text"
              placeholder="9:00 AM - 9:00 PM"
              value={field.value || ""}
              error={field.error}
            />
          )}
        </Field>

        <Field name="businessHoursBn">
          {(field, props) => (
            <Input
              {...props}
              label="ব্যবসায়িক ঘন্টা (বাংলা)"
              type="text"
              placeholder="সকাল ৯টা - রাত ৯টা"
              value={field.value || ""}
              error={field.error}
            />
          )}
        </Field>
      </div>
    </div>
  );

  // Step 2: Contact & Address
  const Step2_Contact = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Where can customers find you?
      </h2>
      
      {/* Contact Info (grid) */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="contactEmail">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label="Email *"
                type="email"
                placeholder="your@email.com"
                value={field.value || ""}
                error={field.error}
                onInput={async (e) => {
                  props.onInput(e);
                  await props.validate?.("contactEmail");
                }}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                  {field.error}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field name="contactPhone">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label="Phone *"
                type="tel"
                placeholder="+8801XXXXXXXXX"
                value={field.value || ""}
                error={field.error}
                onInput={async (e) => {
                  props.onInput(e);
                  await props.validate?.("contactPhone");
                }}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                  {field.error}
                </p>
              )}
            </div>
          )}
        </Field>
      </div>
      
      {/* Address */}
      <div class="space-y-4">
        <h3 class="h6 text-gray-700 dark:text-gray-300">Address</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="division">
            {(field, props) => (
              <div>
                <AdvancedSelect
                  label="Division *"
                  placeholder="Select Division"
                  options={divisions.map(d => ({ value: d, label: d }))}
                  value={field.value || null}
                  onChange={(value) => {
                    props.onChange(value);
                    props.validate?.("division");
                  }}
                  error={field.error}
                  allowClear
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                    {field.error}
                  </p>
                )}
              </div>
            )}
          </Field>

          <Field name="city">
            {(field, props) => (
              <div>
                <Input
                  {...props}
                  label="City *"
                  type="text"
                  placeholder="Dhaka"
                  value={field.value || ""}
                  error={field.error}
                  onInput={async (e) => {
                    props.onInput(e);
                    await props.validate?.("city");
                  }}
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                    {field.error}
                  </p>
                )}
              </div>
            )}
          </Field>
        </div>

        <Field name="address">
          {(field, props) => (
            <div>
              <label class="block h6 mb-2">Full Address *</label>
              <textarea
                {...props}
                rows={3}
                class={`${textareaBaseClasses} ${field.error ? "border-red-500 focus:border-red-600" : ""}`}
                placeholder="House, Road, Area"
                value={field.value || ""}
                onInput={async (e) => {
                  props.onInput(e);
                  await props.validate?.("address");
                }}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                  {field.error}
                </p>
              )}
            </div>
          )}
        </Field>
      </div>
    </div>
  );

  // Step 3: Verification
  const Step3_Verification = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Verify your business
      </h2>
      
      {/* Trade License Number */}
      <Field name="tradeLicenseNumber">
        {(field, props) => (
          <div>
            <Input
              {...props}
              label="Trade License Number *"
              type="text"
              placeholder="Enter license number"
              value={field.value || ""}
              error={field.error}
              onInput={async (e) => {
                props.onInput(e);
                await props.validate?.("tradeLicenseNumber");
              }}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                {field.error}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Trade License File Upload */}
      <div>
        <label class="block h6 mb-3">Trade License Document *</label>
        <div class="border-2 border-dashed border-gray-300 dark:border-forest-600 rounded-xl p-6 text-center hover:border-forest-500 dark:hover:border-sage-400 transition-colors bg-white dark:bg-forest-900/50">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setTradeLicenseFile(file);
              if (file) {
                const preview = URL.createObjectURL(file);
                setTradeLicensePreview(preview);
              }
            }}
            class="hidden"
            id="trade-license-upload"
          />
          <label for="trade-license-upload" class="cursor-pointer">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span class="font-semibold text-forest-600 dark:text-sage-400">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              PDF, JPG, PNG (max 5MB)
            </p>
          </label>
          {tradeLicenseFile() && (
            <div class="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-sage-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>{tradeLicenseFile()?.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Step 4: Branding & Submit
  const Step4_Branding = () => (
    <div class="space-y-6">
      {/* Success message */}
      <div class="text-center py-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Almost there!
        </h2>
        <p class="body-large text-gray-600 dark:text-gray-400">
          Add optional branding to make your shop stand out.
        </p>
      </div>
      
      {/* Summary Card */}
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <span class="text-green-600 dark:text-green-400 text-xl">✓</span>
          <div>
            <p class="font-semibold text-green-800 dark:text-green-400">
              Ready to submit!
            </p>
            <p class="text-sm text-green-700 dark:text-green-500 mt-1">
              Your shop will be reviewed within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
      
      {/* Logo Upload */}
      <ImageUpload
        preview={logoFile() ? (logoPreview() || URL.createObjectURL(logoFile()!)) : undefined}
        isUploading={false}
        onFileSelect={(file) => {
          setLogoFile(file);
          if (file) {
            const preview = URL.createObjectURL(file);
            setLogoPreview(preview);
          }
        }}
        label="Shop Logo (Optional)"
        description="500x500px, PNG or JPG"
      />

      {/* Banner Upload */}
      <ImageUpload
        preview={bannerFile() ? (bannerPreview() || URL.createObjectURL(bannerFile()!)) : undefined}
        isUploading={false}
        onFileSelect={(file) => {
          setBannerFile(file);
          if (file) {
            const preview = URL.createObjectURL(file);
            setBannerPreview(preview);
          }
        }}
        label="Shop Banner (Optional)"
        description="1200x400px, PNG or JPG"
      />
    </div>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep()) {
      case 1: return <Step1_BasicInfo />;
      case 2: return <Step2_Contact />;
      case 3: return <Step3_Verification />;
      case 4: return <Step4_Branding />;
      default: return <Step1_BasicInfo />;
    }
  };

  // Navigation Buttons
  const NavigationButtons = () => (
    <div class="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-forest-700 mt-8">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleBack}
        disabled={currentStep() === 1 || submission.pending}
        class={currentStep() === 1 ? 'invisible' : ''}
      >
        ← Back
      </Button>
      
      <Show
        when={currentStep() < 4}
        fallback={
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submission.pending}
            disabled={submission.pending}
            class="w-48"
          >
            {submission.pending ? 'Submitting...' : 'Create Shop ✓'}
          </Button>
        }
      >
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={submission.pending}
          class="w-32"
        >
          Next →
        </Button>
      </Show>
    </div>
  );

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="shop setup" />
      )}
    >
      <div class="w-full max-w-[700px] mx-auto px-4 py-12">
        {/* Header */}
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {t("seller.setupShop.title")}
          </h1>
          <p class="body-large text-gray-600 dark:text-gray-400">
            Create your shop in a few simple steps.
          </p>
        </div>
        
        {/* Progress Bar */}
        <ProgressBar />
        
        {/* Form */}
        <Form onSubmit={handleSubmit} class="min-h-[500px]">
          {/* Current Step Content */}
          {renderStep()}
          
          {/* Navigation Buttons */}
          <NavigationButtons />
        </Form>
      </div>
    </SafeErrorBoundary>
  );
}
