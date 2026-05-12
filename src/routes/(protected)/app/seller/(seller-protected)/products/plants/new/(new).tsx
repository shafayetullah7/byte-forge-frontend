import { createSignal, createMemo, Show, createEffect, ErrorBoundary, Suspense, For } from "solid-js";
import { createStore } from "solid-js/store";
import { A, createAsync, action, useAction, useSubmission } from "@solidjs/router";
import { getCategoryTree, getTags } from "~/lib/api/endpoints/public";
import type { CategoryTree } from "~/lib/api/endpoints/public/categories.api";
import { useI18n } from "~/i18n";
import { slugify } from "~/lib/utils/slugify";
import Button from "~/components/ui/Button";
import { type SelectOption } from "~/components/ui/Select";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import { toaster } from "~/components/ui/Toast";
import { createPlant } from "~/lib/api/endpoints/seller/plants.api";
import { SunIcon, ChevronLeftIcon, SpinnerIcon } from "~/components/icons";
import { StepIndicator } from "./StepIndicator";
import { Step1Identity } from "./Step1Identity";
import { Step2CategoryTags } from "./Step2CategoryTags";
import { Step3Classification } from "./Step3Classification";
import { Step4Variants, type VariantStore } from "./Step4Variants";
import { Step5CareProfile } from "./Step5CareProfile";
import { Step6Care } from "./Step6Care";
import { Step7Preview } from "./Step7Preview";
import type { PlantFormState } from "~/lib/types/plant-form";
import { createEmptyVariant, toCreatePlantDto, createEmptyForm } from "~/lib/types/plant-form";

// ========================
// Types
// ========================

type PlantStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

interface FormErrors {
  [key: string]: string;
}

// ========================
// Server Action
// ========================

interface CreatePlantActionData {
  dto: Record<string, unknown>;
  saveAsDraft: boolean;
}

