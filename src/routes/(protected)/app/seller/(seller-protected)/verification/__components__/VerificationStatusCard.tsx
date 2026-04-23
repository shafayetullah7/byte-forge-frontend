import { Show } from 'solid-js';
import Card from '~/components/ui/Card';
import Badge from '~/components/ui/Badge';
import type { VerificationStatusType, ShopMedia } from '~/lib/api/endpoints/seller-shop.api';
import { useI18n } from '~/i18n';

export interface VerificationStatusCardProps {
    status: VerificationStatusType | null;
    rejectionReason?: string | null;
    verifiedAt?: Date | null;
    updatedAt?: Date | null;
    createdAt?: Date | null;
    tradeLicenseNumber?: string | null;
    tinNumber?: string | null;
    tradeLicenseDocument?: ShopMedia | null;
    tinDocument?: ShopMedia | null;
    utilityBillDocument?: ShopMedia | null;
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
                return 'bg-gradient-to-br from-forest-500 to-forest-600 shadow-lg shadow-forest-500/30';
            case 'REJECTED':
                return 'bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-lg shadow-terracotta-500/30';
            case 'PENDING':
            case 'REVIEWING':
            default:
                return 'bg-gradient-to-br from-sage-500 to-sage-600 shadow-lg shadow-sage-500/30';
        }
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function getFileIcon(mimeType: string): string {
        if (mimeType.includes('image')) return '🖼️';
        if (mimeType.includes('pdf')) return '📄';
        return '📁';
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
                    <div class="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        {/* Status Icon */}
                        <div class={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBackground(props.status!)}`}>
                            {getStatusIcon(props.status!)}
                        </div>

                        {/* Status Info */}
                        <div class="flex-1 pt-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {getStatusLabel(props.status!)}
                                </h3>
                                <Badge variant={statusColors[props.status!]}>
                                    {props.status}
                                </Badge>
                            </div>

                            {/* Submitted Date */}
                            <Show when={props.createdAt}>
                                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Submitted: {props.createdAt!.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </Show>

                            {/* Updated Date */}
                            <Show when={props.updatedAt && props.updatedAt !== props.createdAt}>
                                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Last updated: {props.updatedAt!.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </Show>
                        </div>
                    </div>

                    {/* Submitted Information Grid */}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Trade License Number */}
                        <Show when={props.tradeLicenseNumber}>
                            <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {t('seller.verification.tradeLicenseNumber')}
                                </p>
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {props.tradeLicenseNumber}
                                </p>
                            </div>
                        </Show>

                        {/* TIN Number */}
                        <Show when={props.tinNumber}>
                            <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {t('seller.verification.tinNumber')}
                                </p>
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {props.tinNumber}
                                </p>
                            </div>
                        </Show>
                    </div>

                    {/* Uploaded Documents Section */}
                    <Show when={props.hasDocuments}>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <svg class="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {t('seller.verification.submittedDocuments')}
                            </h4>
                            <div class="space-y-2">
                                {/* Trade License Document */}
                                <Show when={props.tradeLicenseDocument}>
                                    <div class="flex items-center gap-3 p-3 bg-cream-50 dark:bg-cream-900/20 border border-cream-200 dark:border-cream-700 rounded-lg">
                                        <div class="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                                            {getFileIcon(props.tradeLicenseDocument!.mimeType)}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {props.tradeLicenseDocument!.fileName || t('seller.verification.tradeLicense')}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {formatFileSize(props.tradeLicenseDocument!.size)}
                                            </p>
                                        </div>
                                        <a
                                            href={props.tradeLicenseDocument!.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="p-2 text-sage-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
                                            title={t('common.viewDocument')}
                                        >
                                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </a>
                                    </div>
                                </Show>

                                {/* TIN Document */}
                                <Show when={props.tinDocument}>
                                    <div class="flex items-center gap-3 p-3 bg-cream-50 dark:bg-cream-900/20 border border-cream-200 dark:border-cream-700 rounded-lg">
                                        <div class="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                                            {getFileIcon(props.tinDocument!.mimeType)}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {props.tinDocument!.fileName || t('seller.verification.tinCertificate')}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {formatFileSize(props.tinDocument!.size)}
                                            </p>
                                        </div>
                                        <a
                                            href={props.tinDocument!.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="p-2 text-sage-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
                                            title={t('common.viewDocument')}
                                        >
                                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </a>
                                    </div>
                                </Show>

                                {/* Utility Bill Document */}
                                <Show when={props.utilityBillDocument}>
                                    <div class="flex items-center gap-3 p-3 bg-cream-50 dark:bg-cream-900/20 border border-cream-200 dark:border-cream-700 rounded-lg">
                                        <div class="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                                            {getFileIcon(props.utilityBillDocument!.mimeType)}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {props.utilityBillDocument!.fileName || t('seller.verification.utilityBill')}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                {formatFileSize(props.utilityBillDocument!.size)}
                                            </p>
                                        </div>
                                        <a
                                            href={props.utilityBillDocument!.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="p-2 text-sage-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
                                            title={t('common.viewDocument')}
                                        >
                                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </a>
                                    </div>
                                </Show>
                            </div>
                        </div>
                    </Show>

                    {/* Rejection Reason */}
                    <Show when={props.status === 'REJECTED' && props.rejectionReason}>
                        <div class="p-4 bg-terracotta-50 dark:bg-terracotta-900/20 border-2 border-terracotta-200 dark:border-terracotta-800 rounded-lg">
                            <div class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p class="text-sm font-semibold text-terracotta-800 dark:text-terracotta-400 mb-1">
                                        {t('seller.verification.rejectionReason')}
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

                    {/* Action Button for REJECTED */}
                    <Show when={props.status === 'REJECTED'}>
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
