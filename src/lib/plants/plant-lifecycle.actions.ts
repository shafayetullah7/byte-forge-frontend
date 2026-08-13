import { action } from "@solidjs/router";
import {
  deletePlant,
  invalidateAllPlantCaches,
  updatePlantStatus,
} from "~/lib/api/endpoints/seller/plants.api";
import type { PlantStatus } from "~/lib/api/types/seller.types";
import { ApiError } from "~/lib/api/types";
import { readApiErrorCode } from "~/lib/api/read-api-error-code";

export type PlantLifecycleResult =
  | { success: true }
  | { success: false; error: { message: string; statusCode?: number; code?: string } };

export const updatePlantStatusAction = action(
  async (input: { plantId: string; status: PlantStatus }): Promise<PlantLifecycleResult> => {
    "use server";
    try {
      await updatePlantStatus(input.plantId, input.status);
      invalidateAllPlantCaches(input.plantId);
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: {
          statusCode: apiError.statusCode,
          message: apiError.response?.message ?? apiError.message,
          code: readApiErrorCode(apiError.response),
        },
      };
    }
  },
  "update-plant-status",
);

export const deletePlantAction = action(
  async (input: { plantId: string }): Promise<PlantLifecycleResult> => {
    "use server";
    try {
      await deletePlant(input.plantId);
      invalidateAllPlantCaches(input.plantId);
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: {
          statusCode: apiError.statusCode,
          message: apiError.response?.message ?? apiError.message,
          code: readApiErrorCode(apiError.response),
        },
      };
    }
  },
  "delete-plant",
);
