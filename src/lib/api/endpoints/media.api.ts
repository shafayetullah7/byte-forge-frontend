import { fetcher } from "../api-client";
import type { MediaRecord, UploadMediaResponse } from "../types/media.types";

/**
 * Media API endpoints
 * 
 * Refactored to use the functional fetcher with unwrapped responses.
 */
export const mediaApi = {
  /**
   * Upload a single file
   * @param file - The file to upload
   * @param folder - Optional folder name
   */
  upload: async (file: File, folder?: string): Promise<UploadMediaResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    return fetcher<UploadMediaResponse>("/api/v1/media/upload", {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Get all user media
   */
  getAll: async (): Promise<MediaRecord[]> => {
    return fetcher<MediaRecord[]>("/api/v1/media");
  },

  /**
   * Delete a media file by ID
   */
  delete: async (id: string): Promise<void> => {
    return fetcher<void>(`/api/v1/media/${id}`, {
      method: "DELETE",
    });
  },
};
