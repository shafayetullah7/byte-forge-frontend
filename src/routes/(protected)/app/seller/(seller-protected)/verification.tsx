import { createSignal, Show, Suspense, createEffect, onMount } from 'solid-js';
import { createAsync, useNavigate, action, useSubmission, useAction, revalidate } from '@solidjs/router';
import { VerificationStatusCard } from '~/components/seller/VerificationStatusCard';
import { VerificationForm, type VerificationFormData } from '~/components/seller/VerificationForm';
import { sellerShopApi } from '~/lib/api/endpoints/seller-shop.api';
import { getShop } from '~/lib/context/shop-context';
import { toaster } from '~/components/ui/Toast';
import { useI18n } from '~/i18n';
import { BoltIcon } from '~/components/icons';

/**
 * Submit Verification Action
 * Handles server-side verification submission and automatic cache revalidation.
 */
const submitVerificationAction = action(async (data: VerificationFormData) => {
    "use server";
    try {
        await sellerShopApi.updateVerification(data);
        // Invalidate verification cache to trigger automatic refetch
        revalidate("seller-shop-verification");
        return { success: true };
    } catch (error: any) {
        // Return error as result instead of throwing to prevent h3 from setting invalid headers
        return {
            success: false,
            error: {
                message: error.message || 'Verification submission failed',
            },
        };
    }
}, "submit-verification-action");

export default function VerificationPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [showForm, setShowForm] = createSignal(false);
    
    // Use action for submission with automatic cache invalidation
    const submitAction = useAction(submitVerificationAction);
    const submission = useSubmission(submitVerificationAction);
    
    // Fetch shop data to check if shop exists
    const shopData = createAsync(() => getShop());

    // Fetch verification status - automatically refreshes when action completes
    const verificationData = createAsync(() =>
        sellerShopApi.getVerificationStatus().catch(() => null)
    );

    // Handle server errors from the action - show in toast
    createEffect(() => {
        const result = submission.result;
        if (result && result.success === false && result.error) {
            toaster.error(result.error.message || t('seller.verification.submissionFailed'));
        }
    });

    // Handle successful submission
    createEffect(() => {
        if (submission.result?.success) {
            toaster.success(t('seller.verification.submittedSuccessfully'));
            setShowForm(false);
            // Cache automatically invalidated by action
        }
    });

    // Determine if user can submit documents based on status
    const canSubmitDocuments = () => {
        const status = verificationData()?.status;
        // Can submit when: no status (null), or rejected
        return status === null || status === 'REJECTED';
    };

    const handleSubmit = (data: VerificationFormData) => {
        submitAction(data);
    };

    const handleStartVerification = () => {
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
    };

    onMount(() => {
        // Auto-show form if no verification record exists
        if (verificationData() === null) {
            setShowForm(true);
        }
    });

    return (
        <div class="min-h-screen py-8">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div class="mb-8">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-md shadow-sage-500/20">
                            <BoltIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                {t('seller.verification.title')}
                            </h1>
                            <p class="text-base text-gray-600 dark:text-gray-400">
                                {t('seller.verification.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                <Suspense fallback={
                    <div class="flex items-center justify-center py-12">
                        <svg class="animate-spin h-8 w-8 text-sage-500" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span class="ml-3 text-gray-600 dark:text-gray-400">{t('seller.verification.loadingVerification')}</span>
                    </div>
                }>
                    {(() => {
                        const shop = shopData();
                        const verification = verificationData();

                        // No shop exists
                        if (!shop) {
                            return (
                                <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center shadow-xl border border-gray-200 dark:border-gray-700">
                                    <div class="flex flex-col items-center justify-center py-8">
                                        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-lg shadow-terracotta-500/30">
                                            <svg class="w-11 h-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                            {t('seller.verification.noShopFound')}
                                        </h2>
                                        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                                            {t('seller.verification.noShopFoundDesc')}
                                        </p>
                                        <button
                                            onClick={() => navigate('/seller/setup-shop')}
                                            class="px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            {t('seller.verification.createShopBtn')}
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div class="space-y-6">
                                {/* Verification Status Card */}
                                <VerificationStatusCard
                                    status={verification?.status ?? null}
                                    rejectionReason={verification?.rejectionReason ?? null}
                                    verifiedAt={verification?.verifiedAt ? new Date(verification.verifiedAt) : null}
                                    updatedAt={verification?.updatedAt ? new Date(verification.updatedAt) : null}
                                    createdAt={verification?.createdAt ? new Date(verification.createdAt) : null}
                                    tradeLicenseNumber={verification?.tradeLicenseNumber ?? null}
                                    tinNumber={verification?.tinNumber ?? null}
                                    hasDocuments={!!verification?.tradeLicenseDocumentId}
                                    onAction={canSubmitDocuments() ? handleStartVerification : undefined}
                                    actionLabel={verification?.status === 'REJECTED' ? 'Resubmit Documents' : 'Submit Documents'}
                                />

                                {/* Verification Form - Show when user clicks action button or has no verification */}
                                <Show when={showForm() && canSubmitDocuments()}>
                                    <div class="bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700 p-6">
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        {verification?.status === 'REJECTED' ? t('seller.verification.resubmitDocumentsBtn') : t('seller.verification.submitDocumentsBtn')}
                                    </h2>
                                        <VerificationForm
                                            initialData={{
                                                tradeLicenseNumber: verification?.tradeLicenseNumber ?? undefined,
                                                tinNumber: verification?.tinNumber ?? undefined,
                                                tradeLicenseDocumentId: verification?.tradeLicenseDocumentId ?? undefined,
                                                tinDocumentId: verification?.tinDocumentId ?? undefined,
                                                utilityBillDocumentId: verification?.utilityBillDocumentId ?? undefined,
                                                tradeLicenseDocument: verification?.tradeLicenseDocument ?? undefined,
                                                tinDocument: verification?.tinDocument ?? undefined,
                                                utilityBillDocument: verification?.utilityBillDocument ?? undefined,
                                            }}
                                            onSubmit={handleSubmit}
                                            isLoading={submission.pending}
                                            onCancel={handleCancelForm}
                                        />
                                    </div>
                                </Show>

                                {/* Additional Information */}
                                <div class="bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700 p-6">
                                    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        {t('seller.verification.verificationProcess')}
                                    </h3>
                                    <div class="space-y-3">
                                        <div class="flex items-start gap-3">
                                            <div class="w-6 h-6 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span class="text-xs font-semibold text-sage-700 dark:text-sage-400">1</span>
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{t('seller.verification.step1Title')}</p>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">{t('seller.verification.step1Desc')}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-3">
                                            <div class="w-6 h-6 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span class="text-xs font-semibold text-sage-700 dark:text-sage-400">2</span>
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{t('seller.verification.step2Title')}</p>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">{t('seller.verification.step2Desc')}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-3">
                                            <div class="w-6 h-6 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span class="text-xs font-semibold text-sage-700 dark:text-sage-400">3</span>
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{t('seller.verification.step3Title')}</p>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">{t('seller.verification.step3Desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </Suspense>
            </div>
        </div>
    );
}
