import type { Accessor } from "solid-js";
import { Show, createMemo, onMount } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { createAsync } from "@solidjs/router";
import { getCategoryTree, getTags } from "~/lib/api/endpoints/public";
import { useI18n } from "~/i18n";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import { usePlantSelectOptions } from "~/lib/plants/plantSelectOptions";
import type { PlantFormState } from "~/lib/types/plant-form";
import { createEmptyVariant } from "~/lib/types/plant-form";
import type { PlantSectionId } from "~/lib/plants/plant-section-edit";
import { isVariantSectionId, variantIdFromSection } from "~/lib/plants/plant-section-edit";
import { IdentityFields } from "./sections/IdentityFields";
import { CategoryTagsFields } from "./sections/CategoryTagsFields";
import { ClassificationFields } from "./sections/ClassificationFields";
import { CareProfileFields } from "./sections/CareProfileFields";
import { CareGuideFields } from "./sections/CareGuideFields";
import { VariantCatalogFields } from "./sections/VariantCatalogFields";
import type { PlantStatus } from "~/lib/api/types/seller.types";
import type { KnownTagOption } from "~/components/ui/TagGroupSelector";

export function PlantSectionFieldEditor(props: {
  sectionId: PlantSectionId;
  form: PlantFormState;
  setForm: SetStoreFunction<PlantFormState>;
  errors: Record<string, string>;
  plantId: string;
  originalSlug?: string;
  knownPlantTags?: Accessor<KnownTagOption[]>;
}) {
  const { t } = useI18n();
  const categoryTree = createAsync(() => getCategoryTree());
  const tags = createAsync(() => getTags());
  const selectOptions = usePlantSelectOptions(t);

  const thumbnailUpload = useImageUpload({
    maxSizeMB: 5,
    deleteReplacedMedia: false,
    deleteFromServer: false,
    onSuccess: (id, url) => props.setForm("thumbnail", { id, url }),
    onError: () => props.setForm("thumbnail", { id: null, url: null }),
    onClear: () => props.setForm("thumbnail", { id: null, url: null }),
  });

  onMount(() => {
    if (props.sectionId === "identity") {
      const thumb = props.form.thumbnail;
      if (thumb.id && thumb.url) {
        thumbnailUpload.seed(thumb.id, thumb.url);
      }
    }
  });

  const thumbnailPreview = createMemo(
    () => thumbnailUpload.preview() ?? props.form.thumbnail.url,
  );
  const hasThumbnail = createMemo(
    () => !!(thumbnailUpload.preview() || props.form.thumbnail.id),
  );

  const noopWarning = () => {};
  const inventoryHref = `/app/seller/products/plants/${props.plantId}/inventory`;

  return (
    <>
      <Show when={props.sectionId === "identity"}>
        <IdentityFields
          thumbnailUpload={thumbnailUpload}
          thumbnailPreview={thumbnailPreview}
          hasThumbnail={hasThumbnail}
          allowThumbnailDelete={false}
          isEditMode
          originalSlug={props.originalSlug}
          status={props.form.status}
          onStatusChange={(v) => props.setForm("status", v as PlantStatus)}
          slug={props.form.slug}
          onSlugChange={(v) => props.setForm("slug", v)}
          enName={props.form.translations.en.name}
          onEnNameChange={(v) => props.setForm("translations", "en", "name", v)}
          enShortDesc={props.form.translations.en.shortDescription}
          onEnShortDescChange={(v) => props.setForm("translations", "en", "shortDescription", v)}
          enDescription={props.form.translations.en.description}
          onEnDescriptionChange={(v) => props.setForm("translations", "en", "description", v)}
          bnName={props.form.translations.bn.name}
          onBnNameChange={(v) => props.setForm("translations", "bn", "name", v)}
          bnShortDesc={props.form.translations.bn.shortDescription}
          onBnShortDescChange={(v) => props.setForm("translations", "bn", "shortDescription", v)}
          bnDescription={props.form.translations.bn.description}
          onBnDescriptionChange={(v) => props.setForm("translations", "bn", "description", v)}
          scientificName={props.form.plantDetails.scientificName}
          onScientificNameChange={(v) => props.setForm("plantDetails", "scientificName", v)}
          errors={props.errors}
          t={t}
          onWarningChange={noopWarning}
        />
      </Show>

      <Show when={props.sectionId === "categoryTags"}>
        <CategoryTagsFields
          categoryId={props.form.plantDetails.categoryId}
          onCategoryIdChange={(v) => props.setForm("plantDetails", "categoryId", v)}
          tagIds={() => props.form.plantDetails.tagIds}
          onTagToggle={(tagId) => {
            const current = [...props.form.plantDetails.tagIds];
            const idx = current.indexOf(tagId);
            if (idx >= 0) current.splice(idx, 1);
            else current.push(tagId);
            props.setForm("plantDetails", "tagIds", current);
          }}
          errors={props.errors}
          categoryTree={categoryTree}
          tags={tags}
          knownTags={props.knownPlantTags}
          t={t}
          onWarningChange={noopWarning}
        />
      </Show>

      <Show when={props.sectionId === "classification"}>
        <ClassificationFields
          enCommonNames={props.form.plantDetails.translations.en.commonNames}
          onEnCommonNamesChange={(v) => props.setForm("plantDetails", "translations", "en", "commonNames", v)}
          enOrigin={props.form.plantDetails.translations.en.origin}
          onEnOriginChange={(v) => props.setForm("plantDetails", "translations", "en", "origin", v)}
          enSoilType={props.form.plantDetails.translations.en.soilType}
          onEnSoilTypeChange={(v) => props.setForm("plantDetails", "translations", "en", "soilType", v)}
          enToxicityInfo={props.form.plantDetails.translations.en.toxicityInfo}
          onEnToxicityInfoChange={(v) => props.setForm("plantDetails", "translations", "en", "toxicityInfo", v)}
          bnCommonNames={props.form.plantDetails.translations.bn.commonNames}
          onBnCommonNamesChange={(v) => props.setForm("plantDetails", "translations", "bn", "commonNames", v)}
          bnOrigin={props.form.plantDetails.translations.bn.origin}
          onBnOriginChange={(v) => props.setForm("plantDetails", "translations", "bn", "origin", v)}
          bnSoilType={props.form.plantDetails.translations.bn.soilType}
          onBnSoilTypeChange={(v) => props.setForm("plantDetails", "translations", "bn", "soilType", v)}
          bnToxicityInfo={props.form.plantDetails.translations.bn.toxicityInfo}
          onBnToxicityInfoChange={(v) => props.setForm("plantDetails", "translations", "bn", "toxicityInfo", v)}
          t={t}
          onWarningChange={noopWarning}
        />
      </Show>

      <Show when={props.sectionId === "careProfile"}>
        <CareProfileFields
          lightRequirement={props.form.plantDetails.lightRequirement}
          onLightChange={(v) => props.setForm("plantDetails", "lightRequirement", v)}
          wateringFrequency={props.form.plantDetails.wateringFrequency}
          onWateringChange={(v) => props.setForm("plantDetails", "wateringFrequency", v)}
          humidityLevel={props.form.plantDetails.humidityLevel}
          onHumidityChange={(v) => props.setForm("plantDetails", "humidityLevel", v)}
          careDifficulty={props.form.plantDetails.careDifficulty}
          onCareDifficultyChange={(v) => props.setForm("plantDetails", "careDifficulty", v)}
          growthRate={props.form.plantDetails.growthRate}
          onGrowthRateChange={(v) => props.setForm("plantDetails", "growthRate", v)}
          temperatureRange={props.form.plantDetails.temperatureRange}
          onTemperatureChange={(v) => props.setForm("plantDetails", "temperatureRange", v)}
          matureHeight={props.form.plantDetails.matureHeight}
          onMatureHeightChange={(v) => props.setForm("plantDetails", "matureHeight", v)}
          matureSpread={props.form.plantDetails.matureSpread}
          onMatureSpreadChange={(v) => props.setForm("plantDetails", "matureSpread", v)}
          errors={props.errors}
          lightOptions={selectOptions.lightOptions()}
          wateringOptions={selectOptions.wateringOptions()}
          humidityOptions={selectOptions.humidityOptions()}
          careDifficultyOptions={selectOptions.careDifficultyOptions()}
          growthRateOptions={selectOptions.growthRateOptions()}
          t={t}
          onWarningChange={noopWarning}
        />
      </Show>

      <Show when={props.sectionId === "careGuide"}>
        <CareGuideFields
          careGuide={props.form.careGuide}
          onEnChange={(key, value) => props.setForm("careGuide", "en", key, value)}
          onBnChange={(key, value) => props.setForm("careGuide", "bn", key, value)}
          t={t}
          onWarningChange={noopWarning}
        />
      </Show>

      <Show when={isVariantSectionId(props.sectionId)}>
        <VariantCatalogFields
          variants={props.form.variants}
          setVariants={(fn) => props.setForm("variants", fn(props.form.variants))}
          addVariant={() => props.setForm("variants", (v) => [...v, createEmptyVariant()])}
          duplicateVariant={(index) => {
            const source = props.form.variants[index];
            const copy = {
              ...source,
              id: `variant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              sku: source.sku ? `${source.sku}-copy` : "",
              isBase: false,
              mediaIds: [],
              mediaUrls: [],
              translations: {
                en: { ...source.translations.en },
                bn: { ...source.translations.bn },
              },
            };
            props.setForm("variants", (v) => {
              const newArr = [...v];
              newArr.splice(index + 1, 0, copy);
              return newArr;
            });
          }}
          removeVariant={(index) => {
            if (props.form.variants.length <= 1) return;
            props.setForm("variants", (v) => v.filter((_, i) => i !== index));
          }}
          errors={props.errors}
          growthStageOptions={selectOptions.growthStageOptions()}
          plantFormOptions={selectOptions.plantFormOptions()}
          variegationOptions={selectOptions.variegationOptions()}
          leafDensityOptions={selectOptions.leafDensityOptions()}
          propagationTypeOptions={selectOptions.propagationTypeOptions()}
          containerTypeOptions={selectOptions.containerTypeOptions()}
          stockFieldsDisabled
          inventoryLinkHref={inventoryHref}
          variantFilterId={variantIdFromSection(props.sectionId as `variant:${string}`)}
          hideToolbar
          hideIntro
          t={t}
          onWarningChange={noopWarning}
        />
      </Show>
    </>
  );
}
