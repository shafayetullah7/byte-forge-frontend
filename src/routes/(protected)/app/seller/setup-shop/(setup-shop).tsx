import { createSignal, createEffect, Show, For, ParentComponent, Suspense } from "solid-js";
import { createStore } from "solid-js/store";
import { slugify } from "~/lib/utils/slugify";
import { useNavigate, action, useSubmission, useAction, createAsync, type RouteDefinition, redirect } from "@solidjs/router";
import { Button, ImageUpload } from "~/components/ui";
import { getShop } from "~/lib/context/shop-context";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
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
    const shop = createAsync(() => getShop());
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
            navigate("/app/seller/shops", { replace: true });
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
                                                </div>
                                            </div>

                                        {/* Business Hours - Full Width Below */}
                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                                        {/* Shop Slug (URL) - Global Identity Field */}
                                        <div class="bg-cream-50 dark:bg-forest-800/50 rounded-lg p-4 border border-cream-200 dark:border-forest-700">
                                            <div>
                                                <label class="block h6 text-gray-700 dark:text-gray-300 mb-2">
                                                    {t("seller.shop.slugSectionTitle")}
                                                    <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                                                </label>
                                                <div class="flex rounded-lg">
                                                    <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-forest-700/70 dark:text-gray-400 body-small">
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
                                                <ImageUpload
                                                    preview={logoUpload.preview()}
                                                    isUploading={logoUpload.isUploading()}
                                                    isDeleting={logoUpload.isDeleting()}
                                                    onFileSelect={logoUpload.upload}
                                                    onDelete={logoUpload.deleteMedia}
                                                    label={`${t("seller.shop.logoLabel")} (Optional)`}
                                                    description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                                                />

                                                <ImageUpload
                                                    preview={bannerUpload.preview()}
                                                    isUploading={bannerUpload.isUploading()}
                                                    isDeleting={bannerUpload.isDeleting()}
                                                    onFileSelect={bannerUpload.upload}
                                                    onDelete={bannerUpload.deleteMedia}
                                                    label={`${t("seller.shop.bannerLabel")} (Optional)`}
                                                    description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                                                />
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
