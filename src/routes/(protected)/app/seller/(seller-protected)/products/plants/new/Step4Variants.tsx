import { createEffect, Show, For } from "solid-js";
import { PlusIcon, TrashIcon } from "~/components/icons";
import { Select, type SelectOption } from "~/components/ui/Select";

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

function InputField(props: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onInput: (val: string) => void;
}) {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
      </label>
      <input
        type="text"
        id={props.id}
        value={props.value}
        onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
        placeholder={props.placeholder}
        class="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-colors text-sm"
      />
    </div>
  );
}

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

export interface VariantStore {
  sku: string;
  price: number | "";
  salePrice: number | "";
  costPrice: number | "";
  inventoryCount: number | "";
  trackInventory: boolean;
  lowStockThreshold: number | "";
  isBase: boolean;
  isActive: boolean;
  mediaIds: string[];
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

function VariantImageUpload(props: {
  variantIndex: number;
  mediaIds: string[];
  setVariants: (fn: (v: VariantStore[]) => VariantStore[]) => void;
}) {
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
                <div class="w-full h-full bg-cream-100 dark:bg-forest-700 flex items-center justify-center text-xs text-gray-400">
                  IMG {idx() + 1}
                </div>
                <button
                  type="button"
                  onClick={() => props.setVariants(v => v.map((item, i) => i === props.variantIndex ? { ...item, mediaIds: item.mediaIds.filter((_, j) => j !== idx()) } : item))}
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
        <div class="flex items-center justify-center px-4 py-3 border-2 border-dashed border-cream-200 dark:border-forest-700 rounded-lg bg-white dark:bg-forest-900/30">
          <p class="text-xs text-forest-600 dark:text-forest-400">
            Variant image upload — coming soon
          </p>
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
        <p class="text-sm text-red-600 dark:text-red-400 font-medium">
          {props.errors["variants"]}
        </p>
      </Show>
      <Show when={props.errors["baseVariant"]}>
        <p class="text-sm text-red-600 dark:text-red-400 font-medium">
          {props.errors["baseVariant"]}
        </p>
      </Show>

      <For each={props.variants}>
        {(variant, index) => (
          <div class="border border-cream-200 dark:border-forest-700 rounded-xl overflow-hidden">
            <div class="bg-cream-50 dark:bg-forest-800/50 px-4 py-3 flex items-center justify-between border-b border-cream-200 dark:border-forest-700">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                  {props.t("seller.products.newPlant.variantTitle")} #{index() + 1}
                </span>
                <Show when={variant.isBase}>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-200 font-medium">
                    Base
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
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <NumberField
                  id={`variant-${index()}-price`}
                  label={props.t("seller.products.newPlant.priceLabel")}
                  required
                  placeholder={props.t("seller.products.newPlant.pricePlaceholder")}
                  value={variant.price}
                  onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, price: v } : item))}
                  error={props.errors[`variants.${index()}.price`]}
                  min={0}
                />
                <NumberField
                  id={`variant-${index()}-sale-price`}
                  label={props.t("seller.products.newPlant.salePriceLabel")}
                  placeholder={props.t("seller.products.newPlant.salePricePlaceholder")}
                  value={variant.salePrice}
                  onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, salePrice: v } : item))}
                  min={0}
                />
                <NumberField
                  id={`variant-${index()}-cost-price`}
                  label={props.t("seller.products.newPlant.costPriceLabel")}
                  placeholder={props.t("seller.products.newPlant.costPricePlaceholder")}
                  value={variant.costPrice}
                  onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, costPrice: v } : item))}
                  min={0}
                />
                <NumberField
                  id={`variant-${index()}-inventory`}
                  label={props.t("seller.products.newPlant.inventoryCountLabel")}
                  placeholder={props.t("seller.products.newPlant.inventoryCountPlaceholder")}
                  value={variant.inventoryCount}
                  onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, inventoryCount: v } : item))}
                  min={0}
                />
              </div>

              {/* SKU */}
              <InputField
                id={`variant-${index()}-sku`}
                label={props.t("seller.products.newPlant.skuLabel")}
                placeholder={props.t("seller.products.newPlant.skuPlaceholder")}
                value={variant.sku}
                onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, sku: v } : item))}
              />

      {/* Variant images */}
      <VariantImageUpload variantIndex={index()} mediaIds={variant.mediaIds} setVariants={props.setVariants} />

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
                <NumberField
                  id={`variant-${index()}-low-stock`}
                  label={props.t("seller.products.newPlant.lowStockThresholdLabel")}
                  placeholder={props.t("seller.products.newPlant.lowStockThresholdPlaceholder")}
                  value={variant.lowStockThreshold}
                  onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, lowStockThreshold: v } : item))}
                  min={0}
                />
              </Show>

              {/* Plant Attributes */}
              <div class="border-t border-cream-200 dark:border-forest-700 pt-4">
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {props.t("seller.products.newPlant.plantAttributes")}
                </h5>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InputField
                    id={`variant-${index()}-pot-size`}
                    label={props.t("seller.products.newPlant.potSizeLabel")}
                    placeholder={props.t("seller.products.newPlant.potSizePlaceholder")}
                    value={variant.potSize}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, potSize: v } : item))}
                  />
                  <NumberField
                    id={`variant-${index()}-pot-inches`}
                    label={props.t("seller.products.newPlant.potSizeInchesLabel")}
                    placeholder={props.t("seller.products.newPlant.potSizeInchesPlaceholder")}
                    value={variant.potSizeInches}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, potSizeInches: v } : item))}
                    min={0.5}
                  />
                  <InputField
                    id={`variant-${index()}-pot-material`}
                    label={props.t("seller.products.newPlant.potMaterialLabel")}
                    placeholder={props.t("seller.products.newPlant.potMaterialPlaceholder")}
                    value={variant.potMaterial}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, potMaterial: v } : item))}
                  />
                  <InputField
                    id={`variant-${index()}-pot-color`}
                    label={props.t("seller.products.newPlant.potColorLabel")}
                    placeholder={props.t("seller.products.newPlant.potColorPlaceholder")}
                    value={variant.potColor}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, potColor: v } : item))}
                  />
                  <InputField
                    id={`variant-${index()}-pot-type`}
                    label={props.t("seller.products.newPlant.potTypeLabel")}
                    placeholder={props.t("seller.products.newPlant.potTypePlaceholder")}
                    value={variant.potType}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, potType: v } : item))}
                  />
                  <Select
                    label={props.t("seller.products.newPlant.growthStageLabel")}
                    options={props.growthStageOptions}
                    value={variant.growthStage}
                    onChange={(e) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, growthStage: e.currentTarget.value } : item))}
                    placeholder={props.t("seller.products.newPlant.growthStagePlaceholder")}
                  />
                  <InputField
                    id={`variant-${index()}-plant-form`}
                    label={props.t("seller.products.newPlant.plantFormLabel")}
                    placeholder={props.t("seller.products.newPlant.plantFormPlaceholder")}
                    value={variant.plantForm}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, plantForm: v } : item))}
                  />
                  <InputField
                    id={`variant-${index()}-variegation`}
                    label={props.t("seller.products.newPlant.variegationLabel")}
                    placeholder={props.t("seller.products.newPlant.variegationPlaceholder")}
                    value={variant.variegation}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, variegation: v } : item))}
                  />
                  <InputField
                    id={`variant-${index()}-propagation`}
                    label={props.t("seller.products.newPlant.propagationTypeLabel")}
                    placeholder={props.t("seller.products.newPlant.propagationTypePlaceholder")}
                    value={variant.propagationType}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, propagationType: v } : item))}
                  />
                  <InputField
                    id={`variant-${index()}-container`}
                    label={props.t("seller.products.newPlant.containerTypeLabel")}
                    placeholder={props.t("seller.products.newPlant.containerTypePlaceholder")}
                    value={variant.containerType}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, containerType: v } : item))}
                  />
                  <InputField
                    id={`variant-${index()}-bundle`}
                    label={props.t("seller.products.newPlant.bundleTypeLabel")}
                    placeholder={props.t("seller.products.newPlant.bundleTypePlaceholder")}
                    value={variant.bundleType}
                    onInput={(v) => props.setVariants(vr => vr.map((item, i) => i === index() ? { ...item, bundleType: v } : item))}
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
