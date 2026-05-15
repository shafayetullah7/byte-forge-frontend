import { For, Show, type JSX } from "solid-js";
import { ErrorBoundary } from "solid-js";
import { useParams, createAsync } from "@solidjs/router";
import { getPlantById } from "~/lib/api/endpoints/seller/plants.api";
import {
  FolderIcon,
  InfoCircleIcon,
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
  PencilIcon,
  ArchiveIcon,
  ArrowPathIcon,
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

// ─── Care Card Component ────────────────────────────────────────────

function CareCard(props: {
  icon: JSX.Element;
  title: string;
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
      <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.title}</h4>
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.description}</p>
    </div>
  );
}

// ─── Instruction Row Component ──────────────────────────────────────

function InstructionRow(props: {
  icon: JSX.Element;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string | null;
}) {
  return (
    <div class={`flex gap-4 p-4 rounded-lg ${props.bgColor}`}>
      <div class={`${props.iconColor} flex-shrink-0 mt-0.5`}>{props.icon}</div>
      <div>
        <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.title}</h4>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.description || "—"}</p>
      </div>
    </div>
  );
}

// ─── Main Overview Route ────────────────────────────────────────────

export default function OverviewRoute() {
  const params = useParams();

  const plant = createAsync(
    () => getPlantById(params.plantId as string),
    { deferStream: true }
  );

  return (
    <ErrorBoundary fallback={(error) => (
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p class="text-sm text-amber-700 dark:text-amber-300">
          Failed to load plant details: {error.message}
        </p>
      </div>
    )}>
      <Show when={plant()}>
        {(plantData) => {
          const totalStock = (plantData().variants ?? []).reduce((sum, v) => sum + v.inventoryCount, 0);
          const inventory = getInventoryStatus(totalStock);

          return (
            <div class="space-y-6">

              {/* ─── Thumbnail + Translations Card ─── */}
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
                <div class="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
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

                  {/* Translations & Info */}
                  <div class="flex-1 p-6">
                    <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">English</h2>
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
                        <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">বাংলা</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {plantData().translations?.find(t => t.locale === "bn")?.description ?? ""}
                        </p>
                      </div>
                    )}

                    <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Scientific Name: <span class="text-gray-700 dark:text-gray-300 italic">{plantData().plantDetails?.scientificName ?? "—"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Two-Column Layout ─── */}
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div class="lg:col-span-2 space-y-6">

                  {/* ─── Classification & Details ─── */}
                  <SectionCard
                    title="Classification & Details"
                    icon={<SproutIcon class="w-4 h-4 text-gray-400" />}
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <div>
                        <DetailRow
                          label="Category"
                          value={
                            plantData().plantDetails?.category?.translations?.find(t => t.locale === "en")?.name
                              ?? plantData().plantDetails?.category?.translations?.[0]?.name ?? "—"
                          }
                          icon={<FolderIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Scientific Name"
                          value={plantData().plantDetails?.scientificName ?? "—"}
                          icon={<InfoCircleIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Common Names (EN)"
                          value={
                            plantData().plantDetails?.translations?.find(t => t.locale === "en")?.commonNames
                              ?? plantData().plantDetails?.translations?.[0]?.commonNames ?? "—"
                          }
                          icon={<ChatBubbleLeftRightIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Origin"
                          value={
                            plantData().plantDetails?.translations?.find(t => t.locale === "en")?.origin
                              ?? plantData().plantDetails?.translations?.[0]?.origin ?? "—"
                          }
                          icon={<GlobeAltIcon class="w-4 h-4" />}
                        />
                      </div>
                      <div>
                        <DetailRow
                          label="Soil Type"
                          value={
                            plantData().plantDetails?.translations?.find(t => t.locale === "en")?.soilType
                              ?? plantData().plantDetails?.translations?.[0]?.soilType ?? "—"
                          }
                          icon={<BeakerIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Mature Height"
                          value={plantData().plantDetails?.matureHeight ?? "—"}
                          icon={<RulerIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Mature Spread"
                          value={plantData().plantDetails?.matureSpread ?? "—"}
                          icon={<RulerIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Toxicity"
                          value={
                            plantData().plantDetails?.translations?.find(t => t.locale === "en")?.toxicityInfo
                              ?? plantData().plantDetails?.translations?.[0]?.toxicityInfo ?? "—"
                          }
                          icon={<ExclamationCircleIcon class="w-4 h-4" />}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <Show when={(plantData().plantDetails?.tags ?? []).length > 0}>
                      <div class="mt-4 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tags</p>
                        <div class="flex flex-wrap gap-2">
                          <For each={plantData().plantDetails?.tags ?? []}>
                            {(tag) => {
                              const name = tag.translations?.find(t => t.locale === "en")?.name
                                ?? tag.translations?.[0]?.name ?? tag.slug;
                              return (
                                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300 rounded-full text-xs font-medium border border-forest-200 dark:border-forest-700">
                                  <TagIcon class="w-3 h-3" />
                                  {name}
                                </span>
                              );
                            }}
                          </For>
                        </div>
                      </div>
                    </Show>
                  </SectionCard>

                  {/* ─── Care Requirements (Cards) ─── */}
                  <Show when={plantData().plantDetails}>
                    {(pd) => (
                      <SectionCard
                        title="Care Requirements"
                        icon={<CloudIcon class="w-4 h-4 text-gray-400" />}
                      >
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Show when={pd().lightRequirement}>
                            {(light) => (
                              <CareCard
                                icon={<SunIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />}
                                title="Light"
                                badge={{
                                  text: getLightLabel(light() as any),
                                  ...getLightColor(light() as any),
                                }}
                                description="Bright, indirect light. Avoid direct sunlight which can scorch variegated leaves."
                              />
                            )}
                          </Show>
                          <Show when={pd().wateringFrequency}>
                            {(watering) => (
                              <CareCard
                                icon={<DropletIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                title="Watering"
                                badge={{
                                  text: getWateringLabel(watering() as any),
                                  ...getWateringColor(watering() as any),
                                }}
                                description="Water when top 2-3 inches of soil are dry. Ensure thorough drainage."
                              />
                            )}
                          </Show>
                          <Show when={pd().humidityLevel}>
                            {(humidity) => (
                              <CareCard
                                icon={<CloudIcon class="w-5 h-5 text-sky-600 dark:text-sky-400" />}
                                title="Humidity"
                                badge={{
                                  text: getHumidityLabel(humidity() as any),
                                  ...getHumidityColor(humidity() as any),
                                }}
                                description="Maintain optimal humidity for growth."
                              />
                            )}
                          </Show>
                          <Show when={pd().temperatureRange}>
                            {(temp) => (
                              <CareCard
                                icon={<ThermometerIcon class="w-5 h-5 text-red-600 dark:text-red-400" />}
                                title="Temperature"
                                badge={{
                                  text: temp(),
                                  bg: "bg-red-100 dark:bg-red-900/40",
                                  textColor: "text-red-700 dark:text-red-300",
                                }}
                                description="Maintain temperature within range. Protect from cold drafts."
                              />
                            )}
                          </Show>
                          <Show when={pd().careDifficulty}>
                            {(difficulty) => (
                              <CareCard
                                icon={<SparklesIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />}
                                title="Care Difficulty"
                                badge={{
                                  text: getDifficultyLabel(difficulty() as any),
                                  ...getDifficultyColor(difficulty() as any),
                                }}
                                description="Care level required for this plant."
                              />
                            )}
                          </Show>
                          <Show when={pd().growthRate}>
                            {(growth) => (
                              <CareCard
                                icon={<SproutIcon class="w-5 h-5 text-sage-600 dark:text-sage-400" />}
                                title="Growth Rate"
                                badge={{
                                  text: getGrowthRateLabel(growth() as any),
                                  bg: "bg-sage-100 dark:bg-sage-900/40",
                                  textColor: "text-sage-700 dark:text-sage-300",
                                }}
                                description="Expected growth rate under optimal conditions."
                              />
                            )}
                          </Show>
                        </div>
                      </SectionCard>
                    )}
                  </Show>

                  {/* ─── Care Instructions ─── */}
                  <Show when={plantData().careInstructions}>
                    {(ci) => {
                      const careEn = ci().translations?.find(t => t.locale === "en") || ci();
                      return (
                        <SectionCard
                          title="Care Instructions"
                          icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
                        >
                          <div class="space-y-4">
                            <InstructionRow
                              icon={<SunIcon class="w-5 h-5" />}
                              iconColor="text-cream-600 dark:text-cream-400"
                              bgColor="bg-cream-50 dark:bg-forest-900/30"
                              title="Light Care"
                              description={careEn.lightInstructions}
                            />
                            <InstructionRow
                              icon={<DropletIcon class="w-5 h-5" />}
                              iconColor="text-blue-600 dark:text-blue-400"
                              bgColor="bg-blue-50 dark:bg-blue-900/20"
                              title="Watering Guide"
                              description={careEn.wateringInstructions}
                            />
                            <InstructionRow
                              icon={<CloudIcon class="w-5 h-5" />}
                              iconColor="text-sky-600 dark:text-sky-400"
                              bgColor="bg-sky-50 dark:bg-sky-900/20"
                              title="Humidity Care"
                              description={careEn.humidityInstructions}
                            />
                            <InstructionRow
                              icon={<BeakerIcon class="w-5 h-5" />}
                              iconColor="text-sage-600 dark:text-sage-400"
                              bgColor="bg-sage-50 dark:bg-sage-900/20"
                              title="Fertilizer Schedule"
                              description={careEn.fertilizerSchedule}
                            />
                            <InstructionRow
                              icon={<SproutIcon class="w-5 h-5" />}
                              iconColor="text-forest-600 dark:text-forest-400"
                              bgColor="bg-forest-50 dark:bg-forest-900/20"
                              title="Repotting"
                              description={careEn.repottingFrequency}
                            />
                            <InstructionRow
                              icon={<ScissorsIcon class="w-5 h-5" />}
                              iconColor="text-purple-600 dark:text-purple-400"
                              bgColor="bg-purple-50 dark:bg-purple-900/20"
                              title="Pruning"
                              description={careEn.pruningNotes}
                            />
                            <InstructionRow
                              icon={<ExclamationCircleIcon class="w-5 h-5" />}
                              iconColor="text-red-600 dark:text-red-400"
                              bgColor="bg-red-50 dark:bg-red-900/20"
                              title="Common Problems"
                              description={careEn.commonProblems}
                            />
                            <InstructionRow
                              icon={<CalendarIcon class="w-5 h-5" />}
                              iconColor="text-amber-600 dark:text-amber-400"
                              bgColor="bg-amber-50 dark:bg-amber-900/20"
                              title="Seasonal Care"
                              description={careEn.seasonalCare}
                            />
                          </div>
                        </SectionCard>
                      );
                    }}
                  </Show>

                  {/* ─── Pricing & Inventory ─── */}
                  <SectionCard
                    title="Pricing & Inventory"
                    icon={<DollarSignIcon class="w-4 h-4 text-gray-400" />}
                  >
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Price Range</p>
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
                        <p class="text-sm text-gray-500 dark:text-gray-400">Total Inventory</p>
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
                        <p class="text-sm text-gray-500 dark:text-gray-400">Variants</p>
                        <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                          {plantData().variants?.length ?? 0}
                        </p>
                      </div>
                    </div>
                  </SectionCard>
                </div>

                {/* Right Column (1/3) */}
                <div class="space-y-6">

                  {/* ─── Care Profile ─── */}
                  <Show when={plantData().plantDetails}>
                    {(pd) => (
                      <SectionCard
                        title="Care Profile"
                        icon={<SunIcon class="w-4 h-4 text-gray-400" />}
                      >
                        <DetailRow
                          label="Light"
                          value={pd().lightRequirement ? getLightLabel(pd().lightRequirement as any) : "—"}
                          icon={<SunIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Watering"
                          value={pd().wateringFrequency ? getWateringLabel(pd().wateringFrequency as any) : "—"}
                          icon={<DropletIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Humidity"
                          value={pd().humidityLevel ? getHumidityLabel(pd().humidityLevel as any) : "—"}
                          icon={<MoonIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Temperature"
                          value={pd().temperatureRange ?? "—"}
                          icon={<ThermometerIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Difficulty"
                          value={pd().careDifficulty ? getDifficultyLabel(pd().careDifficulty as any) : "—"}
                          icon={<TrendingUpIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Growth Rate"
                          value={pd().growthRate ? getGrowthRateLabel(pd().growthRate as any) : "—"}
                          icon={<TrendingUpIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Mature Height"
                          value={pd().matureHeight ?? "—"}
                          icon={<RulerIcon class="w-4 h-4" />}
                        />
                        <DetailRow
                          label="Mature Spread"
                          value={pd().matureSpread ?? "—"}
                          icon={<RulerIcon class="w-4 h-4" />}
                        />
                      </SectionCard>
                    )}
                  </Show>

                  {/* ─── Variant Preview ─── */}
                  <Show when={(plantData().variants ?? []).length > 0}>
                    <SectionCard
                      title={`Variants (${plantData().variants?.length ?? 0})`}
                      icon={<CubeIcon class="w-4 h-4 text-gray-400" />}
                      action={
                        <a href={`/app/seller/products/plants/${plantData().id}/variants`} class="text-xs text-forest-600 dark:text-forest-400 hover:underline">
                          View All
                        </a>
                      }
                    >
                      <div class="space-y-3">
                        <For each={(plantData().variants ?? []).slice(0, 2)}>
                          {(variant) => {
                            const inv = getInventoryStatus(variant.inventoryCount);
                            const title = variant.translations?.find(t => t.locale === "en")?.title
                              ?? variant.translations?.[0]?.title ?? `Variant ${variant.id}`;
                            const attrs = variant.plantAttributes;

                            return (
                              <div class="border border-cream-200 dark:border-forest-700 rounded-lg p-4 hover:bg-cream-50 dark:hover:bg-forest-700/30 transition-colors">
                                <div class="flex items-start justify-between mb-2">
                                  <div>
                                    <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">{title}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{variant.sku ?? "—"}</p>
                                  </div>
                                  <Badge variant={inv.variant} class="text-xs">
                                    {inv.label}
                                  </Badge>
                                </div>
                                <div class="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Price</p>
                                    <p class="text-sm font-bold text-forest-800 dark:text-cream-50">{formatPrice(variant.price)}</p>
                                  </div>
                                  <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Stock</p>
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
                    title="Details"
                    icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
                  >
                    <DetailRow
                      label="Created"
                      value={formatDateTime(plantData().createdAt)}
                      icon={<CalendarIcon class="w-4 h-4" />}
                    />
                    <DetailRow
                      label="Last Updated"
                      value={formatDateTime(plantData().updatedAt)}
                      icon={<ClockIcon class="w-4 h-4" />}
                    />
                    <DetailRow
                      label="Plant ID"
                      value={plantData().id}
                      icon={<CheckBadgeIcon class="w-4 h-4" />}
                    />
                  </SectionCard>

                  {/* ─── Quick Actions ─── */}
                  <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
                    <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700">
                      <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">Quick Actions</h3>
                    </div>
                    <div class="p-4 space-y-1">
                      <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                        <PencilIcon class="w-4 h-4" />
                        Edit Plant
                      </button>
                      <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                        <ArchiveIcon class="w-4 h-4" />
                        Archive Plant
                      </button>
                      <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                        <ArrowPathIcon class="w-4 h-4" />
                        Duplicate Plant
                      </button>
                      <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-terracotta-600 dark:text-terracotta-400">
                        <TrashIcon class="w-4 h-4" />
                        Delete Plant
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
