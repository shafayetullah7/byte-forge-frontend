import { Show } from 'solid-js';
import Card from '~/components/ui/Card';
import Badge from '~/components/ui/Badge';
import type { VerificationStatusType } from '~/lib/api/endpoints/seller-shop.api';
import { useI18n } from '~/i18n';

interface VerificationCardProps {
    status?: VerificationStatusType;
    rejectionReason?: string | null;
    verifiedAt?: string | null;
    hasDocuments?: boolean;
    onManage: () => void;
}

export function VerificationCard(props: VerificationCardProps) {
    const { t } = useI18n();
    
    const statusColors: Record<VerificationStatusType, 'default' | 'forest' | 'sage' | 'terracotta'> = {
        PENDING: 'sage',
        REVIEWING: 'sage',
        APPROVED: 'forest',
        REJECTED: 'terracotta',
    };

    const hasStatus = !!props.status;

    function getStatusLabel(status: VerificationStatusType): string {
        const labels: Record<VerificationStatusType, string> = {
            PENDING: t('seller.verification.status.pending'),
            REVIEWING: t('seller.verification.status.reviewing'),
            APPROVED: t('seller.verification.status.approved'),
            REJECTED: t('seller.verification.status.rejected'),
        };
        return labels[status];
    }

    return (
        <Card title={t('seller.verification.cardTitle')}>
            {/* No Verification Record Yet */}
            <Show when={!hasStatus} fallback={
                // Has verification record - show status
                <>
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-start gap-4 flex-1">
                            {/* Status Icon */}
                            <div class={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                props.status === 'APPROVED' 
                                    ? 'bg-gradient-to-br from-forest-500 to-forest-600' 
                                    : props.status === 'REJECTED'
                                    ? 'bg-gradient-to-br from-terracotta-500 to-terracotta-600'
                                    : 'bg-gradient-to-br from-sage-500 to-sage-600'
                            }`}>
                                {props.status === 'APPROVED' ? (
                                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : props.status === 'REJECTED' ? (
                                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>

                            {/* Status Info */}
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {getStatusLabel(props.status!)}
                                    </h3>
                                    <Badge variant={statusColors[props.status!]}>
                                        {props.status}
                                    </Badge>
                                </div>

                                {/* Rejection Reason */}
                                <Show when={props.status === 'REJECTED' && props.rejectionReason}>
                                    <div class="mt-3 p-3 bg-terracotta-50 dark:bg-terracotta-900/20 border border-terracotta-200 dark:border-terracotta-800 rounded-lg">
                                        <p class="text-sm font-semibold text-terracotta-800 dark:text-terracotta-400 mb-1">
                                            {t('seller.verification.rejectionReason')}
                                        </p>
                                        <p class="text-sm text-terracotta-700 dark:text-terracotta-300">
                                            {props.rejectionReason}
                                        </p>
                                    </div>
                                </Show>

                                {/* Verified Date */}
                                <Show when={props.status === 'APPROVED' && props.verifiedAt}>
                                    <div class="mt-3 p-3 bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded-lg">
                                        <p class="text-sm text-forest-700 dark:text-forest-300">
                                            <span class="font-semibold">{t('seller.verification.verifiedOn')}:</span>{' '}
                                            {new Date(props.verifiedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </Show>

                                {/* Status Messages */}
                                <Show when={props.status === 'PENDING' || props.status === 'REVIEWING'}>
                                    <div class="mt-3 p-3 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700 rounded-lg">
                                        <p class="text-sm text-sage-800 dark:text-sage-200">
                                            {props.status === 'REVIEWING' 
                                                ? t('seller.verification.underReviewMessage')
                                                : t('seller.verification.pendingMessage')
                                            }
                                        </p>
                                    </div>
                                </Show>

                                {/* Approved Message */}
                                <Show when={props.status === 'APPROVED'}>
                                    <div class="mt-3 p-3 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700 rounded-lg">
                                        <p class="text-sm text-sage-800 dark:text-sage-200">
                                            {t('seller.verification.approvedMessage')}
                                        </p>
                                    </div>
                                </Show>
                            </div>
                        </div>

                        {/* Manage Button */}
                        <Show when={props.status === 'PENDING' || props.status === 'REJECTED'}>
                            <button
                                onClick={props.onManage}
                                class="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-medium text-sm transition-colors flex-shrink-0"
                            >
                                {props.status === 'REJECTED' ? t('seller.verification.resubmit') : t('seller.verification.updateDocuments')}
                            </button>
                        </Show>
                    </div>
                </>
            }>
                {/* No verification record - show start prompt */}
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

                    <button
                        onClick={props.onManage}
                        class="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {t('seller.verification.startVerification')}
                    </button>
                </div>
            </Show>
        </Card>
    );
}

