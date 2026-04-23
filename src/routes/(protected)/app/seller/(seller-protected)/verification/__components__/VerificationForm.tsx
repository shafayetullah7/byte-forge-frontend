import { createSignal, Show, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { DocumentUploader } from './DocumentUploader';
import Input from '~/components/ui/Input';
import Button from '~/components/ui/Button';
import { useI18n } from '~/i18n';

export interface VerificationFormData {
    tradeLicenseNumber?: string;
    tinNumber?: string;
    tradeLicenseDocumentId?: string | null;
    tinDocumentId?: string | null;
    utilityBillDocumentId?: string | null;
}

export interface VerificationFormProps {
    initialData?: VerificationFormData;
    onSubmit: (data: VerificationFormData) => void;
    isLoading?: boolean;
    onCancel?: () => void;
    isResubmission?: boolean;
}

export function VerificationForm(props: VerificationFormProps) {
    const { t } = useI18n();

    // Form state using createStore - the SolidJS standard for complex state
    const [formState, setFormState] = createStore<VerificationFormData>({
        tradeLicenseNumber: props.initialData?.tradeLicenseNumber || '',
        tinNumber: props.initialData?.tinNumber || '',
        tradeLicenseDocumentId: props.initialData?.tradeLicenseDocumentId || null,
        tinDocumentId: props.initialData?.tinDocumentId || null,
        utilityBillDocumentId: props.initialData?.utilityBillDocumentId || null,
    });

    const [errors, setErrors] = createSignal<Record<string, string>>({});

    // Memo for tracking if form has changes - SolidJS standard pattern
    const hasChangesMemo = createMemo(() => {
        const initialTradeLicenseDoc = props.initialData?.tradeLicenseDocumentId || null;
        const initialTinDoc = props.initialData?.tinDocumentId || null;
        const initialUtilityBillDoc = props.initialData?.utilityBillDocumentId || null;
        const initialTradeLicenseNumber = props.initialData?.tradeLicenseNumber || '';
        const initialTinNumber = props.initialData?.tinNumber || '';

        // Access store properties directly - SolidJS tracks these reactively
        const currentTradeLicenseDoc = formState.tradeLicenseDocumentId || null;
        const currentTinDoc = formState.tinDocumentId || null;
        const currentUtilityBillDoc = formState.utilityBillDocumentId || null;
        const currentTradeLicenseNumber = formState.tradeLicenseNumber?.trim() || '';
        const currentTinNumber = formState.tinNumber?.trim() || '';

        const hasDocumentChanges =
            (currentTradeLicenseDoc !== initialTradeLicenseDoc) ||
            (currentTinDoc !== initialTinDoc) ||
            (currentUtilityBillDoc !== initialUtilityBillDoc);

        const hasNumberChanges =
            (currentTradeLicenseNumber !== initialTradeLicenseNumber) ||
            (currentTinNumber !== initialTinNumber);

        return hasDocumentChanges || hasNumberChanges;
    });

    // Reactive validation - updates when form fields change
    const isFormValid = createMemo(() => {
        try {
            const currentErrors: Record<string, string> = {};
            const hasChanges = hasChangesMemo();
            const tlNumber = formState.tradeLicenseNumber?.trim() || '';
            const tlDocId = formState.tradeLicenseDocumentId || null;
            const tinNumber = formState.tinNumber?.trim() || '';

            // For resubmission, be more lenient - allow submission if any document has changed
            if (props.isResubmission) {
                // Resubmission: At least one document must have changed
                if (!hasChanges) {
                    currentErrors.form = t('seller.verification.noChangesDetected');
                }
                // Don't require all fields for resubmission if changes have been made
            } else {
                // First-time submission: Require all fields
                // Required field: Trade License Number
                if (!tlNumber) {
                    currentErrors.tradeLicenseNumber = t('seller.verification.tradeLicenseNumber') + ' ' + t('common.required');
                }

                // Required field: Trade License Document
                if (!tlDocId) {
                    currentErrors.tradeLicenseDocument = t('seller.verification.tradeLicenseDocument') + ' ' + t('common.required');
                }
            }

            // Validation: TIN Number format (if provided) - should be 10 digits for Bangladesh
            // Only validate TIN format on first-time submission, not resubmission
            if (!props.isResubmission && tinNumber && !/^\d{10}$/.test(tinNumber)) {
                currentErrors.tinNumber = t('seller.verification.tinNumber') + ' must be 10 digits';
            }

            // Update errors signal for display
            setErrors(currentErrors);

            return Object.keys(currentErrors).length === 0;
        } catch (error) {
            console.error('[Validation] error:', error);
            return false;
        }
    });

    const validate = (): boolean => {
        // Validation is now reactive, just return current validity
        return isFormValid();
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        props.onSubmit({
            tradeLicenseNumber: formState.tradeLicenseNumber?.trim() || undefined,
            tinNumber: formState.tinNumber?.trim() || undefined,
            tradeLicenseDocumentId: formState.tradeLicenseDocumentId ?? undefined,
            tinDocumentId: formState.tinDocumentId ?? undefined,
            utilityBillDocumentId: formState.utilityBillDocumentId ?? undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} class="space-y-6">
            {/* Resubmission Hint */}
            <Show when={props.isResubmission}>
                <div class="p-4 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700 rounded-lg">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-sage-600 dark:text-sage-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="text-sm text-sage-800 dark:text-sage-200">
                            <p class="font-semibold mb-1">Update Your Documents</p>
                            <p>Your currently submitted documents are shown above. Upload new files to replace them, or leave unchanged if only updating other information.</p>
                        </div>
                    </div>
                </div>
            </Show>

            {/* Trade License Section */}
            <div class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {t('seller.verification.tradeLicenseDocument')}
                    </h3>
                </div>

                <Input
                    label={t('seller.verification.tradeLicenseNumber')}
                    value={formState.tradeLicenseNumber}
                    onInput={(e) => setFormState('tradeLicenseNumber', e.currentTarget.value)}
                    placeholder={t('seller.verification.tradeLicenseNumberDesc')}
                    error={errors().tradeLicenseNumber}
                    required
                />

                <DocumentUploader
                    label={t('seller.verification.tradeLicenseDocument')}
                    accept="image/*,.pdf"
                    uploadedMediaId={formState.tradeLicenseDocumentId || undefined}
                    onMediaChange={(id) => setFormState('tradeLicenseDocumentId', id || null)}
                    description="PDF or Image (JPG, PNG), max 10MB"
                    required
                />
                <Show when={errors().tradeLicenseDocument}>
                    <p class="text-sm text-red-600 dark:text-red-400">{errors().tradeLicenseDocument}</p>
                </Show>
            </div>

            {/* TIN Section */}
            <div class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {t('seller.verification.tinNumber')}
                        <span class="text-gray-400 dark:text-gray-500 font-normal ml-2">(Optional)</span>
                    </h3>
                </div>

                <Input
                    label={t('seller.verification.tinNumber')}
                    value={formState.tinNumber}
                    onInput={(e) => setFormState('tinNumber', e.currentTarget.value)}
                    placeholder={t('seller.verification.optional')}
                />

                <DocumentUploader
                    label={t('seller.verification.tinDocument')}
                    accept="image/*,.pdf"
                    uploadedMediaId={formState.tinDocumentId || undefined}
                    onMediaChange={(id) => setFormState('tinDocumentId', id || null)}
                    description="TIN Certificate - PDF or Image, max 10MB"
                />
            </div>

            {/* Utility Bill Section */}
            <div class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {t('seller.verification.utilityBillDocument')}
                        <span class="text-gray-400 dark:text-gray-500 font-normal ml-2">(Optional)</span>
                    </h3>
                </div>

                <DocumentUploader
                    label={t('seller.verification.utilityBillDocument')}
                    accept="image/*,.pdf"
                    uploadedMediaId={formState.utilityBillDocumentId || undefined}
                    onMediaChange={(id) => setFormState('utilityBillDocumentId', id || null)}
                    description="Electricity/Water/Gas bill - PDF or Image, max 10MB"
                />
            </div>

            {/* Info Banner */}
            <div class="bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-700 rounded-lg p-4">
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

            {/* Form-level Error */}
            <Show when={errors().form}>
                <div class="p-4 bg-terracotta-50 dark:bg-terracotta-900/20 border-2 border-terracotta-200 dark:border-terracotta-800 rounded-lg">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm text-terracotta-700 dark:text-terracotta-300">
                            {errors().form}
                        </p>
                    </div>
                </div>
            </Show>

            {/* Action Buttons */}
            <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                    type="submit"
                    variant="primary"
                    loading={props.isLoading}
                    disabled={!isFormValid() || props.isLoading}
                    class="flex-1 sm:flex-none"
                >
                    {props.isLoading ? t('seller.verification.submitting') : (props.isResubmission === true ? t('seller.verification.resubmit') : t('seller.verification.submitVerificationBtn'))}
                </Button>
                {props.onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={props.onCancel}
                        disabled={props.isLoading}
                        class="flex-1 sm:flex-none"
                    >
                        {t('common.cancel')}
                    </Button>
                )}
            </div>
        </form>
    );
}
