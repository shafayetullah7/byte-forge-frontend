import { getPublicPlantBySlug } from "~/lib/api/endpoints/public/plants.api";
import { ApiError } from "~/lib/api/types";
import type { PublicPlantDetail } from "~/lib/api/types/public/plants.types";

export async function getPlantBySlug(slug: string): Promise<PublicPlantDetail | null> {
  try {
    return await getPublicPlantBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
