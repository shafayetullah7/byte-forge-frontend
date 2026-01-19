import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button, Input } from "~/components/ui";
import { sellerApi } from "~/lib/api";
import { useBusinessAccount } from "~/lib/context/business-account-context";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";

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

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
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
        <div class="max-w-2xl mx-auto p-6">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("seller.businessAccount.setupTitle")}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    {t("seller.businessAccount.setupDescription")}
                </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <Input
                    label={t("seller.businessAccount.nameLabel")}
                    type="text"
                    required
                    minLength={2}
                    maxLength={255}
                    value={formData().name}
                    onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
                    placeholder={t("seller.businessAccount.namePlaceholder")}
                />

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("seller.businessAccount.addressLabel")}
                    </label>
                    <textarea
                        required
                        minLength={5}
                        maxLength={500}
                        value={formData().address}
                        onInput={(e) => setFormData({ ...formData(), address: e.currentTarget.value })}
                        placeholder={t("seller.businessAccount.addressPlaceholder")}
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors resize-none"
                        rows={3}
                    />
                </div>

                {/* TODO: Add logo upload component */}

                <Button
                    type="submit"
                    variant="primary"
                    class="w-full"
                    disabled={isSubmitting()}
                >
                    {isSubmitting() ? t("common.loading") : t("seller.businessAccount.createButton")}
                </Button>
            </form>
        </div>
    );
}
