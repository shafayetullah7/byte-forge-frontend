import type { PublicPlantFilter } from "~/lib/api/types/public/plants.types";
import {
  PUBLIC_CARE_DIFFICULTY,
  PUBLIC_LIGHT_REQUIREMENT,
} from "~/lib/api/types/public/plants.types";

export type PlantFinderPlacement = "indoor" | "balcony" | "rooftop" | "outdoor";
export type PlantFinderLight = "low" | "indirect" | "bright" | "direct";
export type PlantFinderCare = "easy" | "moderate" | "demanding";

export type PlantFinderAnswers = {
  placement?: PlantFinderPlacement;
  light?: PlantFinderLight;
  care?: PlantFinderCare;
};

export const PLANT_FINDER_STEP_COUNT = 3;

const LIGHT_TO_API: Record<PlantFinderLight, PublicPlantFilter["lightRequirement"]> = {
  low: PUBLIC_LIGHT_REQUIREMENT.LOW,
  indirect: PUBLIC_LIGHT_REQUIREMENT.MEDIUM,
  bright: PUBLIC_LIGHT_REQUIREMENT.BRIGHT_INDIRECT,
  direct: PUBLIC_LIGHT_REQUIREMENT.DIRECT,
};

const CARE_TO_API: Record<PlantFinderCare, PublicPlantFilter["careDifficulty"]> = {
  easy: PUBLIC_CARE_DIFFICULTY.BEGINNER,
  moderate: PUBLIC_CARE_DIFFICULTY.INTERMEDIATE,
  demanding: PUBLIC_CARE_DIFFICULTY.EXPERT,
};

/** Suggested step-2 light when entering from placement (user may change). */
export function getDefaultLightForPlacement(
  placement: PlantFinderPlacement,
): PlantFinderLight {
  switch (placement) {
    case "outdoor":
    case "rooftop":
      return "direct";
    case "balcony":
      return "bright";
    case "indoor":
    default:
      return "indirect";
  }
}

export function answersToPlantFilter(answers: PlantFinderAnswers): Partial<PublicPlantFilter> {
  const filter: Partial<PublicPlantFilter> = {
    inStockOnly: true,
  };

  if (answers.light) {
    filter.lightRequirement = LIGHT_TO_API[answers.light];
  }
  if (answers.care) {
    filter.careDifficulty = CARE_TO_API[answers.care];
  }

  return filter;
}

export function isPlantFinderComplete(answers: PlantFinderAnswers): boolean {
  return Boolean(answers.placement && answers.light && answers.care);
}
