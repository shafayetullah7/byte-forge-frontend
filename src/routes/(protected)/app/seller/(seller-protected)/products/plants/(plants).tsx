import { createSignal, createMemo, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { FilterIcon, DotsVerticalIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, ArchiveIcon, SortIcon, PackageIcon, PlusIcon, XIcon, MagnifyingGlassIcon, FolderIcon, DollarSignIcon, CubeIcon, ClockIcon, CheckCircleIcon, Squares2x2Icon, TagIcon } from "~/components/icons";
import Badge from "~/components/ui/Badge";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { TagMultiSelect } from "~/components/ui/TagMultiSelect";
import { CategorySearchSelect } from "~/components/seller/CategorySearchSelect";
import type { CategoryOption } from "~/components/seller/CategorySearchSelect";

// ========================
// Types
// ========================

interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  price: number;
  salePrice: number | null;
  inventoryCount: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  tags: string[];
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Static Data
// ========================

const TAG_GROUPS = [
  {
    id: "group-1",
    slug: "size",
    name: "Pot Size",
    tags: [
      { id: "tag-1", slug: "4-inch", name: "4 inch" },
      { id: "tag-2", slug: "6-inch", name: "6 inch" },
      { id: "tag-3", slug: "8-inch", name: "8 inch" },
      { id: "tag-4", slug: "10-inch", name: "10 inch" },
    ],
  },
  {
    id: "group-2",
    slug: "growth-stage",
    name: "Growth Stage",
    tags: [
      { id: "tag-5", slug: "seedling", name: "Seedling" },
      { id: "tag-6", slug: "mature", name: "Mature" },
      { id: "tag-7", slug: "cutting", name: "Cutting" },
    ],
  },
  {
    id: "group-3",
    slug: "care-level",
    name: "Care Level",
    tags: [
      { id: "tag-8", slug: "beginner", name: "Beginner Friendly" },
      { id: "tag-9", slug: "intermediate", name: "Intermediate" },
      { id: "tag-10", slug: "expert", name: "Expert" },
    ],
  },
  {
    id: "group-4",
    slug: "light",
    name: "Light Requirements",
    tags: [
      { id: "tag-11", slug: "low-light", name: "Low Light" },
      { id: "tag-12", slug: "bright-indirect", name: "Bright Indirect" },
      { id: "tag-13", slug: "direct-sun", name: "Direct Sun" },
    ],
  },
];

const getTagName = (tagId: string): string => {
  for (const group of TAG_GROUPS) {
    const tag = group.tags.find((t) => t.id === tagId);
    if (tag) return tag.name;
  }
  return tagId;
};

const staticProducts: Product[] = [
  {
    id: "plant-001",
    slug: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    shortDescription: "Popular tropical plant with distinctive split leaves",
    price: 850,
    salePrice: 750,
    inventoryCount: 25,
    status: "ACTIVE",
    category: { id: "cat-1", slug: "indoor-plants", name: "Indoor Plants" },
    tags: ["tag-2", "tag-6", "tag-9", "tag-12"],
    thumbnailUrl: null,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-20T14:45:00Z",
  },
  {
    id: "plant-002",
    slug: "snake-plant-sansevieria",
    name: "Snake Plant (Sansevieria)",
    shortDescription: "Low-maintenance air-purifying plant",
    price: 450,
    salePrice: null,
    inventoryCount: 40,
    status: "ACTIVE",
    category: { id: "cat-1", slug: "indoor-plants", name: "Indoor Plants" },
    tags: ["tag-1", "tag-6", "tag-8", "tag-11"],
    thumbnailUrl: null,
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-01-20T09:15:00Z",
  },
  {
    id: "plant-003",
    slug: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    shortDescription: "Elegant statement plant with large violin-shaped leaves",
    price: 1200,
    salePrice: 1100,
    inventoryCount: 8,
    status: "ACTIVE",
    category: { id: "cat-2", slug: "statement-plants", name: "Statement Plants" },
    tags: ["tag-3", "tag-6", "tag-10", "tag-13"],
    thumbnailUrl: null,
    createdAt: "2025-02-01T11:00:00Z",
    updatedAt: "2025-02-10T16:30:00Z",
  },
  {
    id: "plant-004",
    slug: "pothos-golden",
    name: "Golden Pothos",
    shortDescription: "Trailing vine with heart-shaped variegated leaves",
    price: 350,
    salePrice: null,
    inventoryCount: 60,
    status: "ACTIVE",
    category: { id: "cat-3", slug: "trailing-plants", name: "Trailing Plants" },
    tags: ["tag-1", "tag-5", "tag-8", "tag-11"],
    thumbnailUrl: null,
    createdAt: "2025-02-05T08:45:00Z",
    updatedAt: "2025-02-05T08:45:00Z",
  },
  {
    id: "plant-005",
    slug: "peace-lily",
    name: "Peace Lily",
    shortDescription: "Elegant flowering plant with white spathes",
    price: 650,
    salePrice: 580,
    inventoryCount: 15,
    status: "DRAFT",
    category: { id: "cat-1", slug: "indoor-plants", name: "Indoor Plants" },
    tags: ["tag-2", "tag-6", "tag-8", "tag-11"],
    thumbnailUrl: null,
    createdAt: "2025-02-10T13:20:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "plant-006",
    slug: "rubber-plant-burgundy",
    name: "Rubber Plant (Burgundy)",
    shortDescription: "Bold foliage plant with dark burgundy leaves",
    price: 900,
    salePrice: null,
    inventoryCount: 0,
    status: "ACTIVE",
    category: { id: "cat-1", slug: "indoor-plants", name: "Indoor Plants" },
    tags: ["tag-3", "tag-6", "tag-9", "tag-12"],
    thumbnailUrl: null,
    createdAt: "2025-02-12T07:30:00Z",
    updatedAt: "2025-03-01T09:15:00Z",
  },
  {
    id: "plant-007",
    slug: "alocasia-polly",
    name: "Alocasia Polly",
    shortDescription: "Striking arrow-shaped leaves with dramatic contrast",
    price: 1500,
    salePrice: 1350,
    inventoryCount: 5,
    status: "ACTIVE",
    category: { id: "cat-4", slug: "exotic-plants", name: "Exotic Plants" },
    tags: ["tag-2", "tag-6", "tag-10", "tag-12"],
    thumbnailUrl: null,
    createdAt: "2025-02-18T15:45:00Z",
    updatedAt: "2025-02-25T11:30:00Z",
  },
  {
    id: "plant-008",
    slug: "zz-plant",
    name: "ZZ Plant",
    shortDescription: "Nearly indestructible low-light plant",
    price: 550,
    salePrice: null,
    inventoryCount: 30,
    status: "ARCHIVED",
    category: { id: "cat-1", slug: "indoor-plants", name: "Indoor Plants" },
    tags: ["tag-1", "tag-6", "tag-8", "tag-11"],
    thumbnailUrl: null,
    createdAt: "2025-01-10T12:00:00Z",
    updatedAt: "2025-03-10T08:00:00Z",
  },
];

const STATIC_CATEGORIES: CategoryOption[] = [
  { id: "cat-1", slug: "indoor-plants", name: "Indoor Plants", parentId: null, childrenCount: 3 },
  { id: "cat-1-1", slug: "succulents", name: "Succulents", parentId: "cat-1", childrenCount: 0 },
  { id: "cat-1-2", slug: "ferns", name: "Ferns", parentId: "cat-1", childrenCount: 0 },
  { id: "cat-1-3", slug: "tropical", name: "Tropical", parentId: "cat-1", childrenCount: 0 },
  { id: "cat-2", slug: "statement-plants", name: "Statement Plants", parentId: null, childrenCount: 2 },
  { id: "cat-2-1", slug: "large-leaf", name: "Large Leaf", parentId: "cat-2", childrenCount: 0 },
  { id: "cat-2-2", slug: "architectural", name: "Architectural", parentId: "cat-2", childrenCount: 0 },
  { id: "cat-3", slug: "trailing-plants", name: "Trailing Plants", parentId: null, childrenCount: 2 },
  { id: "cat-3-1", slug: "vining", name: "Vining", parentId: "cat-3", childrenCount: 0 },
  { id: "cat-3-2", slug: "hanging", name: "Hanging", parentId: "cat-3", childrenCount: 0 },
  { id: "cat-4", slug: "exotic-plants", name: "Exotic Plants", parentId: null, childrenCount: 2 },
  { id: "cat-4-1", slug: "rare", name: "Rare", parentId: "cat-4", childrenCount: 0 },
  { id: "cat-4-2", slug: "variegated", name: "Variegated", parentId: "cat-4", childrenCount: 0 },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "updatedAt", label: "Date Updated" },
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "inventory", label: "Inventory" },
];

