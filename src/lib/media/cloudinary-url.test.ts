import { describe, expect, it } from "vitest";
import {
  cloudinaryBlurPlaceholder,
  cloudinarySrcSet,
  cloudinaryUrl,
} from "./cloudinary-url";

const SAMPLE_URL =
  "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg";

describe("cloudinaryUrl", () => {
  it("injects preset transforms after /upload/", () => {
    expect(cloudinaryUrl(SAMPLE_URL, "card")).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_fill,f_auto,q_auto/v1234567890/sample.jpg",
    );
  });

  it("returns empty string for nullish urls", () => {
    expect(cloudinaryUrl(null, "card")).toBe("");
    expect(cloudinaryUrl(undefined, "card")).toBe("");
  });

  it("passes through non-Cloudinary urls", () => {
    const external = "https://images.unsplash.com/photo-123?w=400";
    expect(cloudinaryUrl(external, "card")).toBe(external);
  });
});

describe("cloudinaryBlurPlaceholder", () => {
  it("builds a tiny blurred transform", () => {
    expect(cloudinaryBlurPlaceholder(SAMPLE_URL)).toBe(
      "https://res.cloudinary.com/demo/image/upload/e_blur:1000,q_1,w_50/v1234567890/sample.jpg",
    );
  });
});

describe("cloudinarySrcSet", () => {
  it("builds width-descriptor srcset for Cloudinary urls", () => {
    const srcset = cloudinarySrcSet(SAMPLE_URL, "thumb");
    expect(srcset).toContain("120w");
    expect(srcset).toContain("240w");
  });

  it("returns undefined for non-Cloudinary urls", () => {
    expect(
      cloudinarySrcSet("https://images.unsplash.com/photo-123", "thumb"),
    ).toBeUndefined();
  });
});
