import { For, Show } from "solid-js";
import { ErrorBoundary } from "solid-js";
import {
  PackageIcon,
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
  getLeafDensityLabel,
  getPropagationLabel,
  getContainerTypeLabel,
} from "./helpers";
import { MOCK_PLANT } from "./mock-data";
import Badge from "~/components/ui/Badge";

// ─── Care Card Component ────────────────────────────────────────────

function CareCard(props: {
  icon: any;
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
  icon: any;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}) {
  return (
    <div class={`flex gap-4 p-4 rounded-lg ${props.bgColor}`}>
      <div class={`${props.iconColor} flex-shrink-0 mt-0.5`}>{props.icon}</div>
      <div>
        <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">{props.title}</h4>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{props.description}</p>
      </div>
    </div>
  );
}

// ─── Main Overview Route ────────────────────────────────────────────

export default function OverviewRoute() {
  const plant = MOCK_PLANT;
  const inventory = getInventoryStatus(plant.inventoryCount);

  return (
    <ErrorBoundary fallback={(error) => (
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p class="text-sm text-amber-700 dark:text-amber-300">
          Failed to load plant details: {error.message}
        </p>
      </div>
    )}>
      <div class="space-y-6">

        {/* ─── Thumbnail + Translations Card ─── */}
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
          <div class="flex flex-col sm:flex-row">
            {/* Thumbnail */}
            <div class="sm:w-64 md:w-72 h-56 sm:h-auto bg-cream-100 dark:bg-forest-900/50 flex items-center justify-center flex-shrink-0 border-b sm:border-b-0 sm:border-r border-cream-200 dark:border-forest-700">
              {plant.thumbnail?.url ? (
                <img
                  src={plant.thumbnail.url}
                  alt={plant.name}
                  class="w-full h-full object-cover"
                />
              ) : (
                <LeafIcon class="w-20 h-20 text-gray-300 dark:text-gray-600" />
              )}
            </div>

            {/* Translations & Info */}
            <div class="flex-1 p-6">
              <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">English</h2>
              <p class="text-xl font-semibold text-forest-800 dark:text-cream-50 mb-2">{plant.name}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{plant.shortDescription}</p>

              <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50 mb-1">বাংলা</h2>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{plant.description}</p>
              </div>

              <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Scientific Name: <span class="text-gray-700 dark:text-gray-300 italic">{plant.scientificName}</span>
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
                    value={plant.category.name}
                    icon={<FolderIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Scientific Name"
                    value={plant.scientificName}
                    icon={<InfoCircleIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Common Names (EN)"
                    value={plant.plantDetails.translations.en.commonNames}
                    icon={<ChatBubbleLeftRightIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Common Names (BN)"
                    value={plant.plantDetails.translations.bn.commonNames}
                    icon={<ChatBubbleLeftRightIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Origin"
                    value={plant.plantDetails.translations.en.origin}
                    icon={<GlobeAltIcon class="w-4 h-4" />}
                  />
                </div>
                <div>
                  <DetailRow
                    label="Soil Type"
                    value={plant.plantDetails.translations.en.soilType}
                    icon={<BeakerIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Mature Height"
                    value={plant.plantDetails.matureHeight}
                    icon={<RulerIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Mature Spread"
                    value={plant.plantDetails.matureSpread}
                    icon={<RulerIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Toxicity"
                    value={plant.plantDetails.translations.en.toxicityInfo}
                    icon={<ExclamationCircleIcon class="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Tags */}
              <div class="mt-4 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tags</p>
                <div class="flex flex-wrap gap-2">
                  <For each={plant.tags}>
                    {(tag) => (
                      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300 rounded-full text-xs font-medium border border-forest-200 dark:border-forest-700">
                        <TagIcon class="w-3 h-3" />
                        {tag.name}
                      </span>
                    )}
                  </For>
                </div>
              </div>
            </SectionCard>

            {/* ─── Care Requirements (Cards) ─── */}
            <SectionCard
              title="Care Requirements"
              icon={<CloudIcon class="w-4 h-4 text-gray-400" />}
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CareCard
                  icon={<SunIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />}
                  title="Light"
                  badge={{
                    text: getLightLabel(plant.plantDetails.lightRequirement),
                    ...getLightColor(plant.plantDetails.lightRequirement),
                  }}
                  description="Bright, indirect light. Avoid direct sunlight which can scorch variegated leaves."
                />
                <CareCard
                  icon={<DropletIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  title="Watering"
                  badge={{
                    text: getWateringLabel(plant.plantDetails.wateringFrequency),
                    ...getWateringColor(plant.plantDetails.wateringFrequency),
                  }}
                  description="Water when top 2-3 inches of soil are dry. Ensure thorough drainage."
                />
                <CareCard
                  icon={<CloudIcon class="w-5 h-5 text-sky-600 dark:text-sky-400" />}
                  title="Humidity"
                  badge={{
                    text: getHumidityLabel(plant.plantDetails.humidityLevel),
                    ...getHumidityColor(plant.plantDetails.humidityLevel),
                  }}
                  description="Maintain 60-80% humidity for optimal growth and variegation."
                />
                <CareCard
                  icon={<ThermometerIcon class="w-5 h-5 text-red-600 dark:text-red-400" />}
                  title="Temperature"
                  badge={{
                    text: plant.plantDetails.temperatureRange,
                    bg: "bg-red-100 dark:bg-red-900/40",
                    textColor: "text-red-700 dark:text-red-300",
                  }}
                  description="Keep between 18°C - 27°C. Protect from cold drafts and sudden changes."
                />
                <CareCard
                  icon={<SparklesIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />}
                  title="Care Difficulty"
                  badge={{
                    text: getDifficultyLabel(plant.plantDetails.careDifficulty),
                    ...getDifficultyColor(plant.plantDetails.careDifficulty),
                  }}
                  description="Intermediate level care. Requires some experience with tropical plants."
                />
                <CareCard
                  icon={<SproutIcon class="w-5 h-5 text-sage-600 dark:text-sage-400" />}
                  title="Growth Rate"
                  badge={{
                    text: getGrowthRateLabel(plant.plantDetails.growthRate!),
                    bg: "bg-sage-100 dark:bg-sage-900/40",
                    textColor: "text-sage-700 dark:text-sage-300",
                  }}
                  description="Moderate growth. New leaves appear every 4-6 weeks during growing season."
                />
              </div>
            </SectionCard>

            {/* ─── Care Instructions ─── */}
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
                  description={plant.careGuide.en.lightInstructions}
                />
                <InstructionRow
                  icon={<DropletIcon class="w-5 h-5" />}
                  iconColor="text-blue-600 dark:text-blue-400"
                  bgColor="bg-blue-50 dark:bg-blue-900/20"
                  title="Watering Guide"
                  description={plant.careGuide.en.wateringInstructions}
                />
                <InstructionRow
                  icon={<CloudIcon class="w-5 h-5" />}
                  iconColor="text-sky-600 dark:text-sky-400"
                  bgColor="bg-sky-50 dark:bg-sky-900/20"
                  title="Humidity Care"
                  description={plant.careGuide.en.humidityInstructions}
                />
                <InstructionRow
                  icon={<BeakerIcon class="w-5 h-5" />}
                  iconColor="text-sage-600 dark:text-sage-400"
                  bgColor="bg-sage-50 dark:bg-sage-900/20"
                  title="Fertilizer Schedule"
                  description={plant.careGuide.en.fertilizerSchedule}
                />
                <InstructionRow
                  icon={<SproutIcon class="w-5 h-5" />}
                  iconColor="text-forest-600 dark:text-forest-400"
                  bgColor="bg-forest-50 dark:bg-forest-900/20"
                  title="Repotting"
                  description={plant.careGuide.en.repottingFrequency}
                />
                <InstructionRow
                  icon={<ScissorsIcon class="w-5 h-5" />}
                  iconColor="text-purple-600 dark:text-purple-400"
                  bgColor="bg-purple-50 dark:bg-purple-900/20"
                  title="Pruning"
                  description={plant.careGuide.en.pruningNotes}
                />
                <InstructionRow
                  icon={<ExclamationCircleIcon class="w-5 h-5" />}
                  iconColor="text-red-600 dark:text-red-400"
                  bgColor="bg-red-50 dark:bg-red-900/20"
                  title="Common Problems"
                  description={plant.careGuide.en.commonProblems}
                />
                <InstructionRow
                  icon={<CalendarIcon class="w-5 h-5" />}
                  iconColor="text-amber-600 dark:text-amber-400"
                  bgColor="bg-amber-50 dark:bg-amber-900/20"
                  title="Seasonal Care"
                  description={plant.careGuide.en.seasonalCare}
                />
              </div>
            </SectionCard>

            {/* ─── Pricing & Inventory ─── */}
            <SectionCard
              title="Pricing & Inventory"
              icon={<DollarSignIcon class="w-4 h-4 text-gray-400" />}
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Base Price</p>
                  <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                    {formatPrice(plant.price)}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Total Inventory</p>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                      {plant.inventoryCount}
                    </p>
                    <Badge variant={inventory.variant} class="text-xs">
                      {inventory.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Variants</p>
                  <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                    {plant.variants.length}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Column (1/3) */}
          <div class="space-y-6">

            {/* ─── Care Profile ─── */}
            <SectionCard
              title="Care Profile"
              icon={<SunIcon class="w-4 h-4 text-gray-400" />}
            >
              <DetailRow
                label="Light"
                value={getLightLabel(plant.plantDetails.lightRequirement)}
                icon={<SunIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Watering"
                value={getWateringLabel(plant.plantDetails.wateringFrequency)}
                icon={<DropletIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Humidity"
                value={getHumidityLabel(plant.plantDetails.humidityLevel)}
                icon={<MoonIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Temperature"
                value={plant.plantDetails.temperatureRange}
                icon={<ThermometerIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Difficulty"
                value={getDifficultyLabel(plant.plantDetails.careDifficulty)}
                icon={<TrendingUpIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Growth Rate"
                value={getGrowthRateLabel(plant.plantDetails.growthRate!)}
                icon={<TrendingUpIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Mature Height"
                value={plant.plantDetails.matureHeight}
                icon={<RulerIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Mature Spread"
                value={plant.plantDetails.matureSpread}
                icon={<RulerIcon class="w-4 h-4" />}
              />
            </SectionCard>

            {/* ─── Variant Preview ─── */}
            <SectionCard
              title={`Variants (${plant.variants.length})`}
              icon={<CubeIcon class="w-4 h-4 text-gray-400" />}
              action={
                <a href={`/app/seller/products/plants/${plant.id}/variants`} class="text-xs text-forest-600 dark:text-forest-400 hover:underline">
                  View All
                </a>
              }
            >
              <div class="space-y-3">
                <For each={plant.variants.slice(0, 2)}>
                  {(variant) => {
                    const inv = getInventoryStatus(variant.inventoryCount);
                    return (
                      <div class="border border-cream-200 dark:border-forest-700 rounded-lg p-4 hover:bg-cream-50 dark:hover:bg-forest-700/30 transition-colors">
                        <div class="flex items-start justify-between mb-2">
                          <div>
                            <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">{variant.title}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{variant.sku}</p>
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
                        <div class="flex flex-wrap gap-1.5 pt-2 border-t border-cream-200 dark:border-forest-700">
                          <span class="text-xs px-2 py-0.5 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300 rounded-full">
                            {getGrowthStageLabel(variant.attributes.growthStage)}
                          </span>
                          <span class="text-xs px-2 py-0.5 bg-cream-50 dark:bg-cream-900/30 text-cream-700 dark:text-cream-300 rounded-full">
                            {getPlantFormLabel(variant.attributes.plantForm)}
                          </span>
                          <span class="text-xs px-2 py-0.5 bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 rounded-full">
                            {getVariegationLabel(variant.attributes.variegation)}
                          </span>
                          {variant.images.length > 0 && (
                            <span class="text-xs px-2 py-0.5 bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 rounded-full flex items-center gap-1">
                              <ImageIcon class="w-3 h-3" />
                              {variant.images.length}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </SectionCard>

            {/* ─── Timestamps ─── */}
            <SectionCard
              title="Details"
              icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
            >
              <DetailRow
                label="Created"
                value={formatDateTime(plant.createdAt)}
                icon={<CalendarIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Last Updated"
                value={formatDateTime(plant.updatedAt)}
                icon={<ClockIcon class="w-4 h-4" />}
              />
              <DetailRow
                label="Plant ID"
                value={plant.id}
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
    </ErrorBoundary>
  );
}
