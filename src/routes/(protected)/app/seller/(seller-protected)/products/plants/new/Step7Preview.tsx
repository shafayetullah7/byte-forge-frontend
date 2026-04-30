import { Show, For } from "solid-js";
import type { VariantStore } from "./Step4Variants";

type PlantStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

interface CareGuideData {
  lightInstructions: string;
  wateringInstructions: string;
  humidityInstructions: string;
  fertilizerSchedule: string;
  repottingFrequency: string;
  pruningNotes: string;
  commonProblems: string;
  seasonalCare: string;
}

interface PreviewSectionProps {
  title: string;
  children: any;
}

function PreviewSection(props: PreviewSectionProps) {
  return (
    <div class="border border-cream-200 dark:border-forest-700 rounded-xl overflow-hidden">
      <div class="bg-cream-50 dark:bg-forest-800/50 px-5 py-3 border-b border-cream-200 dark:border-forest-700">
        <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50">
          {props.title}
        </h4>
      </div>
      <div class="p-5">
        {props.children}
      </div>
    </div>
  );
}

function PreviewRow(props: { label: string; value?: string | null; children?: any }) {
  return (
    <div class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0">
      <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0">
        {props.label}
      </dt>
      <dd class="text-sm text-gray-900 dark:text-white">
        {props.value || props.children || (
          <span class="text-gray-400 dark:text-gray-500 italic">—</span>
        )}
      </dd>
    </div>
  );
}

function BilingualSection(props: {
  enLabel: string;
  enValue: string;
  bnLabel: string;
  bnValue: string;
}) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0">
      <div>
        <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          🇬🇧 {props.enLabel}
        </dt>
        <dd class="text-sm text-gray-900 dark:text-white">
          {props.enValue || <span class="text-gray-400 dark:text-gray-500 italic">—</span>}
        </dd>
      </div>
      <div>
        <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          🇧🇩 {props.bnLabel}
        </dt>
        <dd class="text-sm text-gray-900 dark:text-white" dir="auto">
          {props.bnValue || <span class="text-gray-400 dark:text-gray-500 italic">—</span>}
        </dd>
      </div>
    </div>
  );
}

