import { createSignal, createMemo, Show, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { A, createAsync } from "@solidjs/router";
import { getCategoryTree, getTags } from "~/lib/api/endpoints/public";
import type { CategoryTree } from "~/lib/api/endpoints/public/categories.api";
import type { TagGroup } from "~/lib/api/endpoints/public/tags.api";
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
import type { PlantFormState } from "~/lib/types/plant-form";
import { createEmptyVariant, toCreatePlantDto } from "~/lib/types/plant-form";

// ========================
// Types
// ========================

type PlantStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

interface FormErrors {
  [key: string]: string;
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

  const plantFormOptions = createMemo<SelectOption[]>(() => [
    { value: "upright", label: t("seller.products.newPlant.formUpright") },
    { value: "trailing", label: t("seller.products.newPlant.formTrailing") },
    { value: "bushy", label: t("seller.products.newPlant.formBushy") },
    { value: "climbing", label: t("seller.products.newPlant.formClimbing") },
    { value: "rosette", label: t("seller.products.newPlant.formRosette") },
  ]);

  const variegationOptions = createMemo<SelectOption[]>(() => [
    { value: "none", label: t("seller.products.newPlant.varNone") },
    { value: "variegated", label: t("seller.products.newPlant.varVariegated") },
    { value: "semi_variegated", label: t("seller.products.newPlant.varSemiVariegated") },
    { value: "albo", label: t("seller.products.newPlant.varAlbo") },
    { value: "aureo", label: t("seller.products.newPlant.varAureo") },
  ]);

  const leafDensityOptions = createMemo<SelectOption[]>(() => [
    { value: "sparse", label: t("seller.products.newPlant.densitySparse") },
    { value: "moderate", label: t("seller.products.newPlant.densityModerate") },
    { value: "dense", label: t("seller.products.newPlant.densityDense") },
  ]);

  const propagationTypeOptions = createMemo<SelectOption[]>(() => [
    { value: "cutting", label: t("seller.products.newPlant.propCutting") },
    { value: "seed", label: t("seller.products.newPlant.propSeed") },
    { value: "tissue_culture", label: t("seller.products.newPlant.propTissueCulture") },
    { value: "air_layer", label: t("seller.products.newPlant.propAirLayer") },
    { value: "division", label: t("seller.products.newPlant.propDivision") },
  ]);

  const containerTypeOptions = createMemo<SelectOption[]>(() => [
    { value: "nursery_pot", label: t("seller.products.newPlant.contNurseryPot") },
    { value: "decorative_pot", label: t("seller.products.newPlant.contDecorativePot") },
    { value: "hanging_basket", label: t("seller.products.newPlant.contHangingBasket") },
    { value: "terrarium", label: t("seller.products.newPlant.contTerrarium") },
    { value: "grow_bag", label: t("seller.products.newPlant.contGrowBag") },
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
  const [isSlugManual, setIsSlugManual] = createSignal(false);

  // Single form store
  const [form, setForm] = createStore<PlantFormState>({
    thumbnail: { id: null, url: null },
    status: "DRAFT",
    slug: "",
    translations: {
      en: { name: "", shortDescription: "", description: "" },
      bn: { name: "", shortDescription: "", description: "" },
    },
    plantDetails: {
      categoryId: "",
      tagIds: [],
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
    },
    variants: [createEmptyVariant()],
    careGuide: {
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
    },
  });

  // Thumbnail upload — hook handles upload logic, state syncs to form
  const thumbnailUpload = useImageUpload({
    maxSizeMB: 5,
    onSuccess: (id, url) => setForm("thumbnail", { id, url }),
    onError: () => setForm("thumbnail", { id: null, url: null }),
  });

  // Sync hook state to form store (handles deletion case)
  createEffect(() => {
    const hookId = thumbnailUpload.mediaId();
    const hookUrl = thumbnailUpload.preview();
    if (hookId !== form.thumbnail.id || hookUrl !== form.thumbnail.url) {
      setForm("thumbnail", { id: hookId, url: hookUrl });
    }
  });

  // Computed slug
  const computedSlug = createMemo(() => slugify(form.translations.en.name));
  const effectiveSlug = createMemo(() => isSlugManual() ? form.slug : computedSlug());

  // ---- Resolved Display Data (for Preview) ----
  const resolvedCategoryName = createMemo(() => {
    const catId = form.plantDetails.categoryId;
    if (!catId || !categoryTree()) return "";
    const find = (cats: CategoryTree[]): string => {
      for (const c of cats) {
        if (c.id === catId) return c.name;
        if (c.children) {
          const found = find(c.children);
          if (found) return found;
        }
      }
      return "";
    };
    return find(categoryTree()!);
  });

  const resolvedTags = createMemo(() => {
    const tagIds = form.plantDetails.tagIds;
    if (!tags() || tagIds.length === 0) return [];
    const result: { id: string; name: string }[] = [];
    for (const group of tags()!) {
      for (const tag of group.tags) {
        if (tagIds.includes(tag.id)) {
          result.push({ id: tag.id, name: tag.name });
        }
      }
    }
    return result;
  });

  // ---- Variant helpers ----
  function addVariant() {
    setForm("variants", (v) => [...v, createEmptyVariant()]);
  }

  function removeVariant(index: number) {
    if (form.variants.length <= 1) return;
    setForm("variants", (v) => v.filter((_, i) => i !== index));
  }

  function duplicateVariant(index: number) {
    const source = form.variants[index];
    const copy: VariantStore = {
      ...source,
      id: `variant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      sku: source.sku ? `${source.sku}-copy` : "",
      isBase: false,
      mediaIds: [...source.mediaIds],
      mediaUrls: [...source.mediaUrls],
    };
    setForm("variants", (v) => {
      const newArr = [...v];
      newArr.splice(index + 1, 0, copy);
      return newArr;
    });
  }

  // ---- Tag toggle ----
  function toggleTag(tagId: string) {
    const current = [...form.plantDetails.tagIds];
    const idx = current.indexOf(tagId);
    if (idx >= 0) {
      setForm("plantDetails", "tagIds", current.filter((id) => id !== tagId));
    } else if (current.length < 20) {
      setForm("plantDetails", "tagIds", [...current, tagId]);
    }
  }

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
    if (!form.thumbnail.id) {
      newErrors["thumbnail"] = t("seller.products.newPlant.thumbnailRequired");
    }
    if (!form.translations.en.name.trim()) newErrors["en.name"] = t("seller.products.newPlant.nameRequired");
    else if (form.translations.en.name.length > 255) newErrors["en.name"] = t("seller.products.newPlant.nameTooLong");
    if (form.translations.en.shortDescription.length > 500) newErrors["en.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");

    if (form.translations.bn.name.trim() && form.translations.bn.name.length > 255) newErrors["bn.name"] = t("seller.products.newPlant.nameTooLong");
    if (form.translations.bn.shortDescription.length > 500) newErrors["bn.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");

    const currentSlug = effectiveSlug().trim();
    if (currentSlug) {
      if (currentSlug.length < 3) newErrors["slug"] = t("seller.products.newPlant.slugTooShort");
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(currentSlug)) newErrors["slug"] = t("seller.products.newPlant.slugInvalid");
    }

    // Step 2: Category
    if (!form.plantDetails.categoryId.trim()) newErrors["categoryId"] = t("seller.products.newPlant.categoryRequired");

    // Step 4: Variants
    if (form.variants.length === 0) newErrors["variants"] = t("seller.products.newPlant.atLeastOneVariant");
    let baseCount = 0;
    form.variants.forEach((v, i) => {
      if (v.isBase) baseCount++;
      if (v.price === "" || v.price <= 0) newErrors[`variants.${i}.price`] = t("seller.products.newPlant.priceRequired");
    });
    if (form.variants.length > 1 && baseCount !== 1) newErrors["baseVariant"] = t("seller.products.newPlant.exactlyOneBase");

    // Step 5: Care profile
    if (!form.plantDetails.lightRequirement) newErrors["lightRequirement"] = t("seller.products.newPlant.lightRequired");
    if (!form.plantDetails.wateringFrequency) newErrors["wateringFrequency"] = t("seller.products.newPlant.wateringRequired");
    if (!form.plantDetails.humidityLevel) newErrors["humidityLevel"] = t("seller.products.newPlant.humidityRequired");
    if (!form.plantDetails.careDifficulty) newErrors["careDifficulty"] = t("seller.products.newPlant.careDifficultyRequired");

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
      const dto = toCreatePlantDto(form) as unknown as import("~/lib/api/types/seller.types").CreatePlantRequest;
      if (saveAsDraft) dto.status = "DRAFT";
      await plantsApi.create(dto);

      setSubmitStatus("success");
      toaster.success(t("seller.products.newPlant.plantCreated"));

      setTimeout(() => {
        setForm({
          thumbnail: { id: null, url: null },
          status: "DRAFT",
          slug: "",
          translations: {
            en: { name: "", shortDescription: "", description: "" },
            bn: { name: "", shortDescription: "", description: "" },
          },
          plantDetails: {
            categoryId: "", tagIds: [], scientificName: "", lightRequirement: "",
            wateringFrequency: "", humidityLevel: "", temperatureRange: "",
            careDifficulty: "", growthRate: "", matureHeight: "", matureSpread: "",
            translations: {
              en: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
              bn: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
            },
          },
          variants: [createEmptyVariant()],
          careGuide: {
            en: { lightInstructions: "", wateringInstructions: "", humidityInstructions: "",
              fertilizerSchedule: "", repottingFrequency: "", pruningNotes: "",
              commonProblems: "", seasonalCare: "" },
            bn: { lightInstructions: "", wateringInstructions: "", humidityInstructions: "",
              fertilizerSchedule: "", repottingFrequency: "", pruningNotes: "",
              commonProblems: "", seasonalCare: "" },
          },
        });
        thumbnailUpload.clear();
        setIsSlugManual(false);
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
                status={form.status}
                onStatusChange={(v) => setForm("status", v as PlantStatus)}
                slug={effectiveSlug()}
                onSlugChange={(v) => { setForm("slug", v); setIsSlugManual(true); }}
                enName={form.translations.en.name}
                onEnNameChange={(v) => setForm("translations", "en", "name", v)}
                enShortDesc={form.translations.en.shortDescription}
                onEnShortDescChange={(v) => setForm("translations", "en", "shortDescription", v)}
                enDescription={form.translations.en.description}
                onEnDescriptionChange={(v) => setForm("translations", "en", "description", v)}
                bnName={form.translations.bn.name}
                onBnNameChange={(v) => setForm("translations", "bn", "name", v)}
                bnShortDesc={form.translations.bn.shortDescription}
                onBnShortDescChange={(v) => setForm("translations", "bn", "shortDescription", v)}
                bnDescription={form.translations.bn.description}
                onBnDescriptionChange={(v) => setForm("translations", "bn", "description", v)}
                scientificName={form.plantDetails.scientificName}
                onScientificNameChange={(v) => setForm("plantDetails", "scientificName", v)}
                errors={errors()}
                t={t}
                onWarningChange={handleWarningChange(1)}
              />
            </Show>

            {/* Step 2: Category & Tags */}
            <Show when={currentStep() === 2}>
              <Step2CategoryTags
                categoryId={form.plantDetails.categoryId}
                onCategoryIdChange={(v) => setForm("plantDetails", "categoryId", v)}
                tagIds={form.plantDetails.tagIds}
                onTagToggle={(tagId) => {
                  const current = [...form.plantDetails.tagIds];
                  const idx = current.indexOf(tagId);
                  if (idx >= 0) {
                    setForm("plantDetails", "tagIds", current.filter((id) => id !== tagId));
                  } else if (current.length < 20) {
                    setForm("plantDetails", "tagIds", [...current, tagId]);
                  }
                }}
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
                enCommonNames={form.plantDetails.translations.en.commonNames}
                onEnCommonNamesChange={(v) => setForm("plantDetails", "translations", "en", "commonNames", v)}
                enOrigin={form.plantDetails.translations.en.origin}
                onEnOriginChange={(v) => setForm("plantDetails", "translations", "en", "origin", v)}
                enSoilType={form.plantDetails.translations.en.soilType}
                onEnSoilTypeChange={(v) => setForm("plantDetails", "translations", "en", "soilType", v)}
                enToxicityInfo={form.plantDetails.translations.en.toxicityInfo}
                onEnToxicityInfoChange={(v) => setForm("plantDetails", "translations", "en", "toxicityInfo", v)}
                bnCommonNames={form.plantDetails.translations.bn.commonNames}
                onBnCommonNamesChange={(v) => setForm("plantDetails", "translations", "bn", "commonNames", v)}
                bnOrigin={form.plantDetails.translations.bn.origin}
                onBnOriginChange={(v) => setForm("plantDetails", "translations", "bn", "origin", v)}
                bnSoilType={form.plantDetails.translations.bn.soilType}
                onBnSoilTypeChange={(v) => setForm("plantDetails", "translations", "bn", "soilType", v)}
                bnToxicityInfo={form.plantDetails.translations.bn.toxicityInfo}
                onBnToxicityInfoChange={(v) => setForm("plantDetails", "translations", "bn", "toxicityInfo", v)}
                t={t}
                onWarningChange={handleWarningChange(3)}
              />
            </Show>

            {/* Step 4: Variants & Pricing */}
            <Show when={currentStep() === 4}>
              <Step4Variants
                variants={form.variants}
                setVariants={(fn: (v: VariantStore[]) => VariantStore[]) => setForm("variants", fn)}
                addVariant={addVariant}
                duplicateVariant={duplicateVariant}
                removeVariant={removeVariant}
                errors={errors()}
                growthStageOptions={growthStageOptions()}
                plantFormOptions={plantFormOptions()}
                variegationOptions={variegationOptions()}
                leafDensityOptions={leafDensityOptions()}
                propagationTypeOptions={propagationTypeOptions()}
                containerTypeOptions={containerTypeOptions()}
                t={t}
                onWarningChange={handleWarningChange(4)}
              />
            </Show>

            {/* Step 5: Care Profile */}
            <Show when={currentStep() === 5}>
              <Step5CareProfile
                lightRequirement={form.plantDetails.lightRequirement}
                onLightChange={(v) => setForm("plantDetails", "lightRequirement", v)}
                wateringFrequency={form.plantDetails.wateringFrequency}
                onWateringChange={(v) => setForm("plantDetails", "wateringFrequency", v)}
                humidityLevel={form.plantDetails.humidityLevel}
                onHumidityChange={(v) => setForm("plantDetails", "humidityLevel", v)}
                careDifficulty={form.plantDetails.careDifficulty}
                onCareDifficultyChange={(v) => setForm("plantDetails", "careDifficulty", v)}
                growthRate={form.plantDetails.growthRate}
                onGrowthRateChange={(v) => setForm("plantDetails", "growthRate", v)}
                temperatureRange={form.plantDetails.temperatureRange}
                onTemperatureChange={(v) => setForm("plantDetails", "temperatureRange", v)}
                matureHeight={form.plantDetails.matureHeight}
                onMatureHeightChange={(v) => setForm("plantDetails", "matureHeight", v)}
                matureSpread={form.plantDetails.matureSpread}
                onMatureSpreadChange={(v) => setForm("plantDetails", "matureSpread", v)}
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
                lightInstructions={form.careGuide.en.lightInstructions}
                onLightInstructionsChange={(v) => setForm("careGuide", "en", "lightInstructions", v)}
                wateringInstructions={form.careGuide.en.wateringInstructions}
                onWateringInstructionsChange={(v) => setForm("careGuide", "en", "wateringInstructions", v)}
                humidityInstructions={form.careGuide.en.humidityInstructions}
                onHumidityInstructionsChange={(v) => setForm("careGuide", "en", "humidityInstructions", v)}
                fertilizerSchedule={form.careGuide.en.fertilizerSchedule}
                onFertilizerScheduleChange={(v) => setForm("careGuide", "en", "fertilizerSchedule", v)}
                repottingFrequency={form.careGuide.en.repottingFrequency}
                onRepottingFrequencyChange={(v) => setForm("careGuide", "en", "repottingFrequency", v)}
                pruningNotes={form.careGuide.en.pruningNotes}
                onPruningNotesChange={(v) => setForm("careGuide", "en", "pruningNotes", v)}
                commonProblems={form.careGuide.en.commonProblems}
                onCommonProblemsChange={(v) => setForm("careGuide", "en", "commonProblems", v)}
                seasonalCare={form.careGuide.en.seasonalCare}
                onSeasonalCareChange={(v) => setForm("careGuide", "en", "seasonalCare", v)}
                bnLightInstructions={form.careGuide.bn.lightInstructions}
                onBnLightInstructionsChange={(v) => setForm("careGuide", "bn", "lightInstructions", v)}
                bnWateringInstructions={form.careGuide.bn.wateringInstructions}
                onBnWateringInstructionsChange={(v) => setForm("careGuide", "bn", "wateringInstructions", v)}
                bnHumidityInstructions={form.careGuide.bn.humidityInstructions}
                onBnHumidityInstructionsChange={(v) => setForm("careGuide", "bn", "humidityInstructions", v)}
                bnFertilizerSchedule={form.careGuide.bn.fertilizerSchedule}
                onBnFertilizerScheduleChange={(v) => setForm("careGuide", "bn", "fertilizerSchedule", v)}
                bnRepottingFrequency={form.careGuide.bn.repottingFrequency}
                onBnRepottingFrequencyChange={(v) => setForm("careGuide", "bn", "repottingFrequency", v)}
                bnPruningNotes={form.careGuide.bn.pruningNotes}
                onBnPruningNotesChange={(v) => setForm("careGuide", "bn", "pruningNotes", v)}
                bnCommonProblems={form.careGuide.bn.commonProblems}
                onBnCommonProblemsChange={(v) => setForm("careGuide", "bn", "commonProblems", v)}
                bnSeasonalCare={form.careGuide.bn.seasonalCare}
                onBnSeasonalCareChange={(v) => setForm("careGuide", "bn", "seasonalCare", v)}
                t={t}
                onWarningChange={handleWarningChange(6)}
              />
            </Show>

            {/* Step 7: Preview & Submit */}
            <Show when={currentStep() === 7}>
              <Step7Preview
                thumbnailPreview={form.thumbnail.url}
                status={form.status}
                slug={effectiveSlug()}
                enName={form.translations.en.name}
                enShortDesc={form.translations.en.shortDescription}
                enDescription={form.translations.en.description}
                bnName={form.translations.bn.name}
                bnShortDesc={form.translations.bn.shortDescription}
                bnDescription={form.translations.bn.description}
                categoryId={form.plantDetails.categoryId}
                categoryName={resolvedCategoryName()}
                tagIds={form.plantDetails.tagIds}
                tags={resolvedTags()}
                scientificName={form.plantDetails.scientificName}
                lightRequirement={form.plantDetails.lightRequirement}
                wateringFrequency={form.plantDetails.wateringFrequency}
                humidityLevel={form.plantDetails.humidityLevel}
                careDifficulty={form.plantDetails.careDifficulty}
                growthRate={form.plantDetails.growthRate}
                temperatureRange={form.plantDetails.temperatureRange}
                matureHeight={form.plantDetails.matureHeight}
                matureSpread={form.plantDetails.matureSpread}
                enCommonNames={form.plantDetails.translations.en.commonNames}
                enOrigin={form.plantDetails.translations.en.origin}
                enSoilType={form.plantDetails.translations.en.soilType}
                enToxicityInfo={form.plantDetails.translations.en.toxicityInfo}
                bnCommonNames={form.plantDetails.translations.bn.commonNames}
                bnOrigin={form.plantDetails.translations.bn.origin}
                bnSoilType={form.plantDetails.translations.bn.soilType}
                bnToxicityInfo={form.plantDetails.translations.bn.toxicityInfo}
                variants={form.variants}
                careGuideEn={form.careGuide.en}
                careGuideBn={form.careGuide.bn}
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
