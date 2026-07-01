import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import { ApiError } from "../../types";
import type {
  CreateArticlePayload,
  SellerArticleDetail,
  SellerArticleListResponse,
  UpdateArticlePayload,
} from "../../types/seller/articles.types";

const BASE_PATH = "/api/v1/user/seller/articles";

type SuccessEnvelope<T> = { success: boolean; message: string; data: T };

export const getSellerArticles = query(
  async (params?: { page?: number; limit?: number; moderationStatus?: string }) => {
    "use server";
    return fetcher<SellerArticleListResponse>(BASE_PATH, {
      params: params as Record<string, string | number | undefined>,
      unwrapData: false,
    });
  },
  "seller-articles",
);

export const getSellerArticle = query(
  async (id: string) => {
    "use server";
    try {
      return await fetcher<SuccessEnvelope<SellerArticleDetail>>(`${BASE_PATH}/${id}`, {
        unwrapData: false,
      });
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) return null;
      throw error;
    }
  },
  "seller-article-detail",
);

export async function createSellerArticle(payload: CreateArticlePayload) {
  const response = await fetcher<SuccessEnvelope<SellerArticleDetail>>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
    unwrapData: false,
  });
  invalidateSellerArticles();
  return response.data;
}

export async function updateSellerArticle(id: string, payload: UpdateArticlePayload) {
  const response = await fetcher<SuccessEnvelope<SellerArticleDetail>>(`${BASE_PATH}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    unwrapData: false,
  });
  invalidateSellerArticle(id);
  return response.data;
}

export async function submitSellerArticle(id: string) {
  const response = await fetcher<SuccessEnvelope<SellerArticleDetail>>(`${BASE_PATH}/${id}/submit`, {
    method: "POST",
    unwrapData: false,
  });
  invalidateSellerArticle(id);
  return response.data;
}

export async function archiveSellerArticle(id: string) {
  const response = await fetcher<SuccessEnvelope<SellerArticleDetail>>(`${BASE_PATH}/${id}/archive`, {
    method: "POST",
    unwrapData: false,
  });
  invalidateSellerArticle(id);
  return response.data;
}

export async function deleteSellerArticle(id: string) {
  await fetcher<SuccessEnvelope<{ deleted: boolean }>>(`${BASE_PATH}/${id}`, {
    method: "DELETE",
    unwrapData: false,
  });
  invalidateSellerArticles();
}

export const invalidateSellerArticles = () => revalidate(getSellerArticles.keyFor());

export const invalidateSellerArticle = (id: string) => {
  revalidate(getSellerArticles.keyFor());
  revalidate(getSellerArticle.keyFor(id));
};
