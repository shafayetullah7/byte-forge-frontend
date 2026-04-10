import { createSignal, onMount } from 'solid-js';
import { VerificationStatusCard, VerificationStatusType } from '~/components/seller/VerificationStatusCard';
import { VerificationDocumentUploader } from '~/components/seller/VerificationDocumentUploader';
import { sellerApi } from '~/lib/api/endpoints/seller.api';
import { ApiError } from '~/lib/api/types';
import type { VerificationStatus } from '~/lib/api/types/seller.types';

export default function VerificationPage() {
    const [verificationData, setVerificationData] = createSignal<VerificationStatus | null>(null);
    const [isLoading, setIsLoading] = createSignal(true);
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [successMessage, setSuccessMessage] = createSignal<string | null>(null);

    const fetchVerificationStatus = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await sellerApi.shops.verification.getStatus();
            setVerificationData(response);
        } catch (err) {
            console.error('Error fetching verification status:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to load verification status. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: {
        tradeLicenseNumber?: string;
        tinNumber?: string;
        tradeLicenseDocumentId?: string;
        tinDocumentId?: string;
        utilityBillDocumentId?: string;
    }) => {
        try {
            setIsSubmitting(true);
            setError(null);
            setSuccessMessage(null);

            const response = await sellerApi.shops.verification.update({
                tradeLicenseNumber: data.tradeLicenseNumber,
                tinNumber: data.tinNumber,
                tradeLicenseDocumentId: data.tradeLicenseDocumentId,
                tinDocumentId: data.tinDocumentId,
                utilityBillDocumentId: data.utilityBillDocumentId,
            });

            setVerificationData(response);
            setSuccessMessage('Verification documents submitted successfully. Your shop is now pending review.');
        } catch (err) {
            console.error('Error submitting verification:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to submit verification documents. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    onMount(() => {
        fetchVerificationStatus();
    });

    return (
        <div class="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 class="text-2xl font-bold text-forest-900 dark:text-forest-100">
                    Shop Verification
                </h1>
                <p class="mt-1 text-sm text-forest-700 dark:text-forest-300">
                    Submit your business documents for verification to activate your shop
                </p>
            </div>

            {/* Success Message */}
            {successMessage() && (
                <div class="p-4 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-lg">
                    <p class="text-sm text-sage-800 dark:text-sage-200">
                        {successMessage()}
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error() && (
                <div class="p-4 bg-terracotta-50 dark:bg-terracotta-900/20 border border-terracotta-200 dark:border-terracotta-800 rounded-lg">
                    <p class="text-sm text-terracotta-800 dark:text-terracotta-200">
                        {error()}
                    </p>
                </div>
            )}

            {/* Loading State */}
            {isLoading() ? (
                <div class="flex items-center justify-center py-12">
                    <svg class="animate-spin h-8 w-8 text-forest-500" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            ) : verificationData() ? (
                <>
                    {/* Verification Status Card */}
                    <VerificationStatusCard
                        status={verificationData()!.status}
                        rejectionReason={verificationData()?.rejectionReason ?? undefined}
                        verifiedAt={verificationData()?.verifiedAt ? new Date(verificationData()!.verifiedAt!) : undefined}
                        updatedAt={new Date(verificationData()!.updatedAt)}
                    />

                    {/* Document Upload Form */}
                    <div class="bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700 p-6">
                        <h2 class="text-lg font-semibold text-forest-900 dark:text-forest-100 mb-4">
                            Verification Documents
                        </h2>
                        <VerificationDocumentUploader
                            initialData={{
                                tradeLicenseNumber: verificationData()?.tradeLicenseNumber,
                                tinNumber: verificationData()?.tinNumber,
                                tradeLicenseDocumentId: undefined,
                                tinDocumentId: undefined,
                                utilityBillDocumentId: undefined,
                            }}
                            onSubmit={handleSubmit}
                            isLoading={isSubmitting()}
                        />
                    </div>
                </>
            ) : (
                <div class="bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700 p-6">
                    <p class="text-forest-700 dark:text-forest-300">
                        No verification record found. Please ensure you have created a shop first.
                    </p>
                </div>
            )}
        </div>
    );
}
