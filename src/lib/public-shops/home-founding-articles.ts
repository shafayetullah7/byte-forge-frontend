import { query } from "@solidjs/router";
import { config } from "~/lib/config";
import {
  getShopArticles,
  getShopBySlug,
} from "~/lib/public-shops/public-shop.service";
import type { PublicShopArticle } from "~/lib/types/public/shops.types";

export type HomeFoundingArticleItem = {
  shopSlug: string;
  shopName: string;
  article: PublicShopArticle;
};

export function pickLatestArticle(
  articles: PublicShopArticle[],
): PublicShopArticle | undefined {
  if (articles.length === 0) return undefined;

  let latest = articles[0];
  let latestTime = new Date(latest.publishedAt).getTime();

  for (let i = 1; i < articles.length; i++) {
    const candidate = articles[i];
    const time = new Date(candidate.publishedAt).getTime();
    if (Number.isNaN(time)) continue;
    if (Number.isNaN(latestTime) || time > latestTime) {
      latest = candidate;
      latestTime = time;
    }
  }

  return latest;
}

export async function collectHomeFoundingArticles(
  slugs: string[],
): Promise<HomeFoundingArticleItem[]> {
  if (slugs.length === 0) return [];

  const settled = await Promise.allSettled(
    slugs.map(async (shopSlug) => {
      const shop = await getShopBySlug(shopSlug);
      if (!shop) return null;

      const articles = await getShopArticles(shopSlug);
      const article = pickLatestArticle(articles);
      if (!article) return null;

      return {
        shopSlug,
        shopName: shop.name,
        article,
      } satisfies HomeFoundingArticleItem;
    }),
  );

  const items: HomeFoundingArticleItem[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      items.push(result.value);
    } else if (result.status === "rejected" && config.isDev) {
      console.warn("[collectHomeFoundingArticles] shop fetch failed:", result.reason);
    }
  }

  return items;
}

export const listHomeFoundingArticles = query(async () => {
  "use server";
  if (!config.articlesEnabled) {
    return [];
  }
  return collectHomeFoundingArticles(config.foundingShopSlugs);
}, "public-home-founding-articles");
