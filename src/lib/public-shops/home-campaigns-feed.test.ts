import { describe, expect, it } from "vitest";
import { mapFeedItemToHomeCampaign } from "./home-campaigns";
import {
  PUBLIC_CAMPAIGN_STATUS,
  PUBLIC_CAMPAIGN_TYPE,
} from "~/lib/types/public/shops.types";

describe("mapFeedItemToHomeCampaign", () => {
  it("maps API feed item to HomeCampaignItem with campaign slug", () => {
    const item = mapFeedItemToHomeCampaign({
      shopSlug: "green-nursery",
      shopName: "Green Nursery",
      campaign: {
        id: "camp-1",
        slug: "monsoon-sale",
        title: "Monsoon sale",
        type: PUBLIC_CAMPAIGN_TYPE.DISCOUNT,
        bannerUrl: "https://res.cloudinary.com/demo/banner.jpg",
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.999Z",
        discountPercent: 15,
        description: "Save on monsoon picks",
        status: PUBLIC_CAMPAIGN_STATUS.ACTIVE,
        participants: 2,
        views: 10,
        productsIncluded: 3,
        ordersGenerated: 1,
        savingsProvided: 500,
        likes: 0,
        bookmarks: 0,
      },
    });

    expect(item.shopSlug).toBe("green-nursery");
    expect(item.shopName).toBe("Green Nursery");
    expect(item.campaign.slug).toBe("monsoon-sale");
    expect(item.campaign.title).toBe("Monsoon sale");
    expect(item.campaign.discountPercent).toBe(15);
  });

  it("falls back campaign slug to id when slug omitted", () => {
    const item = mapFeedItemToHomeCampaign({
      shopSlug: "shop-a",
      shopName: "Shop A",
      campaign: {
        id: "camp-uuid",
        title: "Flash",
        type: PUBLIC_CAMPAIGN_TYPE.DISCOUNT,
        bannerUrl: "https://res.cloudinary.com/demo/b.jpg",
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-06-01T00:00:00.000Z",
        discountPercent: null,
        description: "",
        status: PUBLIC_CAMPAIGN_STATUS.ACTIVE,
        participants: 0,
        views: 0,
        productsIncluded: 0,
        ordersGenerated: 0,
        savingsProvided: 0,
        likes: 0,
        bookmarks: 0,
      },
    });

    expect(item.campaign.slug).toBe("camp-uuid");
  });
});
