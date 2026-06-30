import { action } from "@solidjs/router";
import {
  archiveSellerCampaign,
  createSellerCampaign,
  deleteSellerCampaign,
  submitSellerCampaign,
  updateSellerCampaign,
} from "./campaigns.api";
import type { CreateCampaignPayload, UpdateCampaignPayload } from "../../types/seller/campaigns.types";
import { ApiError } from "~/lib/api/types";

export type CampaignMutationResult =
  | { success: true; id?: string }
  | { success: false; error: { message: string; statusCode?: number } };

function mutationError(error: unknown): CampaignMutationResult {
  const apiError = error as ApiError;
  return {
    success: false,
    error: {
      statusCode: apiError.statusCode,
      message: apiError.response?.message ?? apiError.message,
    },
  };
}

export const createCampaignAction = action(
  async (payload: CreateCampaignPayload): Promise<CampaignMutationResult> => {
    "use server";
    try {
      const data = await createSellerCampaign(payload);
      return { success: true, id: data.id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "create-campaign",
);

export const updateCampaignAction = action(
  async (input: { id: string; payload: UpdateCampaignPayload }): Promise<CampaignMutationResult> => {
    "use server";
    try {
      await updateSellerCampaign(input.id, input.payload);
      return { success: true, id: input.id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "update-campaign",
);

export const submitCampaignAction = action(
  async (id: string): Promise<CampaignMutationResult> => {
    "use server";
    try {
      await submitSellerCampaign(id);
      return { success: true, id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "submit-campaign",
);

export const archiveCampaignAction = action(
  async (id: string): Promise<CampaignMutationResult> => {
    "use server";
    try {
      await archiveSellerCampaign(id);
      return { success: true, id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "archive-campaign",
);

export const deleteCampaignAction = action(
  async (id: string): Promise<CampaignMutationResult> => {
    "use server";
    try {
      await deleteSellerCampaign(id);
      return { success: true };
    } catch (error) {
      return mutationError(error);
    }
  },
  "delete-campaign",
);
