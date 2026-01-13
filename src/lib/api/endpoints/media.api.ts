import { api } from "../api-client";
import type { MediaRecord, UploadMediaResponse } from "../types/media.types";
import type { ApiResponse } from "../types";

/**
 * Media API endpoints
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

    return api.post<UploadMediaResponse>("/api/v1/media/upload", formData);
  },

  /**
   * Get all user media
   */
  getAll: async (): Promise<ApiResponse<MediaRecord[]>> => {
    return api.get<ApiResponse<MediaRecord[]>>("/api/v1/media");
  },

  /**
   * Delete a media file by ID
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/api/v1/media/${id}`);
  },
};
