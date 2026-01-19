import { Component, Show } from "solid-js";

export interface ImageUploadProps {
    preview: string | null;
    isUploading: boolean;
    isDeleting?: boolean;
    onFileSelect: (file: File) => void;
    onDelete?: () => void;
    disabled?: boolean;
    label?: string;
    description?: string;
    accept?: string;
    maxSizeMB?: number;
}

/**
 * Reusable image upload component with preview and delete
 * 
 * @example
 * ```tsx
 * const { isUploading, isDeleting, preview, upload, deleteMedia } = useImageUpload({
 *   onSuccess: (id, url) => setFormData({ ...formData(), logoId: id })
 * });
 * 
 * <ImageUpload
 *   preview={preview()}
 *   isUploading={isUploading()}
 *   isDeleting={isDeleting()}
 *   onFileSelect={upload}
 *   onDelete={deleteMedia}
 *   label="Business Logo"
 * />
 * ```
 */
export const ImageUpload: Component<ImageUploadProps> = (props) => {
    const handleChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            props.onFileSelect(file);
        }
    };

    return (
        <div>
            {/* Label */}
            <Show when={props.label}>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {props.label}
                </label>
            </Show>

            <div class="space-y-3">
                {/* Preview with Delete Button */}
                <Show when={props.preview}>
                    <div class="relative group">
                        <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div class="relative">
                                <img
                                    src={props.preview!}
                                    alt="Preview"
                                    class="w-20 h-20 object-cover rounded-lg"
                                />
                                {/* Delete button overlay */}
                                <Show when={props.onDelete}>
                                    <button
                                        type="button"
                                        onClick={props.onDelete}
                                        disabled={props.isDeleting}
                                        class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Delete image"
                                    >
                                        <Show when={!props.isDeleting} fallback={<span class="text-xs">...</span>}>
                                            ✕
                                        </Show>
                                    </button>
                                </Show>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                    Image uploaded
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    You can change it by uploading a new file
                                </p>
                            </div>
                        </div>
                    </div>
                </Show>

                {/* Upload Area */}
                <div class="relative">
                    <input
                        type="file"
                        accept={props.accept || "image/jpeg,image/png,image/webp,image/gif"}
                        onChange={handleChange}
                        disabled={props.disabled || props.isUploading}
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div class="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-terracotta-500 dark:hover:border-terracotta-400 transition-colors">
                        <div class="text-center">
                            <Show
                                when={!props.isUploading}
                                fallback={
                                    <p class="text-sm text-gray-600 dark:text-gray-400">
                                        Uploading...
                                    </p>
                                }
                            >
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    📷 Click to upload or drag and drop
                                </p>
                                <Show when={props.description}>
                                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        {props.description}
                                    </p>
                                </Show>
                                <Show when={!props.description && props.maxSizeMB}>
                                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        JPEG, PNG, WEBP, or GIF (max {props.maxSizeMB}MB)
                                    </p>
                                </Show>
                            </Show>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
