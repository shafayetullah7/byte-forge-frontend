import { createSignal } from "solid-js";
import { mediaApi } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";

export interface UseImageUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  onSuccess?: (mediaId: string, mediaUrl: string) => void;
  onError?: (error: Error) => void;
}

export interface UseImageUploadReturn {
  isUploading: () => boolean;
  isDeleting: () => boolean;
  preview: () => string | null;
  mediaId: () => string | null;
  upload: (file: File) => Promise<void>;
  deleteMedia: () => Promise<void>;
  clear: () => void;
}

/**
 * Hook for handling image uploads with validation and preview
 * 
 * @example
 * ```tsx
 * const { isUploading, preview, upload, deleteMedia } = useImageUpload({
 *   maxSizeMB: 3,
 *   onSuccess: (mediaId, url) => {
 *     setFormData({ ...formData(), logoId: mediaId });
 *   }
 * });
 * ```
 */
export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxSizeMB = 3,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    onSuccess,
    onError,
  } = options;

  const [isUploading, setIsUploading] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [preview, setPreview] = createSignal<string | null>(null);
  const [mediaId, setMediaId] = createSignal<string | null>(null);

  const upload = async (file: File) => {
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const error = new Error(`File size must be less than ${maxSizeMB}MB`);
      toaster.error(error.message);
      onError?.(error);
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const error = new Error(
        `Only ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")} images are allowed`
      );
      toaster.error(error.message);
      onError?.(error);
      return;
    }

    setIsUploading(true);

    try {
      // Direct API call - 401 handled by API client
      const response = await mediaApi.upload(file);

      // Backend returns media directly in data
      const uploadedMediaId = response.data.id;
      const mediaUrl = response.data.url;

      setMediaId(uploadedMediaId);
      setPreview(mediaUrl);
      toaster.success("Image uploaded successfully");
      onSuccess?.(uploadedMediaId, mediaUrl);
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(error.message || "Failed to upload image");
      toaster.error(err.message);
      onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMedia = async () => {
    const currentMediaId = mediaId();
    if (!currentMediaId) return;

    setIsDeleting(true);

    try {
      // Direct API call - 401 handled by API client
      await mediaApi.delete(currentMediaId);

      // Clear state after successful deletion
      setMediaId(null);
      setPreview(null);
      // Silent delete - no success toast
    } catch (error: any) {
      // Only show error if deletion fails
      const err = error instanceof Error ? error : new Error(error.message || "Failed to delete image");
      toaster.error(err.message);
      onError?.(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const clear = () => {
    setPreview(null);
    setMediaId(null);
  };

  return {
    isUploading,
    isDeleting,
    preview,
    mediaId,
    upload,
    deleteMedia,
    clear,
  };
}
