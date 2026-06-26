import { action } from "@solidjs/router";
import { updatePlant, invalidateAllPlantCaches } from "~/lib/api/endpoints/seller/plants.api";
import { invalidateInventory } from "~/lib/api/endpoints/seller/inventory.api";
import type { PlantFormState } from "~/lib/types/plant-form";
import { toUpdatePlantDto } from "~/lib/types/plant-form";
import {
  type PlantSectionId,
  sectionTouchesVariants,
} from "./plant-section-edit";

export interface SavePlantSectionPayload {
  plantId: string;
  sectionId: PlantSectionId;
  form: PlantFormState;
}

export const savePlantSectionAction = action(async (payload: SavePlantSectionPayload) => {
  "use server";
  try {
    await updatePlant(payload.plantId, toUpdatePlantDto(payload.form) as never);
    return { success: true as const, id: payload.plantId };
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      statusCode?: number;
      response?: {
        error?: { validationErrors?: { field: string; message: string }[] };
        validationErrors?: { field: string; message: string }[];
      };
      validationErrors?: { field: string; message: string }[];
    };
    const apiResponse = err.response;
    return {
      success: false as const,
      error: {
        message: err.message || "Failed to save section",
        statusCode: err.statusCode,
        validationErrors:
          apiResponse?.error?.validationErrors ||
          apiResponse?.validationErrors ||
          err.validationErrors,
      },
    };
  }
}, "save-plant-section-action");

export function invalidateAfterSectionSave(plantId: string, sectionId: PlantSectionId) {
  invalidateAllPlantCaches(plantId);
  if (sectionTouchesVariants(sectionId)) {
    invalidateInventory(plantId);
  }
}
