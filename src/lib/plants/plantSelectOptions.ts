import { createMemo } from "solid-js";
import type { SelectOption } from "~/components/ui/Select";

export function usePlantSelectOptions(t: (key: string) => string) {
  const lightOptions = createMemo<SelectOption[]>(() => [
    { value: "LOW", label: t("seller.products.newPlant.lightLow") },
    { value: "MEDIUM", label: t("seller.products.newPlant.lightMedium") },
    { value: "BRIGHT_INDIRECT", label: t("seller.products.newPlant.lightBrightIndirect") },
    { value: "DIRECT", label: t("seller.products.newPlant.lightDirect") },
  ]);

  const wateringOptions = createMemo<SelectOption[]>(() => [
    { value: "DAILY", label: t("seller.products.newPlant.wateringDaily") },
    { value: "WEEKLY", label: t("seller.products.newPlant.wateringWeekly") },
    { value: "BI_WEEKLY", label: t("seller.products.newPlant.wateringBiWeekly") },
    { value: "MONTHLY", label: t("seller.products.newPlant.wateringMonthly") },
  ]);

  const humidityOptions = createMemo<SelectOption[]>(() => [
    { value: "LOW", label: t("seller.products.newPlant.humidityLow") },
    { value: "MEDIUM", label: t("seller.products.newPlant.humidityMedium") },
    { value: "HIGH", label: t("seller.products.newPlant.humidityHigh") },
  ]);

  const careDifficultyOptions = createMemo<SelectOption[]>(() => [
    { value: "BEGINNER", label: t("seller.products.newPlant.careBeginner") },
    { value: "INTERMEDIATE", label: t("seller.products.newPlant.careIntermediate") },
    { value: "EXPERT", label: t("seller.products.newPlant.careExpert") },
  ]);

  const growthRateOptions = createMemo<SelectOption[]>(() => [
    { value: "SLOW", label: t("seller.products.newPlant.growthSlow") },
    { value: "MODERATE", label: t("seller.products.newPlant.growthModerate") },
    { value: "FAST", label: t("seller.products.newPlant.growthFast") },
  ]);

  const growthStageOptions = createMemo<SelectOption[]>(() => [
    { value: "SEEDLING", label: t("seller.products.newPlant.stageSeedling") },
    { value: "JUVENILE", label: t("seller.products.newPlant.stageJuvenile") },
    { value: "MATURE", label: t("seller.products.newPlant.stageMature") },
    { value: "CUTTING", label: t("seller.products.newPlant.stageCutting") },
  ]);

  const plantFormOptions = createMemo<SelectOption[]>(() => [
    { value: "UPRIGHT", label: t("seller.products.newPlant.formUpright") },
    { value: "TRAILING", label: t("seller.products.newPlant.formTrailing") },
    { value: "BUSHY", label: t("seller.products.newPlant.formBushy") },
    { value: "CLIMBING", label: t("seller.products.newPlant.formClimbing") },
    { value: "ROSETTE", label: t("seller.products.newPlant.formRosette") },
  ]);

  const variegationOptions = createMemo<SelectOption[]>(() => [
    { value: "NONE", label: t("seller.products.newPlant.varNone") },
    { value: "VARIEGATED", label: t("seller.products.newPlant.varVariegated") },
    { value: "SEMI_VARIEGATED", label: t("seller.products.newPlant.varSemiVariegated") },
    { value: "ALBO", label: t("seller.products.newPlant.varAlbo") },
    { value: "AUREO", label: t("seller.products.newPlant.varAureo") },
  ]);

  const leafDensityOptions = createMemo<SelectOption[]>(() => [
    { value: "SPARSE", label: t("seller.products.newPlant.densitySparse") },
    { value: "MODERATE", label: t("seller.products.newPlant.densityModerate") },
    { value: "DENSE", label: t("seller.products.newPlant.densityDense") },
  ]);

  const propagationTypeOptions = createMemo<SelectOption[]>(() => [
    { value: "CUTTING", label: t("seller.products.newPlant.propCutting") },
    { value: "SEED", label: t("seller.products.newPlant.propSeed") },
    { value: "TISSUE_CULTURE", label: t("seller.products.newPlant.propTissueCulture") },
    { value: "AIR_LAYER", label: t("seller.products.newPlant.propAirLayer") },
    { value: "DIVISION", label: t("seller.products.newPlant.propDivision") },
  ]);

  const containerTypeOptions = createMemo<SelectOption[]>(() => [
    { value: "NURSERY_POT", label: t("seller.products.newPlant.contNurseryPot") },
    { value: "DECORATIVE_POT", label: t("seller.products.newPlant.contDecorativePot") },
    { value: "HANGING_BASKET", label: t("seller.products.newPlant.contHangingBasket") },
    { value: "TERRARIUM", label: t("seller.products.newPlant.contTerrarium") },
    { value: "GROW_BAG", label: t("seller.products.newPlant.contGrowBag") },
  ]);

  return {
    lightOptions,
    wateringOptions,
    humidityOptions,
    careDifficultyOptions,
    growthRateOptions,
    growthStageOptions,
    plantFormOptions,
    variegationOptions,
    leafDensityOptions,
    propagationTypeOptions,
    containerTypeOptions,
  };
}
