import {
  createSignal,
  createMemo,
  Show,
  For,
  mergeProps,
} from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { slugify } from "~/lib/utils/slugify";
import Button from "~/components/ui/Button";
import { Select, type SelectOption } from "~/components/ui/Select";
import { TagMultiSelect, type TagGroupOption } from "~/components/ui/TagMultiSelect";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import { toaster } from "~/components/ui/Toast";
import {
  PackageIcon,
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  SunIcon,
  BoltIcon,
  ClipboardListIcon,
} from "~/components/icons";

// ========================
// Types
// ========================

type PlantStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

interface VariantStore {
  sku: string;
  price: number | "";
  salePrice: number | "";
  costPrice: number | "";
  inventoryCount: number | "";
  trackInventory: boolean;
  lowStockThreshold: number | "";
  isBase: boolean;
  isActive: boolean;
  // Variant images
  mediaIds: string[];
  // Plant attributes
  potSize: string;
  potSizeInches: number | "";
  potMaterial: string;
  potColor: string;
  potType: string;
  growthStage: string;
  plantForm: string;
  variegation: string;
  propagationType: string;
  containerType: string;
  bundleType: string;
}

interface FormErrors {
  [key: string]: string;
}

// ========================
// Static Options (matching backend enum values)
// ========================

const LIGHT_OPTIONS: SelectOption[] = [
  { value: "low", label: "Low Light (shady corners, indirect light)" },
  { value: "medium", label: "Medium Light (bright room, no direct sun)" },
  { value: "bright_indirect", label: "Bright Indirect (near window, filtered light)" },
  { value: "direct", label: "Direct Sun (full sunlight, windowsill)" },
];

const WATERING_OPTIONS: SelectOption[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "bi_weekly", label: "Every 2 Weeks" },
  { value: "monthly", label: "Monthly" },
];

const HUMIDITY_OPTIONS: SelectOption[] = [
  { value: "low", label: "Low (normal room humidity)" },
  { value: "medium", label: "Moderate (slightly humid)" },
  { value: "high", label: "High (bathroom/misting recommended)" },
];

const CARE_DIFFICULTY_OPTIONS: SelectOption[] = [
  { value: "beginner", label: "Beginner (hard to kill)" },
  { value: "intermediate", label: "Intermediate (some experience needed)" },
  { value: "expert", label: "Expert (finicky, specific conditions)" },
];

const GROWTH_RATE_OPTIONS: SelectOption[] = [
  { value: "slow", label: "Slow" },
  { value: "moderate", label: "Moderate" },
  { value: "fast", label: "Fast" },
];

const GROWTH_STAGE_OPTIONS: SelectOption[] = [
  { value: "seedling", label: "Seedling" },
  { value: "juvenile", label: "Juvenile" },
  { value: "mature", label: "Mature" },
  { value: "cutting", label: "Cutting" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
];

// Placeholder category options (will be replaced with API data)
const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "", label: "Loading categories..." },
  // TODO: Replace with actual API call to fetch categories
];

// Placeholder tag groups (will be replaced with API data)
const TAG_GROUPS: TagGroupOption[] = [
  // TODO: Replace with actual API call to fetch tags
];

// ========================
// Helper: Create empty variant
// ========================

function createEmptyVariant(): VariantStore {
  return {
    sku: "",
    price: "",
    salePrice: "",
    costPrice: "",
    inventoryCount: "",
    trackInventory: true,
    lowStockThreshold: "",
    isBase: false,
    isActive: true,
    mediaIds: [],
    potSize: "",
    potSizeInches: "",
    potMaterial: "",
    potColor: "",
    potType: "",
    growthStage: "",
    plantForm: "",
    variegation: "",
    propagationType: "",
    containerType: "",
    bundleType: "",
  };
}

// ========================
// Section Card Component
// ========================

