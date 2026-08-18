import { createSignal, createEffect, Show, For, ParentComponent, Suspense } from "solid-js";
import { createStore } from "solid-js/store";
import { slugify } from "~/lib/utils/slugify";
import { useNavigate, action, useSubmission, useAction, createAsync, type RouteDefinition, redirect } from "@solidjs/router";
import { Button, FieldGroup, ImageUpload, Input, Textarea, fieldControlClass } from "~/components/ui";
import { getShop } from "~/lib/context/shop-context";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
import { getShopSlugPrefix } from "~/lib/seo/meta";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import type { ApplyAsSellerRequest, ShopTranslationInput } from "~/lib/api/types/seller.types";
import { sellerApi } from "~/lib/api/endpoints/seller";
import type { Locale } from "~/i18n";

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

// Available locales for shop translations
const AVAILABLE_LOCALES: Locale[] = ["en", "bn"];

export default function SetupShop() {
    const navigate = useNavigate();
    const { t, locale, setLocale } = useI18n();
    const shop = createAsync(() => getShop(), { deferStream: true });
    const applyTrigger = useAction(applyAsSellerAction);
    const submission = useSubmission(applyAsSellerAction);

    // Form field errors for inline validation
    const [errors, setErrors] = createSignal<Record<string, string>>({});

    // Form data state - translations organized by locale using createStore for nested state
    const [translations, setTranslations] = createStore<Record<Locale, {
        name: string;
        description: string;
        businessHours: string;
    }>>({
        en: { name: "", description: "", businessHours: "" },
        bn: { name: "", description: "", businessHours: "" },
    });

    // Media IDs stored separately
    const [mediaIds, setMediaIds] = createSignal({
        logoId: undefined as string | undefined,
        bannerId: undefined as string | undefined,
    });

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
            navigate("/app/seller/my-shop", { replace: true });
        }
    });

    // Clear errors when form changes
    createEffect(() => {
        setErrors({});
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

    // Handle submission error with specific error code handling
    createEffect(() => {
        if (submission.error) {
            const error = submission.error as any;
            const errorData = error.response;
            const errorCode = errorData?.error;
            
            // Handle network errors (no response from server)
            if (error.statusCode === 0) {
                toaster.error(t("seller.shop.errors.networkError"));
                return;
            }
            
            // Handle specific error codes based on backend response
            if (errorCode === 'DUPLICATE_ENTRY') {
                // User already owns a shop
                toaster.error(t("seller.shop.errors.alreadyExists"));
            } else if (errorCode === 'VALIDATION_ERROR') {
                // Extract first validation error message
                const validationMsg = errorData.validationErrors?.[0]?.message 
                    || errorData.message 
                    || t("seller.shop.errors.validationFailed");
                // Check if it's a translation key
                toaster.error(validationMsg.includes('.') ? t(validationMsg) : validationMsg);
            } else if (errorCode === 'FORBIDDEN') {
                // Media not owned by user
                toaster.error(t("seller.shop.errors.mediaNotOwned"));
            } else if (errorCode === 'NOT_FOUND') {
                // Media not found
                toaster.error(t("seller.shop.errors.mediaNotFound"));
            } else {
                // Fallback to generic message
                const message = errorData?.message || error.message;
                const displayMessage = message?.includes('.') 
                    ? t(message) 
                    : message || t("seller.shop.createFailed");
                toaster.error(displayMessage);
            }
        }
    });

    // Validate form
    const validateCurrentStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

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

        setErrors(newErrors);
        return isValid;
    };

    // Handle final form submission
    const handleSubmit = (e: Event) => {
        e.preventDefault();

        // Validate form
        if (!validateCurrentStep()) {
            return;
        }

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
            slug: shopSlug().trim() || undefined,
            logoId: media.logoId,
            bannerId: media.bannerId,
            translations: translationsPayload,
        };

        applyTrigger(payload);
    };

    return (
        <Suspense
            fallback={
                <div class="flex justify-center py-20">
                    <div
                        class="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin"
                        role="status"
                        aria-label={t("common.loading")}
                    />
                </div>
            }
        >
            <div class="w-full min-w-0 flex-1 overflow-y-auto">
                <div class="mx-auto max-w-3xl w-full space-y-8 py-12 px-4 sm:px-6">
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
                            <form onSubmit={handleSubmit} class="space-y-6">
                                <div class="space-y-6">
                                    {/* Language Notice */}
                                    <p class="body-small text-forest-700/70 dark:text-gray-400 text-center">
                                        {t("seller.shop.bothLanguagesRequired")} — {t("seller.shop.multiLanguageDescription")}
                                    </p>

                                    {/* Side-by-Side Language Columns */}
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Left Section: English Fields */}
                                                <div class="space-y-4">
                                                    <div class="flex items-center gap-2 mb-2">
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

                                                    <Input
                                                        label={t("seller.shop.nameLabel")}
                                                        required
                                                        value={translations.en.name}
                                                        onInput={(e) => setTranslations("en", "name", e.currentTarget.value)}
                                                        placeholder={t("seller.shop.namePlaceholder")}
                                                        error={errors().name}
                                                    />

                                                    <Textarea
                                                        label={t("seller.shop.aboutLabel")}
                                                        required
                                                        value={translations.en.description}
                                                        onInput={(e) => setTranslations("en", "description", e.currentTarget.value)}
                                                        placeholder={t("seller.shop.aboutPlaceholder")}
                                                        rows={4}
                                                        error={errors().description}
                                                    />
                                                </div>

                                                {/* Right Section: Bengali Fields */}
                                                <div class="space-y-4">
                                                    <div class="flex items-center gap-2 mb-2">
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

                                                    <Input
                                                        label={t("seller.shop.nameLabel")}
                                                        required
                                                        dir="auto"
                                                        value={translations.bn.name}
                                                        onInput={(e) => setTranslations("bn", "name", e.currentTarget.value)}
                                                        placeholder={t("seller.shop.namePlaceholder")}
                                                        error={errors().name}
                                                    />

                                                    <Textarea
                                                        label={t("seller.shop.aboutLabel")}
                                                        required
                                                        dir="auto"
                                                        value={translations.bn.description}
                                                        onInput={(e) => setTranslations("bn", "description", e.currentTarget.value)}
                                                        placeholder={t("seller.shop.aboutPlaceholder")}
                                                        rows={4}
                                                        error={errors().description}
                                                    />
                                                </div>
                                            </div>

                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <FieldGroup
                                                label={t("seller.shop.brandStoryLabel")}
                                                requirement="optional"
                                            >
                                                <Textarea
                                                    value={translations.en.businessHours}
                                                    onInput={(e) => setTranslations("en", "businessHours", e.currentTarget.value)}
                                                    placeholder={t("seller.shop.brandStoryPlaceholder")}
                                                    rows={3}
                                                />
                                            </FieldGroup>

                                            <FieldGroup
                                                label={t("seller.shop.brandStoryLabel")}
                                                requirement="optional"
                                            >
                                                <Textarea
                                                    dir="auto"
                                                    value={translations.bn.businessHours}
                                                    onInput={(e) => setTranslations("bn", "businessHours", e.currentTarget.value)}
                                                    placeholder={t("seller.shop.brandStoryPlaceholder")}
                                                    rows={3}
                                                />
                                            </FieldGroup>
                                        </div>

                                        <div class="bg-cream-50 dark:bg-forest-800/50 rounded-lg p-4 border border-cream-200 dark:border-forest-700">
                                            <FieldGroup
                                                label={t("seller.shop.slugSectionTitle")}
                                                requirement="optional"
                                                hint={`💡 ${t("seller.shop.slugIdentityHint")}`}
                                            >
                                                <div class="flex min-w-0">
                                                    <span class="inline-flex items-center px-4 py-2.5 rounded-l-lg border-2 border-r-0 border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                                                        {getShopSlugPrefix()}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={shopSlug()}
                                                        onInput={(e) => {
                                                            setShopSlug(e.currentTarget.value);
                                                            setIsSlugManual(true);
                                                        }}
                                                        placeholder={t("seller.shop.slugPlaceholder")}
                                                        class={fieldControlClass({
                                                            class: "rounded-l-none flex-1 min-w-0",
                                                        })}
                                                    />
                                                </div>
                                            </FieldGroup>
                                        </div>

                                        {/* Branding (Optional) */}
                                        <div class="border-t border-cream-200 dark:border-forest-700 pt-8 mt-4">
                                            <div class="text-center mb-6">
                                                <h3 class="h6 font-semibold">
                                                    {t("seller.shop.brandingTitle")}
                                                    <span class="text-gray-400 font-normal ml-1">({t("common.optional")})</span>
                                                </h3>
                                            </div>

                                            {/* Logo & Banner Upload (Optional) */}
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FieldGroup
                                                    label={t("seller.shop.logoLabel")}
                                                    requirement="optional"
                                                >
                                                    <ImageUpload
                                                        preview={logoUpload.preview()}
                                                        isUploading={logoUpload.isUploading()}
                                                        isDeleting={logoUpload.isDeleting()}
                                                        onFileSelect={logoUpload.upload}
                                                        onDelete={logoUpload.deleteMedia}
                                                        description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                                                    />
                                                </FieldGroup>

                                                <FieldGroup
                                                    label={t("seller.shop.bannerLabel")}
                                                    requirement="optional"
                                                >
                                                    <ImageUpload
                                                        preview={bannerUpload.preview()}
                                                        isUploading={bannerUpload.isUploading()}
                                                        isDeleting={bannerUpload.isDeleting()}
                                                        onFileSelect={bannerUpload.upload}
                                                        onDelete={bannerUpload.deleteMedia}
                                                        description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                                                    />
                                                </FieldGroup>
                                            </div>

                                            {/* Skip Note */}
                                            <p class="body-small text-forest-700/70 dark:text-gray-400 text-center mt-4">
                                                💡 Optional — you can add branding later
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <div class="pt-6">
                                            <Button
                                                type="submit"
                                                variant="accent"
                                                class="w-full"
                                                disabled={submission.pending}
                                            >
                                                {submission.pending ? "Creating Shop..." : "Create Shop"}
                                            </Button>
                                        </div>
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