const createPlantAction = action(async (data: CreatePlantActionData) => {
  "use server";
  try {
    if (data.saveAsDraft) {
      (data.dto as any).status = "DRAFT";
    }
    await createPlant(data.dto as unknown as import("~/lib/api/types/seller.types").CreatePlantRequest);
    return { success: true };
  } catch (error: any) {
    const response = error.response || error;
    return {
      success: false,
      error: {
        message: error.message || "Failed to create plant",
        statusCode: error.statusCode,
        validationErrors: response?.error?.validationErrors || response?.validationErrors,
      },
    };
  }
}, "create-plant-action");

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
  const [isSlugManual, setIsSlugManual] = createSignal(false);
  const [validationErrors, setValidationErrors] = createSignal<{ field: string; message: string }[]>([]);

  // ---- Server Action ----
  const createPlantTrigger = useAction(createPlantAction);
  const plantSubmission = useSubmission(createPlantAction);
  const isSubmitting = () => plantSubmission.pending;

  // Single form store
  const [form, setForm] = createStore<PlantFormState>(createEmptyForm());

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

  // ---- Handle submission result ----
  createEffect(() => {
    const result = plantSubmission.result;
    if (!result) return;

    if (result.success === true) {
      setValidationErrors([]);
      toaster.success(t("seller.products.newPlant.plantCreated"));
      setTimeout(() => {
        setForm(createEmptyForm());
        thumbnailUpload.clear();
        setIsSlugManual(false);
        setCurrentStep(1);
      }, 1500);
    } else if (result.success === false && result.error) {
      const errs = result.error.validationErrors;
      if (errs && errs.length > 0) {
        setValidationErrors(errs);
      } else {
        setValidationErrors([]);
        const msg = result.error.message || t("seller.products.newPlant.createFailed");
        toaster.error(msg);
      }
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
      translations: {
        en: { ...source.translations.en },
        bn: { ...source.translations.bn },
      },
    };
    setForm("variants", (v) => {
      const newArr = [...v];
      newArr.splice(index + 1, 0, copy);
      return newArr;
    });
  }

  // ---- Step Indicator Data ----
  const stepTitles = createMemo(() => [
    t("seller.products.newPlant.step1Title"),
    t("seller.products.newPlant.step2Title"),
    t("seller.products.newPlant.step3Title"),
    t("seller.products.newPlant.step4Title"),
    t("seller.products.newPlant.step5Title"),
    t("seller.products.newPlant.step6Title"),
    t("seller.products.newPlant.step7Title"),
  ]);

  const stepInfo = createMemo(() =>
    Array.from({ length: totalSteps }, (_, i) => {
      const stepNum = i + 1;
      const warning = stepWarnings[stepNum];
      const isCurrent = currentStep() === stepNum;
      const isPast = stepNum < currentStep();
      const isPreview = stepNum === 7;
      const hasNoWarnings = !warning.hasWarning;
      return {
        number: stepNum,
        title: stepTitles()[i],
        isComplete: isPast && hasNoWarnings,
        hasWarning: !isPast && warning.hasWarning,
        isCurrent,
        isPreview,
      };
    })
  );

  // ---- Step Warning Callback ----
  const warningCallbacks = createMemo(() => {
    const callbacks: Record<number, (hasWarning: boolean, missingFields: string[]) => void> = {};
    for (let i = 1; i <= totalSteps; i++) {
      callbacks[i] = (hasWarning, missingFields) => {
        setStepWarnings(i, { hasWarning, missing: missingFields });
      };
    }
    return callbacks;
  });

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
    else if (form.translations.en.name.length < 3) newErrors["en.name"] = t("seller.products.newPlant.nameTooShort");
    else if (form.translations.en.name.length > 255) newErrors["en.name"] = t("seller.products.newPlant.nameTooLong");
    if (form.translations.en.shortDescription.length > 500) newErrors["en.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");

    if (form.translations.bn.name.trim()) {
      if (form.translations.bn.name.length < 3) newErrors["bn.name"] = t("seller.products.newPlant.nameTooShort");
      else if (form.translations.bn.name.length > 255) newErrors["bn.name"] = t("seller.products.newPlant.nameTooLong");
    }
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
    if (baseCount !== 1) newErrors["baseVariant"] = t("seller.products.newPlant.exactlyOneBase");

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
  const handleSubmit = (saveAsDraft: boolean) => {
    const allErrors = validateAll();
    if (Object.keys(allErrors).length > 0 && !saveAsDraft) {
      const firstErrorStep = findFirstStepWithError(allErrors);
      goToStep(firstErrorStep);
      toaster.error(`${Object.keys(allErrors).length} ${t("seller.products.newPlant.fieldsNeedAttention")}`);
      return;
    }

    if (saveAsDraft && allErrors["thumbnail"]) {
      toaster.error(t("seller.products.newPlant.thumbnailRequired"));
      return;
    }

    const dto = toCreatePlantDto(form);
    createPlantTrigger({ dto, saveAsDraft });
  };

  // ---- Step Titles for Navigation ----
  const stepTitle = () => stepTitles()[currentStep() - 1];
  const hasAnyWarnings = () => {
    for (let i = 1; i < currentStep(); i++) {
      if (stepWarnings[i].hasWarning) return true;
    }
    return false;
  };

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="max-w-5xl mx-auto py-12 px-6">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
            <div class="flex items-center gap-3 mb-4">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 class="text-lg font-semibold text-red-900 dark:text-red-200">
                {t("seller.products.newPlant.loadFailed") || "Failed to Load"}
              </h2>
            </div>
            <p class="text-sm text-red-700 dark:text-red-300 mb-4">
              {error.message || t("seller.products.newPlant.loadFailedDesc") || "Unable to load the plant creation form."}
            </p>
            <div class="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                {t("common.retry") || "Retry"}
              </button>
              <A
                href="/app/seller/products/plants"
                class="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                {t("seller.products.newPlant.backToPlants")}
              </A>
            </div>
          </div>
        </div>
      )}
    >
      <Suspense
        fallback={
          <div class="max-w-5xl mx-auto flex items-center justify-center py-24">
            <SpinnerIcon class="w-8 h-8 text-forest-600 dark:text-forest-400 animate-spin" />
            <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">
              {t("seller.products.newPlant.loadingData") || "Loading..."}
            </span>
          </div>
        }
      >
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

          {/* Validation Error Banner */}
          <Show when={validationErrors().length > 0}>
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                    {validationErrors().length} {t("seller.products.newPlant.fieldsNeedAttention")}
                  </p>
                  <ul class="space-y-1">
                    <For each={validationErrors()}>
                      {(err) => (
                        <li class="text-sm text-red-700 dark:text-red-400">
                          {err.message}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setValidationErrors([])}
                  class="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </Show>

      {/* Success Banner */}
      <Show when={plantSubmission.result?.success === true}>
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
                    onWarningChange={warningCallbacks()[1]}
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
                    onWarningChange={warningCallbacks()[2]}
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
                    onWarningChange={warningCallbacks()[3]}
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
                    onWarningChange={warningCallbacks()[4]}
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
                    onWarningChange={warningCallbacks()[5]}
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
                    onWarningChange={warningCallbacks()[6]}
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
      </Suspense>
    </ErrorBoundary>
  );
}
