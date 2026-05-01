import { createSignal, createMemo, Show, For, mergeProps } from "solid-js";
import { createStore } from "solid-js/store";
import { A, createAsync } from "@solidjs/router";
import { getCategoryTree, getTags } from "~/lib/api/endpoints/public";
import { useI18n } from "~/i18n";
import { slugify } from "~/lib/utils/slugify";
import Button from "~/components/ui/Button";
import { type SelectOption } from "~/components/ui/Select";
import { TagMultiSelect } from "~/components/ui/TagMultiSelect";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import { toaster } from "~/components/ui/Toast";
import { plantsApi } from "~/lib/api/endpoints/seller/plants.api";
import { SunIcon, ChevronLeftIcon } from "~/components/icons";
import { StepIndicator } from "./StepIndicator";
import { Step1Identity } from "./Step1Identity";
import { Step2CategoryTags } from "./Step2CategoryTags";
import { Step3Classification } from "./Step3Classification";
import { Step4Variants, type VariantStore } from "./Step4Variants";
import { Step5CareProfile } from "./Step5CareProfile";
import { Step6Care } from "./Step6Care";
import { Step7Preview } from "./Step7Preview";

// ========================
// Types
// ========================

type PlantStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

interface FormErrors {
  [key: string]: string;
}

// ========================
// Helper
// ========================

function createEmptyVariant(): VariantStore {
  return {
    sku: "",
    price: "",
    inventoryCount: "",
    trackInventory: true,
    lowStockThreshold: "",
    isBase: false,
    isActive: true,
    mediaIds: [],
    mediaUrls: [],
    growthStage: "",
    plantForm: "",
    variegation: "",
    propagationType: "",
    containerType: "",
    bundleType: "",
  };
}

// ========================
// Main Page
// ========================

