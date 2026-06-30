import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import { ApiError } from "../../types";
import type {
  CreateCampaignPayload,
  SellerCampaignDetail,
  SellerCampaignListResponse,
  UpdateCampaignPayload,
} from "../../types/seller/campaigns.types";

const BASE_PATH = "/api/v1/user/seller/campaigns";

type SuccessEnvelope<T> = { success: boolean; message: string; data: T };

export const getSellerCampaigns = query(
  async (params?: { page?: number; limit?: number }) => {
    "use server";
    return fetcher<SellerCampaignListResponse>(BASE_PATH, {
      params: params as Record<string, number | undefined>,
      unwrapData: false,
    });
  },
  "seller-campaigns",
);

export const getSellerCampaign = query(
  async (id: string) => {
    "use server";
    try {
      return await fetcher<SuccessEnvelope<SellerCampaignDetail>>(`${BASE_PATH}/${id}`, {
        unwrapData: false,
      });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) return null;
      throw error;
    }
  },
  "seller-campaign-detail",
);

export async function createSellerCampaign(payload: CreateCampaignPayload) {
  const response = await fetcher<SuccessEnvelope<SellerCampaignDetail>>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
    unwrapData: false,
  });
  invalidateSellerCampaigns();
  return response.data;
}

export async function updateSellerCampaign(id: string, payload: UpdateCampaignPayload) {
  const response = await fetcher<SuccessEnvelope<SellerCampaignDetail>>(`${BASE_PATH}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    unwrapData: false,
  });
  invalidateSellerCampaign(id);
  return response.data;
}

export async function submitSellerCampaign(id: string) {
  const response = await fetcher<SuccessEnvelope<SellerCampaignDetail>>(`${BASE_PATH}/${id}/submit`, {
    method: "POST",
    unwrapData: false,
  });
  invalidateSellerCampaign(id);
  return response.data;
}

export async function archiveSellerCampaign(id: string) {
  const response = await fetcher<SuccessEnvelope<SellerCampaignDetail>>(`${BASE_PATH}/${id}/archive`, {
    method: "POST",
    unwrapData: false,
  });
  invalidateSellerCampaign(id);
  return response.data;
}

export async function deleteSellerCampaign(id: string) {
  await fetcher<SuccessEnvelope<{ deleted: boolean }>>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
    unwrapData: false,
  });
  invalidateSellerCampaigns();
}

export const invalidateSellerCampaigns = () => revalidate(getSellerCampaigns.keyFor());

export const invalidateSellerCampaign = (id: string) => {
  revalidate(getSellerCampaigns.keyFor());
  revalidate(getSellerCampaign.keyFor(id));
};
