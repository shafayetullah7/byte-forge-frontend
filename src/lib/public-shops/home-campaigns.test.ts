import { describe, expect, it } from "vitest";
import { isDisplayableCampaign } from "./home-campaigns";
import {
  PUBLIC_CAMPAIGN_STATUS,
  PUBLIC_CAMPAIGN_TYPE,
  type PublicShopCampaign,
} from "~/lib/types/public/shops.types";

function baseCampaign(overrides: Partial<PublicShopCampaign> = {}): PublicShopCampaign {
  return {
    id: "camp-1",
    slug: "monsoon-sale",
    title: "Monsoon sale",
    type: PUBLIC_CAMPAIGN_TYPE.DISCOUNT,
    bannerUrl: "https://res.cloudinary.com/demo/image/upload/banner.jpg",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z",
    discountPercent: 20,
    description: "Test",
    status: PUBLIC_CAMPAIGN_STATUS.ACTIVE,
    participants: 0,
    views: 0,
    productsIncluded: 1,
    ordersGenerated: 0,
    savingsProvided: 0,
    likes: 0,
    bookmarks: 0,
    ...overrides,
  };
}

describe("isDisplayableCampaign", () => {
  it("returns true for ACTIVE campaign within date window", () => {
    const now = new Date("2026-06-15T12:00:00.000Z");
    expect(isDisplayableCampaign(baseCampaign(), now)).toBe(true);
  });

  it("excludes non-ACTIVE status", () => {
    const now = new Date("2026-06-15T12:00:00.000Z");
    expect(
      isDisplayableCampaign(
        baseCampaign({ status: PUBLIC_CAMPAIGN_STATUS.COMPLETED }),
        now,
      ),
    ).toBe(false);
  });

  it("excludes campaign after end date", () => {
    const now = new Date("2027-01-02T00:00:00.000Z");
    expect(isDisplayableCampaign(baseCampaign(), now)).toBe(false);
  });

  it("excludes campaign before start date", () => {
    const now = new Date("2025-12-31T12:00:00.000Z");
    expect(isDisplayableCampaign(baseCampaign(), now)).toBe(false);
  });
});
