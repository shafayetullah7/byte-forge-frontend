import { For } from "solid-js";
import { PackageIcon, FolderIcon, InfoCircleIcon, ChatBubbleLeftRightIcon, GlobeAltIcon, CubeIcon, ExclamationCircleIcon, TagIcon, DollarSignIcon, SunIcon, DropletIcon, MoonIcon, TrendingUpIcon, ThermometerIcon, ClockIcon, CalendarIcon, CheckBadgeIcon, PencilIcon, ArchiveIcon, ArrowPathIcon, TrashIcon } from "~/components/icons";
import { SectionCard } from "./components/SectionCard";
import { DetailRow } from "./components/DetailRow";
import { getStatusVariant, getInventoryStatus, formatPrice, formatDateTime, getLightLabel, getWateringLabel, getHumidityLabel, getDifficultyLabel, getGrowthRateLabel } from "./helpers";
import { MOCK_PLANT } from "./mock-data";
import Badge from "~/components/ui/Badge";

export default function OverviewRoute() {
  const plant = MOCK_PLANT;
  const inventory = getInventoryStatus(plant.inventoryCount);

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Plant Info */}
      <div class="lg:col-span-2 space-y-6">
        {/* Description */}
        <SectionCard
          title="Description"
          icon={<PackageIcon class="w-4 h-4 text-gray-400" />}
        >
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {plant.description}
          </p>
        </SectionCard>

        {/* Classification */}
        <SectionCard
          title="Classification & Details"
          icon={<FolderIcon class="w-4 h-4 text-gray-400" />}
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
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
            <DetailRow
              label="Soil Type"
              value={plant.plantDetails.translations.en.soilType}
              icon={<CubeIcon class="w-4 h-4" />}
            />
            <DetailRow
              label="Toxicity"
              value={plant.plantDetails.translations.en.toxicityInfo}
              icon={<ExclamationCircleIcon class="w-4 h-4" />}
            />
          </div>

          {/* Tags */}
          <div class="mt-4 pt-4 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</p>
            <div class="flex flex-wrap gap-2">
              <For each={plant.tags}>
                {(tag) => (
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                    {tag.name}
                  </span>
                )}
              </For>
            </div>
          </div>
        </SectionCard>

        {/* Pricing & Inventory */}
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

      {/* Right Column - Care Profile & Quick Info */}
      <div class="space-y-6">
        {/* Care Profile */}
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
            label="Temperature"
            value={plant.plantDetails.temperatureRange!}
            icon={<ThermometerIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Mature Height"
            value={plant.plantDetails.matureHeight!}
            icon={<TrendingUpIcon class="w-4 h-4" />}
          />
          <DetailRow
            label="Mature Spread"
            value={plant.plantDetails.matureSpread!}
            icon={<TrendingUpIcon class="w-4 h-4" />}
          />
        </SectionCard>

        {/* Timestamps */}
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

        {/* Quick Actions */}
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-3">Quick Actions</h3>
          <div class="space-y-2">
            <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
              <PencilIcon class="w-4 h-4" />
              Edit Plant
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
              <ArchiveIcon class="w-4 h-4" />
              Archive Plant
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
              <ArrowPathIcon class="w-4 h-4" />
              Duplicate Plant
            </button>
            <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-terracotta-600 dark:text-terracotta-400">
              <TrashIcon class="w-4 h-4" />
              Delete Plant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
