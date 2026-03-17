import { createSignal, createEffect, Show, For, ParentComponent } from "solid-js";
import { useNavigate, action, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Button, ImageUpload } from "~/components/ui";
import { ValidatedInput } from "~/components/seller";
import { getShop, useShop } from "~/lib/context/shop-context";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import type { ApplyAsSellerRequest, ShopTranslationInput } from "~/lib/api/types/seller.types";
import { sellerApi } from "~/lib/api/endpoints/seller.api";

/**
 * Route Preload
 * Ensures shop data is fetched as soon as navigation starts.
 */
export const route = {
    preload: () => getShop(),
} satisfies RouteDefinition;

/**
 * Apply as Seller Action
 */
const applyAsSellerAction = action(async (formData: ApplyAsSellerRequest) => {
    "use server";
    return await sellerApi.shops.create(formData);
}, "apply-as-seller");

/**
 * Step configuration for the multi-step form
 */
const STEPS = [
    { id: 1, title: "Basic Info", description: "Shop name and description" },
    { id: 2, title: "Branding", description: "Logo and banner" },
    { id: 3, title: "Business Info", description: "Address and license" },
    { id: 4, title: "Verification", description: "Upload documents" },
] as const;

/**
 * StepProgress component - displays the multi-step form progress bar
 * Extracted outside the main component to avoid unnecessary re-renders
 */
interface StepProgressProps {
    currentStep: number;
}

