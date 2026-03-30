import { Component } from "solid-js";
import { FileUpload, FileUploadProps } from "./FileUpload";

export type ImageUploadProps = Omit<FileUploadProps, "accept" | "showPreview"> & {
    /**
     * Override default image accept pattern
     * @default "image/jpeg,image/png,image/webp,image/gif"
     */
    accept?: string;
};

/**
 * Image upload component - specialized version of FileUpload for images
 * 
 * This is a re-export of FileUpload with image-specific defaults:
 * - accept: "image/jpeg,image/png,image/webp,image/gif"
 * - showPreview: true (always show image preview)
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
    return (
        <FileUpload
            {...props}
            accept={props.accept || "image/jpeg,image/png,image/webp,image/gif"}
            showPreview={true}
        />
    );
};
