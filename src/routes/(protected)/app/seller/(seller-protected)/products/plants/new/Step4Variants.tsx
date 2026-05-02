import { createEffect, Show, For, createSignal } from "solid-js";
import { PlusIcon, TrashIcon, ClipboardDocumentIcon } from "~/components/icons";
import { Select, type SelectOption } from "~/components/ui/Select";
import Input from "~/components/ui/Input";
import { mediaApi } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";

function CheckboxField(props: {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label for={props.id} class="flex items-center gap-2.5 cursor-pointer group">
      <div class="relative">
        <input
          type="checkbox"
          id={props.id}
          checked={props.checked}
          disabled={props.disabled}
          onChange={(e) => props.onChange((e.target as HTMLInputElement).checked)}
          class="sr-only peer"
        />
        <div class={`w-5 h-5 rounded border-2 border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-900/30 peer-checked:bg-forest-600 peer-checked:border-forest-600 transition-colors flex items-center justify-center ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

export interface VariantStore {
  sku: string;
  price: number | "";
  inventoryCount: number | "";
  trackInventory: boolean;
  lowStockThreshold: number | "";
  isBase: boolean;
  isActive: boolean;
  mediaIds: string[];
  mediaUrls: string[];
  growthStage: string;
  plantForm: string;
  variegation: string;
  leafDensity: string;
  stemCount: number | "";
  currentHeight: string;
  currentSpread: string;
  propagationType: string;
  containerType: string;
  containerSize: string;
  bundleType: string;
}

function VariantImageUpload(props: {
  variantIndex: number;
  mediaIds: string[];
  mediaUrls: string[];
  setVariants: (fn: (v: VariantStore[]) => VariantStore[]) => void;
  t: (key: string) => string;
}) {
  const [isUploading, setIsUploading] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);

  const handleUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toaster.error(props.t("seller.products.newPlant.imageSizeError"));
      return;
    }
    setIsUploading(true);
    try {
      const response = await mediaApi.upload(file);
      props.setVariants(v => v.map((item, i) => i === props.variantIndex ? {
        ...item,
        mediaIds: [...item.mediaIds, response.id],
        mediaUrls: [...item.mediaUrls, response.url]
      } : item));
      toaster.success(props.t("seller.products.newPlant.imageUploaded"));
    } catch (err: any) {
      toaster.error(err.message || props.t("seller.products.newPlant.imageUploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (idx: number) => {
    const id = props.mediaIds[idx];
    if (!id) return;
    setIsDeleting(true);
    try {
      await mediaApi.delete(id);
      props.setVariants(v => v.map((item, i) => i === props.variantIndex ? {
        ...item,
        mediaIds: item.mediaIds.filter((_, j) => j !== idx),
        mediaUrls: item.mediaUrls.filter((_, j) => j !== idx)
      } : item));
    } catch (err: any) {
      toaster.error(err.message || props.t("seller.products.newPlant.imageDeleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {props.t("seller.products.newPlant.variantImagesLabel").replace("{count}", String(props.mediaIds.length))}
        </p>
        <Show when={props.mediaIds.length >= 10}>
          <span class="text-xs text-amber-600 dark:text-amber-400">
            {props.t("seller.products.newPlant.imageLimitReached") || "Maximum 10 images reached"}
          </span>
        </Show>
      </div>
      <Show when={props.mediaIds.length > 0}>
        <div class="flex flex-wrap gap-2 mb-3">
          <For each={props.mediaUrls}>
            {(url, idx) => (
              <div class="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-cream-200 dark:border-forest-700 group">
                <img src={url} alt={props.t("seller.products.newPlant.variantImageAlt").replace("{n}", String(idx() + 1))} class="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDelete(idx())}
                  disabled={isDeleting()}
                  class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting() ? "…" : "×"}
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={props.mediaIds.length < 10}>
        <div class="relative">
          <input
            type="file"
            accept="image/*"
            disabled={isUploading()}
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) handleUpload(file);
              e.currentTarget.value = "";
            }}
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div class="flex items-center justify-center px-4 py-3 border-2 border-dashed border-cream-200 dark:border-forest-700 rounded-lg bg-white dark:bg-forest-900/30 hover:border-terracotta-500 dark:hover:border-terracotta-400 transition-colors">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {isUploading() ? props.t("seller.products.newPlant.imageUploading") : props.t("seller.products.newPlant.imageUploadPrompt")}
            </p>
          </div>
        </div>
      </Show>
    </div>
  );
}

function AttributeFieldset(props: {
  title: string;
  emoji: string;
  children: any;
}) {
  return (
    <fieldset class="border border-cream-200 dark:border-forest-700 rounded-lg p-4">
      <legend class="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
        {props.emoji} {props.title}
      </legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
        {props.children}
      </div>
    </fieldset>
  );
}

export function Step4Variants(props: {
  variants: VariantStore[];
  setVariants: (fn: (v: VariantStore[]) => VariantStore[]) => void;
  addVariant: () => void;
  duplicateVariant: (index: number) => void;
  removeVariant: (index: number) => void;
  errors: Record<string, string>;
  growthStageOptions: SelectOption[];
  plantFormOptions: SelectOption[];
  variegationOptions: SelectOption[];
  leafDensityOptions: SelectOption[];
  propagationTypeOptions: SelectOption[];
  containerTypeOptions: SelectOption[];
  t: (key: string) => string;
  onWarningChange: (hasWarning: boolean, missingFields: string[]) => void;
}) {
  createEffect(() => {
    const missing: string[] = [];
    if (props.variants.length === 0) {
      missing.push(props.t("seller.products.newPlant.atLeastOneVariant"));
    }
    props.variants.forEach((v, i) => {
      if (v.price === "" || v.price <= 0) {
        missing.push(`${props.t("seller.products.newPlant.variantTitle")} #${i + 1}: ${props.t("seller.products.newPlant.priceRequired")}`);
      }
    });
    if (props.variants.length > 1) {
      const baseCount = props.variants.filter(v => v.isBase).length;
      if (baseCount !== 1) {
        missing.push(props.t("seller.products.newPlant.exactlyOneBase"));
      }
    }
    props.onWarningChange(missing.length > 0, missing);
  });

  return (
    <div class="space-y-6">
      <style>{`
        .variant-details > summary::-webkit-details-marker { display: none; }
        .variant-details > summary::marker { display: none; }
        .variant-details[open] > summary .chevron-icon { transform: rotate(180deg); }
      `}</style>

      {/* Section Intro */}
      <div class="bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-700 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <span class="text-xl flex-shrink-0">💰</span>
          <div>
            <h4 class="text-sm font-semibold text-forest-900 dark:text-forest-100 mb-1">
              {props.t("seller.products.newPlant.step4Title")}
            </h4>
            <p class="text-xs text-forest-700 dark:text-forest-300 leading-relaxed">
              {props.t("seller.products.newPlant.step4Description")}
            </p>
          </div>
        </div>
      </div>
      <Show when={props.errors["variants"]}>
        <p class="text-xs text-red-600 dark:text-red-400 font-medium">
          {props.errors["variants"]}
        </p>
      </Show>
      <Show when={props.errors["baseVariant"]}>
        <p class="text-xs text-red-600 dark:text-red-400 font-medium">
          {props.errors["baseVariant"]}
        </p>
      </Show>

      {/* Quick Actions Toolbar */}
      <div class="flex items-center gap-3">
        <button
          type="button"
          onClick={props.addVariant}
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cream-200 dark:border-forest-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-forest-500 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-800/30 transition-colors"
        >
          <PlusIcon class="w-4 h-4" />
          {props.t("seller.products.newPlant.addVariant")}
        </button>
      </div>

      {/* Empty State */}
      <Show when={props.variants.length === 0}>
        <div class="text-center py-16 border-2 border-dashed border-cream-300 dark:border-forest-600 rounded-xl">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-forest-50 dark:bg-forest-800 flex items-center justify-center">
            <svg class="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {props.t("seller.products.newPlant.addFirstVariant") || "Add Your First Variant"}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2 max-w-sm mx-auto">
            {props.t("seller.products.newPlant.variantHelpText") || "Variants are different versions of your plant (e.g., juvenile, mature, cutting). Each can have its own price, inventory, and images."}
          </p>
          <p class="text-xs text-red-600 dark:text-red-400 font-medium mb-6">
            ⚠️ At least one variant is required — you can't set a price or create your plant without it.
          </p>
          <button type="button" onClick={props.addVariant} class="px-6 py-2.5 bg-forest-600 text-white rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors">
            + {props.t("seller.products.newPlant.addVariant")}
          </button>
        </div>
      </Show>

      {/* Variant Cards */}
      <For each={props.variants}>
        {(variant, index) => {
          const i = index();
          const baseCount = props.variants.filter(v => v.isBase).length;
          const isLastBase = variant.isBase && baseCount === 1;

          const attrs = [
            variant.growthStage, variant.plantForm, variant.variegation,
            variant.leafDensity, variant.stemCount, variant.currentHeight,
            variant.currentSpread, variant.propagationType, variant.containerType,
            variant.containerSize, variant.bundleType
          ];
          const filled = attrs.filter(a => a && a !== '').length;
          const completionPercent = Math.round((filled / attrs.length) * 100);

          return (
            <details class="variant-details border border-cream-200 dark:border-forest-700 rounded-xl overflow-hidden" open>
              <summary class="bg-cream-50 dark:bg-forest-900/20 px-4 py-3 flex items-center justify-between border-b border-cream-200 dark:border-forest-700 cursor-pointer hover:bg-cream-100 dark:hover:bg-forest-900/30 transition-colors [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                <div class="flex items-center gap-3">
                  <svg class="chevron-icon w-5 h-5 text-gray-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span class="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {props.t("seller.products.newPlant.variantTitle")} #{i + 1}
                  </span>
                  <Show when={variant.isBase}>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-200 font-medium">
                      {props.t("seller.products.newPlant.baseBadge")}
                    </span>
                  </Show>
                </div>

                <div class="flex items-center gap-4">
                  {/* Summary Bar */}
                  <div class="hidden sm:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span class="font-medium text-forest-700 dark:text-forest-300">
                      ${typeof variant.price === 'number' ? variant.price.toFixed(2) : (variant.price || '—')}
                    </span>
                    <span>📦 {variant.inventoryCount || '∞'}</span>
                    <span>📸 {variant.mediaIds.length}</span>
                    <span>🌱 {variant.growthStage || '—'}</span>
                  </div>

                  {/* Completion Progress */}
                  <Show when={completionPercent > 0 && completionPercent < 100}>
                    <div class="hidden md:flex items-center gap-2">
                      <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div
                          class="bg-forest-500 h-1 rounded-full transition-all"
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                      <span class="text-xs text-gray-500">{completionPercent}%</span>
                    </div>
                  </Show>

                  {/* Low Stock Warning */}
                  <Show when={variant.trackInventory && typeof variant.inventoryCount === 'number' && typeof variant.lowStockThreshold === 'number' && variant.inventoryCount <= variant.lowStockThreshold && variant.inventoryCount > 0}>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                      ⚠️ Low stock
                    </span>
                  </Show>

                  {/* Actions */}
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); props.duplicateVariant(i); }}
                      class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                      title={props.t("seller.products.newPlant.duplicateVariant") || "Duplicate variant"}
                    >
                      <ClipboardDocumentIcon class="w-4 h-4" />
                    </button>
                    <Show when={props.variants.length > 1}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); props.removeVariant(i); }}
                        class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </Show>
                  </div>
                </div>
              </summary>

              {/* Content */}
              <div class="p-4 space-y-4">
                {/* Pricing row */}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Input
                    type="number"
                    id={`variant-${i}-price`}
                    label={props.t("seller.products.newPlant.priceLabel")}
                    required
                    placeholder={props.t("seller.products.newPlant.pricePlaceholder")}
                    value={variant.price}
                    onInput={(e) => {
                      const v = e.currentTarget.value;
                      props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, price: v === "" ? "" : parseFloat(v) } : item));
                    }}
                    error={props.errors[`variants.${i}.price`]}
                    min={0}
                  />
                  <Input
                    type="number"
                    id={`variant-${i}-inventory`}
                    label={props.t("seller.products.newPlant.inventoryCountLabel")}
                    placeholder={props.t("seller.products.newPlant.inventoryCountPlaceholder")}
                    value={variant.inventoryCount}
                    onInput={(e) => {
                      const v = e.currentTarget.value;
                      props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, inventoryCount: v === "" ? "" : parseFloat(v) } : item));
                    }}
                    min={0}
                  />
                </div>

                {/* SKU */}
                <Input
                  id={`variant-${i}-sku`}
                  label={props.t("seller.products.newPlant.skuLabel")}
                  placeholder={props.t("seller.products.newPlant.skuPlaceholder")}
                  value={variant.sku}
                  onInput={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, sku: e.currentTarget.value } : item))}
                />

                {/* Variant images */}
                <VariantImageUpload variantIndex={i} mediaIds={variant.mediaIds} mediaUrls={variant.mediaUrls} setVariants={props.setVariants} t={props.t} />

                {/* Checkboxes */}
                <div class="flex flex-wrap gap-6">
                  <CheckboxField
                    id={`variant-${i}-track`}
                    label={props.t("seller.products.newPlant.trackInventoryLabel")}
                    checked={variant.trackInventory}
                    onChange={(v) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, trackInventory: v } : item))}
                  />
                  <CheckboxField
                    id={`variant-${i}-base`}
                    label={props.t("seller.products.newPlant.isBaseLabel")}
                    checked={variant.isBase}
                    disabled={isLastBase}
                    onChange={(v) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, isBase: v } : item))}
                  />
                  <Show when={isLastBase}>
                    <span class="text-xs text-gray-400 dark:text-gray-500 self-center">
                      ({props.t("seller.products.newPlant.atLeastOneBase") || "At least one base required"})
                    </span>
                  </Show>
                  <CheckboxField
                    id={`variant-${i}-active`}
                    label={props.t("seller.products.newPlant.isActiveLabel")}
                    checked={variant.isActive}
                    onChange={(v) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, isActive: v } : item))}
                  />
                </div>

                {/* Low stock threshold */}
                <Show when={variant.trackInventory}>
                  <Input
                    type="number"
                    id={`variant-${i}-low-stock`}
                    label={props.t("seller.products.newPlant.lowStockThresholdLabel")}
                    placeholder={props.t("seller.products.newPlant.lowStockThresholdPlaceholder")}
                    value={variant.lowStockThreshold}
                    onInput={(e) => {
                      const v = e.currentTarget.value;
                      props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, lowStockThreshold: v === "" ? "" : parseFloat(v) } : item));
                    }}
                    min={0}
                  />
                </Show>

                {/* Plant Attributes - Grouped */}
                <div class="space-y-4">
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {props.t("seller.products.newPlant.plantAttributes")}
                  </h5>

                  {/* Morphology */}
                  <AttributeFieldset title="Morphology" emoji="🌱">
                    <Select
                      label={props.t("seller.products.newPlant.growthStageLabel")}
                      options={props.growthStageOptions}
                      value={variant.growthStage}
                      onChange={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, growthStage: e.currentTarget.value } : item))}
                      placeholder={props.t("seller.products.newPlant.growthStagePlaceholder")}
                    />
                    <Select
                      label={props.t("seller.products.newPlant.plantFormLabel")}
                      options={props.plantFormOptions}
                      value={variant.plantForm}
                      onChange={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, plantForm: e.currentTarget.value } : item))}
                      placeholder={props.t("seller.products.newPlant.plantFormPlaceholder")}
                    />
                    <Select
                      label={props.t("seller.products.newPlant.variegationLabel")}
                      options={props.variegationOptions}
                      value={variant.variegation}
                      onChange={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, variegation: e.currentTarget.value } : item))}
                      placeholder={props.t("seller.products.newPlant.variegationPlaceholder")}
                    />
                    <Select
                      label={props.t("seller.products.newPlant.leafDensityLabel")}
                      options={props.leafDensityOptions}
                      value={variant.leafDensity}
                      onChange={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, leafDensity: e.currentTarget.value } : item))}
                      placeholder={props.t("seller.products.newPlant.leafDensityPlaceholder")}
                    />
                    <Input
                      type="number"
                      id={`variant-${i}-stem-count`}
                      label={props.t("seller.products.newPlant.stemCountLabel")}
                      placeholder={props.t("seller.products.newPlant.stemCountPlaceholder")}
                      value={variant.stemCount}
                      onInput={(e) => {
                        const v = e.currentTarget.value;
                        props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, stemCount: v === "" ? "" : parseInt(v) } : item));
                      }}
                      min={1}
                    />
                  </AttributeFieldset>

                    {/* Dimensions */}
                    <AttributeFieldset title={props.t("seller.products.newPlant.currentDimensions")} emoji="📏">
                    <Input
                      id={`variant-${i}-current-height`}
                      label={props.t("seller.products.newPlant.currentHeightLabel")}
                      placeholder={props.t("seller.products.newPlant.currentHeightPlaceholder")}
                      value={variant.currentHeight}
                      onInput={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, currentHeight: e.currentTarget.value } : item))}
                    />
                    <Input
                      id={`variant-${i}-current-spread`}
                      label={props.t("seller.products.newPlant.currentSpreadLabel")}
                      placeholder={props.t("seller.products.newPlant.currentSpreadPlaceholder")}
                      value={variant.currentSpread}
                      onInput={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, currentSpread: e.currentTarget.value } : item))}
                    />
                  </AttributeFieldset>

                    {/* Container & Propagation */}
                    <AttributeFieldset title={props.t("seller.products.newPlant.containerAndPropagation")} emoji="🪴">
                    <Select
                      label={props.t("seller.products.newPlant.propagationTypeLabel")}
                      options={props.propagationTypeOptions}
                      value={variant.propagationType}
                      onChange={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, propagationType: e.currentTarget.value } : item))}
                      placeholder={props.t("seller.products.newPlant.propagationTypePlaceholder")}
                    />
                    <Select
                      label={props.t("seller.products.newPlant.containerTypeLabel")}
                      options={props.containerTypeOptions}
                      value={variant.containerType}
                      onChange={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, containerType: e.currentTarget.value } : item))}
                      placeholder={props.t("seller.products.newPlant.containerTypePlaceholder")}
                    />
                    <Input
                      id={`variant-${i}-container-size`}
                      label={props.t("seller.products.newPlant.containerSizeLabel")}
                      placeholder={props.t("seller.products.newPlant.containerSizePlaceholder")}
                      value={variant.containerSize}
                      onInput={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, containerSize: e.currentTarget.value } : item))}
                    />
                    <Input
                      id={`variant-${i}-bundle`}
                      label={props.t("seller.products.newPlant.bundleTypeLabel")}
                      placeholder={props.t("seller.products.newPlant.bundleTypePlaceholder")}
                      value={variant.bundleType}
                      onInput={(e) => props.setVariants(vr => vr.map((item, idx) => idx === i ? { ...item, bundleType: e.currentTarget.value } : item))}
                    />
                  </AttributeFieldset>
                </div>
              </div>
            </details>
          );
        }}
      </For>
    </div>
  );
}
