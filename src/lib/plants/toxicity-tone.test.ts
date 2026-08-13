import { describe, expect, it } from "vitest";
import { getToxicityTone } from "./toxicity-tone";

describe("getToxicityTone", () => {
  it("treats non-toxic copy as safe", () => {
    expect(getToxicityTone("Non-toxic")).toBe("safe");
    expect(getToxicityTone("Pet-safe and child-friendly")).toBe("safe");
    expect(getToxicityTone("অবিষাক্ত")).toBe("safe");
  });

  it("treats toxic copy as warning", () => {
    expect(getToxicityTone("Toxic to cats and dogs if ingested")).toBe("warning");
    expect(getToxicityTone("খেলে বিড়াল ও কুকুরের জন্য বিষাক্ত")).toBe("warning");
  });

  it("prefers warning when both safe and toxic phrases appear", () => {
    expect(getToxicityTone("Non-toxic to humans but toxic to pets")).toBe("warning");
  });

  it("uses neutral info styling for ambiguous notes", () => {
    expect(getToxicityTone("Keep away from curious toddlers")).toBe("info");
  });
});
