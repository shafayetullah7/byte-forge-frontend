import { Show, createEffect, createSignal } from 'solid-js';
import { XIcon } from '~/components/icons';
import { VerificationDocumentUploader } from './VerificationDocumentUploader';
import type { UpdateVerificationDto } from '~/lib/api/endpoints/seller-shop.api';
import { useI18n } from '~/i18n';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateVerificationDto) => Promise<{ success: boolean; error?: any }>;
    isLoading: boolean;
    initialData?: {
        tradeLicenseNumber?: string | null;
        tinNumber?: string | null;
        tradeLicenseDocumentId?: string | null;
        tinDocumentId?: string | null;
        utilityBillDocumentId?: string | null;
    };
}

export function VerificationModal(props: VerificationModalProps) {
    const { t } = useI18n();
    const [submitted, setSubmitted] = createSignal(false);

    // Reset submitted state when modal opens
    createEffect(() => {
        if (props.isOpen) {
            setSubmitted(false);
        }
    });

    const handleSubmit = async (data: UpdateVerificationDto) => {
        const result = await props.onSubmit(data);
        if (result.success) {
            setSubmitted(true);
        }
        return result;
    };

    const handleClose = () => {
        if (!props.isLoading) {
            setSubmitted(false);
            props.onClose();
        }
    };

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-forest-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div class="sticky top-0 bg-white dark:bg-forest-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {t('seller.verification.manageTitle')}
                            </h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {t('seller.verification.manageSubtitle')}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={props.isLoading}
                            class="p-2 hover:bg-gray-100 dark:hover:bg-forest-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <XIcon class="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div class="p-6">
                        <Show when={!submitted} fallback={
                            <div class="py-12 flex flex-col items-center justify-center text-center">
                                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
                                    <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {t('seller.verification.submittedSuccessfully')}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400 mb-6">
                                    {t('seller.verification.submissionSuccessMessage')}
                                </p>
                                <button
                                    onClick={handleClose}
                                    class="px-6 py-2 bg-forest-500 hover:bg-forest-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    {t('common.close')}
                                </button>
                            </div>
                        }>
                            {/* Info Box */}
                            <div class="bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700 rounded-lg p-4 mb-6">
                                <div class="flex items-start gap-3">
                                    <svg class="w-5 h-5 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div class="text-sm text-sage-800 dark:text-sage-200">
                                        <p class="font-semibold mb-1">
                                            {t('seller.verification.processInfoTitle')}
                                        </p>
                                        <p>
                                            {t('seller.verification.processInfoText')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload Form */}
                            <VerificationDocumentUploader
                                initialData={{
                                    tradeLicenseNumber: props.initialData?.tradeLicenseNumber ?? undefined,
                                    tinNumber: props.initialData?.tinNumber ?? undefined,
                                    tradeLicenseDocumentId: props.initialData?.tradeLicenseDocumentId ?? undefined,
                                    tinDocumentId: props.initialData?.tinDocumentId ?? undefined,
                                    utilityBillDocumentId: props.initialData?.utilityBillDocumentId ?? undefined,
                                }}
                                onSubmit={handleSubmit}
                                isLoading={props.isLoading}
                            />
                        </Show>
                    </div>
                </div>
            </div>
        </Show>
    );
}
