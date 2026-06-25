import { buildSitemapXml } from "~/lib/seo/sitemap";

export async function GET() {
  const xml = await buildSitemapXml();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
