import { createEffect, Show, For, createSignal } from "solid-js";
import { PlusIcon, TrashIcon } from "~/components/icons";
import { Select, type SelectOption } from "~/components/ui/Select";
import Input from "~/components/ui/Input";
import { mediaApi } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";

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
        <div class="w-5 h-5 rounded border-2 border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-900/30 peer-checked:bg-forest-600 peer-checked:border-forest-600 transition-colors flex items-center justify-center">
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
  // Morphology
  growthStage: string;
  plantForm: string;
  variegation: string;
  leafDensity: string;
  stemCount: number | "";
  currentHeight: string;
  currentSpread: string;
  // Container & Packaging
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
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {props.t("seller.products.newPlant.variantImagesLabel").replace("{count}", String(props.mediaIds.length))}
      </p>
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
            <p class="text-xs text-forest-600 dark:text-forest-400">
              {isUploading() ? props.t("seller.products.newPlant.imageUploading") : props.t("seller.products.newPlant.imageUploadPrompt")}
            </p>
          </div>
        </div>
      </Show>
    </div>
  );
}

export function Step4Variants(props: {
  variants: VariantStore[];
  setVariants: (fn: (v: VariantStore[]) => VariantStore[]) => void;
  addVariant: () => void;
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

      <For each={props.variants}>
        {(variant, index) => (
          <div class="border border-cream-200 dark:border-forest-700 rounded-xl overflow-hidden">
            <div class="bg-cream-50 dark:bg-forest-900/20 px-4 py-3 flex items-center justify-between border-b border-cream-200 dark:border-forest-700">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                  {props.t("seller.products.newPlant.variantTitle")} #{index() + 1}
                </span>
                <Show when={variant.isBase}>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-200 font-medium">
                    {props.t("seller.products.newPlant.baseBadge")}
                  </span>
                </Show>
              </div>
              <Show when={props.variants.length > 1}>
                <button
                  type="button"
                  onClick={() => props.removeVariant(index())}
                  class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </Show>
            </div>

            <div class="p-4 space-y-4">
              {/* Pricing row */}
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Input
                  type="number"
                  id={`variant-${index()}-price`}
                  label={props.t("seller.products.newPlant.priceLabel")}
                  required
                  placeholder={props.t("seller.products.newPlant.pricePlaceholder")}
                  value={variant.price}
                  onInput={(e) => {
                    const v = e.currentTarget.value;
                    props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, price: v === "" ? "" : parseFloat(v) } : item));
                  }}
                  error={props.errors[`variants.${index()}.price`]}
                  min={0}
                />
                <Input
                  type="number"
                  id={`variant-${index()}-inventory`}
                  label={props.t("seller.products.newPlant.inventoryCountLabel")}
                  placeholder={props.t("seller.products.newPlant.inventoryCountPlaceholder")}
                  value={variant.inventoryCount}
                  onInput={(e) => {
                    const v = e.currentTarget.value;
                    props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, inventoryCount: v === "" ? "" : parseFloat(v) } : item));
                  }}
                  min={0}
                />
              </div>

              {/* SKU */}
              <Input
                id={`variant-${index()}-sku`}
                label={props.t("seller.products.newPlant.skuLabel")}
                placeholder={props.t("seller.products.newPlant.skuPlaceholder")}
                value={variant.sku}
                onInput={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, sku: e.currentTarget.value } : item))}
              />

      {/* Variant images */}
      <VariantImageUpload variantIndex={index()} mediaIds={variant.mediaIds} mediaUrls={variant.mediaUrls} setVariants={props.setVariants} t={props.t} />

              {/* Checkboxes */}
              <div class="flex flex-wrap gap-6">
                <CheckboxField
                  id={`variant-${index()}-track`}
                  label={props.t("seller.products.newPlant.trackInventoryLabel")}
                  checked={variant.trackInventory}
                  onChange={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, trackInventory: v } : item))}
                />
                <CheckboxField
                  id={`variant-${index()}-base`}
                  label={props.t("seller.products.newPlant.isBaseLabel")}
                  checked={variant.isBase}
                  onChange={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, isBase: v } : item))}
                />
                <CheckboxField
                  id={`variant-${index()}-active`}
                  label={props.t("seller.products.newPlant.isActiveLabel")}
                  checked={variant.isActive}
                  onChange={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, isActive: v } : item))}
                />
              </div>

              {/* Low stock threshold */}
              <Show when={variant.trackInventory}>
                <Input
                  type="number"
                  id={`variant-${index()}-low-stock`}
                  label={props.t("seller.products.newPlant.lowStockThresholdLabel")}
                  placeholder={props.t("seller.products.newPlant.lowStockThresholdPlaceholder")}
                  value={variant.lowStockThreshold}
                  onInput={(e) => {
                    const v = e.currentTarget.value;
                    props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, lowStockThreshold: v === "" ? "" : parseFloat(v) } : item));
                  }}
                  min={0}
                />
              </Show>

              {/* Plant Attributes */}
              <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {props.t("seller.products.newPlant.plantAttributes")}
                </h5>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Select
                    label={props.t("seller.products.newPlant.growthStageLabel")}
                    options={props.growthStageOptions}
                    value={variant.growthStage}
                    onChange={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, growthStage: e.currentTarget.value } : item))}
                    placeholder={props.t("seller.products.newPlant.growthStagePlaceholder")}
                  />
                  <Select
                    label={props.t("seller.products.newPlant.plantFormLabel")}
                    options={props.plantFormOptions}
                    value={variant.plantForm}
                    onChange={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, plantForm: e.currentTarget.value } : item))}
                    placeholder={props.t("seller.products.newPlant.plantFormPlaceholder")}
                  />
                  <Select
                    label={props.t("seller.products.newPlant.variegationLabel")}
                    options={props.variegationOptions}
                    value={variant.variegation}
                    onChange={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, variegation: e.currentTarget.value } : item))}
                    placeholder={props.t("seller.products.newPlant.variegationPlaceholder")}
                  />
                  <Select
                    label={props.t("seller.products.newPlant.leafDensityLabel")}
                    options={props.leafDensityOptions}
                    value={variant.leafDensity}
                    onChange={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, leafDensity: e.currentTarget.value } : item))}
                    placeholder={props.t("seller.products.newPlant.leafDensityPlaceholder")}
                  />
                  <Input
                    type="number"
                    id={`variant-${index()}-stem-count`}
                    label={props.t("seller.products.newPlant.stemCountLabel")}
                    placeholder={props.t("seller.products.newPlant.stemCountPlaceholder")}
                    value={variant.stemCount}
                    onInput={(e) => {
                      const v = e.currentTarget.value;
                      props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, stemCount: v === "" ? "" : parseInt(v) } : item));
                    }}
                    min={1}
                  />
                  <Input
                    id={`variant-${index()}-current-height`}
                    label={props.t("seller.products.newPlant.currentHeightLabel")}
                    placeholder={props.t("seller.products.newPlant.currentHeightPlaceholder")}
                    value={variant.currentHeight}
                    onInput={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, currentHeight: e.currentTarget.value } : item))}
                  />
                  <Input
                    id={`variant-${index()}-current-spread`}
                    label={props.t("seller.products.newPlant.currentSpreadLabel")}
                    placeholder={props.t("seller.products.newPlant.currentSpreadPlaceholder")}
                    value={variant.currentSpread}
                    onInput={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, currentSpread: e.currentTarget.value } : item))}
                  />
                  <Select
                    label={props.t("seller.products.newPlant.propagationTypeLabel")}
                    options={props.propagationTypeOptions}
                    value={variant.propagationType}
                    onChange={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, propagationType: e.currentTarget.value } : item))}
                    placeholder={props.t("seller.products.newPlant.propagationTypePlaceholder")}
                  />
                  <Select
                    label={props.t("seller.products.newPlant.containerTypeLabel")}
                    options={props.containerTypeOptions}
                    value={variant.containerType}
                    onChange={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, containerType: e.currentTarget.value } : item))}
                    placeholder={props.t("seller.products.newPlant.containerTypePlaceholder")}
                  />
                  <Input
                    id={`variant-${index()}-container-size`}
                    label={props.t("seller.products.newPlant.containerSizeLabel")}
                    placeholder={props.t("seller.products.newPlant.containerSizePlaceholder")}
                    value={variant.containerSize}
                    onInput={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, containerSize: e.currentTarget.value } : item))}
                  />
                  <Input
                    id={`variant-${index()}-bundle`}
                    label={props.t("seller.products.newPlant.bundleTypeLabel")}
                    placeholder={props.t("seller.products.newPlant.bundleTypePlaceholder")}
                    value={variant.bundleType}
                    onInput={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, bundleType: e.currentTarget.value } : item))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </For>

      <button
        type="button"
        onClick={props.addVariant}
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-cream-300 dark:border-forest-600 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-forest-500 hover:text-forest-600 dark:hover:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-800/30 transition-colors"
      >
        <PlusIcon class="w-4 h-4" />
        {props.t("seller.products.newPlant.addVariant")}
      </button>
    </div>
  );
}
