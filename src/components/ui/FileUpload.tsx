import { Component, Show, createSignal } from "solid-js";
import type { JSX } from "solid-js";

export interface FileUploadProps {
    preview?: string | null;
    fileName?: string | null;
    fileType?: string | null;
    fileSize?: number | null;
    isUploading: boolean;
    isDeleting?: boolean;
    onFileSelect: (file: File) => void;
    onDelete?: () => void;
    disabled?: boolean;
    label?: string;
    description?: string;
    accept?: string;
    maxSizeMB?: number;
    showPreview?: boolean;
}

/**
 * Get file icon based on MIME type
 */
function getFileIcon(fileType: string | null): string {
    if (!fileType) return "📄";

    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType === "application/pdf") return "📕";
    if (fileType.includes("word") || fileType.includes("document")) return "📘";
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📗";
    if (fileType.includes("powerpoint") || fileType.includes("presentation")) return "📙";
    if (fileType.startsWith("video/")) return "🎬";
    if (fileType.startsWith("audio/")) return "🎵";

    return "📄";
}

/**
 * Format file size to human-readable format
 */
function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Unified file upload component with preview support for images and documents
 * 
 * @example
 * ```tsx
 * // For images only
 * <FileUpload
 *   preview={preview()}
 *   isUploading={isUploading()}
 *   onFileSelect={upload}
 *   accept="image/*"
 *   label="Profile Photo"
 * />
 * 
 * // For documents (PDF, images, etc.)
 * <FileUpload
 *   preview={preview()}
 *   fileName={fileName()}
 *   fileType={fileType()}
 *   isUploading={isUploading()}
 *   onFileSelect={upload}
 *   accept="image/*,.pdf,.doc,.docx"
 *   label="Trade License"
 * />
 * ```
 */
export const FileUpload: Component<FileUploadProps> = (props) => {
    const [localPreview, setLocalPreview] = createSignal<string | null>(null);
    let fileInputRef: HTMLInputElement | undefined;

    const previewUrl = () => props.preview ?? localPreview();
    const hasFile = () => !!(props.preview || props.fileName || localPreview());

    /**
     * Clear the file input value to allow re-selecting the same file
     * Uses SolidJS ref pattern for proper DOM access
     */
    const clearFileInput = () => {
        if (fileInputRef) {
            fileInputRef.value = "";
        }
    };

    const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
        const input = e.currentTarget;
        const file = input.files?.[0];

        if (file) {
            // Validate file size if maxSizeMB is provided
            if (props.maxSizeMB && file.size > props.maxSizeMB * 1024 * 1024) {
                alert(`File size exceeds maximum allowed size of ${props.maxSizeMB}MB`);
                input.value = "";
                return;
            }

            // Create preview for local files
            if (!props.preview) {
                const url = URL.createObjectURL(file);
                setLocalPreview(url);
            }

            props.onFileSelect(file);
        }
    };

    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation();
        if (props.onDelete) {
            props.onDelete();
        }
        setLocalPreview(null);
        // Clear the input value using ref to allow re-selecting the same file
        clearFileInput();
    };

    const displayFileName = () => {
        if (props.fileName) return props.fileName;
        if (previewUrl()) {
            // Extract filename from URL if possible
            const urlParts = previewUrl()!.split("/");
            return urlParts[urlParts.length - 1]?.split("?")[0] || "uploaded-file";
        }
        return "file";
    };

    const displayFileSize = () => {
        if (props.fileSize) return formatFileSize(props.fileSize);
        return "";
    };

    const fileIcon = () => getFileIcon(props.fileType ?? null);

    const inputId = `file-upload-${props.label?.replace(/\s+/g, "-").toLowerCase() || "file"}`;

    return (
        <div>
            {/* Label */}
            <Show when={props.label}>
                <label for={inputId} class="block text-sm font-medium text-forest-800 dark:text-forest-200 mb-2">
                    {props.label}
                </label>
            </Show>

            <div class="space-y-3">
                {/* Preview Section */}
                <Show when={hasFile() && props.showPreview !== false}>
                    <div class="flex items-center gap-4 p-4 bg-cream-50/50 dark:bg-forest-900/50 rounded-lg border border-cream-200 dark:border-forest-700">
                        {/* File Preview */}
                        <Show
                            when={props.fileType?.startsWith("image/") || previewUrl()}
                            fallback={
                                // Non-image file preview (icon + filename)
                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                    <div class="w-12 h-12 flex items-center justify-center bg-forest-100 dark:bg-forest-800 rounded-lg text-2xl">
                                        {fileIcon()}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-forest-900 dark:text-forest-100 truncate">
                                            {displayFileName()}
                                        </p>
                                        <p class="text-xs text-forest-600 dark:text-forest-400">
                                            {props.fileType || "Unknown type"} • {displayFileSize() || "Size unknown"}
                                        </p>
                                    </div>
                                </div>
                            }
                        >
                            {/* Image preview */}
                            <div class="relative">
                                <img
                                    src={previewUrl()!}
                                    alt="Preview"
                                    class="w-20 h-20 object-cover rounded-lg"
                                    onError={(e) => {
                                        // Fallback to icon if image fails to load
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-forest-900 dark:text-forest-100 truncate">
                                    {displayFileName()}
                                </p>
                                <p class="text-xs text-forest-600 dark:text-forest-400">
                                    {displayFileSize() || "Click to replace"}
                                </p>
                            </div>
                        </Show>

                        {/* Delete Button */}
                        <Show when={props.onDelete}>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={props.isDeleting}
                                class="w-8 h-8 flex items-center justify-center bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                title="Remove file"
                            >
                                <Show when={!props.isDeleting} fallback={<span class="text-xs">...</span>}>
                                    ✕
                                </Show>
                            </button>
                        </Show>
                    </div>
                </Show>

                {/* Upload Area */}
                <div class="relative">
                    <input
                        type="file"
                        id={inputId}
                        ref={fileInputRef}
                        accept={props.accept || "*/*"}
                        onChange={handleChange}
                        onClick={clearFileInput}
                        disabled={props.disabled || props.isUploading}
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div class="flex items-center justify-center px-4 py-3 border-2 border-dashed border-cream-200 dark:border-forest-700 rounded-lg hover:border-terracotta-500 dark:hover:border-terracotta-400 transition-colors duration-200 bg-white dark:bg-forest-900/30">
                        <Show
                            when={!props.isUploading}
                            fallback={
                                <div class="text-center">
                                    <p class="text-sm text-forest-600 dark:text-forest-400">
                                        Uploading...
                                    </p>
                                </div>
                            }
                        >
                            <div class="text-center">
                                <p class="text-sm text-forest-700 dark:text-forest-300">
                                    📁 Click to upload or drag and drop
                                </p>
                                <Show when={props.description}>
                                    <p class="text-xs text-forest-600 dark:text-forest-400 mt-1">
                                        {props.description}
                                    </p>
                                </Show>
                                <Show when={!props.description && props.maxSizeMB}>
                                    <p class="text-xs text-forest-600 dark:text-forest-400 mt-1">
                                        Max size: {props.maxSizeMB}MB
                                    </p>
                                </Show>
                                <Show when={!props.description && !props.maxSizeMB && props.accept}>
                                    <p class="text-xs text-forest-600 dark:text-forest-400 mt-1">
                                        Accepted: {props.accept}
                                    </p>
                                </Show>
                            </div>
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    );
};
