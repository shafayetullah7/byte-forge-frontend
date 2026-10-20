import { query } from "@solidjs/router";
import {
  FEATURED_SHOPS_DISPLAY_LIMIT,
  FEATURED_SHOPS_POOL_LIMIT,
  getUtcDayIndex,
  selectFeaturedShopWindow,
} from "~/lib/home/featured-shops-rotation";
import { listShops } from "~/lib/public-shops/public-shop.service";

export const listFeaturedShopsForHome = query(async () => {
  "use server";
  const result = await listShops({
    sort: "popular",
    page: 1,
    limit: FEATURED_SHOPS_POOL_LIMIT,
  });
  const data = selectFeaturedShopWindow(
    result.data,
    FEATURED_SHOPS_DISPLAY_LIMIT,
    getUtcDayIndex(),
  );
  return { ...result, data };
}, "public-featured-shops-home");
