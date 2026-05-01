import { Show } from 'solid-js';
import Card from '~/components/ui/Card';
import Badge from '~/components/ui/Badge';
import { CheckIcon, XCircleIcon, ClockIcon, ShieldCheckIcon, PlusIcon, CalendarIcon, ArrowPathIcon, DocumentTextIcon, EyeIcon, ExclamationCircleIcon, InfoCircleIcon, CheckBadgeIcon } from '~/components/icons';
import type { VerificationStatusType, ShopMedia } from '~/lib/api/endpoints/seller/shop-detail.api';
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
                return <CheckIcon class="w-8 h-8 text-white" />;
            case 'REJECTED':
                return <XCircleIcon class="w-8 h-8 text-white" />;
            case 'PENDING':
            case 'REVIEWING':
            default:
                return <ClockIcon class="w-8 h-8 text-white" />;
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
                        <ShieldCheckIcon class="w-8 h-8 text-white" />
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
                            <PlusIcon class="w-5 h-5" />
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
                                    <CalendarIcon class="w-4 h-4" />
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
                                    <ArrowPathIcon class="w-4 h-4" />
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
                                <DocumentTextIcon class="w-4 h-4 text-sage-500" />
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
                                            <EyeIcon class="w-5 h-5" />
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
                                            <EyeIcon class="w-5 h-5" />
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
                                            <EyeIcon class="w-5 h-5" />
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
                                <ExclamationCircleIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 mt-0.5 flex-shrink-0" />
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
                                <CheckBadgeIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
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
                                <InfoCircleIcon class="w-5 h-5 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" />
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
                                    <ArrowPathIcon class="w-5 h-5" />
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