function SectionCard(props: {
  icon?: any;
  title: string;
  description: string;
  children: any;
  class?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = createSignal(
    props.defaultOpen !== undefined ? props.defaultOpen : true
  );

  return (
    <div
      class={`bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden ${
        props.class || ""
      }`}
    >
      <div
        class={`px-6 py-4 border-b border-cream-200 dark:border-forest-700 ${
          props.collapsible ? "cursor-pointer select-none" : ""
        }`}
        onClick={() => props.collapsible && setIsOpen(!isOpen())}
      >
        <div class="flex items-center gap-3">
          {props.icon && (
            <div class="w-8 h-8 rounded-lg bg-forest-100 dark:bg-forest-700 flex items-center justify-center flex-shrink-0">
              <props.icon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
            </div>
          )}
          <div class="flex-1">
            <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
              {props.title}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {props.description}
            </p>
          </div>
          {props.collapsible && (
            <svg
              class={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen() ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>
      <Show when={!props.collapsible || isOpen()}>
        <div class="p-6">{props.children}</div>
      </Show>
    </div>
  );
}

// ========================
// Input Field Component
// ========================

function InputField(props: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onInput: (val: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  dir?: "auto" | "ltr" | "rtl";
  hint?: string;
  maxLen?: number;
}) {
  const merged = mergeProps(
    { type: "text", textarea: false, rows: 3, required: false, maxLen: 0 },
    props
  );

  return (
    <div>
      <label for={merged.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {merged.label}
        {merged.required && <span class="text-red-500 ml-1">*</span>}
      </label>
      {merged.textarea ? (
        <textarea
          id={merged.id}
          value={merged.value}
          onInput={(e) => merged.onInput((e.target as HTMLTextAreaElement).value)}
          placeholder={merged.placeholder}
          rows={merged.rows}
          dir={merged.dir}
          maxlength={merged.maxLen || undefined}
          class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm resize-none ${
            merged.error
              ? "border-red-500 dark:border-red-400"
              : "border-cream-200 dark:border-forest-600"
          }`}
        />
      ) : (
        <input
          type={merged.type}
          id={merged.id}
          value={merged.value}
          onInput={(e) => merged.onInput((e.target as HTMLInputElement).value)}
          placeholder={merged.placeholder}
          dir={merged.dir}
          maxlength={merged.maxLen || undefined}
          class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm ${
            merged.error
              ? "border-red-500 dark:border-red-400"
              : "border-cream-200 dark:border-forest-600"
          }`}
        />
      )}
      <Show when={merged.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
          {merged.error}
        </p>
      </Show>
      <Show when={merged.hint}>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{merged.hint}</p>
      </Show>
      <Show when={merged.maxLen && merged.textarea}>
        <p class="mt-1 text-xs text-gray-400 dark:text-gray-500 text-right">
          {merged.value.length}/{merged.maxLen}
        </p>
      </Show>
    </div>
  );
}

// ========================
// Number Input Field
// ========================

function NumberField(props: {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: number | "";
  onInput: (val: number | "") => void;
  error?: string;
  min?: number;
  step?: number;
}) {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
        {props.required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        id={props.id}
        value={props.value}
        onInput={(e) => {
          const v = (e.target as HTMLInputElement).value;
          props.onInput(v === "" ? "" : parseFloat(v));
        }}
        placeholder={props.placeholder}
        min={props.min}
        step={props.step || "any"}
        class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm ${
          props.error
            ? "border-red-500 dark:border-red-400"
            : "border-cream-200 dark:border-forest-600"
        }`}
      />
      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
          {props.error}
        </p>
      </Show>
    </div>
  );
}

// ========================
// Checkbox Field
// ========================

function CheckboxField(props: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label for={props.id} class="flex items-center gap-2.5 cursor-pointer group">
      <div class="relative">
        <input
          type="checkbox"
          id={props.id}
          checked={props.checked}
          onChange={(e) => props.onChange((e.target as HTMLInputElement).checked)}
          class="sr-only peer"
        />
        <div class="w-5 h-5 rounded border-2 border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-700 peer-checked:bg-forest-600 peer-checked:border-forest-600 transition-colors flex items-center justify-center">
          <Show when={props.checked}>
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </Show>
        </div>
      </div>
      <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-cream-100 transition-colors">
        {props.label}
      </span>
    </label>
  );
}

// ========================
// Variant Image Upload Component
// ========================

function VariantImageUpload(props: {
  variantIndex: number;
  mediaIds: string[];
  onAdd: (mediaId: string) => void;
  onRemove: (index: number) => void;
}) {
  const imageUpload = useImageUpload({ maxSizeMB: 5 });

  return (
    <div>
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Variant Images ({props.mediaIds.length}/10)
      </p>
      <Show when={props.mediaIds.length > 0}>
        <div class="flex flex-wrap gap-2 mb-2">
          <For each={props.mediaIds}>
            {(mediaId, idx) => (
              <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-cream-200 dark:border-forest-600">
                {/* TODO: Show actual image preview from mediaId */}
                <div class="w-full h-full bg-cream-100 dark:bg-forest-700 flex items-center justify-center text-xs text-gray-400">
                  IMG {idx() + 1}
                </div>
                <button
                  type="button"
                  onClick={() => props.onRemove(idx())}
                  class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={props.mediaIds.length < 10}>
        <ImageUpload
          preview={imageUpload.preview()}
          isUploading={imageUpload.isUploading()}
          isDeleting={imageUpload.isDeleting()}
          onFileSelect={(file) => {
            imageUpload.upload(file);
            // TODO: Get mediaId from upload response and add to variant
          }}
          onDelete={() => imageUpload.deleteMedia()}
          label=""
          description="Click to add image (JPEG, PNG, WEBP, GIF - max 5MB)"
        />
      </Show>
    </div>
  );
}

// ========================
// Main Page
// ========================

export default function NewPlantPage() {
  const { t } = useI18n();

  // ---- Form State ----
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitStatus, setSubmitStatus] = createSignal<"success" | "error" | null>(null);

  // Thumbnail
  const thumbnailUpload = useImageUpload({
    maxSizeMB: 5,
  });

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

  // Auto-generate slug from English name
  createMemo(() => {
    const englishName = translations.en.name;
    if (!isSlugManual() && englishName) {
      setSlug(slugify(englishName));
    }
  });

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
  });

  // EN/BN Plant Details Translations (common names, origin, soil, toxicity)
  const [enDetails, setEnDetails] = createStore({
    commonNames: "",
    origin: "",
    soilType: "",
    toxicityInfo: "",
  });

  const [bnDetails, setBnDetails] = createStore({
    commonNames: "",
    origin: "",
    soilType: "",
    toxicityInfo: "",
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

  // Care Instructions
  const [careInstructions, setCareInstructions] = createStore({
    lightInstructions: "",
    wateringInstructions: "",
    humidityInstructions: "",
    fertilizerSchedule: "",
    repottingFrequency: "",
    pruningNotes: "",
    commonProblems: "",
    seasonalCare: "",
  });

  const [careTranslations, setCareTranslations] = createStore<{
    en: typeof careInstructions;
    bn: typeof careInstructions;
  }>({
    en: { ...careInstructions },
    bn: { ...careInstructions },
  });

  // ---- Validation ----
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Thumbnail
    if (!thumbnailUpload.mediaId()) {
      newErrors.thumbnail = t("seller.products.newPlant.thumbnailRequired");
    }

    // Translations - English
    if (!translations.en.name.trim()) {
      newErrors["en.name"] = t("seller.products.newPlant.nameRequired");
    } else if (translations.en.name.length > 255) {
      newErrors["en.name"] = t("seller.products.newPlant.nameTooLong");
    }
    // Short description is optional, but if provided max 500
    if (translations.en.shortDescription.length > 500) {
      newErrors["en.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");
    }
    if (!translations.en.description.trim()) {
      newErrors["en.description"] = t("seller.products.newPlant.descriptionRequired");
    } else if (translations.en.description.length < 50) {
      newErrors["en.description"] = t("seller.products.newPlant.descriptionTooShort");
    }

    // Translations - Bengali
    if (!translations.bn.name.trim()) {
      newErrors["bn.name"] = t("seller.products.newPlant.nameRequired");
    } else if (translations.bn.name.length > 255) {
      newErrors["bn.name"] = t("seller.products.newPlant.nameTooLong");
    }
    if (translations.bn.shortDescription.length > 500) {
      newErrors["bn.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");
    }
    if (!translations.bn.description.trim()) {
      newErrors["bn.description"] = t("seller.products.newPlant.descriptionRequired");
    } else if (translations.bn.description.length < 50) {
      newErrors["bn.description"] = t("seller.products.newPlant.descriptionTooShort");
    }

    // Slug validation (if provided)
    const currentSlug = slug().trim();
    if (currentSlug) {
      if (currentSlug.length < 3) {
        newErrors.slug = t("seller.products.newPlant.slugTooShort");
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(currentSlug)) {
        newErrors.slug = t("seller.products.newPlant.slugInvalid");
      }
    }

    // Plant details
    if (!plantDetails.categoryId.trim()) {
      newErrors.categoryId = t("seller.products.newPlant.categoryRequired");
    }
    if (!plantDetails.lightRequirement) {
      newErrors.lightRequirement = t("seller.products.newPlant.lightRequired");
    }
    if (!plantDetails.wateringFrequency) {
      newErrors.wateringFrequency = t("seller.products.newPlant.wateringRequired");
    }
    if (!plantDetails.humidityLevel) {
      newErrors.humidityLevel = t("seller.products.newPlant.humidityRequired");
    }
    if (!plantDetails.careDifficulty) {
      newErrors.careDifficulty = t("seller.products.newPlant.careDifficultyRequired");
    }

    // Variants
    if (variants.length === 0) {
      newErrors.variants = t("seller.products.newPlant.atLeastOneVariant");
    }

    let baseCount = 0;
    variants.forEach((v, i) => {
      if (v.isBase) baseCount++;
      if (v.price === "" || v.price <= 0) {
        newErrors[`variants.${i}.price`] = t("seller.products.newPlant.priceRequired");
      }
    });

    if (variants.length > 1 && baseCount !== 1) {
      newErrors.baseVariant = t("seller.products.newPlant.exactlyOneBase");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---- Submission ----
  const handleSubmit = async (saveAsDraft: boolean) => {
    setSubmitStatus(null);

    if (!validate()) {
      toaster.error(t("seller.setupShop.pleaseFixErrors"));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        slug: slug().trim() || undefined,
        thumbnailId: thumbnailUpload.mediaId()!,
        status: saveAsDraft ? "DRAFT" : status(),
        translations: [
          {
            locale: "en" as const,
            name: translations.en.name.trim(),
            shortDescription: translations.en.shortDescription.trim() || undefined,
            description: translations.en.description.trim(),
          },
          {
            locale: "bn" as const,
            name: translations.bn.name.trim(),
            shortDescription: translations.bn.shortDescription.trim() || undefined,
            description: translations.bn.description.trim(),
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
        },
        enDetails: {
          locale: "en" as const,
          commonNames: enDetails.commonNames.trim() || undefined,
          origin: enDetails.origin.trim() || undefined,
          soilType: enDetails.soilType.trim() || undefined,
          toxicityInfo: enDetails.toxicityInfo.trim() || undefined,
        },
        bnDetails: {
          locale: "bn" as const,
          commonNames: bnDetails.commonNames.trim() || undefined,
          origin: bnDetails.origin.trim() || undefined,
          soilType: bnDetails.soilType.trim() || undefined,
          toxicityInfo: bnDetails.toxicityInfo.trim() || undefined,
        },
        variants: variants.map((v) => ({
          sku: v.sku.trim() || undefined,
          price: typeof v.price === "number" ? v.price : 0,
          salePrice: typeof v.salePrice === "number" && v.salePrice > 0 ? v.salePrice : undefined,
          costPrice: typeof v.costPrice === "number" && v.costPrice > 0 ? v.costPrice : undefined,
          inventoryCount: typeof v.inventoryCount === "number" ? v.inventoryCount : undefined,
          trackInventory: v.trackInventory,
          lowStockThreshold: typeof v.lowStockThreshold === "number" ? v.lowStockThreshold : undefined,
          isBase: v.isBase,
          isActive: v.isActive,
          mediaIds: v.mediaIds.length > 0 ? v.mediaIds : undefined,
          plantAttributes: {
            potSize: v.potSize.trim() || undefined,
            potSizeInches: typeof v.potSizeInches === "number" ? v.potSizeInches : undefined,
            potMaterial: v.potMaterial.trim() || undefined,
            potColor: v.potColor.trim() || undefined,
            potType: v.potType.trim() || undefined,
            growthStage: v.growthStage || undefined,
            plantForm: v.plantForm.trim() || undefined,
            variegation: v.variegation.trim() || undefined,
            propagationType: v.propagationType.trim() || undefined,
            containerType: v.containerType.trim() || undefined,
            bundleType: v.bundleType.trim() || undefined,
          },
        })),
        careInstructions:
          careInstructions.lightInstructions ||
          careInstructions.wateringInstructions ||
          careInstructions.humidityInstructions ||
          careInstructions.fertilizerSchedule ||
          careInstructions.repottingFrequency ||
          careInstructions.pruningNotes ||
          careInstructions.commonProblems ||
          careInstructions.seasonalCare
            ? { ...careInstructions }
            : undefined,
        careTranslations: [
          {
            locale: "en" as const,
            ...careTranslations.en,
          },
          {
            locale: "bn" as const,
            ...careTranslations.bn,
          },
        ],
      };

      // TODO: Replace with actual API call
      // await plantsApi.create(payload);

      console.log("Plant payload (not sent - no API):", JSON.stringify(payload, null, 2));

      setSubmitStatus("success");
      toaster.success(t("seller.products.newPlant.plantCreated"));

      // Reset form
      setTimeout(() => {
        setTranslations("en", { name: "", shortDescription: "", description: "" });
        setTranslations("bn", { name: "", shortDescription: "", description: "" });
        setPlantDetails({
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
        });
        setEnDetails({ commonNames: "", origin: "", soilType: "", toxicityInfo: "" });
        setBnDetails({ commonNames: "", origin: "", soilType: "", toxicityInfo: "" });
        setVariants([createEmptyVariant()]);
        thumbnailUpload.clear();
        setSlug("");
        setIsSlugManual(false);
      }, 1500);
    } catch (err) {
      setSubmitStatus("error");
      toaster.error(t("seller.products.newPlant.createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Computed ----
  const hasEnglishContent = createMemo(
    () =>
      translations.en.name.trim().length > 0 &&
      translations.en.description.trim().length >= 50
  );

  const hasBengaliContent = createMemo(
    () =>
      translations.bn.name.trim().length > 0 &&
      translations.bn.description.trim().length >= 50
  );

  return (
    <div class="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <A
            href="/app/seller/products/plants"
            class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-forest-700 transition-colors"
            aria-label={t("seller.products.newPlant.backToPlants")}
          >
            <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </A>
          <div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
                <SunIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                  {t("seller.products.newPlant.pageTitle")}
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {t("seller.products.newPlant.pageSubtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      <Show when={submitStatus() === "success"}>
        <div class="bg-forest-50 dark:bg-forest-900/30 border border-forest-200 dark:border-forest-700 rounded-xl p-4 flex items-center gap-3">
          <CheckCircleIcon class="w-5 h-5 text-forest-600 dark:text-forest-400 flex-shrink-0" />
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
        class="space-y-6"
        noValidate
      >
        {/* Section 1: Identity & Photos */}
        <SectionCard
          icon={PackageIcon}
          title={t("seller.products.newPlant.identitySection")}
          description={t("seller.products.newPlant.identitySectionDesc")}
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Upload */}
            <div>
              <ImageUpload
                preview={thumbnailUpload.preview()}
                isUploading={thumbnailUpload.isUploading()}
                isDeleting={thumbnailUpload.isDeleting()}
                onFileSelect={thumbnailUpload.upload}
                onDelete={thumbnailUpload.deleteMedia}
                label={t("seller.products.newPlant.thumbnailLabel")}
                description={t("seller.products.newPlant.thumbnailDesc")}
              />
              <Show when={errors()["thumbnail"]}>
                <p class="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                  {errors()["thumbnail"]}
                </p>
              </Show>
            </div>

            {/* Status & Slug */}
            <div class="space-y-4">
              <Select
                label={t("seller.products.newPlant.statusLabel")}
                options={STATUS_OPTIONS}
                value={status()}
                onChange={(e) => setStatus(e.currentTarget.value as PlantStatus)}
                placeholder={t("seller.products.newPlant.statusLabel")}
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {t("seller.products.newPlant.statusHint")}
              </p>

              <div class="bg-cream-50 dark:bg-forest-800/50 rounded-lg p-4 border border-cream-200 dark:border-forest-700">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  URL Slug
                  <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                </label>
                <div class="flex rounded-lg">
                  <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-forest-700/70 dark:text-gray-400 text-xs">
                    byteforge.com/plants/
                  </span>
                  <input
                    type="text"
                    value={slug()}
                    onInput={(e) => {
                      setSlug((e.currentTarget as HTMLInputElement).value);
                      setIsSlugManual(true);
                    }}
                    placeholder="monstera-deliciosa"
                    class={`flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm ${
                      errors()["slug"] ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                </div>
                <Show when={errors()["slug"]}>
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                    {errors()["slug"]}
                  </p>
                </Show>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("seller.products.newPlant.slugHint")}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 2: Bilingual Names & Descriptions */}
        <SectionCard
          icon={BoltIcon}
          title={t("seller.products.newPlant.namesAndDescriptions")}
          description={t("seller.products.newPlant.namesAndDescriptionsDesc")}
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English Column */}
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">🇬🇧</span>
                <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                  English
                </h4>
                <div class="ml-auto">
                  <Show when={hasEnglishContent()}>
                    <CheckCircleIcon class="w-5 h-5 text-forest-500" />
                  </Show>
                </div>
              </div>

              <InputField
                id="en-name"
                label={t("seller.products.newPlant.plantNameLabel")}
                required
                placeholder={t("seller.products.newPlant.plantNamePlaceholder")}
                value={translations.en.name}
                onInput={(v) => setTranslations("en", "name", v)}
                error={errors()["en.name"]}
                maxLen={255}
                hint={t("seller.products.newPlant.plantNameHint")}
              />

              <InputField
                id="en-short-desc"
                label={t("seller.products.newPlant.shortSummaryLabel")}
                placeholder={t("seller.products.newPlant.shortSummaryPlaceholder")}
                value={translations.en.shortDescription}
                onInput={(v) => setTranslations("en", "shortDescription", v)}
                error={errors()["en.shortDescription"]}
                maxLen={500}
                textarea
                rows={2}
                hint={t("seller.products.newPlant.shortSummaryHint")}
              />

              <InputField
                id="en-description"
                label={t("seller.products.newPlant.detailedDescriptionLabel")}
                required
                placeholder={t("seller.products.newPlant.descriptionPlaceholder")}
                value={translations.en.description}
                onInput={(v) => setTranslations("en", "description", v)}
                error={errors()["en.description"]}
                textarea
                rows={5}
                hint={t("seller.products.newPlant.descriptionHint")}
              />
            </div>

            {/* Bengali Column */}
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">🇧🇩</span>
                <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                  বাংলা
                </h4>
                <div class="ml-auto">
                  <Show when={hasBengaliContent()}>
                    <CheckCircleIcon class="w-5 h-5 text-forest-500" />
                  </Show>
                </div>
              </div>

              <InputField
                id="bn-name"
                label={t("seller.products.newPlant.plantNameLabel")}
                required
                placeholder={t("seller.products.newPlant.plantNameBnPlaceholder")}
                value={translations.bn.name}
                onInput={(v) => setTranslations("bn", "name", v)}
                error={errors()["bn.name"]}
                dir="auto"
                maxLen={255}
                hint={t("seller.products.newPlant.plantNameHint")}
              />

              <InputField
                id="bn-short-desc"
                label={t("seller.products.newPlant.shortSummaryLabel")}
                placeholder={t("seller.products.newPlant.shortSummaryBnPlaceholder")}
                value={translations.bn.shortDescription}
                onInput={(v) => setTranslations("bn", "shortDescription", v)}
                error={errors()["bn.shortDescription"]}
                dir="auto"
                maxLen={500}
                textarea
                rows={2}
                hint={t("seller.products.newPlant.shortSummaryHint")}
              />

              <InputField
                id="bn-description"
                label={t("seller.products.newPlant.detailedDescriptionLabel")}
                required
                placeholder={t("seller.products.newPlant.descriptionBnPlaceholder")}
                value={translations.bn.description}
                onInput={(v) => setTranslations("bn", "description", v)}
                error={errors()["bn.description"]}
                dir="auto"
                textarea
                rows={5}
                hint={t("seller.products.newPlant.descriptionHint")}
              />
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Plant Characteristics */}
        <SectionCard
          icon={SunIcon}
          title={t("seller.products.newPlant.characteristics")}
          description={t("seller.products.newPlant.characteristicsDesc")}
          collapsible
        >
          <div class="space-y-6">
            {/* Category & Tags */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label={t("seller.products.newPlant.categoryLabel")}
                options={CATEGORY_OPTIONS}
                value={plantDetails.categoryId}
                onChange={(e) => setPlantDetails("categoryId", e.currentTarget.value)}
                placeholder={t("seller.products.newPlant.categoryPlaceholder")}
                error={errors()["categoryId"]}
              />
              <div>
                <p class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("seller.products.newPlant.tagsLabel")}
                  <span class="text-gray-400 ml-1">({t("common.optional")})</span>
                </p>
                <TagMultiSelect
                  selectedTags={plantDetails.tagIds}
                  onToggle={toggleTag}
                  groups={TAG_GROUPS}
                  placeholder={t("seller.products.newPlant.tagsPlaceholder")}
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("seller.products.newPlant.tagsHint")}
                </p>
              </div>
            </div>

            {/* Required care fields */}
            <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t("seller.products.newPlant.careRequirements")}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select
                  label={t("seller.products.newPlant.lightRequirementLabel")}
                  options={LIGHT_OPTIONS}
                  value={plantDetails.lightRequirement}
                  onChange={(e) => setPlantDetails("lightRequirement", e.currentTarget.value)}
                  placeholder={t("seller.products.newPlant.lightRequirementPlaceholder")}
                  error={errors()["lightRequirement"]}
                />
                <Select
                  label={t("seller.products.newPlant.wateringFrequencyLabel")}
                  options={WATERING_OPTIONS}
                  value={plantDetails.wateringFrequency}
                  onChange={(e) => setPlantDetails("wateringFrequency", e.currentTarget.value)}
                  placeholder={t("seller.products.newPlant.wateringFrequencyPlaceholder")}
                  error={errors()["wateringFrequency"]}
                />
                <Select
                  label={t("seller.products.newPlant.humidityLevelLabel")}
                  options={HUMIDITY_OPTIONS}
                  value={plantDetails.humidityLevel}
                  onChange={(e) => setPlantDetails("humidityLevel", e.currentTarget.value)}
                  placeholder={t("seller.products.newPlant.humidityLevelPlaceholder")}
                  error={errors()["humidityLevel"]}
                />
                <Select
                  label={t("seller.products.newPlant.careDifficultyLabel")}
                  options={CARE_DIFFICULTY_OPTIONS}
                  value={plantDetails.careDifficulty}
                  onChange={(e) => setPlantDetails("careDifficulty", e.currentTarget.value)}
                  placeholder={t("seller.products.newPlant.careDifficultyPlaceholder")}
                  error={errors()["careDifficulty"]}
                />
                <Select
                  label={t("seller.products.newPlant.growthRateLabel")}
                  options={GROWTH_RATE_OPTIONS}
                  value={plantDetails.growthRate}
                  onChange={(e) => setPlantDetails("growthRate", e.currentTarget.value)}
                  placeholder={t("seller.products.newPlant.growthRatePlaceholder")}
                />
              </div>
            </div>

            {/* Botanical info */}
            <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t("seller.products.newPlant.botanicalInfo")}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  id="scientific-name"
                  label={t("seller.products.newPlant.scientificNameLabel")}
                  placeholder={t("seller.products.newPlant.scientificNamePlaceholder")}
                  value={plantDetails.scientificName}
                  onInput={(v) => setPlantDetails("scientificName", v)}
                  hint={t("seller.products.newPlant.scientificNameHint")}
                />
                <InputField
                  id="temperature-range"
                  label={t("seller.products.newPlant.temperatureRangeLabel")}
                  placeholder={t("seller.products.newPlant.temperatureRangePlaceholder")}
                  value={plantDetails.temperatureRange}
                  onInput={(v) => setPlantDetails("temperatureRange", v)}
                  hint={t("seller.products.newPlant.temperatureRangeHint")}
                />
                <InputField
                  id="mature-height"
                  label={t("seller.products.newPlant.matureHeightLabel")}
                  placeholder={t("seller.products.newPlant.matureHeightPlaceholder")}
                  value={plantDetails.matureHeight}
                  onInput={(v) => setPlantDetails("matureHeight", v)}
                  hint={t("seller.products.newPlant.matureHeightHint")}
                />
                <InputField
                  id="mature-spread"
                  label={t("seller.products.newPlant.matureSpreadLabel")}
                  placeholder={t("seller.products.newPlant.matureSpreadPlaceholder")}
                  value={plantDetails.matureSpread}
                  onInput={(v) => setPlantDetails("matureSpread", v)}
                  hint={t("seller.products.newPlant.matureSpreadHint")}
                />
              </div>
            </div>

            {/* EN/BN Plant Details Translations */}
            <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-4">
                {t("seller.products.newPlant.localizedDetails")}
              </h4>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* EN Details */}
                <div class="space-y-3">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    English
                  </p>
                  <InputField
                    id="en-common-names"
                    label={t("seller.products.newPlant.commonNamesLabel")}
                    placeholder={t("seller.products.newPlant.commonNamesPlaceholder")}
                    value={enDetails.commonNames}
                    onInput={(v) => setEnDetails("commonNames", v)}
                  />
                  <InputField
                    id="en-origin"
                    label={t("seller.products.newPlant.originLabel")}
                    placeholder={t("seller.products.newPlant.originPlaceholder")}
                    value={enDetails.origin}
                    onInput={(v) => setEnDetails("origin", v)}
                  />
                  <InputField
                    id="en-soil-type"
                    label={t("seller.products.newPlant.soilTypeLabel")}
                    placeholder={t("seller.products.newPlant.soilTypePlaceholder")}
                    value={enDetails.soilType}
                    onInput={(v) => setEnDetails("soilType", v)}
                  />
                  <InputField
                    id="en-toxicity"
                    label={t("seller.products.newPlant.toxicityInfoLabel")}
                    placeholder={t("seller.products.newPlant.toxicityInfoPlaceholder")}
                    value={enDetails.toxicityInfo}
                    onInput={(v) => setEnDetails("toxicityInfo", v)}
                    hint={t("seller.products.newPlant.toxicityInfoHint")}
                  />
                </div>

                {/* BN Details */}
                <div class="space-y-3">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    বাংলা
                  </p>
                  <InputField
                    id="bn-common-names"
                    label={t("seller.products.newPlant.commonNamesLabel")}
                    placeholder={t("seller.products.newPlant.commonNamesBnPlaceholder")}
                    value={bnDetails.commonNames}
                    onInput={(v) => setBnDetails("commonNames", v)}
                    dir="auto"
                  />
                  <InputField
                    id="bn-origin"
                    label={t("seller.products.newPlant.originLabel")}
                    placeholder={t("seller.products.newPlant.originBnPlaceholder")}
                    value={bnDetails.origin}
                    onInput={(v) => setBnDetails("origin", v)}
                    dir="auto"
                  />
                  <InputField
                    id="bn-soil-type"
                    label={t("seller.products.newPlant.soilTypeLabel")}
                    placeholder={t("seller.products.newPlant.soilTypeBnPlaceholder")}
                    value={bnDetails.soilType}
                    onInput={(v) => setBnDetails("soilType", v)}
                    dir="auto"
                  />
                  <InputField
                    id="bn-toxicity"
                    label={t("seller.products.newPlant.toxicityInfoLabel")}
                    placeholder={t("seller.products.newPlant.toxicityInfoBnPlaceholder")}
                    value={bnDetails.toxicityInfo}
                    onInput={(v) => setBnDetails("toxicityInfo", v)}
                    dir="auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 4: Pricing & Variants */}
        <SectionCard
          icon={BoltIcon}
          title={t("seller.products.newPlant.variants")}
          description={t("seller.products.newPlant.variantsDesc")}
          collapsible
        >
          <div class="space-y-6">
            <Show when={errors()["variants"]}>
              <p class="text-sm text-red-600 dark:text-red-400 font-medium">
                {errors()["variants"]}
              </p>
            </Show>
            <Show when={errors()["baseVariant"]}>
              <p class="text-sm text-red-600 dark:text-red-400 font-medium">
                {errors()["baseVariant"]}
              </p>
            </Show>

            <For each={variants}>
              {(variant, index) => (
                <div class="border border-cream-200 dark:border-forest-700 rounded-xl overflow-hidden">
                  <div class="bg-cream-50 dark:bg-forest-800/50 px-4 py-3 flex items-center justify-between border-b border-cream-200 dark:border-forest-700">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                        {t("seller.products.newPlant.variantTitle")} #{index() + 1}
                      </span>
                      <Show when={variant.isBase}>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-200 font-medium">
                          Base
                        </span>
                      </Show>
                    </div>
                    <Show when={variants.length > 1}>
                      <button
                        type="button"
                        onClick={() => removeVariant(index())}
                        class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label={t("seller.products.newPlant.removeVariant")}
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </Show>
                  </div>

                  <div class="p-4 space-y-4">
                    {/* Pricing row */}
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <NumberField
                        id={`variant-${index()}-price`}
                        label={t("seller.products.newPlant.priceLabel")}
                        required
                        placeholder={t("seller.products.newPlant.pricePlaceholder")}
                        value={variant.price}
                        onInput={(v) => setVariants(index(), "price", v)}
                        error={errors()[`variants.${index()}.price`]}
                        min={0}
                      />
                      <NumberField
                        id={`variant-${index()}-sale-price`}
                        label={t("seller.products.newPlant.salePriceLabel")}
                        placeholder={t("seller.products.newPlant.salePricePlaceholder")}
                        value={variant.salePrice}
                        onInput={(v) => setVariants(index(), "salePrice", v)}
                        min={0}
                      />
                      <NumberField
                        id={`variant-${index()}-cost-price`}
                        label={t("seller.products.newPlant.costPriceLabel")}
                        placeholder={t("seller.products.newPlant.costPricePlaceholder")}
                        value={variant.costPrice}
                        onInput={(v) => setVariants(index(), "costPrice", v)}
                        min={0}
                      />
                      <NumberField
                        id={`variant-${index()}-inventory`}
                        label={t("seller.products.newPlant.inventoryCountLabel")}
                        placeholder={t("seller.products.newPlant.inventoryCountPlaceholder")}
                        value={variant.inventoryCount}
                        onInput={(v) => setVariants(index(), "inventoryCount", v)}
                        min={0}
                      />
                    </div>

                    {/* SKU */}
                    <InputField
                      id={`variant-${index()}-sku`}
                      label={t("seller.products.newPlant.skuLabel")}
                      placeholder={t("seller.products.newPlant.skuPlaceholder")}
                      value={variant.sku}
                      onInput={(v) => setVariants(index(), "sku", v)}
                    />

                    {/* Variant images */}
                    <VariantImageUpload
                      variantIndex={index()}
                      mediaIds={variant.mediaIds}
                      onAdd={(mediaId) => setVariants(index(), "mediaIds", [...variant.mediaIds, mediaId])}
                      onRemove={(idx) => setVariants(index(), "mediaIds", variant.mediaIds.filter((_, i) => i !== idx))}
                    />

                    {/* Checkboxes */}
                    <div class="flex flex-wrap gap-6">
                      <CheckboxField
                        id={`variant-${index()}-track`}
                        label={t("seller.products.newPlant.trackInventoryLabel")}
                        checked={variant.trackInventory}
                        onChange={(v) => setVariants(index(), "trackInventory", v)}
                      />
                      <CheckboxField
                        id={`variant-${index()}-base`}
                        label={t("seller.products.newPlant.isBaseLabel")}
                        checked={variant.isBase}
                        onChange={(v) => setVariants(index(), "isBase", v)}
                      />
                      <CheckboxField
                        id={`variant-${index()}-active`}
                        label={t("seller.products.newPlant.isActiveLabel")}
                        checked={variant.isActive}
                        onChange={(v) => setVariants(index(), "isActive", v)}
                      />
                    </div>

                    {/* Low stock threshold */}
                    <Show when={variant.trackInventory}>
                      <NumberField
                        id={`variant-${index()}-low-stock`}
                        label={t("seller.products.newPlant.lowStockThresholdLabel")}
                        placeholder={t("seller.products.newPlant.lowStockThresholdPlaceholder")}
                        value={variant.lowStockThreshold}
                        onInput={(v) => setVariants(index(), "lowStockThreshold", v)}
                        min={0}
                      />
                    </Show>

                    {/* Plant Attributes (collapsible) */}
                    <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
                      <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {t("seller.products.newPlant.plantAttributes")}
                      </h5>
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <InputField
                          id={`variant-${index()}-pot-size`}
                          label={t("seller.products.newPlant.potSizeLabel")}
                          placeholder={t("seller.products.newPlant.potSizePlaceholder")}
                          value={variant.potSize}
                          onInput={(v) => setVariants(index(), "potSize", v)}
                        />
                        <NumberField
                          id={`variant-${index()}-pot-inches`}
                          label={t("seller.products.newPlant.potSizeInchesLabel")}
                          placeholder={t("seller.products.newPlant.potSizeInchesPlaceholder")}
                          value={variant.potSizeInches}
                          onInput={(v) => setVariants(index(), "potSizeInches", v)}
                          min={0.5}
                        />
                        <InputField
                          id={`variant-${index()}-pot-material`}
                          label={t("seller.products.newPlant.potMaterialLabel")}
                          placeholder={t("seller.products.newPlant.potMaterialPlaceholder")}
                          value={variant.potMaterial}
                          onInput={(v) => setVariants(index(), "potMaterial", v)}
                        />
                        <InputField
                          id={`variant-${index()}-pot-color`}
                          label={t("seller.products.newPlant.potColorLabel")}
                          placeholder={t("seller.products.newPlant.potColorPlaceholder")}
                          value={variant.potColor}
                          onInput={(v) => setVariants(index(), "potColor", v)}
                        />
                        <InputField
                          id={`variant-${index()}-pot-type`}
                          label={t("seller.products.newPlant.potTypeLabel")}
                          placeholder={t("seller.products.newPlant.potTypePlaceholder")}
                          value={variant.potType}
                          onInput={(v) => setVariants(index(), "potType", v)}
                        />
                        <Select
                          label={t("seller.products.newPlant.growthStageLabel")}
                          options={GROWTH_STAGE_OPTIONS}
                          value={variant.growthStage}
                          onChange={(e) => setVariants(index(), "growthStage", e.currentTarget.value)}
                          placeholder={t("seller.products.newPlant.growthStagePlaceholder")}
                        />
                        <InputField
                          id={`variant-${index()}-plant-form`}
                          label={t("seller.products.newPlant.plantFormLabel")}
                          placeholder={t("seller.products.newPlant.plantFormPlaceholder")}
                          value={variant.plantForm}
                          onInput={(v) => setVariants(index(), "plantForm", v)}
                        />
                        <InputField
                          id={`variant-${index()}-variegation`}
                          label={t("seller.products.newPlant.variegationLabel")}
                          placeholder={t("seller.products.newPlant.variegationPlaceholder")}
                          value={variant.variegation}
                          onInput={(v) => setVariants(index(), "variegation", v)}
                        />
                        <InputField
                          id={`variant-${index()}-propagation`}
                          label={t("seller.products.newPlant.propagationTypeLabel")}
                          placeholder={t("seller.products.newPlant.propagationTypePlaceholder")}
                          value={variant.propagationType}
                          onInput={(v) => setVariants(index(), "propagationType", v)}
                        />
                        <InputField
                          id={`variant-${index()}-container`}
                          label={t("seller.products.newPlant.containerTypeLabel")}
                          placeholder={t("seller.products.newPlant.containerTypePlaceholder")}
                          value={variant.containerType}
                          onInput={(v) => setVariants(index(), "containerType", v)}
                        />
                        <InputField
                          id={`variant-${index()}-bundle`}
                          label={t("seller.products.newPlant.bundleTypeLabel")}
                          placeholder={t("seller.products.newPlant.bundleTypePlaceholder")}
                          value={variant.bundleType}
                          onInput={(v) => setVariants(index(), "bundleType", v)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>

            <button
              type="button"
              onClick={addVariant}
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-cream-300 dark:border-forest-600 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-forest-500 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-800/30 transition-colors"
            >
              <PlusIcon class="w-4 h-4" />
              {t("seller.products.newPlant.addVariant")}
            </button>
          </div>
        </SectionCard>

        {/* Section 5: Care Guide (Optional) */}
        <SectionCard
          icon={ClipboardListIcon}
          title={t("seller.products.newPlant.careInstructions")}
          description={t("seller.products.newPlant.careInstructionsDesc")}
          collapsible
          defaultOpen={false}
        >
          <div class="space-y-6">
            {/* General Care Instructions */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="care-light"
                label={t("seller.products.newPlant.lightInstructionsLabel")}
                placeholder={t("seller.products.newPlant.lightInstructionsPlaceholder")}
                value={careInstructions.lightInstructions}
                onInput={(v) => setCareInstructions("lightInstructions", v)}
                textarea
                rows={3}
              />
              <InputField
                id="care-watering"
                label={t("seller.products.newPlant.wateringInstructionsLabel")}
                placeholder={t("seller.products.newPlant.wateringInstructionsPlaceholder")}
                value={careInstructions.wateringInstructions}
                onInput={(v) => setCareInstructions("wateringInstructions", v)}
                textarea
                rows={3}
              />
              <InputField
                id="care-humidity"
                label={t("seller.products.newPlant.humidityInstructionsLabel")}
                placeholder={t("seller.products.newPlant.humidityInstructionsPlaceholder")}
                value={careInstructions.humidityInstructions}
                onInput={(v) => setCareInstructions("humidityInstructions", v)}
                textarea
                rows={3}
              />
              <InputField
                id="care-fertilizer"
                label={t("seller.products.newPlant.fertilizerScheduleLabel")}
                placeholder={t("seller.products.newPlant.fertilizerSchedulePlaceholder")}
                value={careInstructions.fertilizerSchedule}
                onInput={(v) => setCareInstructions("fertilizerSchedule", v)}
                textarea
                rows={3}
              />
              <InputField
                id="care-repotting"
                label={t("seller.products.newPlant.repottingFrequencyLabel")}
                placeholder={t("seller.products.newPlant.repottingFrequencyPlaceholder")}
                value={careInstructions.repottingFrequency}
                onInput={(v) => setCareInstructions("repottingFrequency", v)}
                textarea
                rows={3}
              />
              <InputField
                id="care-pruning"
                label={t("seller.products.newPlant.pruningNotesLabel")}
                placeholder={t("seller.products.newPlant.pruningNotesPlaceholder")}
                value={careInstructions.pruningNotes}
                onInput={(v) => setCareInstructions("pruningNotes", v)}
                textarea
                rows={3}
              />
              <InputField
                id="care-problems"
                label={t("seller.products.newPlant.commonProblemsLabel")}
                placeholder={t("seller.products.newPlant.commonProblemsPlaceholder")}
                value={careInstructions.commonProblems}
                onInput={(v) => setCareInstructions("commonProblems", v)}
                textarea
                rows={3}
              />
              <InputField
                id="care-seasonal"
                label={t("seller.products.newPlant.seasonalCareLabel")}
                placeholder={t("seller.products.newPlant.seasonalCarePlaceholder")}
                value={careInstructions.seasonalCare}
                onInput={(v) => setCareInstructions("seasonalCare", v)}
                textarea
                rows={3}
              />
            </div>

            {/* Care Translations */}
            <div class="border-t border-cream-200 dark:border-forest-700 pt-6">
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-4">
                {t("seller.products.newPlant.careTranslationsTitle")}
              </h4>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* EN Care */}
                <div class="space-y-3">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    English Care
                  </p>
                  <InputField
                    id="care-en-light"
                    label={t("seller.products.newPlant.lightInstructionsLabel")}
                    placeholder={t("seller.products.newPlant.lightInstructionsPlaceholder")}
                    value={careTranslations.en.lightInstructions}
                    onInput={(v) => setCareTranslations("en", "lightInstructions", v)}
                    textarea
                    rows={2}
                  />
                  <InputField
                    id="care-en-watering"
                    label={t("seller.products.newPlant.wateringInstructionsLabel")}
                    placeholder={t("seller.products.newPlant.wateringInstructionsPlaceholder")}
                    value={careTranslations.en.wateringInstructions}
                    onInput={(v) => setCareTranslations("en", "wateringInstructions", v)}
                    textarea
                    rows={2}
                  />
                  <InputField
                    id="care-en-humidity"
                    label={t("seller.products.newPlant.humidityInstructionsLabel")}
                    placeholder={t("seller.products.newPlant.humidityInstructionsPlaceholder")}
                    value={careTranslations.en.humidityInstructions}
                    onInput={(v) => setCareTranslations("en", "humidityInstructions", v)}
                    textarea
                    rows={2}
                  />
                </div>

                {/* BN Care */}
                <div class="space-y-3">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    বাংলা যত্ন
                  </p>
                  <InputField
                    id="care-bn-light"
                    label={t("seller.products.newPlant.lightInstructionsLabel")}
                    placeholder={t("seller.products.newPlant.lightInstructionsBnPlaceholder")}
                    value={careTranslations.bn.lightInstructions}
                    onInput={(v) => setCareTranslations("bn", "lightInstructions", v)}
                    dir="auto"
                    textarea
                    rows={2}
                  />
                  <InputField
                    id="care-bn-watering"
                    label={t("seller.products.newPlant.wateringInstructionsLabel")}
                    placeholder={t("seller.products.newPlant.wateringInstructionsBnPlaceholder")}
                    value={careTranslations.bn.wateringInstructions}
                    onInput={(v) => setCareTranslations("bn", "wateringInstructions", v)}
                    dir="auto"
                    textarea
                    rows={2}
                  />
                  <InputField
                    id="care-bn-humidity"
                    label={t("seller.products.newPlant.humidityInstructionsLabel")}
                    placeholder={t("seller.products.newPlant.humidityInstructionsBnPlaceholder")}
                    value={careTranslations.bn.humidityInstructions}
                    onInput={(v) => setCareTranslations("bn", "humidityInstructions", v)}
                    dir="auto"
                    textarea
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Submit Buttons */}
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            class="flex-1 sm:flex-none"
            disabled={isSubmitting()}
            onClick={() => window.history.back()}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            class="flex-1 sm:flex-none"
            disabled={isSubmitting()}
            loading={isSubmitting()}
            onClick={() => handleSubmit(true)}
          >
            {isSubmitting() ? t("seller.products.newPlant.saving") : t("seller.products.newPlant.submitDraft")}
          </Button>
          <Button
            type="submit"
            variant="accent"
            class="flex-1 sm:flex-none"
            disabled={isSubmitting()}
            loading={isSubmitting()}
          >
            {isSubmitting() ? t("seller.products.newPlant.creating") : t("seller.products.newPlant.submitActive")}
          </Button>
        </div>
      </form>
    </div>
  );
}
