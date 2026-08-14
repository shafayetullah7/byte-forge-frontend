import { describe, expect, it, vi } from "vitest";
import {
  prepareImageForUpload,
  shouldCompressImage,
} from "./prepare-image-for-upload";

vi.mock("browser-image-compression", () => ({
  default: vi.fn(async (file: File) => file),
}));

describe("shouldCompressImage", () => {
  it("compresses raster photos", () => {
    expect(shouldCompressImage("image/jpeg")).toBe(true);
    expect(shouldCompressImage("image/png")).toBe(true);
    expect(shouldCompressImage("image/webp")).toBe(true);
  });

  it("skips gif and svg", () => {
    expect(shouldCompressImage("image/gif")).toBe(false);
    expect(shouldCompressImage("image/svg+xml")).toBe(false);
  });

  it("skips non-images", () => {
    expect(shouldCompressImage("application/pdf")).toBe(false);
  });
});

describe("prepareImageForUpload", () => {
  it("returns the original file when compression is disabled", async () => {
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    await expect(
      prepareImageForUpload(file, { enabled: false }),
    ).resolves.toBe(file);
  });

  it("returns the original file for gif uploads", async () => {
    const file = new File(["x"], "anim.gif", { type: "image/gif" });
    await expect(prepareImageForUpload(file)).resolves.toBe(file);
  });
});
