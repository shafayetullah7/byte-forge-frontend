import { createSignal, createMemo, createEffect, For, Show, Suspense, ErrorBoundary, onCleanup } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { getPublicPlants } from "~/lib/api/endpoints/public/plants.api";
import type {
  PublicPlantListItem,
  PublicPlantFilter,
} from "~/lib/api/types/public/plants.types";
import {
  LeafIcon,
  MagnifyingGlassIcon,
  FilterIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SunIcon,
  DropletIcon,
  CubeIcon,
} from "~/components/icons";
import { Button } from "~/components/ui";

// ========================
// Helpers
// ========================

function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "\u2014";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `\u09f3${num.toLocaleString("en-BD")}`;
}

function getInventoryLabel(count: number): string {
  if (count === 0) return "Out of Stock";
  if (count <= 5) return `Only ${count} left`;
  if (count <= 20) return `${count} in stock`;
  return "In Stock";
}

function getDifficultyLabel(difficulty: string | null): string {
  if (!difficulty) return "";
  switch (difficulty) {
    case "BEGINNER": return "Easy";
    case "INTERMEDIATE": return "Medium";
    case "EXPERT": return "Advanced";
    default: return "";
  }
}

function getDifficultyColor(difficulty: string | null): string {
  if (!difficulty) return "";
  switch (difficulty) {
    case "BEGINNER": return "bg-forest-500/90 text-white";
    case "INTERMEDIATE": return "bg-sage-500/90 text-white";
    case "EXPERT": return "bg-terracotta-500/90 text-white";
    default: return "";
  }
}

function lightLabel(light: string | null): string {
  if (!light) return "";
  switch (light) {
    case "LOW": return "Low";
    case "MEDIUM": return "Medium";
    case "BRIGHT_INDIRECT": return "Bright";
    case "DIRECT": return "Direct";
    default: return light;
  }
}

function wateringLabel(freq: string | null): string {
  if (!freq) return "";
  switch (freq) {
    case "DAILY": return "Daily";
    case "WEEKLY": return "Weekly";
    case "BI_WEEKLY": return "Bi-weekly";
    case "MONTHLY": return "Monthly";
    default: return freq;
  }
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

// ========================
// Filter Section (Sidebar)
// ========================

const CARE_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "EXPERT", label: "Expert" },
];

const LIGHT_OPTIONS = [
  { value: "LOW", label: "Low Light" },
  { value: "MEDIUM", label: "Medium Light" },
  { value: "BRIGHT_INDIRECT", label: "Bright Indirect" },
  { value: "DIRECT", label: "Direct Sunlight" },
];

const WATERING_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "BI_WEEKLY", label: "Bi-Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

const HUMIDITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

const GROWTH_OPTIONS = [
  { value: "SLOW", label: "Slow" },
  { value: "MODERATE", label: "Moderate" },
  { value: "FAST", label: "Fast" },
];

