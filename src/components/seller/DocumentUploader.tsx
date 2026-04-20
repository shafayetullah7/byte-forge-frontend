import { createSignal, Show } from 'solid-js';
import { FileUpload } from '~/components/ui/FileUpload';
import { mediaApi } from '~/lib/api';
import { toaster } from '~/components/ui/Toast';
import { useI18n } from '~/i18n';

export interface DocumentUploaderProps {
    label: string;
    description?: string;
    accept: string;
    maxSizeMB?: number;
    uploadedMediaId?: string | null;
    previewUrl?: string | null;
    onMediaChange: (mediaId: string | undefined) => void;
    onFileDelete?: (mediaId: string) => Promise<void>;
    disabled?: boolean;
    isLoading?: boolean;
    required?: boolean;
}

export function DocumentUploader(props: DocumentUploaderProps) {
    const { t } = useI18n();
    const [previewUrl, setPreviewUrl] = createSignal<string | null>(props.previewUrl ?? null);
    const [fileName, setFileName] = createSignal<string | null>(null);
    const [fileType, setFileType] = createSignal<string | null>(null);
    const [fileSize, setFileSize] = createSignal<number | null>(null);
    const [isUploading, setIsUploading] = createSignal(false);

    const hasFile = () => !!(props.uploadedMediaId || previewUrl() || fileName());

    const handleFileSelect = async (file: File) => {
        const maxSizeBytes = (props.maxSizeMB || 10) * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toaster.error(`File size must be less than ${props.maxSizeMB || 10}MB`);
            return;
        }

        setIsUploading(true);

        try {
            const response = await mediaApi.upload(file);

            setPreviewUrl(response.url);
            setFileName(file.name);
            setFileType(file.type);
            setFileSize(file.size);

            props.onMediaChange(response.id);
            toaster.success('File uploaded successfully');
        } catch (error: any) {
            const err = error instanceof Error ? error : new Error(error.message || 'Failed to upload document');
            toaster.error(err.message);
            setPreviewUrl(null);
            setFileName(null);
            setFileType(null);
            setFileSize(null);
            props.onMediaChange(undefined);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        const currentMediaId = props.uploadedMediaId;
        if (!currentMediaId) {
            setPreviewUrl(null);
            setFileName(null);
            setFileType(null);
            setFileSize(null);
            props.onMediaChange(undefined);
            return;
        }

        setIsUploading(true);

        try {
            if (props.onFileDelete) {
                await props.onFileDelete(currentMediaId);
            } else {
                await mediaApi.delete(currentMediaId);
            }

            setPreviewUrl(null);
            setFileName(null);
            setFileType(null);
            setFileSize(null);
            props.onMediaChange(undefined);
            toaster.success('File deleted successfully');
        } catch (error: any) {
            const err = error instanceof Error ? error : new Error(error.message || 'Failed to delete document');
            toaster.error(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {props.label}
                {props.required && <span class="text-red-500 ml-1">*</span>}
            </label>
            
            <Show when={props.description}>
                <p class="text-xs text-gray-500 dark:text-gray-400">{props.description}</p>
            </Show>

            <FileUpload
                preview={previewUrl()}
                fileName={fileName()}
                fileType={fileType()}
                fileSize={fileSize()}
                isUploading={isUploading()}
                isDeleting={isUploading()}
                onFileSelect={handleFileSelect}
                onDelete={handleDelete}
                disabled={props.disabled || props.isLoading}
                label=""
                accept={props.accept}
                showPreview={true}
                maxSizeMB={props.maxSizeMB}
            />
        </div>
    );
}
