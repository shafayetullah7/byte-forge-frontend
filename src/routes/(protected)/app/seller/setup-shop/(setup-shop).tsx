import { createSignal, createEffect, Show, For, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { slugify } from "~/lib/utils/slugify";
import { useNavigate, action, useSubmission, type RouteDefinition, redirect } from "@solidjs/router";
import { Button, ImageUpload, Card, SegmentedControl } from "~/components/ui";
import { ValidatedInput } from "~/components/seller";
import { getShop, useShop } from "~/lib/context/shop-context";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import type { ApplyAsSellerRequest, ShopTranslationInput } from "~/lib/api/types/seller.types";
import { sellerApi } from "~/lib/api/endpoints/seller.api";
import type { Locale } from "~/i18n";
import { GlobeAltIcon } from "~/components/icons";

/**
 * Route Preload
 * Ensures shop data is fetched as soon as navigation starts.
 */
export const route = {
    preload: () => getShop(),
} satisfies RouteDefinition;

/**
 * Apply as Seller Action
 * Uses single-flight mutation pattern with automatic query revalidation
 */
const applyAsSellerAction = action(async (formData: ApplyAsSellerRequest) => {
    "use server";
    await sellerApi.shops.create(formData);
    // Revalidate shop query and redirect in a single flight
    // This ensures the updated shop data is fetched immediately
    throw redirect("/app/seller/shops", { revalidate: getShop.key });
}, "apply-as-seller");

/**
 * Step configuration for the multi-step form
 */
const STEPS = [
    { id: 1, title: "seller.shop.steps.basicInfo", description: "seller.shop.steps.basicInfoDesc" },
    { id: 2, title: "seller.shop.steps.branding", description: "seller.shop.steps.brandingDesc" },
    { id: 3, title: "seller.shop.steps.businessInfo", description: "seller.shop.steps.businessInfoDesc" },
    { id: 4, title: "seller.shop.steps.verification", description: "seller.shop.steps.verificationDesc" },
] as const;

/**
 * StepProgress component - displays the multi-step form progress bar
 * Extracted outside the main component to avoid unnecessary re-renders
 */
interface StepProgressProps {
    currentStep: number;
    t: (key: string) => string;
}

const StepProgress: ParentComponent<StepProgressProps> = (props) => (
    <div class="mb-8">
        <div class="flex items-center justify-between relative">
            {/* Progress Line */}
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-cream-200 dark:bg-forest-700">
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
                                    : "bg-cream-200 dark:bg-forest-700 text-forest-700/60 dark:text-cream-100/60"
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
                                : "text-forest-700/60 dark:text-cream-100/60"
                                }`}>
                                {props.t(step.title)}
                            </p>
                            <p class="text-xs text-forest-700/60 dark:text-cream-100/60 hidden sm:block">
                                {props.t(step.description)}
                            </p>
                        </div>
                    </div>
                )}
            </For>
        </div>
    </div>
);

// Available locales for shop translations
const AVAILABLE_LOCALES: Locale[] = ["en", "bn"];

export default function SetupShop() {
    const navigate = useNavigate();
    const { t, locale, setLocale } = useI18n();
    const { shop, isLoading } = useShop();
    const submission = useSubmission(applyAsSellerAction);

    // Current step state
    const [currentStep, setCurrentStep] = createSignal(1);

    // Form field errors for inline validation
    const [errors, setErrors] = createSignal<Record<string, string>>({});

    // Document upload errors for inline validation
    const [docErrors, setDocErrors] = createSignal<Record<string, string>>({});

    // Form data state - translations organized by locale using createStore for nested state
    const [translations, setTranslations] = createStore<Record<Locale, {
        shopName: string;
        about: string;
        brandStory: string;
    }>>({
        en: { shopName: "", about: "", brandStory: "" },
        bn: { shopName: "", about: "", brandStory: "" },
    });

    // Business info (same across all locales)
    const [businessInfo, setBusinessInfo] = createSignal({
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

    // Currently selected locale for editing translations in Step 1
    const [editingLocale, setEditingLocale] = createSignal<Locale>("en");

    // Shop slug state
    const [shopSlug, setShopSlug] = createSignal("");
    const [isSlugManual, setIsSlugManual] = createSignal(false);

    // Auto-generate slug when English shop name changes (if not manual)
    createEffect(() => {
        const englishName = translations.en.shopName;
        if (!isSlugManual() && englishName) {
            setShopSlug(slugify(englishName));
        } else if (!isSlugManual() && !englishName) {
            setShopSlug("");
        }
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
        const currentBusinessInfo = businessInfo();
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Step 1: Basic Info validation - validate the currently editing locale
        if (current === 1) {
            const currentLocale = editingLocale();
            const translation = translations[currentLocale];

            if (translation.shopName.trim().length < 2) {
                newErrors.shopName = t("seller.shop.nameRequired");
                isValid = false;
            }
            if (translation.about.trim().length < 10) {
                newErrors.about = t("seller.shop.aboutRequired");
                isValid = false;
            }
        }

        // Step 3: Business Info validation
        if (current === 3) {
            if (!currentBusinessInfo.address || currentBusinessInfo.address.trim().length < 5) {
                newErrors.address = t("seller.shop.addressRequired");
                isValid = false;
            }
            if (!currentBusinessInfo.tradeLicenseNumber || currentBusinessInfo.tradeLicenseNumber.trim().length === 0) {
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

        const currentBusinessInfo = businessInfo();
        const media = mediaIds();

        // Final validation - TIN consistency (if TIN number provided, document is required)
        // Note: trade license document is already validated in validateCurrentStep() for step 4
        if (currentBusinessInfo.tinNumber && !media.tinDocumentId) {
            setDocErrors({ tin: t("seller.shop.tinDocumentRequired") });
            return;
        }

        // Safety check: tradeLicenseDocumentId should be set after validation
        if (!media.tradeLicenseDocumentId) {
            setDocErrors({ tradeLicense: t("seller.shop.tradeLicenseDocumentRequired") });
            return;
        }

        // Build translations array for all locales with complete data
        const translationsPayload: ShopTranslationInput[] = AVAILABLE_LOCALES
            .filter((loc) => {
                const translation = translations[loc];
                // Only include locales with both shopName (≥2 chars) AND about (≥10 chars)
                return translation.shopName.trim().length >= 2 && translation.about.trim().length >= 10;
            })
            .map((loc) => ({
                locale: loc,
                shopName: translations[loc].shopName.trim(),
                about: translations[loc].about.trim(),
                brandStory: translations[loc].brandStory.trim() || undefined,
                featuredHighlight: undefined,
            }));

        const payload: ApplyAsSellerRequest = {
            address: currentBusinessInfo.address.trim(),
            slug: shopSlug().trim() || undefined,
            logoId: media.logoId,
            bannerId: media.bannerId,
            translations: translationsPayload,
            tradeLicenseNumber: currentBusinessInfo.tradeLicenseNumber.trim(),
            tradeLicenseDocumentId: media.tradeLicenseDocumentId,
            tinNumber: currentBusinessInfo.tinNumber?.trim() || undefined,
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
                            <StepProgress currentStep={currentStep()} t={t} />

                            <form onSubmit={handleSubmit} class="space-y-6">
                                {/* Step 1: Basic Info (with multi-language support) */}
                                <Show when={currentStep() === 1}>
                                    <div class="space-y-6">
                                        <div class="text-center mb-6">
                                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                                {t("seller.shop.basicInfoTitle")}
                                            </h2>
                                            <p class="text-gray-600 dark:text-gray-400">
                                                {t("seller.shop.basicInfoSubtitle")}
                                            </p>
                                        </div>

                                        {/* Multi-language Info Banner */}
                                        <Card variant="tinted" class="mb-6">
                                            <div class="flex gap-3">
                                                <svg class="w-5 h-5 text-forest-600 dark:text-forest-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p class="h6 text-forest-700 dark:text-gray-300 mb-1">
                                                        {t("seller.shop.multiLanguageTitle")}
                                                    </p>
                                                    <p class="body-small text-forest-700/70 dark:text-gray-400">
                                                        {t("seller.shop.multiLanguageDescription")}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Language Selector with SegmentedControl */}
                                        <div class="mb-6">
                                            <div class="flex items-center justify-between mb-3">
                                                <h6 class="text-forest-700 dark:text-gray-300">
                                                    {t("seller.shop.selectLanguage")}
                                                </h6>
                                                <span class="body-small text-forest-700/70 dark:text-gray-400 font-semibold">
                                                    {t("seller.shop.languageProgress", {
                                                        completed: AVAILABLE_LOCALES.filter((loc) =>
                                                            translations[loc].shopName.trim().length >= 2 && translations[loc].about.trim().length >= 10
                                                        ).length,
                                                        total: AVAILABLE_LOCALES.length
                                                    })}
                                                </span>
                                            </div>
                                            <SegmentedControl<Locale>
                                                options={[
                                                    { value: "en", label: t("seller.shop.englishLabel"), icon: GlobeAltIcon },
                                                    { value: "bn", label: t("seller.shop.bengaliLabel"), icon: GlobeAltIcon }
                                                ]}
                                                value={editingLocale()}
                                                onChange={setEditingLocale}
                                                size="md"
                                                fullWidth={false}
                                            />
                                            {/* Completion Status */}
                                            <div class="grid grid-cols-2 gap-3 mt-3">
                                                <For each={AVAILABLE_LOCALES}>
                                                    {(loc) => {
                                                        const isComplete = translations[loc].shopName.trim().length >= 2 && translations[loc].about.trim().length >= 10;
                                                        return (
                                                            <div class={`flex items-center gap-2 p-2 rounded-lg border ${isComplete
                                                                    ? "border-forest-500 bg-forest-50 dark:bg-forest-900/30"
                                                                    : "border-cream-200 dark:border-forest-700"
                                                                }`}>
                                                                <Show when={isComplete} fallback={
                                                                    <div class="w-5 h-5 rounded-full border-2 border-cream-300 dark:border-forest-600" />
                                                                }>
                                                                    <svg class="w-5 h-5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </Show>
                                                                <span class={`body-small ${isComplete
                                                                        ? "text-forest-700 dark:text-gray-300 font-semibold"
                                                                        : "text-forest-700/60 dark:text-cream-100/60"
                                                                    }`}>
                                                                    {loc === "en" ? t("seller.shop.englishLabel") : t("seller.shop.bengaliLabel")}
                                                                    {" "}
                                                                    {isComplete ? t("seller.shop.languageComplete") : t("seller.shop.languageIncomplete")}
                                                                </span>
                                                            </div>
                                                        );
                                                    }}
                                                </For>
                                            </div>
                                        </div>

                                        {/* Shop Name */}
                                        <ValidatedInput
                                            label={t("seller.shop.nameLabel")}
                                            type="text"
                                            value={translations[editingLocale()].shopName}
                                            onInput={(e) => setTranslations(editingLocale(), "shopName", (e.target as HTMLInputElement).value)}
                                            placeholder={t("seller.shop.namePlaceholder")}
                                            required
                                            minLength={2}
                                            maxLength={255}
                                            error={errors().shopName}
                                            hint={t("seller.shop.nameHint")}
                                        />

                                        {/* Shop Slug (URL) */}
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t("seller.shop.slugLabel")}
                                                <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                                            </label>
                                            <div class="flex rounded-lg shadow-sm">
                                                <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-forest-600 bg-gray-50 dark:bg-forest-800 text-gray-500 dark:text-gray-400 text-sm">
                                                    byteforge.com/shop/
                                                </span>
                                                <input
                                                    type="text"
                                                    value={shopSlug()}
                                                    onInput={(e) => {
                                                        setShopSlug((e.currentTarget as HTMLInputElement).value);
                                                        setIsSlugManual(true);
                                                    }}
                                                    placeholder={t("seller.shop.slugPlaceholder")}
                                                    class="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-gray-300 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors sm:text-sm"
                                                />
                                            </div>
                                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {t("seller.shop.slugHint")}
                                            </p>
                                        </div>

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
                                                value={translations[editingLocale()].about}
                                                onInput={(e) => setTranslations(editingLocale(), "about", e.currentTarget.value)}
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
                                                    {t("seller.shop.aboutHint")}
                                                </p>
                                            )}
                                        </div>

                                        {/* Brand Story (Optional) */}
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t("seller.shop.brandStoryLabel")}
                                                <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                                            </label>
                                            <textarea
                                                minLength={5}
                                                maxLength={2000}
                                                value={translations[editingLocale()].brandStory}
                                                onInput={(e) => setTranslations(editingLocale(), "brandStory", e.currentTarget.value)}
                                                placeholder={t("seller.shop.brandStoryPlaceholder")}
                                                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none"
                                                rows={3}
                                            />
                                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {t("seller.shop.brandStoryHint")}
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
                                                {t("seller.shop.brandingSubtitle")}
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
                                                {t("seller.shop.businessInfoSubtitle")}
                                            </p>
                                        </div>

                                        {/* Address */}
                                        <ValidatedInput
                                            label={t("seller.shop.addressLabel")}
                                            type="text"
                                            value={businessInfo().address}
                                            onInput={(e) => setBusinessInfo({ ...businessInfo(), address: (e.target as HTMLInputElement).value })}
                                            placeholder={t("seller.shop.addressPlaceholder")}
                                            required
                                            minLength={5}
                                            maxLength={500}
                                            error={errors().address}
                                            hint={t("seller.shop.addressHint")}
                                        />

                                        {/* Trade License Number */}
                                        <ValidatedInput
                                            label={t("seller.shop.tradeLicenseNumberLabel")}
                                            type="text"
                                            value={businessInfo().tradeLicenseNumber}
                                            onInput={(e) => setBusinessInfo({ ...businessInfo(), tradeLicenseNumber: (e.target as HTMLInputElement).value })}
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
                                                {t("seller.shop.verificationSubtitle")}
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
                                                description={t("seller.shop.tradeLicenseDocumentDesc")}
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
                                                description={t("seller.shop.tinDocumentDesc")}
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
                                            description={t("seller.shop.utilityBillDocumentDesc")}
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
                                        {t("seller.shop.previousButton")}
                                    </Button>

                                    {currentStep() < STEPS.length ? (
                                        <Button
                                            type="button"
                                            variant="accent"
                                            onClick={goToNextStep}
                                            disabled={submission.pending}
                                        >
                                            {t("seller.shop.nextButton")}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            variant="accent"
                                            disabled={submission.pending}
                                        >
                                            {submission.pending ? t("seller.shop.creating") : t("seller.shop.createButton")}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer Note */}
                        <div class="bg-terracotta-50 dark:bg-terracotta-900/20 px-8 py-4 border-t border-terracotta-100 dark:border-terracotta-800">
                            <p class="text-sm text-terracotta-800 dark:text-terracotta-200">
                                💡 <strong>{t("common.note")}:</strong> {t("seller.shop.footerNote")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );
}