export function Step7Preview(props: {
  thumbnailPreview: () => string | null;
  status: PlantStatus;
  slug: string;
  enName: string;
  enShortDesc: string;
  enDescription: string;
  bnName: string;
  bnShortDesc: string;
  bnDescription: string;
  categoryId: string;
  tagIds: string[];
  scientificName: string;
  lightRequirement: string;
  wateringFrequency: string;
  humidityLevel: string;
  careDifficulty: string;
  growthRate: string;
  temperatureRange: string;
  matureHeight: string;
  matureSpread: string;
  enCommonNames: string;
  enOrigin: string;
  enSoilType: string;
  enToxicityInfo: string;
  bnCommonNames: string;
  bnOrigin: string;
  bnSoilType: string;
  bnToxicityInfo: string;
  variants: VariantStore[];
  careGuideEn: CareGuideData;
  careGuideBn: CareGuideData;
  t: (key: string) => string;
}) {
  const hasCareGuide = () =>
    props.careGuideEn.lightInstructions ||
    props.careGuideEn.wateringInstructions ||
    props.careGuideEn.humidityInstructions ||
    props.careGuideEn.fertilizerSchedule ||
    props.careGuideEn.repottingFrequency ||
    props.careGuideEn.pruningNotes ||
    props.careGuideEn.commonProblems ||
    props.careGuideEn.seasonalCare ||
    props.careGuideBn.lightInstructions ||
    props.careGuideBn.wateringInstructions ||
    props.careGuideBn.humidityInstructions;

  const statusBadgeClass = () => {
    switch (props.status) {
      case "ACTIVE": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "ARCHIVED": return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
      default: return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  return (
    <div class="space-y-6">
      {/* Warning Banner */}
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-amber-800 dark:text-amber-300">
              {props.t("seller.products.newPlant.previewWarning")}
            </p>
            <p class="text-xs text-amber-700 dark:text-amber-400 mt-1">
              {props.t("seller.products.newPlant.previewWarningDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <Show when={props.thumbnailPreview()}>
        <div class="flex justify-center">
          <div class="w-48 h-48 rounded-xl overflow-hidden border-2 border-cream-200 dark:border-forest-600 shadow-sm">
            <img
              src={props.thumbnailPreview()!}
              alt="Plant thumbnail"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </Show>

      {/* Product Identity */}
      <PreviewSection title={props.t("seller.products.newPlant.step1Title")}>
        <dl class="divide-y divide-cream-100 dark:divide-forest-700/50">
          <PreviewRow label={props.t("seller.products.newPlant.statusLabel")}>
            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass()}`}>
              {props.status}
            </span>
          </PreviewRow>
          <Show when={props.slug}>
            <PreviewRow label="URL Slug" value={props.slug} />
          </Show>
        </dl>
      </PreviewSection>

      {/* Names & Descriptions */}
      <PreviewSection title={props.t("seller.products.newPlant.step2Title")}>
        <BilingualSection
          enLabel="Name"
          enValue={props.enName}
          bnLabel="নাম"
          bnValue={props.bnName}
        />
        <BilingualSection
          enLabel="Short Description"
          enValue={props.enShortDesc}
          bnLabel="সংক্ষিপ্ত বিবরণ"
          bnValue={props.bnShortDesc}
        />
        <div class="py-2 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                🇬🇧 Description
              </dt>
              <dd class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {props.enDescription || <span class="text-gray-400 dark:text-gray-500 italic">—</span>}
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                🇧🇩 বিবরণ
              </dt>
              <dd class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap" dir="auto">
                {props.bnDescription || <span class="text-gray-400 dark:text-gray-500 italic">—</span>}
              </dd>
            </div>
          </div>
        </div>
      </PreviewSection>

      {/* Classification */}
      <PreviewSection title={props.t("seller.products.newPlant.step3Title")}>
        <dl class="divide-y divide-cream-100 dark:divide-forest-700/50">
          <PreviewRow label={props.t("seller.products.newPlant.categoryLabel")} value={props.categoryId || undefined} />
          <Show when={props.tagIds.length > 0}>
            <PreviewRow
              label={props.t("seller.products.newPlant.tagsLabel")}
              value={`${props.tagIds.length} tag${props.tagIds.length > 1 ? "s" : ""} selected`}
            />
          </Show>
          <Show when={props.scientificName}>
            <PreviewRow label={props.t("seller.products.newPlant.scientificNameLabel")} value={props.scientificName} />
          </Show>
        </dl>
      </PreviewSection>

      {/* Care Profile */}
      <PreviewSection title={props.t("seller.products.newPlant.step4Title")}>
        <dl class="divide-y divide-cream-100 dark:divide-forest-700/50">
          <PreviewRow label={props.t("seller.products.newPlant.lightRequirementLabel")} value={props.lightRequirement} />
          <PreviewRow label={props.t("seller.products.newPlant.wateringFrequencyLabel")} value={props.wateringFrequency} />
          <PreviewRow label={props.t("seller.products.newPlant.humidityLevelLabel")} value={props.humidityLevel} />
          <PreviewRow label={props.t("seller.products.newPlant.careDifficultyLabel")} value={props.careDifficulty} />
          <Show when={props.growthRate}>
            <PreviewRow label={props.t("seller.products.newPlant.growthRateLabel")} value={props.growthRate} />
          </Show>
          <Show when={props.temperatureRange}>
            <PreviewRow label={props.t("seller.products.newPlant.temperatureRangeLabel")} value={props.temperatureRange} />
          </Show>
          <Show when={props.matureHeight}>
            <PreviewRow label={props.t("seller.products.newPlant.matureHeightLabel")} value={props.matureHeight} />
          </Show>
          <Show when={props.matureSpread}>
            <PreviewRow label={props.t("seller.products.newPlant.matureSpreadLabel")} value={props.matureSpread} />
          </Show>
        </dl>

        {/* Localized Details */}
        <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {props.t("seller.products.newPlant.localizedDetails")}
          </p>
          <BilingualSection
            enLabel="Common Names"
            enValue={props.enCommonNames}
            bnLabel="সাধারণ নাম"
            bnValue={props.bnCommonNames}
          />
          <BilingualSection
            enLabel="Origin"
            enValue={props.enOrigin}
            bnLabel="উৎপত্তি"
            bnValue={props.bnOrigin}
          />
          <BilingualSection
            enLabel="Soil Type"
            enValue={props.enSoilType}
            bnLabel="মাটির ধরন"
            bnValue={props.bnSoilType}
          />
          <Show when={props.enToxicityInfo || props.bnToxicityInfo}>
            <BilingualSection
              enLabel="Toxicity Info"
              enValue={props.enToxicityInfo}
              bnLabel="বিষাক্ত তথ্য"
              bnValue={props.bnToxicityInfo}
            />
          </Show>
        </div>
      </PreviewSection>

      {/* Variants */}
      <PreviewSection title={props.t("seller.products.newPlant.step5Title")}>
        <For each={props.variants}>
          {(variant, index) => (
            <div class={index() > 0 ? "mt-4 pt-4 border-t border-cream-200 dark:border-forest-700" : ""}>
              <div class="flex items-center gap-2 mb-3">
                <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                  {props.t("seller.products.newPlant.variantTitle")} #{index() + 1}
                </span>
                <Show when={variant.isBase}>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-200 font-medium">
                    Base
                  </span>
                </Show>
              </div>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <Show when={variant.sku}>
                  <PreviewRow label="SKU" value={variant.sku} />
                </Show>
                <PreviewRow label={props.t("seller.products.newPlant.priceLabel")} value={`৳${typeof variant.price === "number" ? variant.price.toFixed(2) : "0.00"}`} />
                <Show when={typeof variant.inventoryCount === "number" && variant.inventoryCount >= 0}>
                  <PreviewRow label={props.t("seller.products.newPlant.inventoryCountLabel")} value={String(variant.inventoryCount)} />
                </Show>
              </dl>
            </div>
          )}
        </For>
      </PreviewSection>

      {/* Care Guide */}
      <Show when={hasCareGuide()}>
        <PreviewSection title={props.t("seller.products.newPlant.step6Title")}>
          {/* EN Care Guide */}
          <div class="mb-4">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">🇬🇧 English</p>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <Show when={props.careGuideEn.lightInstructions}>
                <PreviewRow label={props.t("seller.products.newPlant.lightInstructionsLabel")} value={props.careGuideEn.lightInstructions} />
              </Show>
              <Show when={props.careGuideEn.wateringInstructions}>
                <PreviewRow label={props.t("seller.products.newPlant.wateringInstructionsLabel")} value={props.careGuideEn.wateringInstructions} />
              </Show>
              <Show when={props.careGuideEn.humidityInstructions}>
                <PreviewRow label={props.t("seller.products.newPlant.humidityInstructionsLabel")} value={props.careGuideEn.humidityInstructions} />
              </Show>
              <Show when={props.careGuideEn.fertilizerSchedule}>
                <PreviewRow label={props.t("seller.products.newPlant.fertilizerScheduleLabel")} value={props.careGuideEn.fertilizerSchedule} />
              </Show>
              <Show when={props.careGuideEn.repottingFrequency}>
                <PreviewRow label={props.t("seller.products.newPlant.repottingFrequencyLabel")} value={props.careGuideEn.repottingFrequency} />
              </Show>
              <Show when={props.careGuideEn.pruningNotes}>
                <PreviewRow label={props.t("seller.products.newPlant.pruningNotesLabel")} value={props.careGuideEn.pruningNotes} />
              </Show>
              <Show when={props.careGuideEn.commonProblems}>
                <PreviewRow label={props.t("seller.products.newPlant.commonProblemsLabel")} value={props.careGuideEn.commonProblems} />
              </Show>
              <Show when={props.careGuideEn.seasonalCare}>
                <PreviewRow label={props.t("seller.products.newPlant.seasonalCareLabel")} value={props.careGuideEn.seasonalCare} />
              </Show>
            </dl>
          </div>

          {/* BN Care Guide */}
          <Show when={props.careGuideBn.lightInstructions || props.careGuideBn.wateringInstructions || props.careGuideBn.humidityInstructions}>
            <div class="pt-4 border-t border-cream-200 dark:border-forest-700">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">🇧🇩 বাংলা</p>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <Show when={props.careGuideBn.lightInstructions}>
                  <PreviewRow label={props.t("seller.products.newPlant.lightInstructionsLabel")} value={props.careGuideBn.lightInstructions} />
                </Show>
                <Show when={props.careGuideBn.wateringInstructions}>
                  <PreviewRow label={props.t("seller.products.newPlant.wateringInstructionsLabel")} value={props.careGuideBn.wateringInstructions} />
                </Show>
                <Show when={props.careGuideBn.humidityInstructions}>
                  <PreviewRow label={props.t("seller.products.newPlant.humidityInstructionsLabel")} value={props.careGuideBn.humidityInstructions} />
                </Show>
              </dl>
            </div>
          </Show>
        </PreviewSection>
      </Show>
    </div>
  );
}
