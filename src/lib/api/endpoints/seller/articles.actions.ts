import { action } from "@solidjs/router";
import {
  archiveSellerArticle,
  createSellerArticle,
  deleteSellerArticle,
  submitSellerArticle,
  updateSellerArticle,
} from "./articles.api";
import type { CreateArticlePayload, UpdateArticlePayload } from "../../types/seller/articles.types";
import { ApiError } from "~/lib/api/types";

export type ArticleMutationResult =
  | { success: true; id?: string }
  | { success: false; error: { message: string; statusCode?: number } };

function mutationError(error: unknown): ArticleMutationResult {
  const apiError = error as ApiError;
  return {
    success: false,
    error: {
      statusCode: apiError.statusCode,
      message: apiError.response?.message ?? apiError.message,
    },
  };
}

export const createArticleAction = action(
  async (payload: CreateArticlePayload): Promise<ArticleMutationResult> => {
    "use server";
    try {
      const data = await createSellerArticle(payload);
      return { success: true, id: data.id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "create-article",
);

export const updateArticleAction = action(
  async (input: { id: string; payload: UpdateArticlePayload }): Promise<ArticleMutationResult> => {
    "use server";
    try {
      await updateSellerArticle(input.id, input.payload);
      return { success: true, id: input.id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "update-article",
);

export const submitArticleAction = action(
  async (id: string): Promise<ArticleMutationResult> => {
    "use server";
    try {
      await submitSellerArticle(id);
      return { success: true, id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "submit-article",
);

export const archiveArticleAction = action(
  async (id: string): Promise<ArticleMutationResult> => {
    "use server";
    try {
      await archiveSellerArticle(id);
      return { success: true, id };
    } catch (error) {
      return mutationError(error);
    }
  },
  "archive-article",
);

export const deleteArticleAction = action(
  async (id: string): Promise<ArticleMutationResult> => {
    "use server";
    try {
      await deleteSellerArticle(id);
      return { success: true };
    } catch (error) {
      return mutationError(error);
    }
  },
  "delete-article",
);