const StepProgress: ParentComponent<StepProgressProps> = (props) => (
    <div class="mb-8">
        <div class="flex items-center justify-between relative">
            {/* Progress Line */}
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-forest-700">
                <div
                    class="h-full bg-terracotta-500 transition-all duration-300"
                    style={{ width: `${((props.currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
            </div>

            {/* Step Circles */}
            <For each={STEPS}>
                {(step, index) => (
                    <div class="relative z-10 flex flex-col items-center">
                        <div
                            class={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${props.currentStep > step.id
                                ? "bg-terracotta-500 text-white"
                                : props.currentStep === step.id
                                    ? "bg-terracotta-500 text-white ring-4 ring-terracotta-200 dark:ring-terracotta-800"
                                    : "bg-gray-200 dark:bg-forest-700 text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            {props.currentStep > step.id ? (
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                step.id
                            )}
                        </div>
                        <div class="mt-2 text-center">
                            <p class={`text-sm font-medium ${props.currentStep >= step.id
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                                }`}>
                                {step.title}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                {step.description}
                            </p>
                        </div>
                    </div>
                )}
            </For>
        </div>
    </div>
);

export default function SetupShop() {
    const navigate = useNavigate();
    const { t, locale } = useI18n();
    const { shop, isLoading } = useShop();
    const submission = useSubmission(applyAsSellerAction);

    // Current step state
    const [currentStep, setCurrentStep] = createSignal(1);

    // Form field errors for inline validation
    const [errors, setErrors] = createSignal<Record<string, string>>({});

    // Document upload errors for inline validation
    const [docErrors, setDocErrors] = createSignal<Record<string, string>>({});

    // Form data state
    const [formData, setFormData] = createSignal({
        shopName: "",
        about: "",
        brandStory: "",
        address: "",
        tradeLicenseNumber: "",
        tinNumber: "",
    });

    // Media IDs stored separately
    const [mediaIds, setMediaIds] = createSignal({
        logoId: undefined as string | undefined,
        bannerId: undefined as string | undefined,
        tradeLicenseDocumentId: undefined as string | undefined,
        tinDocumentId: undefined as string | undefined,
        utilityBillDocumentId: undefined as string | undefined,
    });

    // Redirect users who already have a shop
    createEffect(() => {
        const currentShop = shop();
        if (currentShop) {
            navigate("/app/seller/shops", { replace: true });
        }
    });

    // Clear errors when step changes
    createEffect(() => {
        setErrors({});
        setDocErrors({});
    });

    // Image upload hooks
    const logoUpload = useImageUpload({
        maxSizeMB: 3,
        onSuccess: (mediaId) => {
            setMediaIds({ ...mediaIds(), logoId: mediaId });
        },
    });

    const bannerUpload = useImageUpload({
        maxSizeMB: 3,
        onSuccess: (mediaId) => {
            setMediaIds({ ...mediaIds(), bannerId: mediaId });
        },
    });

    const tradeLicenseUpload = useImageUpload({
        maxSizeMB: 5,
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
        onSuccess: (mediaId) => {
            setMediaIds({ ...mediaIds(), tradeLicenseDocumentId: mediaId });
        },
    });

    const tinUpload = useImageUpload({
        maxSizeMB: 5,
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
        onSuccess: (mediaId) => {
            setMediaIds({ ...mediaIds(), tinDocumentId: mediaId });
        },
    });

    const utilityBillUpload = useImageUpload({
        maxSizeMB: 5,
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
        onSuccess: (mediaId) => {
            setMediaIds({ ...mediaIds(), utilityBillDocumentId: mediaId });
        },
    });

    // Handle submission error automatically via toaster or inline UI
    createEffect(() => {
        if (submission.error) {
            toaster.error(submission.error.message || t("seller.shop.createFailed"));
        }
    });

    // Validate current step
    const validateCurrentStep = (): boolean => {
        const current = currentStep();
        const data = formData();
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Step 1: Basic Info validation
        if (current === 1) {
            if (!data.shopName || data.shopName.trim().length < 2) {
                newErrors.shopName = t("seller.shop.nameRequired");
                isValid = false;
            }
            if (!data.about || data.about.trim().length < 10) {
                newErrors.about = t("seller.shop.aboutRequired");
                isValid = false;
            }
        }

        // Step 3: Business Info validation
        if (current === 3) {
            if (!data.address || data.address.trim().length < 5) {
                newErrors.address = t("seller.shop.addressRequired");
                isValid = false;
            }
            if (!data.tradeLicenseNumber || data.tradeLicenseNumber.trim().length === 0) {
                newErrors.tradeLicenseNumber = t("seller.shop.tradeLicenseRequired");
                isValid = false;
            }
        }

        // Step 4: Check if trade license document is uploaded
        if (current === 4) {
            if (!mediaIds().tradeLicenseDocumentId) {
                setDocErrors({ tradeLicense: t("seller.shop.tradeLicenseDocumentRequired") });
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Navigate to next step
    const goToNextStep = () => {
        if (validateCurrentStep()) {
            const current = currentStep();
            if (current < STEPS.length) {
                setCurrentStep(current + 1);
            }
        }
    };

    // Navigate to previous step
    const goToPreviousStep = () => {
        const current = currentStep();
        if (current > 1) {
            setCurrentStep(current - 1);
        }
    };

    // Handle final form submission
    const handleSubmit = (e: Event) => {
        e.preventDefault();

        // Validate current step (step 4 when submitting)
        if (!validateCurrentStep()) {
            return;
        }

        const data = formData();
        const media = mediaIds();

        // Final validation - TIN consistency (if TIN number provided, document is required)
        // Note: trade license document is already validated in validateCurrentStep() for step 4
        if (data.tinNumber && !media.tinDocumentId) {
            setDocErrors({ tin: t("seller.shop.tinDocumentRequired") });
            return;
        }

        // Safety check: tradeLicenseDocumentId should be set after validation
        if (!media.tradeLicenseDocumentId) {
            setDocErrors({ tradeLicense: t("seller.shop.tradeLicenseDocumentRequired") });
            return;
        }

        const translation: ShopTranslationInput = {
            locale: locale(),
            shopName: data.shopName.trim(),
            about: data.about.trim(),
            brandStory: data.brandStory.trim() || undefined,
            featuredHighlight: undefined,
        };

        const payload: ApplyAsSellerRequest = {
            address: data.address.trim(),
            logoId: media.logoId,
            bannerId: media.bannerId,
            translations: [translation],
            tradeLicenseNumber: data.tradeLicenseNumber.trim(),
            tradeLicenseDocumentId: media.tradeLicenseDocumentId,
            tinNumber: data.tinNumber?.trim() || undefined,
            tinDocumentId: media.tinDocumentId,
            utilityBillDocumentId: media.utilityBillDocumentId,
        };

        applyAsSellerAction(payload);
    };

    return (
        <Show when={!isLoading()} fallback={<div class="flex justify-center py-20">{t("common.loading")}</div>}>
            <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-3xl w-full space-y-8">
                    {/* Header */}
                    <div class="text-center">
                        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            {t("seller.shop.setupTitle")}
                        </h1>
                        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            {t("seller.shop.setupDescription")}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div class="bg-white dark:bg-forest-800 rounded-2xl shadow-lg border border-gray-200 dark:border-forest-700 overflow-hidden">
                        <div class="px-8 py-10">
                            {/* Progress Bar */}
                            <StepProgress currentStep={currentStep()} />

                            <form onSubmit={handleSubmit} class="space-y-6">
                                {/* Step 1: Basic Info */}
                                <Show when={currentStep() === 1}>
                                    <div class="space-y-6">
                                        <div class="text-center mb-6">
                                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                                {t("seller.shop.basicInfoTitle")}
                                            </h2>
                                            <p class="text-gray-600 dark:text-gray-400">
                                                Tell us about your shop
                                            </p>
                                        </div>

                                        {/* Shop Name */}
                                        <ValidatedInput
                                            label={t("seller.shop.nameLabel")}
                                            type="text"
                                            value={formData().shopName}
                                            onInput={(e) => setFormData({ ...formData(), shopName: (e.target as HTMLInputElement).value })}
                                            placeholder={t("seller.shop.namePlaceholder")}
                                            required
                                            minLength={2}
                                            maxLength={255}
                                            error={errors().shopName}
                                            hint="This will be displayed as your shop name on the platform."
                                        />

                                        {/* About Shop */}
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t("seller.shop.aboutLabel")}
                                                <span class="text-red-500 ml-1">*</span>
                                            </label>
                                            <textarea
                                                required
                                                minLength={10}
                                                maxLength={2000}
                                                value={formData().about}
                                                onInput={(e) => setFormData({ ...formData(), about: e.currentTarget.value })}
                                                placeholder={t("seller.shop.aboutPlaceholder")}
                                                class={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none ${errors().about
                                                    ? "border-red-500 dark:border-red-400"
                                                    : "border-gray-300 dark:border-forest-600"
                                                    }`}
                                                rows={4}
                                            />
                                            {errors().about ? (
                                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors().about}</p>
                                            ) : (
                                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Describe your shop (minimum 10 characters).
                                                </p>
                                            )}
                                        </div>

                                        {/* Brand Story (Optional) */}
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t("seller.shop.brandStoryLabel")}
                                                <span class="text-gray-400 ml-1">(Optional)</span>
                                            </label>
                                            <textarea
                                                minLength={5}
                                                maxLength={2000}
                                                value={formData().brandStory}
                                                onInput={(e) => setFormData({ ...formData(), brandStory: e.currentTarget.value })}
                                                placeholder={t("seller.shop.brandStoryPlaceholder")}
                                                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none"
                                                rows={3}
                                            />
                                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Share your brand story (optional).
                                            </p>
                                        </div>
                                    </div>
                                </Show>

                                {/* Step 2: Branding */}
                                <Show when={currentStep() === 2}>
                                    <div class="space-y-6">
                                        <div class="text-center mb-6">
                                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                                {t("seller.shop.brandingTitle")}
                                            </h2>
                                            <p class="text-gray-600 dark:text-gray-400">
                                                Upload your shop's visual identity
                                            </p>
                                        </div>

                                        {/* Logo Upload */}
                                        <ImageUpload
                                            preview={logoUpload.preview()}
                                            isUploading={logoUpload.isUploading()}
                                            isDeleting={logoUpload.isDeleting()}
                                            onFileSelect={logoUpload.upload}
                                            onDelete={logoUpload.deleteMedia}
                                            label={t("seller.shop.logoLabel")}
                                            description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                                        />

                                        {/* Banner Upload */}
                                        <ImageUpload
                                            preview={bannerUpload.preview()}
                                            isUploading={bannerUpload.isUploading()}
                                            isDeleting={bannerUpload.isDeleting()}
                                            onFileSelect={bannerUpload.upload}
                                            onDelete={bannerUpload.deleteMedia}
                                            label={t("seller.shop.bannerLabel")}
                                            description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                                        />
                                    </div>
                                </Show>

                                {/* Step 3: Business Info */}
                                <Show when={currentStep() === 3}>
                                    <div class="space-y-6">
                                        <div class="text-center mb-6">
                                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                                {t("seller.shop.businessInfoTitle")}
                                            </h2>
                                            <p class="text-gray-600 dark:text-gray-400">
                                                Provide your business details
                                            </p>
                                        </div>

                                        {/* Address */}
                                        <ValidatedInput
                                            label={t("seller.shop.addressLabel")}
                                            type="text"
                                            value={formData().address}
                                            onInput={(e) => setFormData({ ...formData(), address: (e.target as HTMLInputElement).value })}
                                            placeholder={t("seller.shop.addressPlaceholder")}
                                            required
                                            minLength={5}
                                            maxLength={500}
                                            error={errors().address}
                                            hint="Full business address."
                                        />

                                        {/* Trade License Number */}
                                        <ValidatedInput
                                            label={t("seller.shop.tradeLicenseNumberLabel")}
                                            type="text"
                                            value={formData().tradeLicenseNumber}
                                            onInput={(e) => setFormData({ ...formData(), tradeLicenseNumber: (e.target as HTMLInputElement).value })}
                                            placeholder={t("seller.shop.tradeLicenseNumberPlaceholder")}
                                            required
                                            error={errors().tradeLicenseNumber}
                                        />
                                    </div>
                                </Show>

                                {/* Step 4: Verification Documents */}
                                <Show when={currentStep() === 4}>
                                    <div class="space-y-6">
                                        <div class="text-center mb-6">
                                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                                {t("seller.shop.verificationTitle")}
                                            </h2>
                                            <p class="text-gray-600 dark:text-gray-400">
                                                Upload verification documents
                                            </p>
                                        </div>

                                        {/* Trade License Document */}
                                        <div>
                                            <ImageUpload
                                                preview={tradeLicenseUpload.preview()}
                                                isUploading={tradeLicenseUpload.isUploading()}
                                                isDeleting={tradeLicenseUpload.isDeleting()}
                                                onFileSelect={tradeLicenseUpload.upload}
                                                onDelete={tradeLicenseUpload.deleteMedia}
                                                label={t("seller.shop.tradeLicenseDocumentLabel")}
                                                description="PDF or Image (max 5MB) - Required"
                                            />
                                            {docErrors().tradeLicense && (
                                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{docErrors().tradeLicense}</p>
                                            )}
                                        </div>

                                        {/* TIN Document (Optional) */}
                                        <div>
                                            <ImageUpload
                                                preview={tinUpload.preview()}
                                                isUploading={tinUpload.isUploading()}
                                                isDeleting={tinUpload.isDeleting()}
                                                onFileSelect={tinUpload.upload}
                                                onDelete={tinUpload.deleteMedia}
                                                label={t("seller.shop.tinDocumentLabel")}
                                                description="PDF or Image (max 5MB) - Optional"
                                            />
                                            {docErrors().tin && (
                                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{docErrors().tin}</p>
                                            )}
                                        </div>

                                        {/* Utility Bill (Optional) */}
                                        <ImageUpload
                                            preview={utilityBillUpload.preview()}
                                            isUploading={utilityBillUpload.isUploading()}
                                            isDeleting={utilityBillUpload.isDeleting()}
                                            onFileSelect={utilityBillUpload.upload}
                                            onDelete={utilityBillUpload.deleteMedia}
                                            label={t("seller.shop.utilityBillDocumentLabel")}
                                            description="PDF or Image (max 5MB) - Optional"
                                        />
                                    </div>
                                </Show>

                                {/* Navigation Buttons */}
                                <div class="flex justify-between pt-6 border-t border-gray-200 dark:border-forest-700">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={goToPreviousStep}
                                        disabled={currentStep() === 1 || submission.pending}
                                        class={currentStep() === 1 ? "invisible" : ""}
                                    >
                                        Previous
                                    </Button>

                                    {currentStep() < STEPS.length ? (
                                        <Button
                                            type="button"
                                            variant="accent"
                                            onClick={goToNextStep}
                                            disabled={submission.pending}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            variant="accent"
                                            disabled={submission.pending}
                                        >
                                            {submission.pending ? t("common.loading") : t("seller.shop.createButton")}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer Note */}
                        <div class="bg-terracotta-50 dark:bg-terracotta-900/20 px-8 py-4 border-t border-terracotta-100 dark:border-terracotta-800">
                            <p class="text-sm text-terracotta-800 dark:text-terracotta-200">
                                💡 <strong>Note:</strong> You can update your shop information later from settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );
}
