import { Show } from 'solid-js';
import Card from '~/components/ui/Card';
import Badge from '~/components/ui/Badge';
import { VerificationDocumentUploader } from './VerificationDocumentUploader';
import type { VerificationStatusType, ShopVerificationStatus } from '~/lib/api/endpoints/seller-shop.api';

interface VerificationCardProps {
    verification: ShopVerificationStatus;
    onSubmit: (data: {
        tradeLicenseNumber?: string;
        tinNumber?: string;
        tradeLicenseDocumentId?: string;
        tinDocumentId?: string;
        utilityBillDocumentId?: string;
    }) => void;
    isSubmitting?: boolean;
}

export function VerificationCard(props: VerificationCardProps) {
    const statusColors: Record<VerificationStatusType, 'default' | 'forest' | 'sage' | 'terracotta'> = {
        PENDING: 'sage',
        REVIEWING: 'sage',
        APPROVED: 'forest',
        REJECTED: 'terracotta',
    };

    const statusLabels: Record<VerificationStatusType, string> = {
        PENDING: 'Pending Submission',
        REVIEWING: 'Under Review',
        APPROVED: 'Verified',
        REJECTED: 'Rejected',
    };

    const canSubmitDocuments = props.verification.status === 'PENDING' || props.verification.status === 'REJECTED';

    return (
        <Card title="Shop Verification">
            {/* Status Section */}
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            props.verification.status === 'APPROVED' 
                                ? 'bg-gradient-to-br from-forest-500 to-forest-600' 
                                : props.verification.status === 'REJECTED'
                                ? 'bg-gradient-to-br from-terracotta-500 to-terracotta-600'
                                : 'bg-gradient-to-br from-sage-500 to-sage-600'
                        }`}>
                            {props.verification.status === 'APPROVED' ? (
                                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : props.verification.status === 'REJECTED' ? (
                                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Verification Status
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {statusLabels[props.verification.status]}
                            </p>
                        </div>
                    </div>
                    <Badge variant={statusColors[props.verification.status]}>
                        {props.verification.status}
                    </Badge>
                </div>

                {/* Rejection Reason */}
                <Show when={props.verification.status === 'REJECTED' && props.verification.rejectionReason}>
                    <div class="mt-4 p-4 bg-terracotta-50 dark:bg-terracotta-900/20 border border-terracotta-200 dark:border-terracotta-800 rounded-lg">
                        <h4 class="font-semibold text-terracotta-800 dark:text-terracotta-400 mb-2 flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Rejection Reason
                        </h4>
                        <p class="text-sm text-terracotta-700 dark:text-terracotta-300">
                            {props.verification.rejectionReason}
                        </p>
                    </div>
                </Show>

                {/* Verified Info */}
                <Show when={props.verification.status === 'APPROVED' && props.verification.verifiedAt}>
                    <div class="mt-4 p-4 bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg">
                        <p class="text-sm text-forest-700 dark:text-forest-300">
                            <span class="font-semibold">Verified on:</span>{' '}
                            {new Date(props.verification.verifiedAt!).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </Show>
            </div>

            {/* Document Submission */}
            <Show when={canSubmitDocuments}>
                <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {props.verification.status === 'REJECTED' ? 'Update & Resubmit Documents' : 'Submit Verification Documents'}
                    </h4>
                    
                    <div class="space-y-4">
                        <div class="bg-cream-50 dark:bg-cream-900/20 rounded-lg p-4">
                            <h5 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Required Documents
                            </h5>
                            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li class="flex items-start gap-2">
                                    <span class="text-terracotta-500 mt-0.5">●</span>
                                    <span>Trade License Number and Document (PDF or Image, max 10MB)</span>
                                </li>
                            </ul>
                        </div>

                        <div class="bg-cream-50 dark:bg-cream-900/20 rounded-lg p-4">
                            <h5 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Optional Documents
                            </h5>
                            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li class="flex items-start gap-2">
                                    <span class="text-sage-500 mt-0.5">●</span>
                                    <span>TIN Number and Document</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-sage-500 mt-0.5">●</span>
                                    <span>Utility Bill Document</span>
                                </li>
                            </ul>
                        </div>

                        <VerificationDocumentUploader
                            initialData={{
                                tradeLicenseNumber: props.verification.tradeLicenseNumber,
                                tinNumber: props.verification.tinNumber,
                                tradeLicenseDocumentId: props.verification.tradeLicenseDocumentId,
                                tinDocumentId: props.verification.tinDocumentId,
                                utilityBillDocumentId: props.verification.utilityBillDocumentId,
                            }}
                            onSubmit={props.onSubmit}
                            isLoading={props.isSubmitting}
                        />
                    </div>
                </div>
            </Show>

            {/* Approved Message */}
            <Show when={props.verification.status === 'APPROVED'}>
                <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div class="bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700 rounded-lg p-4">
                        <p class="text-sm text-sage-800 dark:text-sage-200">
                            <svg class="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Your shop has been verified. You can now activate your shop to start selling.
                        </p>
                    </div>
                </div>
            </Show>

            {/* Under Review Message */}
            <Show when={props.verification.status === 'REVIEWING'}>
                <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div class="bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700 rounded-lg p-4">
                        <p class="text-sm text-sage-800 dark:text-sage-200">
                            <svg class="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Your verification is under review. Our admin team will review within 48 hours.
                        </p>
                    </div>
                </div>
            </Show>
        </Card>
    );
}
