import { getPublicPlants } from "~/lib/api/endpoints/public/plants.api";
import { getPublicShops } from "~/lib/api/endpoints/public/shops.api";
import { absoluteUrl } from "./meta";

const STATIC_PATHS = [
  "/",
  "/plants",
  "/shops",
  "/help",
  "/help/shipping-and-returns",
  "/help/cod",
  "/legal/privacy",
  "/legal/terms",
];

async function fetchAllPlantSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let pages = 1;

  while (page <= pages) {
    const response = await getPublicPlants({ page, limit: 100, sortBy: "createdAt", sortOrder: "desc" });
    slugs.push(...response.data.map((plant) => plant.slug));
    pages = response.meta.pages;
    page += 1;
  }

  return slugs;
}

async function fetchAllShopSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let pages = 1;

  while (page <= pages) {
    const response = await getPublicShops({ page, limit: 100, sort: "newest" });
    slugs.push(...response.data.map((shop) => shop.slug));
    pages = response.meta.pages;
    page += 1;
  }

  return slugs;
}

function urlEntry(loc: string, changefreq = "weekly", priority = "0.7"): string {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function buildSitemapXml(): Promise<string> {
  const urls: string[] = [];

  for (const path of STATIC_PATHS) {
    const priority = path === "/" ? "1.0" : "0.8";
    const changefreq = path === "/" ? "daily" : "weekly";
    urls.push(urlEntry(absoluteUrl(path), changefreq, priority));
  }

  try {
    const [plantSlugs, shopSlugs] = await Promise.all([
      fetchAllPlantSlugs(),
      fetchAllShopSlugs(),
    ]);

    for (const slug of plantSlugs) {
      urls.push(urlEntry(absoluteUrl(`/plants/${slug}`), "weekly", "0.7"));
    }
    for (const slug of shopSlugs) {
      urls.push(urlEntry(absoluteUrl(`/shops/${slug}`), "weekly", "0.6"));
    }
  } catch (error) {
    console.error("[sitemap] Failed to fetch dynamic URLs, using static pages only:", error);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}
