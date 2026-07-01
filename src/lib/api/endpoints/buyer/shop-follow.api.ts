import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import { getPublicShopBySlug } from "../public/shops.api";
import { invalidatePublicShopProfile } from "~/lib/public-shops/public-shop.service";
import type { ApiSuccessEnvelope } from "../../types/public/shops.api.types";

export interface FollowedShopItem {
  followedAt: string;
  shop: {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    isVerified: boolean;
    logo: { id: string; url: string } | null;
    banner: { id: string; url: string } | null;
  };
}

export interface FollowShopResult {
  shopId: string;
  slug: string;
  followedAt: string | null;
}

export interface UnfollowShopResult {
  shopId: string;
  slug: string;
}

export const listFollowingShops = query(
  async () => {
    "use server";
    return fetcher<ApiSuccessEnvelope<FollowedShopItem[]>>(
      "/api/v1/user/buyer/shops/following",
      { unwrapData: false },
    );
  },
  "buyer-following-shops",
);

export async function followShop(slug: string): Promise<FollowShopResult> {
  const response = await fetcher<ApiSuccessEnvelope<FollowShopResult>>(
    `/api/v1/user/buyer/shops/${slug}/follow`,
    { method: "POST", unwrapData: false },
  );
  invalidateShopFollow(slug);
  return response.data;
}

export async function unfollowShop(slug: string): Promise<UnfollowShopResult> {
  const response = await fetcher<ApiSuccessEnvelope<UnfollowShopResult>>(
    `/api/v1/user/buyer/shops/${slug}/follow`,
    { method: "DELETE", unwrapData: false },
  );
  invalidateShopFollow(slug);
  return response.data;
}

export const invalidateShopFollow = (slug: string) => {
  revalidate(listFollowingShops.keyFor());
  revalidate(getPublicShopBySlug.keyFor(slug));
  invalidatePublicShopProfile(slug);
};
