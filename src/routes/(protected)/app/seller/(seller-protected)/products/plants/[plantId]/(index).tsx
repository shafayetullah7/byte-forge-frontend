import { For, Show, createSignal, createMemo, type JSX } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { A, useParams, createAsync, useNavigate } from "@solidjs/router";
import { getPlantById, updatePlantStatus, deletePlant, invalidateAllPlantCaches } from "~/lib/api/endpoints/seller/plants.api";
import { PRODUCT_STATUS } from "~/lib/api/types/seller.types";
import { toaster } from "~/components/ui/Toast";
import { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { EditableSectionCard } from "./components/EditableSectionCard";
import { PlantSectionFieldEditor } from "../components/PlantSectionFieldEditor";
import {
  FolderIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  CubeIcon,
  ExclamationCircleIcon,
  TagIcon,
  DollarSignIcon,
  SunIcon,
  DropletIcon,
  MoonIcon,
  TrendingUpIcon,
  ThermometerIcon,
  ClockIcon,
  CalendarIcon,
  CheckBadgeIcon,
  ArchiveIcon,
  TrashIcon,
  CloudIcon,
  ScissorsIcon,
  BeakerIcon,
  SproutIcon,
  ImageIcon,
  LeafIcon,
  RulerIcon,
  SparklesIcon,
} from "~/components/icons";
import { SectionCard } from "./components/SectionCard";
import { DetailRow } from "./components/DetailRow";
import {
  getInventoryStatus,
  formatPrice,
  formatDateTime,
  getLightLabel,
  getLightColor,
  getWateringLabel,
  getWateringColor,
  getHumidityLabel,
  getHumidityColor,
  getDifficultyLabel,
  getDifficultyColor,
  getGrowthRateLabel,
  getGrowthStageLabel,
  getPlantFormLabel,
  getVariegationLabel,
} from "./helpers";
import Badge from "~/components/ui/Badge";
import { useI18n } from "~/i18n";

// ─── Care Card Component ────────────────────────────────────────────

function CareCard(props: {
  icon: JSX.Element;
  titleEn: string;
  titleBn: string;
  badge: { text: string; bg: string; textColor: string };
  description: string;
}) {
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 p-5 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 rounded-lg bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center">
          {props.icon}
        </div>
        <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${props.badge.bg} ${props.badge.textColor}`}>
          {props.badge.text}
        </span>
      </div>
      <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.titleEn}</h4>
      <p class="text-sm font-medium text-forest-600 dark:text-forest-400 mb-1">{props.titleBn}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.description}</p>
    </div>
  );
}

// ─── Instruction Row Component ──────────────────────────────────────

function InstructionRow(props: {
  icon: JSX.Element;
  iconColor: string;
  bgColor: string;
  titleEn: string;
  titleBn: string;
  descEn: string | null;
  descBn: string | null;
}) {
  return (
    <Show when={props.descEn || props.descBn}>
      <div class="space-y-3">
        <Show when={props.descEn}>
          <div class={`flex gap-4 p-4 rounded-lg ${props.bgColor}`}>
            <div class={`${props.iconColor} flex-shrink-0 mt-0.5`}>{props.icon}</div>
            <div>
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.titleEn}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.descEn}</p>
            </div>
          </div>
        </Show>
        <Show when={props.descBn}>
          <div class="flex gap-4 p-4 rounded-lg bg-forest-50 dark:bg-forest-900/20 border-l-2 border-forest-300 dark:border-forest-600">
            <div class={`${props.iconColor} flex-shrink-0 mt-0.5 opacity-60`}>{props.icon}</div>
            <div>
              <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.titleBn}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.descBn}</p>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}

// ─── Main Overview Route ────────────────────────────────────────────

export default function OverviewRoute() {
  const { t, locale } = useI18n();
  const params = useParams();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = createSignal(false);

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  const sectionEdit = usePlantSectionEdit(params.plantId as string, plant);

  const knownPlantTags = createMemo(() => {
    const p = plant();
    if (!p?.plantDetails?.tags?.length) return [];
    const loc = locale();
    return p.plantDetails.tags.map((tag) => ({
      id: tag.id,
      name:
        tag.translations?.find((tr) => tr.locale === loc)?.name
        ?? tag.translations?.find((tr) => tr.locale === "en")?.name
        ?? tag.translations?.[0]?.name
        ?? tag.slug,
    }));
  });

  return (
    <ErrorBoundary fallback={(error) => (
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p class="text-sm text-amber-700 dark:text-amber-300">
          {t("seller.products.plantDetail.loadFailed")}: {error.message}
        </p>
      </div>
    )}>
      <Show when={plant()}>
        {(plantData) => {
          const totalStock = (plantData().variants ?? []).reduce((sum, v) => sum + v.inventoryCount, 0);
          const inventory = getInventoryStatus(totalStock, t as (key: string, ...args: any[]) => string);

          return (
            <div class="space-y-6">

              {/* ─── Thumbnail + Translations Card ─── */}
              <EditableSectionCard
                title={t("seller.products.plantOverview.plantIdentity")}
                icon={<LeafIcon class="w-4 h-4 text-gray-400" />}
                isEditing={sectionEdit.isEditing("identity")}
                isSaving={sectionEdit.isSaving()}
                onEdit={() => sectionEdit.startEdit("identity")}
                onCancel={sectionEdit.cancelEdit}
                onSave={sectionEdit.save}
              >
                <Show
                  when={sectionEdit.isEditing("identity")}
                  fallback={
                    <div class="flex flex-col sm:flex-row">
                      <div class="sm:w-64 md:w-72 h-56 sm:h-auto bg-cream-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 border-b sm:border-b-0 sm:border-r border-cream-200 dark:border-forest-700">
                        {plantData().thumbnail?.url ? (
                          <img
                            src={plantData().thumbnail!.url}
                            alt={
                              plantData().translations?.find(t => t.locale === "en")?.name
                                ?? plantData().translations?.[0]?.name ?? ""
                            }
                            class="w-full h-full object-cover"
                          />
                        ) : (
                          <LeafIcon class="w-20 h-20 text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                      <div class="flex-1 p-6">
                        <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">{t("seller.products.plantOverview.english")}</h2>
                        <p class="text-xl font-semibold text-forest-800 dark:text-cream-50 mb-2">
                          {plantData().translations?.find(t => t.locale === "en")?.name
                            ?? plantData().translations?.[0]?.name ?? ""}
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {plantData().translations?.find(t => t.locale === "en")?.shortDescription
                            ?? plantData().translations?.[0]?.shortDescription ?? ""}
                        </p>
                        {plantData().translations?.find(t => t.locale === "bn") && (
                          <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                            <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">{t("seller.products.plantOverview.bengali")}</h2>
                            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {plantData().translations?.find(t => t.locale === "bn")?.description ?? ""}
                            </p>
                          </div>
                        )}
                        <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {t("seller.products.plantOverview.scientificName")}: <span class="text-gray-700 dark:text-gray-300 italic">{plantData().plantDetails?.scientificName ?? "—"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <PlantSectionFieldEditor
                    sectionId="identity"
                    form={sectionEdit.draftForm}
                    setForm={sectionEdit.setDraftForm}
                    errors={sectionEdit.errors()}
                    plantId={plantData().id}
                    originalSlug={plantData().slug}
                  />
                </Show>
              </EditableSectionCard>

              {/* ─── Two-Column Layout ─── */}
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div class="lg:col-span-2 space-y-6">

                  {/* ─── Category & Tags ─── */}
                  <EditableSectionCard
                    title={t("seller.products.plantOverview.categoryAndTags")}
                    icon={<TagIcon class="w-4 h-4 text-gray-400" />}
                    isEditing={sectionEdit.isEditing("categoryTags")}
                    isSaving={sectionEdit.isSaving()}
                    onEdit={() => sectionEdit.startEdit("categoryTags")}
                    onCancel={sectionEdit.cancelEdit}
                    onSave={sectionEdit.save}
                  >
                    <Show
                      when={sectionEdit.isEditing("categoryTags")}
                      fallback={
                        <>
                          <DetailRow
                            label={t("seller.products.plantOverview.categoryEn")}
                            value={
                              plantData().plantDetails?.category?.translations?.find(t => t.locale === "en")?.name
                                ?? plantData().plantDetails?.category?.translations?.[0]?.name ?? "—"
                            }
                            icon={() => <FolderIcon class="w-4 h-4" />}
                          />
                          <DetailRow
                            label={t("seller.products.plantOverview.categoryBn")}
                            value={
                              plantData().plantDetails?.category?.translations?.find(t => t.locale === "bn")?.name
                                ?? "—"
                            }
                            icon={() => <FolderIcon class="w-4 h-4" />}
                          />
                          <Show when={(plantData().plantDetails?.tags ?? []).length > 0}>
                            <div class="mt-4 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{t("seller.products.plantOverview.tags")}</p>
                              <div class="flex flex-wrap gap-2">
                                <For each={plantData().plantDetails?.tags ?? []}>
                                  {(tag) => {
                                    const nameEn = tag.translations?.find(t => t.locale === "en")?.name
                                      ?? tag.translations?.[0]?.name ?? tag.slug;
                                    const nameBn = tag.translations?.find(t => t.locale === "bn")?.name;
                                    return (
                                      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300 rounded-full text-xs font-medium border border-forest-200 dark:border-forest-700">
                                        <TagIcon class="w-3 h-3" />
                                        {nameEn}
                                        {nameBn && (
                                          <span class="text-forest-500 dark:text-forest-400">({nameBn})</span>
                                        )}
                                      </span>
                                    );
                                  }}
                                </For>
                              </div>
                            </div>
                          </Show>
                        </>
                      }
                    >
                      <PlantSectionFieldEditor
                        sectionId="categoryTags"
                        form={sectionEdit.draftForm}
                        setForm={sectionEdit.setDraftForm}
                        errors={sectionEdit.errors()}
                        plantId={plantData().id}
                        knownPlantTags={knownPlantTags}
                      />
                    </Show>
                  </EditableSectionCard>

                  {/* ─── Classification & Details ─── */}
                  <EditableSectionCard
                    title={t("seller.products.plantOverview.classificationDetails")}
                    icon={<SproutIcon class="w-4 h-4 text-gray-400" />}
                    isEditing={sectionEdit.isEditing("classification")}
                    isSaving={sectionEdit.isSaving()}
                    onEdit={() => sectionEdit.startEdit("classification")}
                    onCancel={sectionEdit.cancelEdit}
                    onSave={sectionEdit.save}
                  >
                    <Show
                      when={sectionEdit.isEditing("classification")}
                      fallback={
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                          <div>
                            <DetailRow
                              label={t("seller.products.plantOverview.commonNamesEn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "en")?.commonNames
                                  ?? plantData().plantDetails?.translations?.[0]?.commonNames ?? "—"
                              }
                              icon={() => <ChatBubbleLeftRightIcon class="w-4 h-4" />}
                            />
                            <DetailRow
                              label={t("seller.products.plantOverview.commonNamesBn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "bn")?.commonNames
                                  ?? "—"
                              }
                              icon={() => <ChatBubbleLeftRightIcon class="w-4 h-4" />}
                            />
                            <DetailRow
                              label={t("seller.products.plantOverview.originEn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "en")?.origin
                                  ?? plantData().plantDetails?.translations?.[0]?.origin ?? "—"
                              }
                              icon={() => <GlobeAltIcon class="w-4 h-4" />}
                            />
                            <DetailRow
                              label={t("seller.products.plantOverview.originBn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "bn")?.origin
                                  ?? "—"
                              }
                              icon={() => <GlobeAltIcon class="w-4 h-4" />}
                            />
                          </div>
                          <div>
                            <DetailRow
                              label={t("seller.products.plantOverview.soilTypeEn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "en")?.soilType
                                  ?? plantData().plantDetails?.translations?.[0]?.soilType ?? "—"
                              }
                              icon={() => <BeakerIcon class="w-4 h-4" />}
                            />
                            <DetailRow
                              label={t("seller.products.plantOverview.soilTypeBn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "bn")?.soilType
                                  ?? "—"
                              }
                              icon={() => <BeakerIcon class="w-4 h-4" />}
                            />
                            <DetailRow
                              label={t("seller.products.plantOverview.toxicityEn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "en")?.toxicityInfo
                                  ?? plantData().plantDetails?.translations?.[0]?.toxicityInfo ?? "—"
                              }
                              icon={() => <ExclamationCircleIcon class="w-4 h-4" />}
                            />
                            <DetailRow
                              label={t("seller.products.plantOverview.toxicityBn")}
                              value={
                                plantData().plantDetails?.translations?.find(t => t.locale === "bn")?.toxicityInfo
                                  ?? "—"
                              }
                              icon={() => <ExclamationCircleIcon class="w-4 h-4" />}
                            />
                          </div>
                        </div>
                      }
                    >
                      <PlantSectionFieldEditor
                        sectionId="classification"
                        form={sectionEdit.draftForm}
                        setForm={sectionEdit.setDraftForm}
                        errors={sectionEdit.errors()}
                        plantId={plantData().id}
                      />
                    </Show>
                  </EditableSectionCard>

                  {/* ─── Care Requirements (Cards) ─── */}
                  <Show when={plantData().plantDetails}>
                    {(pd) => (
                      <EditableSectionCard
                        title={t("seller.products.plantOverview.careRequirements")}
                        icon={<CloudIcon class="w-4 h-4 text-gray-400" />}
                        isEditing={sectionEdit.isEditing("careProfile")}
                        isSaving={sectionEdit.isSaving()}
                        onEdit={() => sectionEdit.startEdit("careProfile")}
                        onCancel={sectionEdit.cancelEdit}
                        onSave={sectionEdit.save}
                      >
                        <Show
                          when={sectionEdit.isEditing("careProfile")}
                          fallback={
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Show when={pd().lightRequirement}>
                                {(light) => (
                                  <CareCard
                                    icon={<SunIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />}
                                    titleEn={t("seller.products.plantOverview.light")}
                                    titleBn="আলো"
                                    badge={{
                                      text: getLightLabel(light() as any),
                                      ...getLightColor(light() as any),
                                    }}
                                    description={t("seller.products.plantOverview.lightDescription")}
                                  />
                                )}
                              </Show>
                              <Show when={pd().wateringFrequency}>
                                {(watering) => (
                                  <CareCard
                                    icon={<DropletIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                    titleEn={t("seller.products.plantOverview.watering")}
                                    titleBn="পানি"
                                    badge={{
                                      text: getWateringLabel(watering() as any),
                                      ...getWateringColor(watering() as any),
                                    }}
                                    description={t("seller.products.plantOverview.wateringDescription")}
                                  />
                                )}
                              </Show>
                              <Show when={pd().humidityLevel}>
                                {(humidity) => (
                                  <CareCard
                                    icon={<CloudIcon class="w-5 h-5 text-sky-600 dark:text-sky-400" />}
                                    titleEn={t("seller.products.plantOverview.humidity")}
                                    titleBn="আর্দ্রতা"
                                    badge={{
                                      text: getHumidityLabel(humidity() as any),
                                      ...getHumidityColor(humidity() as any),
                                    }}
                                    description={t("seller.products.plantOverview.humidityDescription")}
                                  />
                                )}
                              </Show>
                              <Show when={pd().temperatureRange}>
                                {(temp) => (
                                  <CareCard
                                    icon={<ThermometerIcon class="w-5 h-5 text-red-600 dark:text-red-400" />}
                                    titleEn={t("seller.products.plantOverview.temperature")}
                                    titleBn="তাপমাত্রা"
                                    badge={{
                                      text: temp(),
                                      bg: "bg-red-100 dark:bg-red-900/40",
                                      textColor: "text-red-700 dark:text-red-300",
                                    }}
                                    description={t("seller.products.plantOverview.temperatureDescription")}
                                  />
                                )}
                              </Show>
                              <Show when={pd().careDifficulty}>
                                {(difficulty) => (
                                  <CareCard
                                    icon={<SparklesIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />}
                                    titleEn={t("seller.products.plantOverview.careDifficulty")}
                                    titleBn="যত্নের জটিলতা"
                                    badge={{
                                      text: getDifficultyLabel(difficulty() as any),
                                      ...getDifficultyColor(difficulty() as any),
                                    }}
                                    description={t("seller.products.plantOverview.careDifficultyDescription")}
                                  />
                                )}
                              </Show>
                              <Show when={pd().growthRate}>
                                {(growth) => (
                                  <CareCard
                                    icon={<SproutIcon class="w-5 h-5 text-sage-600 dark:text-sage-400" />}
                                    titleEn={t("seller.products.plantOverview.growthRate")}
                                    titleBn="বৃদ্ধির হার"
                                    badge={{
                                      text: getGrowthRateLabel(growth() as any),
                                      bg: "bg-sage-100 dark:bg-sage-900/40",
                                      textColor: "text-sage-700 dark:text-sage-300",
                                    }}
                                    description={t("seller.products.plantOverview.growthRateDescription")}
                                  />
                                )}
                              </Show>
                            </div>
                          }
                        >
                          <PlantSectionFieldEditor
                            sectionId="careProfile"
                            form={sectionEdit.draftForm}
                            setForm={sectionEdit.setDraftForm}
                            errors={sectionEdit.errors()}
                            plantId={plantData().id}
                          />
                        </Show>
                      </EditableSectionCard>
                    )}
                  </Show>

                  {/* ─── Care Instructions ─── */}
                  <Show when={plantData().careInstructions}>
                    {(ci) => {
                      const careEn = ci().translations?.find(t => t.locale === "en") || ci();
                      const careBn = ci().translations?.find(t => t.locale === "bn") || careEn;
                      return (
                        <SectionCard
                          title={t("seller.products.plantOverview.careInstructions")}
                          icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
                          action={
                            <A
                              href={`/app/seller/products/plants/${plantData().id}/care`}
                              class="text-xs text-forest-600 dark:text-forest-400 hover:underline"
                            >
                              {t("seller.products.plantOverview.viewCareGuide")}
                            </A>
                          }
                        >
                          <div class="space-y-4">
                            <InstructionRow
                              icon={<SunIcon class="w-5 h-5" />}
                              iconColor="text-cream-600 dark:text-cream-400"
                              bgColor="bg-cream-50 dark:bg-forest-900/30"
                              titleEn={t("seller.products.plantOverview.lightCare")}
                              titleBn="আলোর যত্ন"
                              descEn={careEn.lightInstructions}
                              descBn={careBn.lightInstructions}
                            />
                            <InstructionRow
                              icon={<DropletIcon class="w-5 h-5" />}
                              iconColor="text-blue-600 dark:text-blue-400"
                              bgColor="bg-blue-50 dark:bg-blue-900/20"
                              titleEn={t("seller.products.plantOverview.wateringGuide")}
                              titleBn="পানির নির্দেশিকা"
                              descEn={careEn.wateringInstructions}
                              descBn={careBn.wateringInstructions}
                            />
                            <InstructionRow
                              icon={<CloudIcon class="w-5 h-5" />}
                              iconColor="text-sky-600 dark:text-sky-400"
                              bgColor="bg-sky-50 dark:bg-sky-900/20"
                              titleEn={t("seller.products.plantOverview.humidityCare")}
                              titleBn="আর্দ্রতার যত্ন"
                              descEn={careEn.humidityInstructions}
                              descBn={careBn.humidityInstructions}
                            />
                            <InstructionRow
                              icon={<BeakerIcon class="w-5 h-5" />}
                              iconColor="text-sage-600 dark:text-sage-400"
                              bgColor="bg-sage-50 dark:bg-sage-900/20"
                              titleEn={t("seller.products.plantOverview.fertilizerSchedule")}
                              titleBn="সারের সময়সূচী"
                              descEn={careEn.fertilizerSchedule}
                              descBn={careBn.fertilizerSchedule}
                            />
                            <InstructionRow
                              icon={<SproutIcon class="w-5 h-5" />}
                              iconColor="text-forest-600 dark:text-forest-400"
                              bgColor="bg-forest-50 dark:bg-forest-900/20"
                              titleEn={t("seller.products.plantOverview.repotting")}
                              titleBn="পুনরায় পট"
                              descEn={careEn.repottingFrequency}
                              descBn={careBn.repottingFrequency}
                            />
                            <InstructionRow
                              icon={<ScissorsIcon class="w-5 h-5" />}
                              iconColor="text-purple-600 dark:text-purple-400"
                              bgColor="bg-purple-50 dark:bg-purple-900/20"
                              titleEn={t("seller.products.plantOverview.pruning")}
                              titleBn="ছাঁটাই"
                              descEn={careEn.pruningNotes}
                              descBn={careBn.pruningNotes}
                            />
                            <InstructionRow
                              icon={<ExclamationCircleIcon class="w-5 h-5" />}
                              iconColor="text-red-600 dark:text-red-400"
                              bgColor="bg-red-50 dark:bg-red-900/20"
                              titleEn={t("seller.products.plantOverview.commonProblems")}
                              titleBn="সাধারণ সমস্যা"
                              descEn={careEn.commonProblems}
                              descBn={careBn.commonProblems}
                            />
                            <InstructionRow
                              icon={<CalendarIcon class="w-5 h-5" />}
                              iconColor="text-amber-600 dark:text-amber-400"
                              bgColor="bg-amber-50 dark:bg-amber-900/20"
                              titleEn={t("seller.products.plantOverview.seasonalCare")}
                              titleBn="মৌসুমি যত্ন"
                              descEn={careEn.seasonalCare}
                              descBn={careBn.seasonalCare}
                            />
                          </div>
                        </SectionCard>
                      );
                    }}
                  </Show>

                  {/* ─── Pricing & Inventory ─── */}
                  <SectionCard
                    title={t("seller.products.plantOverview.pricingInventory")}
                    icon={<DollarSignIcon class="w-4 h-4 text-gray-400" />}
                  >
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.priceRange")}</p>
                        <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                          {(() => {
                            const variants = plantData().variants ?? [];
                            if (variants.length === 0) return "—";
                            const prices = variants.map(v => parseFloat(v.price));
                            const min = Math.min(...prices);
                            const max = Math.max(...prices);
                            return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
                          })()}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.totalInventory")}</p>
                        <div class="flex items-center gap-2 mt-1">
                          <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                            {totalStock}
                          </p>
                          <Badge variant={inventory.variant} class="text-xs">
                            {inventory.label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.variants")}</p>
                        <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                          {plantData().variants?.length ?? 0}
                        </p>
                      </div>
                    </div>
                    <A
                      href={`/app/seller/products/plants/${plantData().id}/inventory`}
                      class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-forest-600 dark:text-forest-400 hover:underline"
                    >
                      {t("seller.products.plantOverview.manageInventory")}
                    </A>
                  </SectionCard>
                </div>

                {/* Right Column (1/3) */}
                <div class="space-y-6">

                  {/* ─── Care Profile ─── */}
                  <Show when={plantData().plantDetails}>
                    {(pd) => (
                      <SectionCard
                        title={t("seller.products.plantOverview.careProfile")}
                        icon={<SunIcon class="w-4 h-4 text-gray-400" />}
                      >
                        <DetailRow
                          label={t("seller.products.plantOverview.light")}
                          value={pd().lightRequirement ? getLightLabel(pd().lightRequirement as any) : "—"}
                          icon={() => <SunIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label={t("seller.products.plantOverview.watering")}
                          value={pd().wateringFrequency ? getWateringLabel(pd().wateringFrequency as any) : "—"}
                          icon={() => <DropletIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label={t("seller.products.plantOverview.humidity")}
                          value={pd().humidityLevel ? getHumidityLabel(pd().humidityLevel as any) : "—"}
                          icon={() => <MoonIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label={t("seller.products.plantOverview.temperature")}
                          value={pd().temperatureRange ?? "—"}
                          icon={() => <ThermometerIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label={t("seller.products.plantOverview.difficulty")}
                          value={pd().careDifficulty ? getDifficultyLabel(pd().careDifficulty as any) : "—"}
                          icon={() => <TrendingUpIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label={t("seller.products.plantOverview.growthRate")}
                          value={pd().growthRate ? getGrowthRateLabel(pd().growthRate as any) : "—"}
                          icon={() => <TrendingUpIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label={t("seller.products.plantOverview.matureHeight")}
                          value={pd().matureHeight ?? "—"}
                          icon={() => <RulerIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label={t("seller.products.plantOverview.matureSpread")}
                          value={pd().matureSpread ?? "—"}
                          icon={() => <RulerIcon class="w-4 h-4" />}
                        />
                      </SectionCard>
                    )}
                  </Show>

                   {/* ─── Variant Preview ─── */}
                   <Show when={(plantData().variants ?? []).length > 0}>
                     <SectionCard
                       title={`${t("seller.products.plantOverview.variants")} (${plantData().variants?.length ?? 0})`}
                       icon={<CubeIcon class="w-4 h-4 text-gray-400" />}
                       action={
                         <a href={`/app/seller/products/plants/${plantData().id}/variants`} class="text-xs text-forest-600 dark:text-forest-400 hover:underline">
                           {t("seller.products.plantOverview.viewAll")}
                         </a>
                       }
                     >
                       <div class="space-y-3">
                         <For each={(plantData().variants ?? []).slice(0, 2)}>
                           {(variant) => {
                              const inv = getInventoryStatus(variant.inventoryCount, t as (key: string, ...args: any[]) => string);
                             const titleEn = variant.translations?.find(t => t.locale === "en")?.title
                               ?? variant.translations?.[0]?.title ?? t("seller.products.plantOverview.variant", variant.id);
                             const titleBn = variant.translations?.find(t => t.locale === "bn")?.title;
                             const attrs = variant.plantAttributes;

                             return (
                               <div class="border border-cream-200 dark:border-forest-700 rounded-lg p-4 hover:bg-cream-50 dark:hover:bg-forest-700/30 transition-colors">
                                 <div class="flex items-start justify-between mb-2">
                                   <div>
                                     <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">{titleEn}</p>
                                     {titleBn && (
                                       <p class="text-sm font-medium text-forest-600 dark:text-forest-400">{titleBn}</p>
                                     )}
                                     <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{variant.sku ?? "—"}</p>
                                   </div>
                                   <Badge variant={inv.variant} class="text-xs">
                                     {inv.label}
                                   </Badge>
                                 </div>
                                 <div class="grid grid-cols-2 gap-2 mb-2">
                                   <div>
                                     <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.price")}</p>
                                     <p class="text-sm font-bold text-forest-800 dark:text-cream-50">{formatPrice(variant.price)}</p>
                                   </div>
                                   <div>
                                     <p class="text-xs text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.stock")}</p>
                                     <p class="text-sm font-bold text-forest-800 dark:text-cream-50">{variant.inventoryCount}</p>
                                   </div>
                                 </div>
                                 <Show when={attrs}>
                                   {(a) => (
                                     <div class="flex flex-wrap gap-1.5 pt-2 border-t border-cream-200 dark:border-forest-700">
                                       <span class="text-xs px-2 py-0.5 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300 rounded-full">
                                         {getGrowthStageLabel(a().growthStage as any)}
                                       </span>
                                       <span class="text-xs px-2 py-0.5 bg-cream-50 dark:bg-cream-900/30 text-cream-700 dark:text-cream-300 rounded-full">
                                         {getPlantFormLabel(a().plantForm as any)}
                                       </span>
                                       <span class="text-xs px-2 py-0.5 bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 rounded-full">
                                         {getVariegationLabel(a().variegation as any)}
                                       </span>
                                       <Show when={variant.media.length > 0}>
                                         <span class="text-xs px-2 py-0.5 bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 rounded-full flex items-center gap-1">
                                           <ImageIcon class="w-3 h-3" />
                                           {variant.media.length}
                                         </span>
                                       </Show>
                                     </div>
                                   )}
                                 </Show>
                               </div>
                             );
                           }}
                         </For>
                       </div>
                     </SectionCard>
                   </Show>

                  {/* ─── Timestamps ─── */}
                  <SectionCard
                    title={t("seller.products.plantOverview.details")}
                    icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
                  >
                    <DetailRow
                      label={t("seller.products.plantOverview.created")}
                      value={formatDateTime(plantData().createdAt)}
                      icon={() => <CalendarIcon class="w-4 h-4" />}
                    />
                    <DetailRow
                      label={t("seller.products.plantOverview.lastUpdated")}
                      value={formatDateTime(plantData().updatedAt)}
                      icon={() => <ClockIcon class="w-4 h-4" />}
                    />
                    <DetailRow
                      label={t("seller.products.plantOverview.plantId")}
                      value={plantData().id}
                      icon={() => <CheckBadgeIcon class="w-4 h-4" />}
                    />
                  </SectionCard>

                  {/* ─── Quick Actions ─── */}
                  <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
                    <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700">
                      <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">{t("seller.products.plantOverview.quickActions")}</h3>
                    </div>
                    <div class="p-4 space-y-1">
                      <Show when={plantData().status !== PRODUCT_STATUS.ACTIVE}>
                        <button
                          type="button"
                          disabled={actionLoading()}
                          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
                          onClick={async () => {
                            if (!confirm(t("seller.products.plantOverview.confirmPublish") || "Publish this plant?")) return;
                            setActionLoading(true);
                            try {
                              await updatePlantStatus(plantData().id, PRODUCT_STATUS.ACTIVE);
                              invalidateAllPlantCaches(plantData().id);
                              toaster.success(t("seller.products.plantOverview.publishSuccess") || "Plant published");
                            } catch (error: unknown) {
                              const err = error as { message?: string };
                              toaster.error(err.message || "Failed to publish plant");
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                        >
                          <SunIcon class="w-4 h-4" />
                          {t("seller.products.plantOverview.publishPlant") || "Publish plant"}
                        </button>
                      </Show>
                      <Show when={plantData().status === PRODUCT_STATUS.ACTIVE}>
                        <button
                          type="button"
                          disabled={actionLoading()}
                          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
                          onClick={async () => {
                            if (!confirm(t("seller.products.plantOverview.confirmArchive") || "Archive this plant?")) return;
                            setActionLoading(true);
                            try {
                              await updatePlantStatus(plantData().id, PRODUCT_STATUS.ARCHIVED);
                              invalidateAllPlantCaches(plantData().id);
                              toaster.success(t("seller.products.plantOverview.archiveSuccess") || "Plant archived");
                            } catch (error: unknown) {
                              const err = error as { message?: string };
                              toaster.error(err.message || "Failed to archive plant");
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                        >
                          <ArchiveIcon class="w-4 h-4" />
                          {t("seller.products.plantOverview.archivePlant")}
                        </button>
                      </Show>
                      <button
                        type="button"
                        disabled={actionLoading()}
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-terracotta-600 dark:text-terracotta-400 disabled:opacity-50"
                        onClick={async () => {
                          const name = plantData().translations?.find((tr) => tr.locale === "en")?.name ?? "";
                          const prompt = t("seller.products.plantOverview.confirmDelete") || `Type the plant name to delete: ${name}`;
                          const typed = window.prompt(prompt);
                          if (typed !== name) return;
                          setActionLoading(true);
                          try {
                            await deletePlant(plantData().id);
                            invalidateAllPlantCaches(plantData().id);
                            toaster.success(t("seller.products.plantOverview.deleteSuccess") || "Plant deleted");
                            navigate("/app/seller/products/plants");
                          } catch (error: unknown) {
                            const err = error as { message?: string };
                            toaster.error(err.message || "Failed to delete plant");
                          } finally {
                            setActionLoading(false);
                          }
                        }}
                      >
                        <TrashIcon class="w-4 h-4" />
                        {t("seller.products.plantOverview.deletePlant")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Show>
    </ErrorBoundary>
  );
}
