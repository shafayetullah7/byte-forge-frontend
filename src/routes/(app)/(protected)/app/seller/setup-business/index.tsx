import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button, Input, ImageUpload } from "~/components/ui";
import { sellerApi } from "~/lib/api";
import { useBusinessAccount } from "~/lib/context/business-account-context";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
import { useImageUpload } from "~/lib/hooks/useImageUpload";

export default function SetupBusiness() {
    const navigate = useNavigate();
    const { t } = useI18n();
    const { refetch } = useBusinessAccount();
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [formData, setFormData] = createSignal({
        name: "",
        address: "",
        logoId: undefined as string | undefined,
    });

    // Use the reusable image upload hook
    const logoUpload = useImageUpload({
        maxSizeMB: 3,
        onSuccess: (mediaId, mediaUrl) => {
            setFormData({ ...formData(), logoId: mediaId });
        },
    });

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Direct API call - 401 handled by API client
            await sellerApi.businessAccount.create({
                basicInfo: formData(),
            });

            toaster.success(t("seller.businessAccount.created"));
            await refetch(); // Refresh business account state
            navigate("/app/seller/shops"); // Redirect to seller dashboard
        } catch (error: any) {
            toaster.error(error.message || t("seller.businessAccount.createFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-2xl w-full space-y-8">
                {/* Header */}
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {t("seller.businessAccount.setupTitle")}
                    </h1>
                    <p class="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        {t("seller.businessAccount.setupDescription")}
                    </p>
                </div>

                {/* Form Card */}
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div class="px-8 py-10">
                        <form onSubmit={handleSubmit} class="space-y-6">
                            {/* Business Name */}
                            <div>
                                <Input
                                    label={t("seller.businessAccount.nameLabel")}
                                    type="text"
                                    required
                                    minLength={2}
                                    maxLength={255}
                                    value={formData().name}
                                    onInput={(e) =>
                                        setFormData({ ...formData(), name: e.currentTarget.value })
                                    }
                                    placeholder={t("seller.businessAccount.namePlaceholder")}
                                />
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    This will be displayed as your business name on the platform.
                                </p>
                            </div>

                            {/* Business Address */}
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("seller.businessAccount.addressLabel")}
                                    <span class="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    required
                                    minLength={5}
                                    maxLength={500}
                                    value={formData().address}
                                    onInput={(e) =>
                                        setFormData({ ...formData(), address: e.currentTarget.value })
                                    }
                                    placeholder={t("seller.businessAccount.addressPlaceholder")}
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none"
                                    rows={4}
                                />
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Provide your complete business address including city and postal code.
                                </p>
                            </div>

                            {/* Logo Upload - Using Reusable Component with Delete */}
                            <ImageUpload
                                preview={logoUpload.preview()}
                                isUploading={logoUpload.isUploading()}
                                isDeleting={logoUpload.isDeleting()}
                                onFileSelect={logoUpload.upload}
                                onDelete={logoUpload.deleteMedia}
                                label="Business Logo (Optional)"
                                description="JPEG, PNG, WEBP, or GIF (max 3MB)"
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="accent"
                                class="w-full py-4 text-base font-semibold"
                                disabled={isSubmitting()}
                            >
                                {isSubmitting()
                                    ? t("common.loading")
                                    : t("seller.businessAccount.createButton")}
                            </Button>
                        </form>
                    </div>

                    {/* Footer Note */}
                    <div class="bg-terracotta-50 dark:bg-terracotta-900/20 px-8 py-4 border-t border-terracotta-100 dark:border-terracotta-800">
                        <p class="text-sm text-terracotta-800 dark:text-terracotta-200">
                            💡 <strong>Note:</strong> You can update your business information later from
                            settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
