import { describe, expect, it } from "vitest";
import type { PlantAiDraftResponse } from "~/lib/api/types/plant-ai.types";
import {
  createEmptyForm,
  createEmptyVariant,
  type PlantFormState,
} from "~/lib/types/plant-form";
import {
  hasPlantAiDraftSignals,
  isPhotoOnlyPlantAiRequest,
  mergePlantAiDraftIntoForm,
  toPlantAiDraftRequest,
} from "./merge-plant-ai-draft";

const monsteraDraft: PlantAiDraftResponse = {
  translations: {
    en: {
      name: "Monstera",
      shortDescription: "Popular tropical foliage plant with split leaves.",
      description:
        "Monstera deliciosa is a hardy indoor plant suited to bright indirect light in Bangladesh homes.",
    },
    bn: {
      name: "মনস্টেরা",
      shortDescription: "বিভক্ত পাতা বিশিষ্ট জনপ্রিয় কৃষ্ণমূলীয় গাছ।",
      description:
        "মনস্টেরা ডেলিসিওসা বাংলাদেশের ঘরের উজ্জ্বল পরোক্ষ আলোতে ভালো জন্মায়।",
    },
  },
  plantDetails: {
    scientificName: "Monstera deliciosa",
    categoryId: "11111111-1111-4111-8111-111111111111",
    tagIds: ["22222222-2222-4222-8222-222222222222"],
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    careDifficulty: "BEGINNER",
    growthRate: "MODERATE",
    temperatureRange: "18-30°C",
    matureHeight: "Up to 3m",
    matureSpread: "Up to 1.5m",
    translations: {
      en: {
        commonNames: "Swiss cheese plant",
        origin: "Central America",
        soilType: "Well-draining potting mix",
        toxicityInfo: "Toxic to pets if ingested",
      },
      bn: {
        commonNames: "সুইস চিজ প্ল্যান্ট",
        origin: "মধ্য আমেরিকা",
        soilType: "ভালো নিষ্কাশনযুক্ত পটিং মিশ্রণ",
        toxicityInfo: "খেলে পোষা প্রাণীর জন্য বিষাক্ত হতে পারে",
      },
    },
  },
  careGuide: {
    en: {
      lightInstructions: "Bright indirect light; avoid harsh midday sun.",
      wateringInstructions: "Water when top 2-3 cm of soil is dry.",
    },
    bn: {
      lightInstructions: "উজ্জ্বল পরোক্ষ আলো; তীব্র মধ্যাহ্নের রোদ এড়িয়ে চলুন।",
      wateringInstructions: "মাটির উপরের ২-৩ সেমি শুকিয়ে গেলে পানি দিন।",
    },
  },
  defaultVariant: {
    growthStage: "JUVENILE",
    plantForm: "CLIMBING",
    propagationType: "CUTTING",
    containerType: "NURSERY_POT",
    translations: {
      en: { title: "Juvenile climbing plant in nursery pot" },
      bn: { title: "নার্সারি পটে কিশোর আরোহী গাছ" },
    },
  },
};

function formWithCommerceFields(): PlantFormState {
  const form = createEmptyForm();
  form.thumbnail = {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    url: "https://cdn.example/thumb.jpg",
  };
  form.slug = "my-custom-slug";
  form.variants = [
    {
      ...createEmptyVariant(),
      price: 450,
      inventoryCount: 12,
      sku: "MON-001",
      trackInventory: true,
      lowStockThreshold: 3,
    },
  ];
  return form;
}

describe("mergePlantAiDraftIntoForm", () => {
  it("fills catalog fields from draft while preserving thumbnail and variants", () => {
    const base = formWithCommerceFields();
    const merged = mergePlantAiDraftIntoForm(base, monsteraDraft);

    expect(merged.translations.en.name).toBe("Monstera");
    expect(merged.translations.bn.name).toBe("মনস্টেরা");
    expect(merged.plantDetails.categoryId).toBe(
      "11111111-1111-4111-8111-111111111111",
    );
    expect(merged.careGuide.en.lightInstructions).toContain("Bright indirect");

    expect(merged.thumbnail).toEqual(base.thumbnail);
    expect(merged.variants[0].price).toBe(450);
    expect(merged.variants[0].inventoryCount).toBe(12);
    expect(merged.variants[0].sku).toBe("MON-001");
    expect(merged.variants[0].trackInventory).toBe(true);
    expect(merged.variants[0].lowStockThreshold).toBe(3);
    expect(merged.variants[0].growthStage).toBe("JUVENILE");
    expect(merged.variants[0].plantForm).toBe("CLIMBING");
    expect(merged.variants[0].propagationType).toBe("CUTTING");
    expect(merged.variants[0].containerType).toBe("NURSERY_POT");
    expect(merged.variants[0].translations.en.title).toContain("nursery pot");
    expect(merged.variants[0].translations.bn.title).toContain("নার্সারি");
  });

  it("leaves variant commerce fields unchanged when draft has no defaultVariant", () => {
    const base = formWithCommerceFields();
    const { defaultVariant: _removed, ...draftWithoutVariant } = monsteraDraft;
    const merged = mergePlantAiDraftIntoForm(base, draftWithoutVariant);

    expect(merged.variants[0].price).toBe(450);
    expect(merged.variants[0].growthStage).toBe("JUVENILE");
    expect(merged.variants[0].translations.en.title).toBe("");
  });

  it("keeps existing slug when already set", () => {
    const base = formWithCommerceFields();
    const merged = mergePlantAiDraftIntoForm(base, monsteraDraft);
    expect(merged.slug).toBe("my-custom-slug");
  });

  it("derives slug from EN name when slug is empty", () => {
    const base = createEmptyForm();
    const merged = mergePlantAiDraftIntoForm(base, monsteraDraft);
    expect(merged.slug).toBe("monstera");
  });
});

describe("toPlantAiDraftRequest", () => {
  it("maps wizard fields to API request", () => {
    const form = createEmptyForm();
    form.translations.en.name = "Monstera";
    form.plantDetails.scientificName = "Monstera deliciosa";
    form.thumbnail.id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

    expect(toPlantAiDraftRequest(form, { localeHint: "en" })).toEqual({
      plantName: "Monstera",
      scientificName: "Monstera deliciosa",
      thumbnailMediaId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      localeHint: "en",
    });
  });

  it("reports whether request has at least one signal", () => {
    expect(hasPlantAiDraftSignals({})).toBe(false);
    expect(hasPlantAiDraftSignals({ plantName: "Monstera" })).toBe(true);
  });

  it("detects photo-only requests", () => {
    expect(
      isPhotoOnlyPlantAiRequest({
        thumbnailMediaId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      }),
    ).toBe(true);
    expect(
      isPhotoOnlyPlantAiRequest({
        thumbnailMediaId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        plantName: "Monstera",
      }),
    ).toBe(false);
  });
});