// ========================
// Helpers
// ========================

function getStatusVariant(status: string): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "ACTIVE": return "forest";
    case "DRAFT": return "cream";
    case "ARCHIVED": return "terracotta";
    default: return "default";
  }
}

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInventoryStatus(count: number): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: "Out of Stock", variant: "terracotta" };
  if (count <= 5) return { label: "Low Stock", variant: "cream" };
  return { label: `${count} in stock`, variant: "forest" };
}

// ========================
// Filter Chip
// ========================

function FilterChip(props: { label: string; onRemove: () => void }) {
  return (
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 border border-forest-200 dark:border-forest-800">
      {props.label}
      <button
        onClick={props.onRemove}
        class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors"
      >
        <XIcon class="w-3 h-3" />
      </button>
    </span>
  );
}

// ========================
// Main Page
// ========================

export default function PlantsPage() {
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal("");
  const [categoryFilter, setCategoryFilter] = createSignal("");
  const [selectedTagIds, setSelectedTagIds] = createSignal<string[]>([]);
  const [sortBy, setSortBy] = createSignal("createdAt");
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = createSignal(false);
  const [showSortPanel, setShowSortPanel] = createSignal(false);

  const [currentPage, setCurrentPage] = createSignal(1);
  const ITEMS_PER_PAGE = 5;

  const toggleTag = (tagId: string) => {
    const current = selectedTagIds();
    if (current.includes(tagId)) {
      setSelectedTagIds(current.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...current, tagId]);
    }
    setCurrentPage(1);
  };

  const removeTag = (tagId: string) => {
    setSelectedTagIds(selectedTagIds().filter((id) => id !== tagId));
    setCurrentPage(1);
  };

  const filteredProducts = createMemo(() => {
    let result = [...staticProducts];

    const query = searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query)
      );
    }

    const status = statusFilter();
    if (status) {
      result = result.filter((p) => p.status === status);
    }

    const category = categoryFilter();
    if (category) {
      result = result.filter((p) => p.category?.slug === category);
    }

    const tags = selectedTagIds();
    if (tags.length > 0) {
      result = result.filter((p) => tags.every((tagId) => p.tags.includes(tagId)));
    }

    const sortField = sortBy();
    const order = sortOrder();
    const sortMultiplier = order === "asc" ? 1 : -1;

    result.sort((a, b) => {
      switch (sortField) {
        case "name":
          return a.name.localeCompare(b.name) * sortMultiplier;
        case "price":
          return (a.price - b.price) * sortMultiplier;
        case "inventory":
          return (a.inventoryCount - b.inventoryCount) * sortMultiplier;
        case "updatedAt":
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * sortMultiplier;
        case "createdAt":
        default:
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortMultiplier;
      }
    });

    return result;
  });

  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(filteredProducts().length / ITEMS_PER_PAGE))
  );

  const paginatedProducts = createMemo(() => {
    const start = (currentPage() - 1) * ITEMS_PER_PAGE;
    return filteredProducts().slice(start, start + ITEMS_PER_PAGE);
  });

  const stats = createMemo(() => ({
    total: staticProducts.length,
    active: staticProducts.filter((p) => p.status === "ACTIVE").length,
    draft: staticProducts.filter((p) => p.status === "DRAFT").length,
    archived: staticProducts.filter((p) => p.status === "ARCHIVED").length,
  }));

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
    setSelectedTagIds([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = createMemo(
    () => searchQuery() || statusFilter() || categoryFilter() || selectedTagIds().length > 0
  );

  const activeFilterCount = createMemo(() => {
    let count = 0;
    if (searchQuery()) count++;
    if (statusFilter()) count++;
    if (categoryFilter()) count++;
    count += selectedTagIds().length;
    return count;
  });

  const sortLabel = createMemo(() => {
    const option = SORT_OPTIONS.find((o) => o.value === sortBy());
    return option ? `${option.label} (${sortOrder() === "asc" ? "↑" : "↓"})` : "";
  });

  return (
    <>
        {/* Page Header */}
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
                <PackageIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                  {t("seller.products.types.plants")}
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  {t("seller.products.managePlantProducts")}
                </p>
              </div>
            </div>
            <A href="/app/seller/products/plants/new">
              <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors">
                <PlusIcon class="w-5 h-5" />
                {t("seller.products.addPlant")}
              </button>
            </A>
          </div>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-6">
          <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{t("common.total")}</p>
                <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">{stats().total}</p>
              </div>
              <div class="w-10 h-10 rounded-lg bg-cream-100 dark:bg-cream-900/40 flex items-center justify-center">
                <Squares2x2Icon class="w-5 h-5 text-cream-600 dark:text-cream-400" />
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{t("buyer.profile.status.active")}</p>
                <p class="text-2xl font-bold text-forest-600 dark:text-forest-400 mt-1">{stats().active}</p>
              </div>
              <div class="w-10 h-10 rounded-lg bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center">
                <CheckCircleIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.shop.myShop.status.draft.label")}</p>
                <p class="text-2xl font-bold text-cream-600 dark:text-cream-400 mt-1">{stats().draft}</p>
              </div>
              <div class="w-10 h-10 rounded-lg bg-cream-100 dark:bg-cream-900/40 flex items-center justify-center">
                <FolderIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{t("common.archived")}</p>
                <p class="text-2xl font-bold text-terracotta-600 dark:text-terracotta-400 mt-1">{stats().archived}</p>
              </div>
              <div class="w-10 h-10 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/40 flex items-center justify-center">
                <ArchiveIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm mb-6">
          <div class="p-4">
            <div class="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div class="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by name or slug..."
                  value={searchQuery()}
                  onInput={(e) => handleFilterChange(setSearchQuery, e.currentTarget.value)}
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat"
                />
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Quick Status Filter */}
              <FilterSelect
                options={[
                  { value: "", label: "All Status" },
                  { value: "ACTIVE", label: "Active", dotColor: "bg-forest-500" },
                  { value: "DRAFT", label: "Draft", dotColor: "bg-cream-500" },
                  { value: "ARCHIVED", label: "Archived", dotColor: "bg-terracotta-500" },
                ]}
                value={statusFilter()}
                onChange={(val) => handleFilterChange(setStatusFilter, val)}
              />

              {/* Sort Button (Desktop) */}
              <div class="hidden lg:block relative">
                <button
                  onClick={() => setShowSortPanel(!showSortPanel())}
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 transition-standard focus-ring-flat min-w-[200px]"
                >
                  <SortIcon class="w-4 h-4 text-gray-400" />
                  <span class="text-sm truncate">{sortLabel()}</span>
                </button>

                {/* Sort Dropdown */}
                <Show when={showSortPanel()}>
                  <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-lg z-50 overflow-hidden">
                    <div class="p-3 border-b border-cream-200 dark:border-forest-700">
                      <p class="text-sm font-semibold text-forest-800 dark:text-cream-100">Sort By</p>
                    </div>
                    <div class="p-2">
                      <For each={SORT_OPTIONS}>
                        {(option) => {
                          const optionIcon = option.value === "createdAt" || option.value === "updatedAt"
                            ? <ClockIcon class="w-4 h-4 text-gray-400" />
                            : option.value === "name"
                              ? <PackageIcon class="w-4 h-4 text-gray-400" />
                              : option.value === "price"
                                ? <DollarSignIcon class="w-4 h-4 text-gray-400" />
                                : <CubeIcon class="w-4 h-4 text-gray-400" />;
                          return (
                            <button
                              onClick={() => {
                                if (sortBy() === option.value) {
                                  setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
                                } else {
                                  setSortBy(option.value);
                                  setSortOrder("desc");
                                }
                                setShowSortPanel(false);
                              }}
                              class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                                sortBy() === option.value
                                  ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700"
                              }`}
                            >
                              <span class="flex items-center gap-2">
                                {optionIcon}
                                <span>{option.label}</span>
                              </span>
                              {sortBy() === option.value && (
                                <span class="text-xs">
                                  {sortOrder() === "asc" ? "↑ Asc" : "↓ Desc"}
                                </span>
                              )}
                            </button>
                          );
                        }}
                      </For>
                    </div>
                    <div class="p-3 border-t border-cream-200 dark:border-forest-700">
                      <button
                        onClick={() => {
                          setSortBy("createdAt");
                          setSortOrder("desc");
                          setShowSortPanel(false);
                        }}
                        class="w-full text-center text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                      >
                        Reset to default
                      </button>
                    </div>
                  </div>
                </Show>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters())}
                class="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:border-forest-500 dark:hover:border-forest-400 transition-standard"
              >
                <FilterIcon class="w-5 h-5" />
                Filters
                <Show when={hasActiveFilters()}>
                  <span class="w-5 h-5 rounded-full bg-forest-500 text-white text-xs flex items-center justify-center font-bold">
                    {activeFilterCount()}
                  </span>
                </Show>
              </button>
            </div>

            {/* Advanced Filters Panel */}
            <Show when={showFilters() || true}>
              <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <CategorySearchSelect
                      value={categoryFilter()}
                      onChange={(val) => handleFilterChange(setCategoryFilter, val)}
                      categories={STATIC_CATEGORIES}
                    />
                  </div>

                  {/* Tag Multi-Select */}
                  <div data-tag-dropdown>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <TagMultiSelect
                      selectedTags={selectedTagIds()}
                      onToggle={toggleTag}
                      groups={TAG_GROUPS}
                    />
                  </div>

                  {/* Sort (Mobile) */}
                  <div class="lg:hidden">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <div class="space-y-2">
                      <select
                        value={sortBy()}
                        onChange={(e) => {
                          setSortBy(e.currentTarget.value);
                          setSortOrder("desc");
                        }}
                        class="w-full px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 transition-standard focus-ring-flat"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <option value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder() === "asc" ? "desc" : "asc")}
                        class="w-full px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 text-sm font-medium transition-standard"
                      >
                        Order: {sortOrder() === "asc" ? "↑ Ascending" : "↓ Descending"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Show>

            {/* Active Filters */}
            <Show when={hasActiveFilters()}>
              <div class="mt-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FilterIcon class="w-4 h-4 text-gray-400" />
                    Active Filters ({activeFilterCount()})
                  </p>
                  <button
                    onClick={clearFilters}
                    class="text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Show when={searchQuery()}>
                    <FilterChip
                      label={`Search: "${searchQuery()}"`}
                      onRemove={() => handleFilterChange(setSearchQuery, "")}
                    />
                  </Show>
                  <Show when={statusFilter()}>
                    <FilterChip
                      label={`Status: ${statusFilter() === "ACTIVE" ? "Active" : statusFilter() === "DRAFT" ? "Draft" : "Archived"}`}
                      onRemove={() => handleFilterChange(setStatusFilter, "")}
                    />
                  </Show>
                  <Show when={categoryFilter()}>
                    <FilterChip
                      label={`Category: ${STATIC_CATEGORIES.find((c) => c.slug === categoryFilter())?.name}`}
                      onRemove={() => handleFilterChange(setCategoryFilter, "")}
                    />
                  </Show>
                  <For each={selectedTagIds()}>
                    {(tagId) => (
                      <FilterChip
                        label={getTagName(tagId)}
                        onRemove={() => removeTag(tagId)}
                      />
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Results Count */}
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing <span class="font-semibold text-forest-800 dark:text-cream-50">{filteredProducts().length}</span> of{" "}
            <span class="font-semibold text-forest-800 dark:text-cream-50">{staticProducts.length}</span> products
          </p>
          <Show when={hasActiveFilters()}>
            <button
              onClick={clearFilters}
              class="inline-flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:underline font-medium"
            >
              <XIcon class="w-4 h-4" />
              Clear all filters
            </button>
          </Show>
        </div>

        {/* Products Table / Cards */}
        <Show
          when={filteredProducts().length > 0}
          fallback={
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center shadow-sm">
              <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                No products found
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-6">
                {hasActiveFilters()
                  ? "Try adjusting your filters or search query"
                  : t("seller.products.startSellingPlants")}
              </p>
              <Show
                when={!hasActiveFilters()}
                fallback={
                  <button
                    onClick={clearFilters}
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
                  >
                    Clear Filters
                  </button>
                }
              >
                <A href="/app/seller/products/plants/new">
                  <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors">
                    <PlusIcon class="w-5 h-5" />
                    {t("seller.products.addPlant")}
                  </button>
                </A>
              </Show>
            </div>
          }
        >
          {/* Desktop Table */}
          <div class="hidden lg:block bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50">
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <PackageIcon class="w-4 h-4 text-gray-400" />
                      Product
                    </div>
                  </th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <FolderIcon class="w-4 h-4 text-gray-400" />
                      Category
                    </div>
                  </th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <TagIcon class="w-4 h-4 text-gray-400" />
                      Tags
                    </div>
                  </th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <DollarSignIcon class="w-4 h-4 text-gray-400" />
                      Price
                    </div>
                  </th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <CubeIcon class="w-4 h-4 text-gray-400" />
                      Inventory
                    </div>
                  </th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div class="flex items-center gap-2">
                      <ClockIcon class="w-4 h-4 text-gray-400" />
                      Updated
                    </div>
                  </th>
                  <th class="text-right px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <For each={paginatedProducts()}>
                  {(product) => {
                    const inventory = getInventoryStatus(product.inventoryCount);
                    return (
                      <tr class="border-b border-cream-100 dark:border-forest-700/50 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors">
                        <td class="px-4 py-3">
                          <div>
                            <p class="font-semibold text-forest-800 dark:text-cream-50">
                              {product.name}
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {product.shortDescription}
                            </p>
                          </div>
                        </td>
                        <td class="px-4 py-3">
                          <Show
                            when={product.category}
                            fallback={<span class="text-gray-400 dark:text-gray-500 text-sm">—</span>}
                          >
                            <span class="text-sm text-gray-700 dark:text-gray-300">
                              {product.category!.name}
                            </span>
                          </Show>
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex flex-wrap gap-1 max-w-[200px]">
                            <For each={product.tags.slice(0, 3)}>
                              {(tagId) => (
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                                  {getTagName(tagId)}
                                </span>
                              )}
                            </For>
                            <Show when={product.tags.length > 3}>
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-100 text-cream-700 dark:bg-forest-700 dark:text-gray-400">
                                +{product.tags.length - 3}
                              </span>
                            </Show>
                          </div>
                        </td>
                        <td class="px-4 py-3">
                          <div>
                            <span class="font-semibold text-forest-800 dark:text-cream-50">
                              {formatPrice(product.price)}
                            </span>
                            <Show when={product.salePrice}>
                              <span class="ml-2 text-sm text-terracotta-600 dark:text-terracotta-400 line-through">
                                {formatPrice(product.salePrice!)}
                              </span>
                            </Show>
                          </div>
                        </td>
                        <td class="px-4 py-3">
                          <Badge variant={inventory.variant}>
                            {inventory.label}
                          </Badge>
                        </td>
                        <td class="px-4 py-3">
                          <Badge variant={getStatusVariant(product.status)}>
                            {product.status === "ACTIVE" ? "Active" : product.status === "DRAFT" ? "Draft" : "Archived"}
                          </Badge>
                        </td>
                        <td class="px-4 py-3">
                          <span class="text-sm text-gray-500 dark:text-gray-400">
                            {formatDateTime(product.updatedAt)}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-right">
                          <div class="relative group">
                            <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors">
                              <DotsVerticalIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                            <div class="absolute right-0 mt-1 w-40 bg-white dark:bg-forest-800 rounded-lg border border-cream-200 dark:border-forest-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
                              <div class="py-1">
                                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700 flex items-center gap-2">
                                  <PencilIcon class="w-4 h-4" />
                                  {t("common.edit")}
                                </button>
                                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700 flex items-center gap-2">
                                  <TrashIcon class="w-4 h-4" />
                                  {t("common.delete")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }}
                </For>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div class="lg:hidden space-y-4">
            <For each={paginatedProducts()}>
              {(product) => {
                const inventory = getInventoryStatus(product.inventoryCount);
                return (
                  <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <h3 class="font-semibold text-forest-800 dark:text-cream-50 truncate">
                            {product.name}
                          </h3>
                          <Badge variant={getStatusVariant(product.status)} class="flex-shrink-0">
                            {product.status === "ACTIVE" ? "Active" : product.status === "DRAFT" ? "Draft" : "Archived"}
                          </Badge>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {product.shortDescription}
                        </p>
                      </div>
                      <div class="relative group ml-3 flex-shrink-0">
                        <button class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors">
                          <DotsVerticalIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                        <div class="absolute right-0 mt-1 w-36 bg-white dark:bg-forest-800 rounded-lg border border-cream-200 dark:border-forest-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
                          <div class="py-1">
                            <button class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700 flex items-center gap-2">
                              <PencilIcon class="w-4 h-4" />
                              {t("common.edit")}
                            </button>
                            <button class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700 flex items-center gap-2">
                              <TrashIcon class="w-4 h-4" />
                              {t("common.delete")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div class="flex items-center gap-2">
                        <FolderIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Category</p>
                          <p class="font-medium text-forest-800 dark:text-cream-50">
                            {product.category?.name || "—"}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <DollarSignIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Price</p>
                          <p class="font-semibold text-forest-800 dark:text-cream-50">
                            {formatPrice(product.price)}
                            <Show when={product.salePrice}>
                              <span class="ml-1 text-xs text-terracotta-600 dark:text-terracotta-400 line-through">
                                {formatPrice(product.salePrice!)}
                              </span>
                            </Show>
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <CubeIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Inventory</p>
                          <Badge variant={inventory.variant} class="mt-0.5">
                            {inventory.label}
                          </Badge>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <ClockIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Updated</p>
                          <p class="font-medium text-forest-800 dark:text-cream-50">
                            {formatDateTime(product.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div class="flex flex-wrap gap-1">
                      <For each={product.tags}>
                        {(tagId) => (
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                            {getTagName(tagId)}
                          </span>
                        )}
                      </For>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>

          {/* Pagination */}
          <Show when={totalPages() > 1}>
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm px-6 py-4 mt-6">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(currentPage() - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage() * ITEMS_PER_PAGE, filteredProducts().length)} of{" "}
                  {filteredProducts().length} results
                </p>
                <div class="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage() === 1}
                    class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
                    {(page) => (
                      <button
                        onClick={() => setCurrentPage(page)}
                        class={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage() === page
                            ? "bg-forest-600 text-white"
                            : "border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </For>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages(), p + 1))}
                    disabled={currentPage() === totalPages()}
                    class="p-2 rounded-lg border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </Show>
        </Show>
    </>
  );
}
