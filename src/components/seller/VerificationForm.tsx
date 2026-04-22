import { createSignal, Show } from 'solid-js';
import { DocumentUploader } from './DocumentUploader';
import { FilePreviewCard } from './FilePreviewCard';
import Input from '~/components/ui/Input';
import Button from '~/components/ui/Button';
import { useI18n } from '~/i18n';

export interface VerificationFormData {
    tradeLicenseNumber?: string;
    tinNumber?: string;
    tradeLicenseDocumentId?: string;
    tinDocumentId?: string;
    utilityBillDocumentId?: string;
    tradeLicenseDocument?: ShopMedia;
    tinDocument?: ShopMedia;
    utilityBillDocument?: ShopMedia;
}

export interface ShopMedia {
    id: string;
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
}

export interface VerificationFormProps {
    initialData?: VerificationFormData;
    onSubmit: (data: VerificationFormData) => void;
    isLoading?: boolean;
    onCancel?: () => void;
}

export function VerificationForm(props: VerificationFormProps) {
    const { t } = useI18n();
    const [tradeLicenseNumber, setTradeLicenseNumber] = createSignal(
        props.initialData?.tradeLicenseNumber || ''
    );
    const [tinNumber, setTinNumber] = createSignal(
        props.initialData?.tinNumber || ''
    );
    const [tradeLicenseDocumentId, setTradeLicenseDocumentId] = createSignal<
        string | undefined
    >(props.initialData?.tradeLicenseDocumentId || undefined);
    const [tinDocumentId, setTinDocumentId] = createSignal<string | undefined>(
        props.initialData?.tinDocumentId || undefined
    );
    const [utilityBillDocumentId, setUtilityBillDocumentId] = createSignal<
        string | undefined
    >(props.initialData?.utilityBillDocumentId || undefined);

    const [errors, setErrors] = createSignal<Record<string, string>>({});

    const isResubmit = () => {
        return !!(props.initialData?.tradeLicenseDocumentId || props.initialData?.tradeLicenseNumber);
    };

    const hasExistingDocuments = () => {
        return !!(
            props.initialData?.tradeLicenseDocumentId ||
            props.initialData?.tinDocumentId ||
            props.initialData?.utilityBillDocumentId
        );
    };

    const hasChanges = (): boolean => {
        // Check if any field has changed from initial values
        return (
            tradeLicenseNumber().trim() !== (props.initialData?.tradeLicenseNumber || '').trim() ||
            tinNumber().trim() !== (props.initialData?.tinNumber || '').trim() ||
            tradeLicenseDocumentId() !== props.initialData?.tradeLicenseDocumentId ||
            tinDocumentId() !== props.initialData?.tinDocumentId ||
            utilityBillDocumentId() !== props.initialData?.utilityBillDocumentId
        );
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Required field: Trade License Number
        if (!tradeLicenseNumber().trim()) {
            newErrors.tradeLicenseNumber = t('seller.verification.tradeLicenseNumber') + ' ' + t('common.required');
        }

        // Required field: Trade License Document
        if (!tradeLicenseDocumentId()) {
            newErrors.tradeLicenseDocument = t('seller.verification.tradeLicenseDocument') + ' ' + t('common.required');
        }

        // Validation: TIN Number format (if provided) - should be 10 digits for Bangladesh
        const tinValue = tinNumber().trim();
        if (tinValue && !/^\d{10}$/.test(tinValue)) {
            newErrors.tinNumber = t('seller.verification.tinNumber') + ' must be 10 digits';
        }

        // EDGE CASE: Prevent identical resubmission (no changes)
        if (isResubmit() && !hasChanges()) {
            newErrors.form = t('seller.verification.noChangesDetected');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        props.onSubmit({
            tradeLicenseNumber: tradeLicenseNumber().trim() || undefined,
            tinNumber: tinNumber().trim() || undefined,
            tradeLicenseDocumentId: tradeLicenseDocumentId(),
            tinDocumentId: tinDocumentId(),
            utilityBillDocumentId: utilityBillDocumentId(),
        });
    };

    return (
        <form onSubmit={handleSubmit} class="space-y-6">
            {/* Existing Documents Section - Show on resubmission */}
            <Show when={isResubmit() && hasExistingDocuments()}>
                <div class="bg-cream-50 dark:bg-forest-900/30 rounded-xl border border-cream-200 dark:border-forest-700 p-5">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {t('seller.verification.existingDocuments')}
                        </h3>
                    </div>
                    
                    <div class="space-y-4">
                        {/* Trade License */}
                        <Show when={props.initialData?.tradeLicenseDocumentId && props.initialData?.tradeLicenseDocument} keyed>
                            {(doc) => (
                                <FilePreviewCard 
                                    label={t('seller.verification.tradeLicenseDocument')}
                                    url={doc.url}
                                    fileName={doc.fileName}
                                    mimeType={doc.mimeType}
                                    size={doc.size}
                                />
                            )}
                        </Show>

                        {/* TIN Document */}
                        <Show when={props.initialData?.tinDocumentId && props.initialData?.tinDocument} keyed>
                            {(doc) => (
                                <FilePreviewCard 
                                    label={t('seller.verification.tinDocument')}
                                    url={doc.url}
                                    fileName={doc.fileName}
                                    mimeType={doc.mimeType}
                                    size={doc.size}
                                />
                            )}
                        </Show>

                        {/* Utility Bill */}
                        <Show when={props.initialData?.utilityBillDocumentId && props.initialData?.utilityBillDocument} keyed>
                            {(doc) => (
                                <FilePreviewCard 
                                    label={t('seller.verification.utilityBillDocument')}
                                    url={doc.url}
                                    fileName={doc.fileName}
                                    mimeType={doc.mimeType}
                                    size={doc.size}
                                />
                            )}
                        </Show>
                    </div>

                    <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p class="text-xs text-amber-800 dark:text-amber-300">
                            {t('seller.verification.replaceDocumentsHint')}
                        </p>
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
                    value={tradeLicenseNumber()}
                    onInput={(e) => setTradeLicenseNumber(e.currentTarget.value)}
                    placeholder={t('seller.verification.tradeLicenseNumberDesc')}
                    error={errors().tradeLicenseNumber}
                    required
                />

                <DocumentUploader
                    label={t('seller.verification.tradeLicenseDocument')}
                    accept="image/*,.pdf"
                    uploadedMediaId={tradeLicenseDocumentId()}
                    onMediaChange={setTradeLicenseDocumentId}
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
                    value={tinNumber()}
                    onInput={(e) => setTinNumber(e.currentTarget.value)}
                    placeholder={t('seller.verification.optional')}
                />

                <DocumentUploader
                    label={t('seller.verification.tinDocument')}
                    accept="image/*,.pdf"
                    uploadedMediaId={tinDocumentId()}
                    onMediaChange={setTinDocumentId}
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
                    uploadedMediaId={utilityBillDocumentId()}
                    onMediaChange={setUtilityBillDocumentId}
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
                    class="flex-1 sm:flex-none"
                >
                    {isResubmit() ? t('seller.verification.resubmit') : t('seller.verification.submitVerificationBtn')}
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
