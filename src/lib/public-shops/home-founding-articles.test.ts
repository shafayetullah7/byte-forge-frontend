import { describe, expect, it } from "vitest";
import type { PublicShopArticle } from "~/lib/types/public/shops.types";
import { pickLatestArticle } from "./home-founding-articles";

function article(partial: Partial<PublicShopArticle> & { id: string }): PublicShopArticle {
  return {
    id: partial.id,
    slug: partial.slug ?? partial.id,
    title: partial.title ?? "Title",
    excerpt: partial.excerpt ?? "",
    coverUrl: partial.coverUrl ?? "",
    publishedAt: partial.publishedAt ?? "2024-01-01",
    readMinutes: partial.readMinutes ?? 5,
    category: partial.category ?? "Care",
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
  };
}

describe("pickLatestArticle", () => {
  it("returns undefined for empty list", () => {
    expect(pickLatestArticle([])).toBeUndefined();
  });

  it("returns article with latest publishedAt", () => {
    const older = article({ id: "a", publishedAt: "2024-01-01" });
    const newer = article({ id: "b", publishedAt: "2025-06-01" });
    expect(pickLatestArticle([older, newer])?.id).toBe("b");
    expect(pickLatestArticle([newer, older])?.id).toBe("b");
  });
});
