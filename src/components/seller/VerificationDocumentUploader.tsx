import { createSignal, Show } from 'solid-js';
import { FileUpload } from '../ui/FileUpload';
import { mediaApi } from '~/lib/api';
import { toaster } from '../ui/Toast';

interface VerificationDocumentUploaderProps {
    initialData?: {
        tradeLicenseNumber?: string | null;
        tinNumber?: string | null;
        tradeLicenseDocumentId?: string | null;
        tinDocumentId?: string | null;
        utilityBillDocumentId?: string | null;
    };
    onSubmit: (data: VerificationFormData) => void;
    isLoading?: boolean;
}

interface VerificationFormData {
    tradeLicenseNumber?: string;
    tinNumber?: string;
    tradeLicenseDocumentId?: string;
    tinDocumentId?: string;
    utilityBillDocumentId?: string;
}

interface DocumentUploadFieldProps {
    accept: string;
    uploadedMediaId?: string | null;
    onMediaChange: (mediaId: string | undefined) => void;
    disabled?: boolean;
    label: string;
    description?: string;
}

/**
 * Document upload field using the unified FileUpload component
 * Supports images, PDFs, and other document types
 * Uploads files immediately when selected
 */
function DocumentUploadField(props: DocumentUploadFieldProps) {
    const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);
    const [fileName, setFileName] = createSignal<string | null>(null);
    const [fileType, setFileType] = createSignal<string | null>(null);
    const [fileSize, setFileSize] = createSignal<number | null>(null);
    const [isUploading, setIsUploading] = createSignal(false);

    /**
     * Handle file selection and immediate upload
     */
    const handleFileSelect = async (file: File) => {
        // Validate file size (max 10MB)
        const maxSizeBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toaster.error('File size must be less than 10MB');
            return;
        }

        setIsUploading(true);

        try {
            // Upload file immediately
            const response = await mediaApi.upload(file);

            // Update state with uploaded file info
            setPreviewUrl(response.url);
            setFileName(file.name);
            setFileType(file.type);
            setFileSize(file.size);

            // Notify parent of successful upload with media ID
            props.onMediaChange(response.id);
        } catch (error: any) {
            const err = error instanceof Error ? error : new Error(error.message || 'Failed to upload document');
            toaster.error(err.message);
            // Clear state on error
            setPreviewUrl(null);
            setFileName(null);
            setFileType(null);
            setFileSize(null);
            props.onMediaChange(undefined);
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Handle file deletion
     */
    const handleDelete = async () => {
        const currentMediaId = props.uploadedMediaId;
        if (!currentMediaId) {
            // Just clear local state if no media ID
            setPreviewUrl(null);
            setFileName(null);
            setFileType(null);
            setFileSize(null);
            props.onMediaChange(undefined);
            return;
        }

        setIsUploading(true);

        try {
            // Delete from server
            await mediaApi.delete(currentMediaId);

            // Clear state after successful deletion
            setPreviewUrl(null);
            setFileName(null);
            setFileType(null);
            setFileSize(null);
            props.onMediaChange(undefined);
        } catch (error: any) {
            const err = error instanceof Error ? error : new Error(error.message || 'Failed to delete document');
            toaster.error(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <FileUpload
            preview={previewUrl()}
            fileName={fileName()}
            fileType={fileType()}
            fileSize={fileSize()}
            isUploading={isUploading()}
            isDeleting={isUploading()}
            onFileSelect={handleFileSelect}
            onDelete={handleDelete}
            disabled={props.disabled}
            label={props.label}
            description={props.description}
            accept={props.accept}
            showPreview={true}
        />
    );
}

export function VerificationDocumentUploader(props: VerificationDocumentUploaderProps) {
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

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!tradeLicenseNumber().trim()) {
            newErrors.tradeLicenseNumber = 'Trade license number is required';
        }

        if (!tradeLicenseDocumentId()) {
            newErrors.tradeLicenseDocument = 'Trade license document is required';
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
            tradeLicenseNumber: tradeLicenseNumber().trim(),
            tinNumber: tinNumber().trim() || undefined,
            tradeLicenseDocumentId: tradeLicenseDocumentId(),
            tinDocumentId: tinDocumentId(),
            utilityBillDocumentId: utilityBillDocumentId(),
        });
    };

    return (
        <form onSubmit={handleSubmit} class="space-y-6">
            {/* Trade License Section */}
            <div class="space-y-4">
                <h4 class="text-base font-semibold text-forest-900 dark:text-forest-100">
                    Trade License
                </h4>

                <div>
                    <label
                        for="tradeLicenseNumber"
                        class="block text-sm font-medium text-forest-800 dark:text-forest-200 mb-1"
                    >
                        Trade License Number <span class="text-terracotta-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="tradeLicenseNumber"
                        value={tradeLicenseNumber()}
                        onInput={(e) => setTradeLicenseNumber(e.currentTarget.value)}
                        class="w-full px-4 py-2.5 rounded-lg border border-forest-300 dark:border-forest-600
                   bg-white dark:bg-forest-900
                   text-forest-900 dark:text-forest-100
                   focus:ring-2 focus:ring-forest-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
                        placeholder="Enter trade license number"
                        disabled={props.isLoading}
                    />
                    <Show when={errors().tradeLicenseNumber}>
                        <p class="mt-1 text-sm text-terracotta-600 dark:text-terracotta-400">
                            {errors().tradeLicenseNumber}
                        </p>
                    </Show>
                </div>

                <div>
                    <label class="block text-sm font-medium text-forest-800 dark:text-forest-200 mb-1">
                        Trade License Document <span class="text-terracotta-500">*</span>
                    </label>
                    <DocumentUploadField
                        accept="image/*,.pdf"
                        uploadedMediaId={tradeLicenseDocumentId()}
                        onMediaChange={(mediaId) => setTradeLicenseDocumentId(mediaId || undefined)}
                        disabled={props.isLoading}
                        label="Upload trade license document"
                        description="Accepted formats: PDF, JPG, PNG (Max 10MB)"
                    />
                    <Show when={errors().tradeLicenseDocument}>
                        <p class="mt-1 text-sm text-terracotta-600 dark:text-terracotta-400">
                            {errors().tradeLicenseDocument}
                        </p>
                    </Show>
                </div>
            </div>

            <hr class="border-forest-200 dark:border-forest-700" />

            {/* TIN Section */}
            <div class="space-y-4">
                <h4 class="text-base font-semibold text-forest-900 dark:text-forest-100">
                    Tax Identification Number (TIN)
                </h4>

                <div>
                    <label
                        for="tinNumber"
                        class="block text-sm font-medium text-forest-800 dark:text-forest-200 mb-1"
                    >
                        TIN Number <span class="text-forest-400 text-xs">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        id="tinNumber"
                        value={tinNumber()}
                        onInput={(e) => setTinNumber(e.currentTarget.value)}
                        class="w-full px-4 py-2.5 rounded-lg border border-forest-300 dark:border-forest-600
                   bg-white dark:bg-forest-900
                   text-forest-900 dark:text-forest-100
                   focus:ring-2 focus:ring-forest-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
                        placeholder="Enter TIN number"
                        disabled={props.isLoading}
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-forest-800 dark:text-forest-200 mb-1">
                        TIN Document <span class="text-forest-400 text-xs">(Optional)</span>
                    </label>
                    <DocumentUploadField
                        accept="image/*,.pdf"
                        uploadedMediaId={tinDocumentId()}
                        onMediaChange={(mediaId) => setTinDocumentId(mediaId || undefined)}
                        disabled={props.isLoading}
                        label="Upload TIN document"
                        description="Accepted formats: PDF, JPG, PNG (Max 10MB)"
                    />
                </div>
            </div>

            <hr class="border-forest-200 dark:border-forest-700" />

            {/* Utility Bill Section */}
            <div class="space-y-4">
                <h4 class="text-base font-semibold text-forest-900 dark:text-forest-100">
                    Utility Bill
                </h4>

                <div>
                    <label class="block text-sm font-medium text-forest-800 dark:text-forest-200 mb-1">
                        Utility Bill Document <span class="text-forest-400 text-xs">(Optional)</span>
                    </label>
                    <DocumentUploadField
                        accept="image/*,.pdf"
                        uploadedMediaId={utilityBillDocumentId()}
                        onMediaChange={(mediaId) => setUtilityBillDocumentId(mediaId || undefined)}
                        disabled={props.isLoading}
                        label="Upload utility bill document"
                        description="Electricity, water, or gas bill (PDF, JPG, PNG - Max 10MB)"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div class="pt-4">
                <button
                    type="submit"
                    disabled={props.isLoading}
                    class="w-full py-3 px-4 bg-forest-600 hover:bg-forest-700
                 dark:bg-forest-500 dark:hover:bg-forest-600
                 text-white font-medium rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-200"
                >
                    {props.isLoading ? (
                        <span class="flex items-center justify-center gap-2">
                            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        'Submit for Verification'
                    )}
                </button>
                <p class="mt-2 text-xs text-forest-600 dark:text-forest-400 text-center">
                    Submitting will reset your verification status to "Pending Review"
                </p>
            </div>
        </form>
    );
}