export default function NewPlantPage() {
  const { t } = useI18n();

  // ---- Category Tree ----
  const categoryTree = createAsync(() => getCategoryTree());

  // ---- Tags ----
  const tags = createAsync(() => getTags());

  // ---- Translated Select Options ----
  const lightOptions = createMemo<SelectOption[]>(() => [
    { value: "low", label: t("seller.products.newPlant.lightLow") },
    { value: "medium", label: t("seller.products.newPlant.lightMedium") },
    { value: "bright_indirect", label: t("seller.products.newPlant.lightBrightIndirect") },
    { value: "direct", label: t("seller.products.newPlant.lightDirect") },
  ]);

  const wateringOptions = createMemo<SelectOption[]>(() => [
    { value: "daily", label: t("seller.products.newPlant.wateringDaily") },
    { value: "weekly", label: t("seller.products.newPlant.wateringWeekly") },
    { value: "bi_weekly", label: t("seller.products.newPlant.wateringBiWeekly") },
    { value: "monthly", label: t("seller.products.newPlant.wateringMonthly") },
  ]);

  const humidityOptions = createMemo<SelectOption[]>(() => [
    { value: "low", label: t("seller.products.newPlant.humidityLow") },
    { value: "medium", label: t("seller.products.newPlant.humidityMedium") },
    { value: "high", label: t("seller.products.newPlant.humidityHigh") },
  ]);

  const careDifficultyOptions = createMemo<SelectOption[]>(() => [
    { value: "beginner", label: t("seller.products.newPlant.careBeginner") },
    { value: "intermediate", label: t("seller.products.newPlant.careIntermediate") },
    { value: "expert", label: t("seller.products.newPlant.careExpert") },
  ]);

  const growthRateOptions = createMemo<SelectOption[]>(() => [
    { value: "slow", label: t("seller.products.newPlant.growthSlow") },
    { value: "moderate", label: t("seller.products.newPlant.growthModerate") },
    { value: "fast", label: t("seller.products.newPlant.growthFast") },
  ]);

  const growthStageOptions = createMemo<SelectOption[]>(() => [
    { value: "seedling", label: t("seller.products.newPlant.stageSeedling") },
    { value: "juvenile", label: t("seller.products.newPlant.stageJuvenile") },
    { value: "mature", label: t("seller.products.newPlant.stageMature") },
    { value: "cutting", label: t("seller.products.newPlant.stageCutting") },
  ]);

  const statusOptions = createMemo<SelectOption[]>(() => [
    { value: "DRAFT", label: t("seller.products.newPlant.statusDraft") },
    { value: "ACTIVE", label: t("seller.products.newPlant.statusActive") },
    { value: "ARCHIVED", label: t("seller.products.newPlant.statusArchived") },
  ]);

  // ---- Wizard State ----
  const [currentStep, setCurrentStep] = createSignal(1);
  const totalSteps = 7;

  // Step warnings: { step: { hasWarning: bool, missing: string[] } }
  const [stepWarnings, setStepWarnings] = createStore<Record<number, { hasWarning: boolean; missing: string[] }>>({
    1: { hasWarning: false, missing: [] },
    2: { hasWarning: false, missing: [] },
    3: { hasWarning: false, missing: [] },
    4: { hasWarning: false, missing: [] },
    5: { hasWarning: false, missing: [] },
    6: { hasWarning: false, missing: [] },
    7: { hasWarning: false, missing: [] },
  });

  // ---- Form State ----
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitStatus, setSubmitStatus] = createSignal<"success" | "error" | null>(null);

  // Thumbnail
  const thumbnailUpload = useImageUpload({ maxSizeMB: 5 });

  // Status
  const [status, setStatus] = createSignal<PlantStatus>("DRAFT");

  // Translations (EN + BN)
  const [translations, setTranslations] = createStore<{
    en: { name: string; shortDescription: string; description: string };
    bn: { name: string; shortDescription: string; description: string };
  }>({
    en: { name: "", shortDescription: "", description: "" },
    bn: { name: "", shortDescription: "", description: "" },
  });

  // Slug
  const [slug, setSlug] = createSignal("");
  const [isSlugManual, setIsSlugManual] = createSignal(false);

  // Auto-computed slug (pure, no side effects — safe for SSR hydration)
  const computedSlug = createMemo(() => {
    const englishName = translations.en.name;
    if (englishName) return slugify(englishName);
    return "";
  });

  const effectiveSlug = createMemo(() => isSlugManual() ? slug() : computedSlug());

  // Plant Details
  const [plantDetails, setPlantDetails] = createStore({
    categoryId: "",
    tagIds: [] as string[],
    scientificName: "",
    lightRequirement: "",
    wateringFrequency: "",
    humidityLevel: "",
    temperatureRange: "",
    careDifficulty: "",
    growthRate: "",
    matureHeight: "",
    matureSpread: "",
    translations: {
      en: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
      bn: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
    },
  });

  // Variants
  const [variants, setVariants] = createStore<VariantStore[]>([createEmptyVariant()]);

  function addVariant() {
    setVariants((v) => [...v, createEmptyVariant()]);
  }

  function removeVariant(index: number) {
    if (variants.length <= 1) return;
    setVariants((v) => v.filter((_, i) => i !== index));
  }

  // Tag toggle
  function toggleTag(tagId: string) {
    const current = [...plantDetails.tagIds];
    const idx = current.indexOf(tagId);
    if (idx >= 0) {
      setPlantDetails("tagIds", current.filter((id) => id !== tagId));
    } else if (current.length < 20) {
      setPlantDetails("tagIds", [...current, tagId]);
    }
  }

  // Care Guide (EN + BN)
  const [careGuide, setCareGuide] = createStore({
    en: {
      lightInstructions: "",
      wateringInstructions: "",
      humidityInstructions: "",
      fertilizerSchedule: "",
      repottingFrequency: "",
      pruningNotes: "",
      commonProblems: "",
      seasonalCare: "",
    },
    bn: {
      lightInstructions: "",
      wateringInstructions: "",
      humidityInstructions: "",
      fertilizerSchedule: "",
      repottingFrequency: "",
      pruningNotes: "",
      commonProblems: "",
      seasonalCare: "",
    },
  });

  // ---- Step Indicator Data ----
  const stepTitles = [
    t("seller.products.newPlant.step1Title"),
    t("seller.products.newPlant.step2Title"),
    t("seller.products.newPlant.step3Title"),
    t("seller.products.newPlant.step4Title"),
    t("seller.products.newPlant.step5Title"),
    t("seller.products.newPlant.step6Title"),
    t("seller.products.newPlant.step7Title"),
  ];

  const stepInfo = createMemo(() =>
    Array.from({ length: totalSteps }, (_, i) => {
      const stepNum = i + 1;
      const warning = stepWarnings[stepNum];
      const isCurrent = currentStep() === stepNum;
      const isPast = stepNum < currentStep();
      const isOptional = stepNum === 6;
      const isPreview = stepNum === 7;
      const hasNoWarnings = !warning.hasWarning;
      return {
        number: stepNum,
        title: stepTitles[i],
        isComplete: isPast && hasNoWarnings,
        hasWarning: !isPast && warning.hasWarning,
        warningCount: warning.missing.length,
        isCurrent,
        isOptional,
        isPreview,
      };
    })
  );

  // ---- Step Warning Callback ----
  const handleWarningChange = (step: number) => (hasWarning: boolean, missingFields: string[]) => {
    setStepWarnings(step, { hasWarning, missing: missingFields });
  };

  // ---- Navigation ----
  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    if (currentStep() < totalSteps) {
      goToStep(currentStep() + 1);
    }
  };

  const goBack = () => {
    if (currentStep() > 1) {
      goToStep(currentStep() - 1);
    }
  };

  // ---- Full Validation ----
  const validateAll = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Step 1: Identity, names, descriptions, scientific name
    if (!thumbnailUpload.mediaId()) {
      newErrors["thumbnail"] = t("seller.products.newPlant.thumbnailRequired");
    }
    if (!translations.en.name.trim()) newErrors["en.name"] = t("seller.products.newPlant.nameRequired");
    else if (translations.en.name.length > 255) newErrors["en.name"] = t("seller.products.newPlant.nameTooLong");
    if (translations.en.shortDescription.length > 500) newErrors["en.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");

    if (translations.bn.name.trim() && translations.bn.name.length > 255) newErrors["bn.name"] = t("seller.products.newPlant.nameTooLong");
    if (translations.bn.shortDescription.length > 500) newErrors["bn.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");

    const currentSlug = effectiveSlug().trim();
    if (currentSlug) {
      if (currentSlug.length < 3) newErrors["slug"] = t("seller.products.newPlant.slugTooShort");
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(currentSlug)) newErrors["slug"] = t("seller.products.newPlant.slugInvalid");
    }

    // Step 2: Category
    if (!plantDetails.categoryId.trim()) newErrors["categoryId"] = t("seller.products.newPlant.categoryRequired");

    // Step 4: Variants
    if (variants.length === 0) newErrors["variants"] = t("seller.products.newPlant.atLeastOneVariant");
    let baseCount = 0;
    variants.forEach((v, i) => {
      if (v.isBase) baseCount++;
      if (v.price === "" || v.price <= 0) newErrors[`variants.${i}.price`] = t("seller.products.newPlant.priceRequired");
    });
    if (variants.length > 1 && baseCount !== 1) newErrors["baseVariant"] = t("seller.products.newPlant.exactlyOneBase");

    // Step 5: Care profile
    if (!plantDetails.lightRequirement) newErrors["lightRequirement"] = t("seller.products.newPlant.lightRequired");
    if (!plantDetails.wateringFrequency) newErrors["wateringFrequency"] = t("seller.products.newPlant.wateringRequired");
    if (!plantDetails.humidityLevel) newErrors["humidityLevel"] = t("seller.products.newPlant.humidityRequired");
    if (!plantDetails.careDifficulty) newErrors["careDifficulty"] = t("seller.products.newPlant.careDifficultyRequired");

    setErrors(newErrors);
    return newErrors;
  };

  const findFirstStepWithError = (errs: FormErrors): number => {
    const step1Keys = ["thumbnail", "slug", "en.name", "en.shortDescription", "bn.name", "bn.shortDescription"];
    const step2Keys = ["categoryId"];
    const step4Keys = ["variants", "baseVariant"];
    const step5Keys = ["lightRequirement", "wateringFrequency", "humidityLevel", "careDifficulty"];

    const keys = Object.keys(errs);
    if (keys.some(k => step1Keys.includes(k))) return 1;
    if (keys.some(k => step2Keys.includes(k))) return 2;
    if (keys.some(k => step4Keys.includes(k) || k.startsWith("variants."))) return 4;
    if (keys.some(k => step5Keys.includes(k))) return 5;
    return 1;
  };

  // ---- Submission ----
  const handleSubmit = async (saveAsDraft: boolean) => {
    setSubmitStatus(null);

    const allErrors = validateAll();
    if (Object.keys(allErrors).length > 0 && !saveAsDraft) {
      const firstErrorStep = findFirstStepWithError(allErrors);
      goToStep(firstErrorStep);
      toaster.error(`${Object.keys(allErrors).length} ${t("seller.products.newPlant.fieldsNeedAttention")}`);
      return;
    }

    // For drafts, still block if critical required fields are missing
    if (saveAsDraft && allErrors["thumbnail"]) {
      toaster.error(t("seller.products.newPlant.thumbnailRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: import("~/lib/api/types/seller.types").CreatePlantRequest = {
        slug: effectiveSlug().trim() || undefined,
        thumbnailId: thumbnailUpload.mediaId()!,
        status: saveAsDraft ? "DRAFT" : status(),
        translations: [
          {
            locale: "en",
            name: translations.en.name.trim(),
            shortDescription: translations.en.shortDescription.trim() || undefined,
            description: translations.en.description.trim() || undefined,
          },
        ],
        plantDetails: {
          categoryId: plantDetails.categoryId.trim(),
          tagIds: plantDetails.tagIds.length > 0 ? plantDetails.tagIds : undefined,
          scientificName: plantDetails.scientificName.trim() || undefined,
          lightRequirement: plantDetails.lightRequirement,
          wateringFrequency: plantDetails.wateringFrequency,
          humidityLevel: plantDetails.humidityLevel,
          temperatureRange: plantDetails.temperatureRange.trim() || undefined,
          careDifficulty: plantDetails.careDifficulty,
          growthRate: plantDetails.growthRate || undefined,
          matureHeight: plantDetails.matureHeight.trim() || undefined,
          matureSpread: plantDetails.matureSpread.trim() || undefined,
          translations: {
            en: {
              commonNames: plantDetails.translations.en.commonNames.trim() || undefined,
              origin: plantDetails.translations.en.origin.trim() || undefined,
              soilType: plantDetails.translations.en.soilType.trim() || undefined,
              toxicityInfo: plantDetails.translations.en.toxicityInfo.trim() || undefined,
            },
            bn: {
              commonNames: plantDetails.translations.bn.commonNames.trim() || undefined,
              origin: plantDetails.translations.bn.origin.trim() || undefined,
              soilType: plantDetails.translations.bn.soilType.trim() || undefined,
              toxicityInfo: plantDetails.translations.bn.toxicityInfo.trim() || undefined,
            },
          },
        },
        variants: variants.map((v) => ({
          sku: v.sku.trim() || undefined,
          price: v.price as number,
          inventoryCount: typeof v.inventoryCount === "number" ? v.inventoryCount : 0,
          trackInventory: v.trackInventory,
          lowStockThreshold: typeof v.lowStockThreshold === "number" ? v.lowStockThreshold : undefined,
          isBase: v.isBase,
          isActive: v.isActive,
          mediaIds: v.mediaIds.length > 0 ? v.mediaIds : undefined,
          plantAttributes: {
            growthStage: v.growthStage || undefined,
            plantForm: v.plantForm.trim() || undefined,
            variegation: v.variegation.trim() || undefined,
            propagationType: v.propagationType.trim() || undefined,
            containerType: v.containerType.trim() || undefined,
            bundleType: v.bundleType.trim() || undefined,
          },
        })),
        careGuide:
          careGuide.en.lightInstructions ||
          careGuide.en.wateringInstructions ||
          careGuide.en.humidityInstructions ||
          careGuide.en.fertilizerSchedule ||
          careGuide.en.repottingFrequency ||
          careGuide.en.pruningNotes ||
          careGuide.en.commonProblems ||
          careGuide.en.seasonalCare ||
          careGuide.bn.lightInstructions ||
          careGuide.bn.wateringInstructions ||
          careGuide.bn.humidityInstructions ||
          careGuide.bn.fertilizerSchedule ||
          careGuide.bn.repottingFrequency ||
          careGuide.bn.pruningNotes ||
          careGuide.bn.commonProblems ||
          careGuide.bn.seasonalCare
            ? {
                en: {
                  lightInstructions: careGuide.en.lightInstructions.trim() || undefined,
                  wateringInstructions: careGuide.en.wateringInstructions.trim() || undefined,
                  humidityInstructions: careGuide.en.humidityInstructions.trim() || undefined,
                  fertilizerSchedule: careGuide.en.fertilizerSchedule.trim() || undefined,
                  repottingFrequency: careGuide.en.repottingFrequency.trim() || undefined,
                  pruningNotes: careGuide.en.pruningNotes.trim() || undefined,
                  commonProblems: careGuide.en.commonProblems.trim() || undefined,
                  seasonalCare: careGuide.en.seasonalCare.trim() || undefined,
                },
                bn: {
                  lightInstructions: careGuide.bn.lightInstructions.trim() || undefined,
                  wateringInstructions: careGuide.bn.wateringInstructions.trim() || undefined,
                  humidityInstructions: careGuide.bn.humidityInstructions.trim() || undefined,
                  fertilizerSchedule: careGuide.bn.fertilizerSchedule.trim() || undefined,
                  repottingFrequency: careGuide.bn.repottingFrequency.trim() || undefined,
                  pruningNotes: careGuide.bn.pruningNotes.trim() || undefined,
                  commonProblems: careGuide.bn.commonProblems.trim() || undefined,
                  seasonalCare: careGuide.bn.seasonalCare.trim() || undefined,
                },
              }
            : undefined,
      };

      // Add Bengali translation only if user provided content
      if (translations.bn.name.trim()) {
        payload.translations.push({
          locale: "bn",
          name: translations.bn.name.trim(),
          shortDescription: translations.bn.shortDescription.trim() || undefined,
          description: translations.bn.description.trim() || undefined,
        });
      }

      await plantsApi.create(payload);

      setSubmitStatus("success");
      toaster.success(t("seller.products.newPlant.plantCreated"));

      setTimeout(() => {
        setTranslations("en", { name: "", shortDescription: "", description: "" });
        setTranslations("bn", { name: "", shortDescription: "", description: "" });
        setPlantDetails({
          categoryId: "", tagIds: [], scientificName: "", lightRequirement: "",
          wateringFrequency: "", humidityLevel: "", temperatureRange: "",
          careDifficulty: "", growthRate: "", matureHeight: "", matureSpread: "",
          translations: {
            en: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
            bn: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
          },
        });
        setVariants([createEmptyVariant()]);
        thumbnailUpload.clear();
        setSlug("");
        setIsSlugManual(false);
        setCareGuide({
          en: { lightInstructions: "", wateringInstructions: "", humidityInstructions: "",
            fertilizerSchedule: "", repottingFrequency: "", pruningNotes: "",
            commonProblems: "", seasonalCare: "" },
          bn: { lightInstructions: "", wateringInstructions: "", humidityInstructions: "",
            fertilizerSchedule: "", repottingFrequency: "", pruningNotes: "",
            commonProblems: "", seasonalCare: "" },
        });
        setCurrentStep(1);
      }, 1500);
    } catch (err: any) {
      setSubmitStatus("error");
      const msg = err?.response?.message || err?.message || t("seller.products.newPlant.createFailed");
      toaster.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Step Titles for Navigation ----
  const stepTitle = () => stepTitles[currentStep() - 1];
  const hasAnyWarnings = () => Object.values(stepWarnings).some(w => w.hasWarning);

  return (
    <div class="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Page Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <A
            href="/app/seller/products/plants"
            class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-forest-700 transition-colors"
          >
            <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </A>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
              <SunIcon class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                {t("seller.products.newPlant.pageTitle")}
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {t("seller.products.newPlant.step")} {currentStep()} {t("seller.products.newPlant.of")} {totalSteps} — {stepTitle()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={stepInfo()} onStepClick={goToStep} />

      {/* Success Banner */}
      <Show when={submitStatus() === "success"}>
        <div class="bg-forest-50 dark:bg-forest-900/30 border border-forest-200 dark:border-forest-700 rounded-xl p-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-forest-600 dark:text-forest-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-sm font-medium text-forest-800 dark:text-forest-200">
            {t("seller.products.newPlant.plantCreated")}
          </p>
        </div>
      </Show>

      {/* Form */}
      <form
        onSubmit={(e: Event) => {
          e.preventDefault();
          handleSubmit(false);
        }}
        noValidate
      >
        {/* Step Content */}
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
          <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700">
            <h2 class="text-base font-semibold text-forest-800 dark:text-cream-50">
              {stepTitle()}
              <Show when={currentStep() === 6}>
                <span class="ml-2 text-xs font-normal text-gray-400">
                  ({t("common.optional")})
                </span>
              </Show>
              <Show when={currentStep() === 7}>
                <span class="ml-2 text-xs font-normal text-purple-500 dark:text-purple-400">
                  ({t("seller.products.newPlant.previewStep")})
                </span>
              </Show>
            </h2>
          </div>
          <div class="p-6">
            {/* Step 1: Identity, Names & Descriptions */}
            <Show when={currentStep() === 1}>
              <Step1Identity
                thumbnailUpload={thumbnailUpload}
                status={status()}
                onStatusChange={(v) => setStatus(v as PlantStatus)}
                slug={effectiveSlug()}
                onSlugChange={(v) => { setSlug(v); setIsSlugManual(true); }}
                enName={translations.en.name}
                onEnNameChange={(v) => setTranslations("en", "name", v)}
                enShortDesc={translations.en.shortDescription}
                onEnShortDescChange={(v) => setTranslations("en", "shortDescription", v)}
                enDescription={translations.en.description}
                onEnDescriptionChange={(v) => setTranslations("en", "description", v)}
                bnName={translations.bn.name}
                onBnNameChange={(v) => setTranslations("bn", "name", v)}
                bnShortDesc={translations.bn.shortDescription}
                onBnShortDescChange={(v) => setTranslations("bn", "shortDescription", v)}
                bnDescription={translations.bn.description}
                onBnDescriptionChange={(v) => setTranslations("bn", "description", v)}
                scientificName={plantDetails.scientificName}
                onScientificNameChange={(v) => setPlantDetails("scientificName", v)}
                errors={errors()}
                t={t}
                onWarningChange={handleWarningChange(1)}
              />
            </Show>

            {/* Step 2: Category & Tags */}
            <Show when={currentStep() === 2}>
              <Step2CategoryTags
                categoryId={plantDetails.categoryId}
                onCategoryIdChange={(v) => setPlantDetails("categoryId", v)}
                tagIds={plantDetails.tagIds}
                onTagToggle={toggleTag}
                errors={errors()}
                categoryTree={categoryTree}
                tags={tags}
                t={t}
                onWarningChange={handleWarningChange(2)}
              />
            </Show>

            {/* Step 3: Localized Details */}
            <Show when={currentStep() === 3}>
              <Step3Classification
                enCommonNames={plantDetails.translations.en.commonNames}
                onEnCommonNamesChange={(v) => setPlantDetails("translations", "en", "commonNames", v)}
                enOrigin={plantDetails.translations.en.origin}
                onEnOriginChange={(v) => setPlantDetails("translations", "en", "origin", v)}
                enSoilType={plantDetails.translations.en.soilType}
                onEnSoilTypeChange={(v) => setPlantDetails("translations", "en", "soilType", v)}
                enToxicityInfo={plantDetails.translations.en.toxicityInfo}
                onEnToxicityInfoChange={(v) => setPlantDetails("translations", "en", "toxicityInfo", v)}
                bnCommonNames={plantDetails.translations.bn.commonNames}
                onBnCommonNamesChange={(v) => setPlantDetails("translations", "bn", "commonNames", v)}
                bnOrigin={plantDetails.translations.bn.origin}
                onBnOriginChange={(v) => setPlantDetails("translations", "bn", "origin", v)}
                bnSoilType={plantDetails.translations.bn.soilType}
                onBnSoilTypeChange={(v) => setPlantDetails("translations", "bn", "soilType", v)}
                bnToxicityInfo={plantDetails.translations.bn.toxicityInfo}
                onBnToxicityInfoChange={(v) => setPlantDetails("translations", "bn", "toxicityInfo", v)}
                t={t}
                onWarningChange={handleWarningChange(3)}
              />
            </Show>

            {/* Step 4: Variants & Pricing */}
            <Show when={currentStep() === 4}>
              <Step4Variants
                variants={variants}
                setVariants={(fn: (v: VariantStore[]) => VariantStore[]) => setVariants(fn)}
                addVariant={addVariant}
                removeVariant={removeVariant}
                errors={errors()}
                growthStageOptions={growthStageOptions()}
                t={t}
                onWarningChange={handleWarningChange(4)}
              />
            </Show>

            {/* Step 5: Care Profile */}
            <Show when={currentStep() === 5}>
              <Step5CareProfile
                lightRequirement={plantDetails.lightRequirement}
                onLightChange={(v) => setPlantDetails("lightRequirement", v)}
                wateringFrequency={plantDetails.wateringFrequency}
                onWateringChange={(v) => setPlantDetails("wateringFrequency", v)}
                humidityLevel={plantDetails.humidityLevel}
                onHumidityChange={(v) => setPlantDetails("humidityLevel", v)}
                careDifficulty={plantDetails.careDifficulty}
                onCareDifficultyChange={(v) => setPlantDetails("careDifficulty", v)}
                growthRate={plantDetails.growthRate}
                onGrowthRateChange={(v) => setPlantDetails("growthRate", v)}
                temperatureRange={plantDetails.temperatureRange}
                onTemperatureChange={(v) => setPlantDetails("temperatureRange", v)}
                matureHeight={plantDetails.matureHeight}
                onMatureHeightChange={(v) => setPlantDetails("matureHeight", v)}
                matureSpread={plantDetails.matureSpread}
                onMatureSpreadChange={(v) => setPlantDetails("matureSpread", v)}
                errors={errors()}
                lightOptions={lightOptions()}
                wateringOptions={wateringOptions()}
                humidityOptions={humidityOptions()}
                careDifficultyOptions={careDifficultyOptions()}
                growthRateOptions={growthRateOptions()}
                t={t}
                onWarningChange={handleWarningChange(5)}
              />
            </Show>

            {/* Step 6: Care Guide */}
            <Show when={currentStep() === 6}>
              <Step6Care
                lightInstructions={careGuide.en.lightInstructions}
                onLightInstructionsChange={(v) => setCareGuide("en", "lightInstructions", v)}
                wateringInstructions={careGuide.en.wateringInstructions}
                onWateringInstructionsChange={(v) => setCareGuide("en", "wateringInstructions", v)}
                humidityInstructions={careGuide.en.humidityInstructions}
                onHumidityInstructionsChange={(v) => setCareGuide("en", "humidityInstructions", v)}
                fertilizerSchedule={careGuide.en.fertilizerSchedule}
                onFertilizerScheduleChange={(v) => setCareGuide("en", "fertilizerSchedule", v)}
                repottingFrequency={careGuide.en.repottingFrequency}
                onRepottingFrequencyChange={(v) => setCareGuide("en", "repottingFrequency", v)}
                pruningNotes={careGuide.en.pruningNotes}
                onPruningNotesChange={(v) => setCareGuide("en", "pruningNotes", v)}
                commonProblems={careGuide.en.commonProblems}
                onCommonProblemsChange={(v) => setCareGuide("en", "commonProblems", v)}
                seasonalCare={careGuide.en.seasonalCare}
                onSeasonalCareChange={(v) => setCareGuide("en", "seasonalCare", v)}
                bnLightInstructions={careGuide.bn.lightInstructions}
                onBnLightInstructionsChange={(v) => setCareGuide("bn", "lightInstructions", v)}
                bnWateringInstructions={careGuide.bn.wateringInstructions}
                onBnWateringInstructionsChange={(v) => setCareGuide("bn", "wateringInstructions", v)}
                bnHumidityInstructions={careGuide.bn.humidityInstructions}
                onBnHumidityInstructionsChange={(v) => setCareGuide("bn", "humidityInstructions", v)}
                bnFertilizerSchedule={careGuide.bn.fertilizerSchedule}
                onBnFertilizerScheduleChange={(v) => setCareGuide("bn", "fertilizerSchedule", v)}
                bnRepottingFrequency={careGuide.bn.repottingFrequency}
                onBnRepottingFrequencyChange={(v) => setCareGuide("bn", "repottingFrequency", v)}
                bnPruningNotes={careGuide.bn.pruningNotes}
                onBnPruningNotesChange={(v) => setCareGuide("bn", "pruningNotes", v)}
                bnCommonProblems={careGuide.bn.commonProblems}
                onBnCommonProblemsChange={(v) => setCareGuide("bn", "commonProblems", v)}
                bnSeasonalCare={careGuide.bn.seasonalCare}
                onBnSeasonalCareChange={(v) => setCareGuide("bn", "seasonalCare", v)}
                t={t}
                onWarningChange={handleWarningChange(6)}
              />
            </Show>

            {/* Step 7: Preview & Submit */}
            <Show when={currentStep() === 7}>
              <Step7Preview
                thumbnailPreview={thumbnailUpload.preview}
                status={status()}
                slug={effectiveSlug()}
                enName={translations.en.name}
                enShortDesc={translations.en.shortDescription}
                enDescription={translations.en.description}
                bnName={translations.bn.name}
                bnShortDesc={translations.bn.shortDescription}
                bnDescription={translations.bn.description}
                categoryId={plantDetails.categoryId}
                tagIds={plantDetails.tagIds}
                scientificName={plantDetails.scientificName}
                lightRequirement={plantDetails.lightRequirement}
                wateringFrequency={plantDetails.wateringFrequency}
                humidityLevel={plantDetails.humidityLevel}
                careDifficulty={plantDetails.careDifficulty}
                growthRate={plantDetails.growthRate}
                temperatureRange={plantDetails.temperatureRange}
                matureHeight={plantDetails.matureHeight}
                matureSpread={plantDetails.matureSpread}
                enCommonNames={plantDetails.translations.en.commonNames}
                enOrigin={plantDetails.translations.en.origin}
                enSoilType={plantDetails.translations.en.soilType}
                enToxicityInfo={plantDetails.translations.en.toxicityInfo}
                bnCommonNames={plantDetails.translations.bn.commonNames}
                bnOrigin={plantDetails.translations.bn.origin}
                bnSoilType={plantDetails.translations.bn.soilType}
                bnToxicityInfo={plantDetails.translations.bn.toxicityInfo}
                variants={variants}
                careGuideEn={careGuide.en}
                careGuideBn={careGuide.bn}
                t={t}
              />
            </Show>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting()}
            onClick={() => window.history.back()}
          >
            {t("common.cancel")}
          </Button>

          <div class="flex items-center gap-3">
            <Show when={currentStep() > 1}>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting()}
                onClick={goBack}
              >
                ← {t("seller.setupShop.back")}
              </Button>
            </Show>

            <Show when={currentStep() < totalSteps} fallback={
              <Button
                type="submit"
                variant="accent"
                disabled={isSubmitting() || hasAnyWarnings()}
                loading={isSubmitting()}
              >
                {isSubmitting() ? t("seller.products.newPlant.creating") : t("seller.products.newPlant.submitActive")}
              </Button>
            }>
              <Button
                type="button"
                variant="accent"
                disabled={isSubmitting()}
                onClick={goNext}
              >
                {t("seller.setupShop.next")} →
              </Button>
            </Show>
          </div>
        </div>
      </form>
    </div>
  );
}