function FilterSection(props: {
  careDifficulty: () => string;
  setCareDifficulty: (v: string) => void;
  lightRequirement: () => string;
  setLightRequirement: (v: string) => void;
  wateringFrequency: () => string;
  setWateringFrequency: (v: string) => void;
  humidityLevel: () => string;
  setHumidityLevel: (v: string) => void;
  growthRate: () => string;
  setGrowthRate: (v: string) => void;
  minPrice: () => string;
  setMinPrice: (v: string) => void;
  maxPrice: () => string;
  setMaxPrice: (v: string) => void;
  inStockOnly: () => boolean;
  setInStockOnly: (v: boolean) => void;
  hasActiveFilters: () => boolean;
  clearFilters: () => void;
  setCurrentPage: (v: number) => void;
}) {
  const setCare = (v: string) => { props.setCareDifficulty(v); props.setCurrentPage(1); };
  const setLight = (v: string) => { props.setLightRequirement(v); props.setCurrentPage(1); };
  const setWater = (v: string) => { props.setWateringFrequency(v); props.setCurrentPage(1); };
  const setHum = (v: string) => { props.setHumidityLevel(v); props.setCurrentPage(1); };
  const setGrowth = (v: string) => { props.setGrowthRate(v); props.setCurrentPage(1); };
  const setMin = (v: string) => { props.setMinPrice(v); props.setCurrentPage(1); };
  const setMax = (v: string) => { props.setMaxPrice(v); props.setCurrentPage(1); };
  const setStock = (v: boolean) => { props.setInStockOnly(v); props.setCurrentPage(1); };

  return (
    <div class="space-y-5">
      {/* Clear All */}
      <Show when={props.hasActiveFilters()}>
        <button
          onClick={props.clearFilters}
          class="w-full text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium py-1"
        >
          Clear All Filters
        </button>
      </Show>

      {/* Care Level */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Care Level
        </label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="careDifficulty"
              value=""
              checked={props.careDifficulty() === ""}
              onChange={() => setCare("")}
              class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">Any Level</span>
          </label>
          <For each={CARE_OPTIONS}>
            {(opt) => (
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="careDifficulty"
                  value={opt.value}
                  checked={props.careDifficulty() === opt.value}
                  onChange={() => setCare(opt.value)}
                  class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{opt.label}</span>
              </label>
            )}
          </For>
        </div>
      </div>

      {/* Light */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Light
        </label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="lightRequirement"
              value=""
              checked={props.lightRequirement() === ""}
              onChange={() => setLight("")}
              class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">Any Light</span>
          </label>
          <For each={LIGHT_OPTIONS}>
            {(opt) => (
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="lightRequirement"
                  value={opt.value}
                  checked={props.lightRequirement() === opt.value}
                  onChange={() => setLight(opt.value)}
                  class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{opt.label}</span>
              </label>
            )}
          </For>
        </div>
      </div>

      {/* Watering */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Watering
        </label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="wateringFrequency"
              value=""
              checked={props.wateringFrequency() === ""}
              onChange={() => setWater("")}
              class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">Any Frequency</span>
          </label>
          <For each={WATERING_OPTIONS}>
            {(opt) => (
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="wateringFrequency"
                  value={opt.value}
                  checked={props.wateringFrequency() === opt.value}
                  onChange={() => setWater(opt.value)}
                  class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{opt.label}</span>
              </label>
            )}
          </For>
        </div>
      </div>

      {/* Humidity */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Humidity
        </label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="humidityLevel"
              value=""
              checked={props.humidityLevel() === ""}
              onChange={() => setHum("")}
              class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">Any Level</span>
          </label>
          <For each={HUMIDITY_OPTIONS}>
            {(opt) => (
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="humidityLevel"
                  value={opt.value}
                  checked={props.humidityLevel() === opt.value}
                  onChange={() => setHum(opt.value)}
                  class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{opt.label}</span>
              </label>
            )}
          </For>
        </div>
      </div>

      {/* Growth Rate */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Growth Rate
        </label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="growthRate"
              value=""
              checked={props.growthRate() === ""}
              onChange={() => setGrowth("")}
              class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">Any Rate</span>
          </label>
          <For each={GROWTH_OPTIONS}>
            {(opt) => (
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="growthRate"
                  value={opt.value}
                  checked={props.growthRate() === opt.value}
                  onChange={() => setGrowth(opt.value)}
                  class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{opt.label}</span>
              </label>
            )}
          </For>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price Range (৳)
        </label>
        <div class="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={props.minPrice()}
            onInput={(e) => setMin(e.currentTarget.value)}
            min="0"
            class="w-full px-3 py-2 rounded-lg border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-sm transition-standard focus-ring-flat"
          />
          <span class="text-gray-400 flex-shrink-0">—</span>
          <input
            type="number"
            placeholder="Max"
            value={props.maxPrice()}
            onInput={(e) => setMax(e.currentTarget.value)}
            min="0"
            class="w-full px-3 py-2 rounded-lg border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-sm transition-standard focus-ring-flat"
          />
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <label class="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={props.inStockOnly()}
            onChange={(e) => setStock(e.currentTarget.checked)}
            class="w-4 h-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}

// ========================
// Plant Card
// ========================

function PlantCard(props: { plant: PublicPlantListItem }) {
  const plant = props.plant;
  const inStock = plant.inStock;

  return (
    <A
      href={`/plants/${plant.slug}`}
      class="group flex flex-col bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden hover:shadow-lg hover:border-forest-300 dark:hover:border-forest-600 transition-all duration-300"
    >
      {/* Image - 4:3 portrait */}
      <div class="relative aspect-[4/3] bg-cream-100 dark:bg-forest-900/50 overflow-hidden">
        <Show
          when={plant.thumbnail}
          fallback={
            <div class="w-full h-full flex items-center justify-center">
              <LeafIcon class="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
          }
        >
          {(thumbnail) => (
            <img
              src={thumbnail().url}
              alt={plant.name}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </Show>

        {/* Price Badge */}
        <div class="absolute bottom-3 left-3">
          <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/95 dark:bg-forest-900/95 backdrop-blur-sm shadow-sm text-sm font-bold text-forest-800 dark:text-cream-50">
            {formatPrice(plant.price)}
          </span>
        </div>

        {/* Badges */}
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
          <Show when={!inStock}>
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-terracotta-500/90 backdrop-blur-sm text-xs font-semibold text-white">
              Out of Stock
            </span>
          </Show>
          <Show when={inStock && plant.inventoryCount <= 5}>
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-cream-500/90 backdrop-blur-sm text-xs font-semibold text-cream-900">
              Only {plant.inventoryCount} left
            </span>
          </Show>
        </div>

        {/* Care Difficulty */}
        <Show when={plant.careDifficulty}>
          {(difficulty) => (
            <div class="absolute top-3 right-3">
              <span class={`inline-flex items-center px-2.5 py-1 rounded-lg backdrop-blur-sm text-xs font-semibold ${getDifficultyLabel(difficulty()) ? getDifficultyColor(difficulty()) : ""}`}>
                {getDifficultyLabel(difficulty())}
              </span>
            </div>
          )}
        </Show>
      </div>

      {/* Content */}
      <div class="p-4">
        {/* Name & Scientific Name */}
        <div class="mb-2">
          <h3 class="font-semibold text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-forest-300 transition-colors">
            {plant.name}
          </h3>
          <Show when={plant.scientificName}>
            {(name) => (
              <p class="text-xs italic text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                {name()}
              </p>
            )}
          </Show>
        </div>

        {/* Shop Info */}
        <Show when={plant.shop}>
          {(shop) => (
            <A
              href={`/shops/${shop().slug}`}
              class="inline-flex items-center gap-2 mb-3 px-2 py-1 rounded-lg hover:bg-cream-50 dark:hover:bg-forest-700/50 transition-colors group/shop"
            >
              <Show when={shop().logo}>
                {(logo) => (
                  <img
                    src={logo().url}
                    alt={shop().name}
                    class="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200 dark:ring-forest-600"
                  />
                )}
              </Show>
              <span class="text-xs text-gray-500 dark:text-gray-400 group-hover/shop:text-forest-600 dark:group-hover/shop:text-forest-300 transition-colors">
                {shop().name}
              </span>
            </A>
          )}
        </Show>

        {/* Tags - compact, max 3 */}
        <Show when={plant.tags.length > 0}>
          <div class="flex flex-wrap gap-1.5 mb-3">
            <For each={plant.tags.slice(0, 3)}>
              {(tag) => (
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-cream-100/80 text-cream-700 dark:bg-forest-700/60 dark:text-gray-300">
                  {tag.name || tag.slug}
                </span>
              )}
            </For>
          </div>
        </Show>

        {/* Care Info - Clean labels */}
        <div class="flex items-center gap-3 text-xs">
          <Show when={plant.lightRequirement}>
            {(light) => (
              <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`Light: ${light()}`}>
                <SunIcon class="w-3.5 h-3.5 text-amber-500" />
                {lightLabel(light())}
              </span>
            )}
          </Show>
          <Show when={plant.wateringFrequency}>
            {(freq) => (
              <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`Watering: ${freq()}`}>
                <DropletIcon class="w-3.5 h-3.5 text-blue-500" />
                {wateringLabel(freq())}
              </span>
            )}
          </Show>
          <span class={`inline-flex items-center gap-1 ${
            inStock ? "text-forest-600 dark:text-forest-400" : "text-terracotta-600 dark:text-terracotta-400"
          }`}>
            <CubeIcon class="w-3.5 h-3.5" />
            {inStock ? getInventoryLabel(plant.inventoryCount) : "Out of Stock"}
          </span>
        </div>
      </div>
    </A>
  );
}

// ========================
// Main Page
// ========================

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "inventory", label: "Availability" },
  { value: "difficulty", label: "Care Level" },
  { value: "createdAt", label: "Newest" },
];

export default function PlantsPage() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [careDifficulty, setCareDifficulty] = createSignal("");
  const [lightRequirement, setLightRequirement] = createSignal("");
  const [wateringFrequency, setWateringFrequency] = createSignal("");
  const [humidityLevel, setHumidityLevel] = createSignal("");
  const [growthRate, setGrowthRate] = createSignal("");
  const [minPrice, setMinPrice] = createSignal("");
  const [maxPrice, setMaxPrice] = createSignal("");
  const [inStockOnly, setInStockOnly] = createSignal<boolean>(false);
  const [sortBy, setSortBy] = createSignal("name");
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = createSignal(1);
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const ITEMS_PER_PAGE = 12;

  // Debounce search
  let debounceTimer: ReturnType<typeof setTimeout>;
  createEffect(() => {
    const query = searchQuery();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setDebouncedSearch(query);
      setCurrentPage(1);
    }, 300);
    
    onCleanup(() => clearTimeout(debounceTimer));
  });

  // Filter params memo
  const filterParams = createMemo<PublicPlantFilter>(() => ({
    page: currentPage(),
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch() || undefined,
    careDifficulty: (careDifficulty() || undefined) as PublicPlantFilter["careDifficulty"],
    lightRequirement: (lightRequirement() || undefined) as PublicPlantFilter["lightRequirement"],
    wateringFrequency: (wateringFrequency() || undefined) as PublicPlantFilter["wateringFrequency"],
    humidityLevel: (humidityLevel() || undefined) as PublicPlantFilter["humidityLevel"],
    growthRate: (growthRate() || undefined) as PublicPlantFilter["growthRate"],
    minPrice: minPrice() ? parseFloat(minPrice()) : undefined,
    maxPrice: maxPrice() ? parseFloat(maxPrice()) : undefined,
    inStockOnly: inStockOnly() || undefined,
    sortBy: sortBy() as PublicPlantFilter["sortBy"],
    sortOrder: sortOrder(),
  }));

  // API call
  const plantsData = createAsync(
    () => getPublicPlants(filterParams()),
    { deferStream: true }
  );

  // Extract data
  const plants = createMemo(() => plantsData()?.data ?? []);
  const meta = createMemo(() => plantsData()?.meta);
  const totalPages = createMemo(() => meta()?.pages ?? 1);
  const totalItems = createMemo(() => meta()?.total ?? 0);

  // Filter handlers
  const hasActiveFilters = createMemo(
    () =>
      !!debouncedSearch() ||
      !!careDifficulty() ||
      !!lightRequirement() ||
      !!wateringFrequency() ||
      !!humidityLevel() ||
      !!growthRate() ||
      !!minPrice() ||
      !!maxPrice() ||
      inStockOnly()
  );

  const activeFilterCount = createMemo(() => {
    let count = 0;
    if (debouncedSearch()) count++;
    if (careDifficulty()) count++;
    if (lightRequirement()) count++;
    if (wateringFrequency()) count++;
    if (humidityLevel()) count++;
    if (growthRate()) count++;
    if (minPrice()) count++;
    if (maxPrice()) count++;
    if (inStockOnly()) count++;
    return count;
  });

  const sortLabel = createMemo(() => {
    const option = SORT_OPTIONS.find((o) => o.value === sortBy());
    return option ? `${option.label} (${sortOrder() === "asc" ? "↑" : "↓"})` : "";
  });

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setCareDifficulty("");
    setLightRequirement("");
    setWateringFrequency("");
    setHumidityLevel("");
    setGrowthRate("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center p-6">
          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md w-full text-center">
            <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <LeafIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
              Failed to Load Plants
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {error?.message || "Something went wrong while fetching plants."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
            >
              Retry
            </Button>
          </div>
        </div>
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
        {/* Content Layout */}
        <div class="relative">

          {/* Mobile Filter Overlay */}
          <Show when={sidebarOpen()}>
            <div
              class="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          </Show>

          {/* Sidebar */}
          <aside
            class={`w-64 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700 overflow-y-auto ${
              sidebarOpen() ? "fixed inset-y-0 left-0 z-50" : "hidden lg:block"
            } lg:fixed lg:top-16 lg:left-0 lg:z-10 lg:h-[calc(100vh-4rem)]`}
          >
            {/* Mobile Header */}
            <div class="lg:hidden flex items-center justify-between p-4 border-b border-cream-200 dark:border-forest-700 sticky top-0 z-10 bg-white dark:bg-forest-800">
              <h2 class="text-lg font-bold text-forest-800 dark:text-cream-50">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
              >
                <XIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div class="p-4 lg:p-6">
              <FilterSection
                careDifficulty={careDifficulty}
                setCareDifficulty={setCareDifficulty}
                lightRequirement={lightRequirement}
                setLightRequirement={setLightRequirement}
                wateringFrequency={wateringFrequency}
                setWateringFrequency={setWateringFrequency}
                humidityLevel={humidityLevel}
                setHumidityLevel={setHumidityLevel}
                growthRate={growthRate}
                setGrowthRate={setGrowthRate}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main class="lg:ml-64">
            <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Toolbar: Search + Sort */}
              <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6">
                <div class="p-4">
                  <div class="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div class="flex-1 relative">
                      <MagnifyingGlassIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search plants by name, scientific name, or tag..."
                        value={searchQuery()}
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        class="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat text-sm"
                      />
                      <Show when={searchQuery()}>
                        <button
                          onClick={() => setSearchQuery("")}
                          class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
                        >
                          <XIcon class="w-4 h-4 text-gray-400" />
                        </button>
                      </Show>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen())}
                      class={`lg:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 transition-standard text-sm font-medium ${
                        sidebarOpen()
                          ? "border-forest-500 bg-forest-50 text-forest-700 dark:border-forest-400 dark:bg-forest-900/50 dark:text-forest-300"
                          : "border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:border-forest-300 dark:hover:border-forest-600"
                      }`}
                    >
                      <FilterIcon class="w-4 h-4" />
                      Filters
                      <Show when={hasActiveFilters()}>
                        <span class="w-5 h-5 rounded-full bg-forest-500 text-white text-xs flex items-center justify-center font-bold">
                          {activeFilterCount()}
                        </span>
                      </Show>
                    </button>

                    {/* Sort */}
                    <div class="relative">
                      <select
                        value={sortBy()}
                        onChange={(e) => {
                          setSortBy(e.currentTarget.value);
                          setSortOrder("asc");
                        }}
                        class="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-900/30 text-forest-800 dark:text-cream-50 transition-standard focus-ring-flat text-sm appearance-none cursor-pointer pr-8"
                      >
                        <For each={SORT_OPTIONS}>
                          {(opt) => <option value={opt.value}>{opt.label}</option>}
                        </For>
                      </select>
                      <ChevronDownIcon class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Order Toggle */}
                    <button
                      onClick={() => setSortOrder(sortOrder() === "asc" ? "desc" : "asc")}
                      class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-cream-200 dark:border-forest-700 hover:border-forest-300 dark:hover:border-forest-600 bg-white dark:bg-forest-900/30 text-forest-800 dark:text-cream-50 transition-standard text-sm font-medium"
                    >
                      {sortOrder() === "asc" ? "↑ Asc" : "↓ Desc"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <div class="flex items-center justify-between mb-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span class="font-semibold text-forest-800 dark:text-cream-50">
                    {plants().length}
                  </span>{" "}
                  of{" "}
                  <span class="font-semibold text-forest-800 dark:text-cream-50">
                    {totalItems()}
                  </span>{" "}
                  plants
                </p>
                <Show when={hasActiveFilters()}>
                  <button
                    onClick={clearFilters}
                    class="inline-flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                  >
                    <XIcon class="w-4 h-4" />
                    Clear all
                  </button>
                </Show>
              </div>

              {/* Active Filter Chips */}
              <Show when={hasActiveFilters()}>
                <div class="flex flex-wrap gap-2 mb-4">
                  <Show when={debouncedSearch()}>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      Search: "{debouncedSearch()}"
                      <button onClick={() => { setSearchQuery(""); setDebouncedSearch(""); }} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={careDifficulty()}>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      {CARE_OPTIONS.find((o) => o.value === careDifficulty())?.label}
                      <button onClick={() => setCareDifficulty("")} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={lightRequirement()}>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      {LIGHT_OPTIONS.find((o) => o.value === lightRequirement())?.label}
                      <button onClick={() => setLightRequirement("")} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={wateringFrequency()}>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      {WATERING_OPTIONS.find((o) => o.value === wateringFrequency())?.label}
                      <button onClick={() => setWateringFrequency("")} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={humidityLevel()}>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      {HUMIDITY_OPTIONS.find((o) => o.value === humidityLevel())?.label}
                      <button onClick={() => setHumidityLevel("")} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={growthRate()}>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      {GROWTH_OPTIONS.find((o) => o.value === growthRate())?.label}
                      <button onClick={() => setGrowthRate("")} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={inStockOnly()}>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      In Stock Only
                      <button onClick={() => setInStockOnly(false)} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                </div>
              </Show>

              {/* Plant Grid */}
              <Suspense fallback={
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <For each={Array.from({ length: ITEMS_PER_PAGE })}>
                    {() => (
                      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden animate-pulse">
                        <div class="aspect-[4/3] bg-cream-100 dark:bg-forest-900/50" />
                        <div class="p-4 space-y-3">
                          <div class="h-4 bg-cream-200 dark:bg-forest-700 rounded w-3/4" />
                          <div class="h-3 bg-cream-100 dark:bg-forest-800 rounded w-1/2" />
                          <div class="h-3 bg-cream-100 dark:bg-forest-800 rounded w-full" />
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              }>
                <Show
                  when={plantsData()}
                  fallback={
                    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 py-16 px-4 text-center">
                      <div class="w-16 h-16 rounded-full bg-cream-100 dark:bg-forest-700 flex items-center justify-center mx-auto mb-4">
                        <LeafIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                        Loading plants...
                      </h3>
                      <p class="text-gray-500 dark:text-gray-400">Fetching plants from the store.</p>
                    </div>
                  }
                >
                  <Show
                    when={plants().length > 0}
                    fallback={
                      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 py-16 px-4 text-center">
                        <div class="w-16 h-16 rounded-full bg-cream-100 dark:bg-forest-700 flex items-center justify-center mx-auto mb-4">
                          <LeafIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                          No plants found
                        </h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          {hasActiveFilters()
                            ? "Try adjusting your filters or search query to find what you're looking for."
                            : "No plants are available right now. Check back later!"}
                        </p>
                        <Show when={hasActiveFilters()}>
                          <Button onClick={clearFilters} variant="secondary">
                            Clear All Filters
                          </Button>
                        </Show>
                      </div>
                    }
                  >
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <For each={plants()}>
                        {(plant) => <PlantCard plant={plant} />}
                      </For>
                    </div>
                  </Show>

                  {/* Pagination */}
                  <Show when={totalPages() > 1}>
                    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm px-6 py-4 mt-8">
                      <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Page{" "}
                          <span class="font-semibold text-forest-800 dark:text-cream-50">
                            {currentPage()}
                          </span>{" "}
                          of{" "}
                          <span class="font-semibold text-forest-800 dark:text-cream-50">
                            {totalPages()}
                          </span>
                        </p>
                        <div class="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage() === 1}
                            class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous page"
                          >
                            <ChevronLeftIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </button>
                          <For each={getPageNumbers(currentPage(), totalPages())}>
                            {(page) => (
                              page === "..." ? (
                                <span class="w-9 h-9 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none">…</span>
                              ) : (
                                <button
                                  onClick={() => setCurrentPage(page as number)}
                                  class={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage() === page
                                      ? "bg-forest-600 text-white shadow-sm"
                                      : "border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            )}
                          </For>
                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages(), p + 1))}
                            disabled={currentPage() === totalPages()}
                            class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next page"
                          >
                            <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Show>
                </Show>

                </Suspense>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
