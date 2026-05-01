import { query } from "@solidjs/router";
import { fetcher } from "../../api-client";

export interface TagGroup {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tags: Tag[];
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  usageCount: number;
}

/**
 * Get all active tags grouped by group (public endpoint, localized)
 */
export const getTags = query(
  async () => {
    return fetcher<TagGroup[]>("/api/v1/tags");
  },
  "public-tags"
);
