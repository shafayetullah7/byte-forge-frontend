import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import { toaster } from "~/components/ui/Toast";
import { deleteMediaAction, uploadMediaAction } from "~/lib/media/media.actions";

export interface UseImageUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  folder?: string;
  /** When false, replaced uploads do not call mediaApi.delete on the previous id. */
  deleteReplacedMedia?: boolean;
  /** When false, deleteMedia only clears local state (no API delete). */
  deleteFromServer?: boolean;
  onSuccess?: (mediaId: string, mediaUrl: string) => void;
  onError?: (error: Error) => void;
  onClear?: () => void;
}

export interface UseImageUploadReturn {
  isUploading: () => boolean;
  isDeleting: () => boolean;
  preview: () => string | null;
  mediaId: () => string | null;
  upload: (file: File) => Promise<void>;
  deleteMedia: () => Promise<void>;
  clear: () => void;
  seed: (mediaId: string, url: string) => void;
}

/**
 * Hook for handling image uploads with validation and preview
 */
export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxSizeMB = 3,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    folder,
    deleteReplacedMedia = true,
    deleteFromServer = true,
    onSuccess,
    onError,
    onClear,
  } = options;

  const uploadTrigger = useAction(uploadMediaAction);
  const deleteTrigger = useAction(deleteMediaAction);

  const [isUploading, setIsUploading] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [preview, setPreview] = createSignal<string | null>(null);
  const [mediaId, setMediaId] = createSignal<string | null>(null);

  const seed = (id: string, url: string) => {
    setMediaId(id);
    setPreview(url);
  };

  const upload = async (file: File) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const error = new Error(`File size must be less than ${maxSizeMB}MB`);
      toaster.error(error.message);
      onError?.(error);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      const error = new Error(
        `Only ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")} images are allowed`
      );
      toaster.error(error.message);
      onError?.(error);
      return;
    }

    setIsUploading(true);
    const oldMediaId = mediaId();

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (folder) {
        formData.append("folder", folder);
      }

      const result = await uploadTrigger(formData);
      if (!result || result.success === false) {
        throw new Error(result?.error?.message ?? "Failed to upload image");
      }

      const uploadedMediaId = result.data.id;
      const mediaUrl = result.data.url;

      setMediaId(uploadedMediaId);
      setPreview(mediaUrl);
      toaster.success("Image uploaded successfully");
      onSuccess?.(uploadedMediaId, mediaUrl);

      if (deleteReplacedMedia && oldMediaId) {
        deleteTrigger({ id: oldMediaId }).catch(() => {});
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error((error as { message?: string }).message || "Failed to upload image");
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
      if (deleteFromServer) {
        const result = await deleteTrigger({ id: currentMediaId });
        if (!result || result.success === false) {
          throw new Error(result?.error?.message ?? "Failed to delete image");
        }
      }

      setMediaId(null);
      setPreview(null);
      onClear?.();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error((error as { message?: string }).message || "Failed to delete image");
      toaster.error(err.message);
      onError?.(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const clear = () => {
    setPreview(null);
    setMediaId(null);
    onClear?.();
  };

  return {
    isUploading,
    isDeleting,
    preview,
    mediaId,
    upload,
    deleteMedia,
    clear,
    seed,
  };
}
