import { createSignal, createEffect, Show, For, ParentComponent, Suspense } from "solid-js";
import { createStore } from "solid-js/store";
import { slugify } from "~/lib/utils/slugify";
import { useNavigate, action, useSubmission, useAction, createAsync, type RouteDefinition, redirect } from "@solidjs/router";
import { Button, ImageUpload, Card, SegmentedControl } from "~/components/ui";
import { ValidatedInput } from "~/components/seller";
import { getShop } from "~/lib/context/shop-context";
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
    throw redirect("/app/seller/my-shop", { revalidate: getShop.key });
}, "apply-as-seller");

/**
 * Step configuration for the multi-step form (Simplified 2-step)
 */
const STEPS = [
    { id: 1, title: "seller.shop.steps.basicInfo", description: "seller.shop.steps.basicInfoDesc" },
    { id: 2, title: "seller.shop.steps.branding", description: "seller.shop.steps.brandingDesc" },
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
                            <p class={`body-small font-medium ${props.currentStep >= step.id
                                ? "text-forest-800 dark:text-cream-50"
                                : "text-forest-700/60 dark:text-cream-100/60"
                                }`}>
                                {props.t(step.title)}
                            </p>
                            <p class="body-small text-forest-700/60 dark:text-cream-100/60 hidden sm:block">
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
    const shop = createAsync(() => getShop());
    const applyTrigger = useAction(applyAsSellerAction);
    const submission = useSubmission(applyAsSellerAction);

    // Current step state
    const [currentStep, setCurrentStep] = createSignal(1);

    // Form field errors for inline validation
    const [errors, setErrors] = createSignal<Record<string, string>>({});

    // Document upload errors for inline validation
    const [docErrors, setDocErrors] = createSignal<Record<string, string>>({});

    // Form data state - translations organized by locale using createStore for nested state
    const [translations, setTranslations] = createStore<Record<Locale, {
        name: string;
        description: string;
        businessHours: string;
    }>>({
        en: { name: "", description: "", businessHours: "" },
        bn: { name: "", description: "", businessHours: "" },
    });

    // Business info (same across all locales)
    const [businessInfo, setBusinessInfo] = createSignal({
        address: "",
    });

    // Media IDs stored separately
    const [mediaIds, setMediaIds] = createSignal({
        logoId: undefined as string | undefined,
        bannerId: undefined as string | undefined,
    });

    // Currently selected locale for editing translations in Step 1
    const [editingLocale, setEditingLocale] = createSignal<Locale>("en");

    // Shop slug state
    const [shopSlug, setShopSlug] = createSignal("");
    const [isSlugManual, setIsSlugManual] = createSignal(false);

    // Auto-generate slug when English shop name changes (if not manual)
    createEffect(() => {
        const englishName = translations.en.name;
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

        // Step 1: Basic Info validation - validate BOTH locales
        if (current === 1) {
            // Validate English
            if (translations.en.name.trim().length < 1) {
                newErrors.name = t("seller.shop.nameRequired");
                isValid = false;
            }
            if (translations.en.description.trim().length < 10) {
                newErrors.description = t("seller.shop.aboutRequired");
                isValid = false;
            }

            // Validate Bengali
            if (translations.bn.name.trim().length < 1) {
                newErrors.name = t("seller.shop.nameRequired");
                isValid = false;
            }
            if (translations.bn.description.trim().length < 10) {
                newErrors.description = t("seller.shop.aboutRequired");
                isValid = false;
            }

            // Validate address
            if (!currentBusinessInfo.address || currentBusinessInfo.address.trim().length < 5) {
                newErrors.address = t("seller.shop.addressRequired");
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

        // Validate current step
        if (!validateCurrentStep()) {
            return;
        }

        const currentBusinessInfo = businessInfo();
        const media = mediaIds();

        // Build translations array for all locales with complete data
        const translationsPayload: ShopTranslationInput[] = AVAILABLE_LOCALES
            .filter((loc) => {
                const translation = translations[loc];
                // Only include locales with both name (≥1 char) AND description (≥10 chars)
                return translation.name.trim().length >= 1 && translation.description.trim().length >= 10;
            })
            .map((loc) => ({
                locale: loc,
                name: translations[loc].name.trim(),
                description: translations[loc].description.trim(),
                businessHours: translations[loc].businessHours.trim() || undefined,
            }));

        const payload: ApplyAsSellerRequest = {
            address: currentBusinessInfo.address.trim(),
            slug: shopSlug().trim() || undefined,
            logoId: media.logoId,
            bannerId: media.bannerId,
            translations: translationsPayload,
        };

        applyTrigger(payload);
    };

    return (
        <Suspense fallback={<div class="flex justify-center py-20">{t("common.loading")}</div>}>
            <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-3xl w-full space-y-8">
                    {/* Header */}
                    <div class="text-center">
                        <h1 class="h1 mb-3">
                            {t("seller.shop.setupTitle")}
                        </h1>
                        <p class="body-base text-forest-700/70 dark:text-gray-400 max-w-xl mx-auto">
                            {t("seller.shop.setupDescription")}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div class="flat-card bg-white dark:bg-forest-800 overflow-hidden">
                        <div class="px-8 py-10">
                            {/* Progress Bar */}
                            <StepProgress currentStep={currentStep()} t={t} />

                            <form onSubmit={handleSubmit} class="space-y-6">
                                {/* Step 1: Basic Info */}
                                <Show when={currentStep() === 1}>
                                    <div class="space-y-8">
                                        {/* Section 1: Shop Identity */}
                                        <div class="space-y-4">
                                            <div>
                                                <h3 class="h5 mb-1">
                                                    {t("seller.shop.shopIdentityTitle")}
                                                </h3>
                                                <p class="body-small text-forest-700/70 dark:text-gray-400">
                                                    {t("seller.shop.shopIdentityDescription")}
                                                </p>
                                            </div>

                                            {/* Shop Slug (URL) - Global Identity Field */}
                                            <Card variant="tinted" class="p-4">
                                                <div>
                                                    <label class="block h6 text-gray-700 dark:text-gray-300 mb-2">
                                                        {t("seller.shop.slugSectionTitle")}
                                                        <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                                                    </label>
                                                    <div class="flex rounded-lg shadow-sm">
                                                        <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-cream-200 dark:border-forest-600 bg-cream-50 dark:bg-forest-800 text-forest-700/70 dark:text-gray-400 body-small">
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
                                                            class="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors body-small"
                                                        />
                                                    </div>
                                                    <p class="mt-2 body-small text-forest-700/70 dark:text-gray-400">
                                                        💡 {t("seller.shop.slugIdentityHint")}
                                                    </p>
                                                </div>
                                            </Card>
                                        </div>

                                        {/* Section 2: Customer-Facing Content */}
                                        <div class="space-y-4">
                                            <div>
                                                <h3 class="h5 mb-1">
                                                    {t("seller.shop.customerFacingTitle")}
                                                </h3>
                                                <p class="body-small text-forest-700/70 dark:text-gray-400">
                                                    {t("seller.shop.customerFacingDescription")}
                                                </p>
                                            </div>

                                            {/* Side-by-Side Language Columns */}
                                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {/* English Column */}
                                                <div class={`rounded-xl border-2 p-4 space-y-4 ${errors().name || errors().description
                                                    ? "border-red-300 dark:border-red-700"
                                                    : translations.en.name.trim().length >= 1 && translations.en.description.trim().length >= 10
                                                        ? "border-forest-500 bg-forest-50 dark:bg-forest-900/20"
                                                        : "border-cream-200 dark:border-forest-700"
                                                    }`}>
                                                    <div class="flex items-center gap-2 mb-4">
                                                        <span class="text-2xl">🇬🇧</span>
                                                        <div>
                                                            <h4 class="h6">
                                                                {t("seller.shop.englishLabel")}
                                                            </h4>
                                                            <p class="body-small text-forest-700/70 dark:text-gray-400">
                                                                {t("seller.shop.englishColumnHeader")}
                                                            </p>
                                                        </div>
                                                        <div class="ml-auto">
                                                            <Show when={translations.en.name.trim().length >= 1 && translations.en.description.trim().length >= 10} keyed>
                                                                <svg class="w-6 h-6 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </Show>
                                                            <Show when={!(translations.en.name.trim().length >= 1 && translations.en.description.trim().length >= 10)} keyed>
                                                                <div class="w-6 h-6 rounded-full border-2 border-cream-300 dark:border-forest-600" />
                                                            </Show>
                                                        </div>
                                                    </div>

                                                    {/* English Shop Name */}
                                                    <div>
                                                        <label class="block h6 mb-1">
                                                            {t("seller.shop.nameLabel")}
                                                            <span class="text-red-500 ml-1">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={translations.en.name}
                                                            onInput={(e) => setTranslations("en", "name", (e.target as HTMLInputElement).value)}
                                                            placeholder={t("seller.shop.namePlaceholder")}
                                                            class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors body-small ${errors().name
                                                                ? "border-red-500 dark:border-red-400"
                                                                : "border-cream-200 dark:border-forest-600"
                                                                }`}
                                                        />
                                                        <Show when={errors().name}>
                                                            <p class="mt-1 body-small text-red-600 dark:text-red-400">{errors().name}</p>
                                                        </Show>
                                                    </div>

                                                    {/* English Description */}
                                                    <div>
                                                        <label class="block h6 mb-1">
                                                            {t("seller.shop.aboutLabel")}
                                                            <span class="text-red-500 ml-1">*</span>
                                                        </label>
                                                        <textarea
                                                            value={translations.en.description}
                                                            onInput={(e) => setTranslations("en", "description", (e.target as HTMLTextAreaElement).value)}
                                                            placeholder={t("seller.shop.aboutPlaceholder")}
                                                            class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none body-small ${errors().description
                                                                ? "border-red-500 dark:border-red-400"
                                                                : "border-cream-200 dark:border-forest-600"
                                                                }`}
                                                            rows={4}
                                                        />
                                                        <Show when={errors().description}>
                                                            <p class="mt-1 body-small text-red-600 dark:text-red-400">{errors().description}</p>
                                                        </Show>
                                                    </div>

                                                    {/* English Business Hours */}
                                                    <div>
                                                        <label class="block h6 mb-1">
                                                            {t("seller.shop.brandStoryLabel")}
                                                            <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                                                        </label>
                                                        <textarea
                                                            value={translations.en.businessHours}
                                                            onInput={(e) => setTranslations("en", "businessHours", (e.target as HTMLTextAreaElement).value)}
                                                            placeholder={t("seller.shop.brandStoryPlaceholder")}
                                                            class="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none body-small"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Bengali Column */}
                                                <div class={`rounded-xl border-2 p-4 space-y-4 ${errors().name || errors().description
                                                    ? "border-red-300 dark:border-red-700"
                                                    : translations.bn.name.trim().length >= 1 && translations.bn.description.trim().length >= 10
                                                        ? "border-forest-500 bg-forest-50 dark:bg-forest-900/20"
                                                        : "border-cream-200 dark:border-forest-700"
                                                    }`}>
                                                    <div class="flex items-center gap-2 mb-4">
                                                        <span class="text-2xl">🇧🇩</span>
                                                        <div>
                                                            <h4 class="h6">
                                                                {t("seller.shop.bengaliLabel")}
                                                            </h4>
                                                            <p class="body-small text-forest-700/70 dark:text-gray-400">
                                                                {t("seller.shop.bengaliColumnHeader")}
                                                            </p>
                                                        </div>
                                                        <div class="ml-auto">
                                                            <Show when={translations.bn.name.trim().length >= 1 && translations.bn.description.trim().length >= 10} keyed>
                                                                <svg class="w-6 h-6 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </Show>
                                                            <Show when={!(translations.bn.name.trim().length >= 1 && translations.bn.description.trim().length >= 10)} keyed>
                                                                <div class="w-6 h-6 rounded-full border-2 border-cream-300 dark:border-forest-600" />
                                                            </Show>
                                                        </div>
                                                    </div>

                                                    {/* Bengali Shop Name */}
                                                    <div>
                                                        <label class="block h6 mb-1">
                                                            {t("seller.shop.nameLabel")}
                                                            <span class="text-red-500 ml-1">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={translations.bn.name}
                                                            onInput={(e) => setTranslations("bn", "name", (e.target as HTMLInputElement).value)}
                                                            placeholder={t("seller.shop.namePlaceholder")}
                                                            class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors body-small ${errors().name
                                                                ? "border-red-500 dark:border-red-400"
                                                                : "border-cream-200 dark:border-forest-600"
                                                                }`}
                                                            dir="auto"
                                                        />
                                                        <Show when={errors().name}>
                                                            <p class="mt-1 body-small text-red-600 dark:text-red-400">{errors().name}</p>
                                                        </Show>
                                                    </div>

                                                    {/* Bengali Description */}
                                                    <div>
                                                        <label class="block h6 mb-1">
                                                            {t("seller.shop.aboutLabel")}
                                                            <span class="text-red-500 ml-1">*</span>
                                                        </label>
                                                        <textarea
                                                            value={translations.bn.description}
                                                            onInput={(e) => setTranslations("bn", "description", (e.target as HTMLTextAreaElement).value)}
                                                            placeholder={t("seller.shop.aboutPlaceholder")}
                                                            class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none body-small ${errors().description
                                                                ? "border-red-500 dark:border-red-400"
                                                                : "border-cream-200 dark:border-forest-600"
                                                                }`}
                                                            rows={4}
                                                            dir="auto"
                                                        />
                                                        <Show when={errors().description}>
                                                            <p class="mt-1 body-small text-red-600 dark:text-red-400">{errors().description}</p>
                                                        </Show>
                                                    </div>

                                                    {/* Bengali Business Hours */}
                                                    <div>
                                                        <label class="block h6 mb-1">
                                                            {t("seller.shop.brandStoryLabel")}
                                                            <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                                                        </label>
                                                        <textarea
                                                            value={translations.bn.businessHours}
                                                            onInput={(e) => setTranslations("bn", "businessHours", (e.target as HTMLTextAreaElement).value)}
                                                            placeholder={t("seller.shop.brandStoryPlaceholder")}
                                                            class="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none body-small"
                                                            rows={3}
                                                            dir="auto"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Both Languages Required Warning */}
                                            <Card variant="tinted" class="p-3">
                                                <div class="flex items-start gap-3">
                                                    <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <div>
                                                        <p class="h6 text-amber-800 dark:text-amber-300">
                                                            {t("seller.shop.bothLanguagesRequired")}
                                                        </p>
                                                        <p class="body-small text-amber-700 dark:text-amber-400 mt-1">
                                                            {t("seller.shop.multiLanguageDescription")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>

                                        {/* Section 3: Address */}
                                        <div class="space-y-4">
                                            <div>
                                                <h3 class="h5 mb-1">
                                                    {t("seller.shop.addressSectionTitle")}
                                                </h3>
                                                <p class="body-small text-forest-700/70 dark:text-gray-400">
                                                    {t("seller.shop.addressSectionDescription")}
                                                </p>
                                            </div>

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
                                        </div>
                                    </div>
                                </Show>

                                {/* Step 2: Branding (Optional) */}
                                <Show when={currentStep() === 2}>
                                    <div class="space-y-6">
                                        <div class="text-center mb-6">
                                            <h2 class="h1">
                                                {t("seller.shop.brandingTitle")}
                                            </h2>
                                            <p class="body-base text-forest-700/70 dark:text-gray-400">
                                                {t("seller.shop.brandingSubtitle")}
                                            </p>
                                        </div>

                                        {/* Logo Upload (Optional) */}
                                        <ImageUpload
                                            preview={logoUpload.preview()}
                                            isUploading={logoUpload.isUploading()}
                                            isDeleting={logoUpload.isDeleting()}
                                            onFileSelect={logoUpload.upload}
                                            onDelete={logoUpload.deleteMedia}
                                            label={t("seller.shop.logoLabel")}
                                            description="JPEG, PNG, WEBP, or GIF (max 3MB) - Optional"
                                        />

                                        {/* Banner Upload (Optional) */}
                                        <ImageUpload
                                            preview={bannerUpload.preview()}
                                            isUploading={bannerUpload.isUploading()}
                                            isDeleting={bannerUpload.isDeleting()}
                                            onFileSelect={bannerUpload.upload}
                                            onDelete={bannerUpload.deleteMedia}
                                            label={t("seller.shop.bannerLabel")}
                                            description="JPEG, PNG, WEBP, or GIF (max 3MB) - Optional"
                                        />

                                        {/* Skip Note */}
                                        <Card variant="tinted" class="p-4">
                                            <p class="body-small text-forest-700/70 dark:text-gray-400">
                                                💡 You can add branding later. Click "Create Shop" to finish setup now.
                                            </p>
                                        </Card>
                                    </div>
                                </Show>

                                {/* Navigation Buttons */}
                                <div class="flex justify-between pt-6 border-t border-cream-200 dark:border-forest-700">
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
                            <p class="body-small text-terracotta-800 dark:text-terracotta-200">
                                💡 <strong>{t("common.note")}:</strong> {t("seller.shop.footerNote")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
