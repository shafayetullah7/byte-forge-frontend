import { absoluteUrl } from "~/lib/seo/meta";

export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /app/
Disallow: /api/

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
