import { action } from "@solidjs/router";
import { mediaApi } from "~/lib/api/endpoints/user/media.api";
import { ApiError } from "~/lib/api/types";

export type UploadMediaActionResult =
  | { success: true; data: { id: string; url: string } }
  | { success: false; error: { message: string; statusCode?: number } };

export type DeleteMediaActionResult =
  | { success: true }
  | { success: false; error: { message: string; statusCode?: number } };

export const uploadMediaAction = action(
  async (formData: FormData): Promise<UploadMediaActionResult> => {
    "use server";
    try {
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return { success: false, error: { message: "No file provided" } };
      }

      const folder = formData.get("folder");
      const response = await mediaApi.upload(
        file,
        typeof folder === "string" && folder.length > 0 ? folder : undefined,
      );

      return {
        success: true,
        data: { id: response.id, url: response.url },
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: {
          statusCode: apiError.statusCode,
          message: apiError.response?.message ?? apiError.message,
        },
      };
    }
  },
  "upload-media",
);

export const deleteMediaAction = action(
  async (input: { id: string }): Promise<DeleteMediaActionResult> => {
    "use server";
    try {
      await mediaApi.delete(input.id);
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: {
          statusCode: apiError.statusCode,
          message: apiError.response?.message ?? apiError.message,
        },
      };
    }
  },
  "delete-media",
);
