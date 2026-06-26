import { query } from "@solidjs/router";
import { getPublicPlantBySlug } from "~/lib/api/endpoints/public/plants.api";
import { ApiError } from "~/lib/api/types";
import type { PublicPlantDetail } from "~/lib/api/types/public/plants.types";

export const getPlantBySlug = query(
  async (slug: string): Promise<PublicPlantDetail | null> => {
    "use server";
    try {
      return await getPublicPlantBySlug(slug);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
  "public-plant-profile",
);
