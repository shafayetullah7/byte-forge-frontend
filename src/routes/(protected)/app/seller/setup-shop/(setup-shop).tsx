import { createSignal, createEffect, Show } from "solid-js";
import { useNavigate, action, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Button, Input, ImageUpload } from "~/components/ui";
import { getShop, useShop } from "~/lib/context/shop-context";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import type { CreateShopRequest } from "~/lib/api/types/seller.types";
import { sellerApi } from "~/lib/api/endpoints/seller.api";

/**
 * Route Preload
 * Ensures shop data is fetched as soon as navigation starts.
 */
export const route = {
    preload: () => getShop(),
} satisfies RouteDefinition;

/**
 * Create Shop Action
 */
const createShopAction = action(async (formData: CreateShopRequest) => {
    "use server";
    return await sellerApi.shops.create(formData);
}, "create-shop");

export default function SetupShop() {
    const navigate = useNavigate();
    const { t } = useI18n();
    const { shop, isLoading } = useShop();
    const submission = useSubmission(createShopAction);

    const [formData, setFormData] = createSignal({
        name: "",
        description: "",
        logoId: undefined as string | undefined,
    });

    // Redirect users who already have a shop
    createEffect(() => {
        const currentShop = shop();
        if (currentShop) {
            navigate("/app/seller/shops", { replace: true });
        }
    });

    // Use the reusable image upload hook
    const logoUpload = useImageUpload({
        maxSizeMB: 3,
        onSuccess: (mediaId) => {
            setFormData({ ...formData(), logoId: mediaId });
        },
    });

    // Handle submission error automatically via toaster or inline UI
    createEffect(() => {
        if (submission.error) {
            toaster.error(submission.error.message || t("seller.shop.createFailed"));
        }
    });

    // Generate slug from name
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        createShopAction({
            name: formData().name,
            slug: generateSlug(formData().name),
            description: formData().description || undefined,
            logoId: formData().logoId,
        });
    };

    return (
        <Show when={!isLoading()} fallback={<div class="flex justify-center py-20">{t("common.loading")}</div>}>
            <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-2xl w-full space-y-8">
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
                            <form onSubmit={handleSubmit} class="space-y-6">
                                {/* Shop Name */}
                                <div>
                                    <Input
                                        label={t("seller.shop.nameLabel")}
                                        type="text"
                                        required
                                        minLength={2}
                                        maxLength={255}
                                        value={formData().name}
                                        onInput={(e) =>
                                            setFormData({ ...formData(), name: e.currentTarget.value })
                                        }
                                        placeholder={t("seller.shop.namePlaceholder")}
                                    />
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        This will be displayed as your shop name on the platform.
                                    </p>
                                </div>

                                {/* Shop Description */}
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t("seller.shop.descriptionLabel")}
                                        <span class="text-gray-400 ml-1">(Optional)</span>
                                    </label>
                                    <textarea
                                        minLength={5}
                                        maxLength={500}
                                        value={formData().description}
                                        onInput={(e) =>
                                            setFormData({ ...formData(), description: e.currentTarget.value })
                                        }
                                        placeholder={t("seller.shop.descriptionPlaceholder")}
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none"
                                        rows={4}
                                    />
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Tell customers about your shop (optional).
                                    </p>
                                </div>

                                {/* Logo Upload - Using Reusable Component with Delete */}
                                <ImageUpload
                                    preview={logoUpload.preview()}
                                    isUploading={logoUpload.isUploading()}
                                    isDeleting={logoUpload.isDeleting()}
                                    onFileSelect={logoUpload.upload}
                                    onDelete={logoUpload.deleteMedia}
                                    label="Shop Logo (Optional)"
                                    description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="accent"
                                    class="w-full py-4 text-base font-semibold"
                                    disabled={submission.pending}
                                >
                                    {submission.pending
                                        ? t("common.loading")
                                        : t("seller.shop.createButton")}
                                </Button>
                            </form>
                        </div>

                        {/* Footer Note */}
                        <div class="bg-terracotta-50 dark:bg-terracotta-900/20 px-8 py-4 border-t border-terracotta-100 dark:border-terracotta-800">
                            <p class="text-sm text-terracotta-800 dark:text-terracotta-200">
                                💡 <strong>Note:</strong> You can update your shop information later from
                                settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );
}
