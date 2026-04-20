import { Show } from 'solid-js';
import Card from '~/components/ui/Card';
import Badge from '~/components/ui/Badge';
import type { VerificationStatusType } from '~/lib/api/endpoints/seller-shop.api';
import { useI18n } from '~/i18n';

export interface VerificationStatusCardProps {
    status: VerificationStatusType | null;
    rejectionReason?: string | null;
    verifiedAt?: Date | null;
    updatedAt?: Date | null;
    createdAt?: Date | null;
    tradeLicenseNumber?: string | null;
    tinNumber?: string | null;
    hasDocuments?: boolean;
    onAction?: () => void;
    actionLabel?: string;
}

export function VerificationStatusCard(props: VerificationStatusCardProps) {
    const { t } = useI18n();

    const statusColors: Record<VerificationStatusType, 'default' | 'forest' | 'sage' | 'terracotta'> = {
        PENDING: 'sage',
        REVIEWING: 'sage',
        APPROVED: 'forest',
        REJECTED: 'terracotta',
    };

    function getStatusLabel(status: VerificationStatusType): string {
        const labels: Record<VerificationStatusType, string> = {
            PENDING: t('seller.verification.status.pending'),
            REVIEWING: t('seller.verification.status.reviewing'),
            APPROVED: t('seller.verification.status.approved'),
            REJECTED: t('seller.verification.status.rejected'),
        };
        return labels[status];
    }

    function getStatusIcon(status: VerificationStatusType) {
        switch (status) {
            case 'APPROVED':
                return (
                    <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'REJECTED':
                return (
                    <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'PENDING':
            case 'REVIEWING':
            default:
                return (
                    <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    }

    function getIconBackground(status: VerificationStatusType): string {
        switch (status) {
            case 'APPROVED':
                return 'bg-gradient-to-br from-forest-500 to-forest-600';
            case 'REJECTED':
                return 'bg-gradient-to-br from-terracotta-500 to-terracotta-600';
            case 'PENDING':
            case 'REVIEWING':
            default:
                return 'bg-gradient-to-br from-sage-500 to-sage-600';
        }
    }

    return (
        <Card>
            {/* No Verification Record Yet */}
            <Show when={props.status !== null} fallback={
                <div class="text-center py-6">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-lg shadow-sage-500/30">
                        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {t('seller.verification.startTitle')}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        {t('seller.verification.startDescription')}
                    </p>
                    
                    <div class="bg-cream-50 dark:bg-cream-900/20 rounded-lg p-4 max-w-lg mx-auto mb-6">
                        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">
                            {t('seller.verification.requiredDocuments')}
                        </h4>
                        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li class="flex items-start gap-2">
                                <span class="text-terracotta-500 mt-0.5">●</span>
                                <div>
                                    <span class="font-medium text-gray-900 dark:text-gray-100">{t('seller.verification.tradeLicenseNumber')}</span>
                                    <p class="text-xs text-gray-500">{t('seller.verification.tradeLicenseNumberDesc')}</p>
                                </div>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-terracotta-500 mt-0.5">●</span>
                                <div>
                                    <span class="font-medium text-gray-900 dark:text-gray-100">{t('seller.verification.tradeLicenseDocument')}</span>
                                    <p class="text-xs text-gray-500">{t('seller.verification.tradeLicenseDocumentDesc')}</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {props.onAction && (
                        <button
                            onClick={props.onAction}
                            class="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {props.actionLabel || t('seller.verification.startVerification')}
                        </button>
                    )}
                </div>
            }>
                {/* Has verification record - show status */}
                <div class="space-y-4">
                    {/* Status Header */}
                    <div class="flex items-start gap-4">
                        {/* Status Icon */}
                        <div class={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBackground(props.status!)}`}>
                            {getStatusIcon(props.status!)}
                        </div>

                        {/* Status Info */}
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {getStatusLabel(props.status!)}
                                </h3>
                                <Badge variant={statusColors[props.status!]}>
                                    {props.status}
                                </Badge>
                            </div>

                            {/* Submitted Date */}
                            <Show when={props.createdAt}>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Submitted: {props.createdAt!.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </Show>

                            {/* Updated Date */}
                            <Show when={props.updatedAt && props.updatedAt !== props.createdAt}>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Last updated: {props.updatedAt!.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </Show>

                            {/* Trade License Number */}
                            <Show when={props.tradeLicenseNumber}>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <span class="font-medium">Trade License:</span> {props.tradeLicenseNumber}
                                </p>
                            </Show>

                            {/* TIN Number */}
                            <Show when={props.tinNumber}>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    <span class="font-medium">TIN:</span> {props.tinNumber}
                                </p>
                            </Show>

                            {/* Documents Status */}
                            <Show when={props.hasDocuments}>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    <span class="font-medium">Documents:</span> Uploaded
                                </p>
                            </Show>
                        </div>
                    </div>

                    {/* Rejection Reason */}
                    <Show when={props.status === 'REJECTED' && props.rejectionReason}>
                        <div class="p-4 bg-terracotta-50 dark:bg-terracotta-900/20 border-2 border-terracotta-200 dark:border-terracotta-800 rounded-lg">
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p class="text-sm font-semibold text-terracotta-800 dark:text-terracotta-400 mb-1">
                                        Rejection Reason
                                    </p>
                                    <p class="text-sm text-terracotta-700 dark:text-terracotta-300">
                                        {props.rejectionReason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Show>

                    {/* Verified Date */}
                    <Show when={props.status === 'APPROVED' && props.verifiedAt}>
                        <div class="p-4 bg-forest-50 dark:bg-forest-900/20 border-2 border-forest-200 dark:border-forest-800 rounded-lg">
                            <div class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-forest-600 dark:text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <div>
                                    <p class="text-sm font-semibold text-forest-800 dark:text-forest-400">
                                        {t('seller.verification.verifiedOn')}
                                    </p>
                                    <p class="text-sm text-forest-700 dark:text-forest-300">
                                        {props.verifiedAt!.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Show>

                    {/* Status Messages */}
                    <Show when={props.status === 'PENDING' || props.status === 'REVIEWING'}>
                        <div class="p-4 bg-sage-50 dark:bg-sage-900/20 border-2 border-sage-200 dark:border-sage-700 rounded-lg">
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p class="text-sm text-sage-800 dark:text-sage-200">
                                        {props.status === 'REVIEWING' 
                                            ? t('seller.verification.underReviewMessage')
                                            : t('seller.verification.pendingMessage')
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Show>

                    {/* Approved Message */}
                    <Show when={props.status === 'APPROVED'}>
                        <div class="p-4 bg-sage-50 dark:bg-sage-900/20 border-2 border-sage-200 dark:border-sage-700 rounded-lg">
                            <p class="text-sm text-sage-800 dark:text-sage-200">
                                {t('seller.verification.approvedMessage')}
                            </p>
                        </div>
                    </Show>

                    {/* Action Button for PENDING/REJECTED */}
                    <Show when={props.status === 'PENDING' || props.status === 'REJECTED'}>
                        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                            {props.onAction && (
                                <button
                                    onClick={props.onAction}
                                    class="w-full sm:w-auto px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
                                >
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {props.actionLabel || (props.status === 'REJECTED' ? t('seller.verification.resubmit') : t('seller.verification.updateDocuments'))}
                                </button>
                            )}
                        </div>
                    </Show>
                </div>
            </Show>
        </Card>
    );
}
