import {
  createSignal,
  createMemo,
  For,
  Show,
} from "solid-js";
import { useI18n } from "~/i18n";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  DollarSignIcon,
  SparklesIcon,
} from "~/components/icons";

// Static mock data
interface StaticDistrict {
  id: string;
  nameEn: string;
  nameBn: string;
}

interface StaticDivision {
  name: string;
  districts: StaticDistrict[];
}

const STATIC_DIVISIONS: StaticDivision[] = [
  {
    name: "Dhaka",
    districts: [
      { id: "1", nameEn: "Dhaka", nameBn: "ঢাকা" },
      { id: "2", nameEn: "Faridpur", nameBn: "ফরিদপুর" },
      { id: "3", nameEn: "Gazipur", nameBn: "গাজীপুর" },
      { id: "4", nameEn: "Gopalganj", nameBn: "গোপালগঞ্জ" },
      { id: "5", nameEn: "Kishoreganj", nameBn: "কিশোরগঞ্জ" },
      { id: "6", nameEn: "Madaripur", nameBn: "মাদারীপুর" },
      { id: "7", nameEn: "Manikganj", nameBn: "মানিকগঞ্জ" },
      { id: "8", nameEn: "Munshiganj", nameBn: "মুন্সীগঞ্জ" },
      { id: "9", nameEn: "Narayanganj", nameBn: "নারায়ণগঞ্জ" },
      { id: "10", nameEn: "Narsingdi", nameBn: "নরসিংদী" },
      { id: "11", nameEn: "Rajbari", nameBn: "রাজবাড়ী" },
      { id: "12", nameEn: "Shariatpur", nameBn: "শরীয়তপুর" },
      { id: "13", nameEn: "Tangail", nameBn: "টাঙ্গাইল" },
    ],
  },
  {
    name: "Chittagong",
    districts: [
      { id: "14", nameEn: "Bandarban", nameBn: "বান্দরবান" },
      { id: "15", nameEn: "Brahmanbaria", nameBn: "ব্রাহ্মণবাড়িয়া" },
      { id: "16", nameEn: "Chandpur", nameBn: "চাঁদপুর" },
      { id: "17", nameEn: "Chittagong", nameBn: "চট্টগ্রাম" },
      { id: "18", nameEn: "Comilla", nameBn: "কুমিল্লা" },
      { id: "19", nameEn: "Cox's Bazar", nameBn: "কক্স বাজার" },
      { id: "20", nameEn: "Feni", nameBn: "ফেনী" },
      { id: "21", nameEn: "Khagrachhari", nameBn: "খাগড়াছড়ি" },
      { id: "22", nameEn: "Lakshmipur", nameBn: "লক্ষ্মীপুর" },
      { id: "23", nameEn: "Noakhali", nameBn: "নোয়াখালী" },
      { id: "24", nameEn: "Rangamati", nameBn: "রাঙ্গামাটি" },
    ],
  },
  {
    name: "Rajshahi",
    districts: [
      { id: "25", nameEn: "Bogra", nameBn: "বগুড়া" },
      { id: "26", nameEn: "Joypurhat", nameBn: "জয়পুরহাট" },
      { id: "27", nameEn: "Naogaon", nameBn: "নওগাঁ" },
      { id: "28", nameEn: "Natore", nameBn: "নাটোর" },
      { id: "29", nameEn: "Nawabganj", nameBn: "নবাবগঞ্জ" },
      { id: "30", nameEn: "Pabna", nameBn: "পাবনা" },
      { id: "31", nameEn: "Rajshahi", nameBn: "রাজশাহী" },
      { id: "32", nameEn: "Sirajganj", nameBn: "সিরাজগঞ্জ" },
    ],
  },
  {
    name: "Khulna",
    districts: [
      { id: "33", nameEn: "Bagerhat", nameBn: "বাগেরহাট" },
      { id: "34", nameEn: "Chuadanga", nameBn: "চুয়াডাঙ্গা" },
      { id: "35", nameEn: "Jashore", nameBn: "যশোর" },
      { id: "36", nameEn: "Jhenaidah", nameBn: "ঝিনাইদহ" },
      { id: "37", nameEn: "Khulna", nameBn: "খুলনা" },
      { id: "38", nameEn: "Kushtia", nameBn: "কুষ্টিয়া" },
      { id: "39", nameEn: "Magura", nameBn: "মাগুরা" },
      { id: "40", nameEn: "Meherpur", nameBn: "মেহেরপুর" },
      { id: "41", nameEn: "Narail", nameBn: "নড়াইল" },
      { id: "42", nameEn: "Satkhira", nameBn: "সাতক্ষীরা" },
    ],
  },
  {
    name: "Barishal",
    districts: [
      { id: "43", nameEn: "Barguna", nameBn: "বরগুনা" },
      { id: "44", nameEn: "Barishal", nameBn: "বরিশাল" },
      { id: "45", nameEn: "Bhola", nameBn: "ভোলা" },
      { id: "46", nameEn: "Jhalokati", nameBn: "ঝালকাঠি" },
      { id: "47", nameEn: "Patuakhali", nameBn: "পটুয়াখালী" },
      { id: "48", nameEn: "Pirojpur", nameBn: "পিরোজপুর" },
    ],
  },
  {
    name: "Sylhet",
    districts: [
      { id: "49", nameEn: "Habiganj", nameBn: "হবিগঞ্জ" },
      { id: "50", nameEn: "Moulvibazar", nameBn: "মৌলভীবাজার" },
      { id: "51", nameEn: "Sunamganj", nameBn: "সুনামগঞ্জ" },
      { id: "52", nameEn: "Sylhet", nameBn: "সিলেট" },
    ],
  },
  {
    name: "Rangpur",
    districts: [
      { id: "53", nameEn: "Dinajpur", nameBn: "দিনাজপুর" },
      { id: "54", nameEn: "Gaibandha", nameBn: "গাইবান্ধা" },
      { id: "55", nameEn: "Kurigram", nameBn: "কুড়িগ্রাম" },
      { id: "56", nameEn: "Lalmonirhat", nameBn: "লালমনিরহাট" },
      { id: "57", nameEn: "Nilphamari", nameBn: "নীলফামারী" },
      { id: "58", nameEn: "Panchagarh", nameBn: "পঞ্চগড়" },
      { id: "59", nameEn: "Rangpur", nameBn: "রংপুর" },
      { id: "60", nameEn: "Thakurgaon", nameBn: "ঠাকুরগাঁও" },
    ],
  },
  {
    name: "Mymensingh",
    districts: [
      { id: "61", nameEn: "Jamalpur", nameBn: "জামালপুর" },
      { id: "62", nameEn: "Mymensingh", nameBn: "ময়মনসিংহ" },
      { id: "63", nameEn: "Netrokona", nameBn: "নেত্রকোণা" },
      { id: "64", nameEn: "Sherpur", nameBn: "শেরপুর" },
    ],
  },
];

// Some pre-configured rates for demo
const STATIC_RATES: Record<string, string> = {
  "1": "120",    // Dhaka
  "3": "100",    // Gazipur
  "9": "100",    // Narayanganj
  "17": "180",   // Chittagong
  "19": "200",   // Cox's Bazar
  "25": "150",   // Bogra
  "31": "150",   // Rajshahi
  "37": "140",   // Khulna
  "44": "160",   // Barishal
  "52": "170",   // Sylhet
  "59": "160",   // Rangpur
  "62": "150",   // Mymensingh
  "2": "110",    // Faridpur
  "4": "110",    // Gopalganj
  "5": "110",    // Kishoreganj
  "6": "110",    // Madaripur
  "7": "100",    // Manikganj
  "8": "100",    // Munshiganj
  "10": "110",   // Narsingdi
  "11": "110",   // Rajbari
  "12": "110",   // Shariatpur
  "13": "100",   // Tangail
  "14": "220",   // Bandarban
  "15": "160",   // Brahmanbaria
  "16": "170",   // Chandpur
  "18": "170",   // Comilla
  "20": "180",   // Feni
  "21": "220",   // Khagrachhari
  "22": "180",   // Lakshmipur
  "23": "180",   // Noakhali
  "24": "220",   // Rangamati
  "26": "150",   // Joypurhat
  "27": "150",   // Naogaon
  "28": "150",   // Natore
  "29": "150",   // Nawabganj
  "30": "150",   // Pabna
  "32": "150",   // Sirajganj
  "33": "150",   // Bagerhat
  "34": "140",   // Chuadanga
  "35": "140",   // Jashore
  "36": "140",   // Jhenaidah
  "38": "140",   // Kushtia
  "39": "140",   // Magura
  "40": "140",   // Meherpur
  "41": "140",   // Narail
  "42": "150",   // Satkhira
  "43": "170",   // Barguna
  "45": "180",   // Bhola
  "46": "170",   // Jhalokati
  "47": "180",   // Patuakhali
  "48": "170",   // Pirojpur
  "49": "170",   // Habiganj
  "50": "180",   // Moulvibazar
  "51": "180",   // Sunamganj
  "53": "160",   // Dinajpur
  "54": "160",   // Gaibandha
  "55": "160",   // Kurigram
  "56": "160",   // Lalmonirhat
  "57": "160",   // Nilphamari
  "58": "170",   // Panchagarh
  "60": "170",   // Thakurgaon
  "61": "160",   // Jamalpur
  "63": "160",   // Netrokona
  "64": "160",   // Sherpur
};

interface DistrictWithDivision {
  district: StaticDistrict;
  divisionName: string;
}

export default function ShippingRatesPage() {
  const { t, locale } = useI18n();
  const [isSaving, setIsSaving] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [setAllCost, setSetAllCost] = createSignal("");
  const [bulkCost, setBulkCost] = createSignal("");
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());
  const [editingIds, setEditingIds] = createSignal<Set<string>>(new Set());
  const [localCosts, setLocalCosts] = createSignal<Record<string, string>>(STATIC_RATES);

  // Build flat list
  const allDistricts: DistrictWithDivision[] = [];
  for (const div of STATIC_DIVISIONS) {
    for (const dist of div.districts) {
      allDistricts.push({ district: dist, divisionName: div.name });
    }
  }

  // Group filtered districts by division
  const groupedDistricts = createMemo(() => {
    const q = searchQuery().toLowerCase();
    const filtered = allDistricts.filter((item) => {
      if (!q) return true;
      return (
        item.district.nameEn.toLowerCase().includes(q) ||
        item.district.nameBn.includes(q) ||
        item.divisionName.toLowerCase().includes(q)
      );
    });

    const groups = new Map<string, DistrictWithDivision[]>();
    for (const item of filtered) {
      const existing = groups.get(item.divisionName) || [];
      existing.push(item);
      groups.set(item.divisionName, existing);
    }

    return Array.from(groups.entries()).map(([divisionName, districts]) => ({
      divisionName,
      districts,
    }));
  });

  // Stats
  const stats = createMemo(() => {
    const total = allDistricts.length;
    const costs = localCosts();
    const configured = Object.keys(costs).length;
    let freeCount = 0;
    let costSum = 0;
    for (const cost of Object.values(costs)) {
      const num = parseFloat(cost);
      if (num === 0) freeCount++;
      costSum += num;
    }
    const avg = configured > 0 ? Math.round(costSum / configured) : 0;
    return { total, configured, freeCount, avg };
  });

  const selectedCount = createMemo(() => selectedIds().size);
  const currentLocale = locale() || "en";

  // Set all districts
  const handleSetAll = () => {
    const cost = setAllCost();
    if (!cost) return;
    const num = parseFloat(cost);
    if (isNaN(num) || num < 0) return;

    setIsSaving(true);
    setTimeout(() => {
      const record: Record<string, string> = {};
      allDistricts.forEach((item) => {
        record[item.district.id] = cost;
      });
      setLocalCosts(record);
      setSetAllCost("");
      setIsSaving(false);
    }, 500);
  };

  // Bulk update selected
  const handleBulkUpdate = () => {
    const cost = bulkCost();
    if (!cost || selectedIds().size === 0) return;
    const num = parseFloat(cost);
    if (isNaN(num) || num < 0) return;

    setIsSaving(true);
    setTimeout(() => {
      setLocalCosts((prev) => {
        const next = { ...prev };
        Array.from(selectedIds()).forEach((id) => {
          next[id] = cost;
        });
        return next;
      });
      setSelectedIds(new Set<string>());
      setBulkCost("");
      setIsSaving(false);
    }, 500);
  };

  // Single save
  const handleSave = (districtId: string) => {
    const cost = localCosts()[districtId];
    if (cost === undefined && cost !== "") return;

    setIsSaving(true);
    setTimeout(() => {
      setEditingIds((prev) => {
        const next = new Set(prev);
        next.delete(districtId);
        return next;
      });
      setIsSaving(false);
    }, 300);
  };

  // Save on blur
  const handleBlur = (districtId: string) => {
    if (editingIds().has(districtId)) {
      handleSave(districtId);
    }
  };

  // Toggle select
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Start editing
  const startEditing = (id: string) => {
    setEditingIds((prev) => new Set(prev).add(id));
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label={t("seller.shippingRates.title")} />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-8">
        <div class="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-xl bg-terracotta-100 dark:bg-terracotta-900/40 flex items-center justify-center">
                <MapPinIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                  {t("seller.shippingRates.title")}
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {t("seller.shippingRates.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={GlobeAltIcon}
              label={t("seller.shippingRates.totalDistricts")}
              value={stats().total}
              color="forest"
            />
            <StatCard
              icon={CheckCircleIcon}
              label={t("seller.shippingRates.configured")}
              value={stats().configured}
              color="terracotta"
            />
            <StatCard
              icon={SparklesIcon}
              label={t("seller.shippingRates.freeShipping")}
              value={stats().freeCount}
              color="cream"
            />
            <StatCard
              icon={DollarSignIcon}
              label={t("seller.shippingRates.averageCost")}
              value={`৳${stats().avg}`}
              color="forest"
            />
          </div>

          {/* Set All */}
          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-5 mb-4 shadow-sm">
            <div class="flex flex-col sm:flex-row items-start sm:items-end gap-3">
              <div class="flex-1 min-w-0">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("seller.shippingRates.setAllLabel")}
                </label>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder={t("seller.shippingRates.placeholder")}
                      value={setAllCost()}
                      onInput={(e) => setSetAllCost(e.currentTarget.value)}
                      class="w-full pl-7 pr-3 py-2.5 rounded-xl border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSetAll}
                    disabled={!setAllCost() || isSaving()}
                    class="px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    {isSaving() && setAllCost() ? (
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : null}
                    {t("seller.shippingRates.applyAll")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search + Bulk */}
          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-4 mb-4 shadow-sm">
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div class="flex-1 min-w-0">
                <div class="relative">
                  <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder={t("seller.shippingRates.searchPlaceholder")}
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder={t("seller.shippingRates.bulkPlaceholder")}
                    value={bulkCost()}
                    onInput={(e) => setBulkCost(e.currentTarget.value)}
                    class="w-32 pl-7 pr-3 py-2.5 rounded-xl border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
                  />
                </div>
                <button
                  onClick={handleBulkUpdate}
                  disabled={selectedCount() === 0 || !bulkCost() || isSaving()}
                  class="px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  {t("seller.shippingRates.applySelected", { count: selectedCount() })}
                </button>
              </div>
            </div>
          </div>

          {/* Districts Table */}
          <Show
            when={groupedDistricts().length > 0}
            fallback={
              <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-12 shadow-sm text-center">
                <MapPinIcon class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p class="text-gray-500 dark:text-gray-400 font-medium">
                  {t("seller.shippingRates.noResults")}
                </p>
              </div>
            }
          >
            <div class="space-y-4">
              <For each={groupedDistricts()}>
                {(group) => (
                  <DivisionGroup
                    divisionName={group.divisionName}
                    districts={group.districts}
                    currentLocale={currentLocale}
                    localCosts={localCosts()}
                    selectedIds={selectedIds()}
                    editingIds={editingIds()}
                    isSaving={isSaving()}
                    onToggleSelect={toggleSelect}
                    onStartEditing={startEditing}
                    onCostChange={(id, val) =>
                      setLocalCosts((prev) => ({ ...prev, [id]: val }))
                    }
                    onSave={handleSave}
                    onBlur={handleBlur}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}

function StatCard(props: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    forest: {
      bg: "bg-forest-100 dark:bg-forest-900/40",
      icon: "text-forest-600 dark:text-forest-400",
      text: "text-forest-800 dark:text-cream-50",
    },
    terracotta: {
      bg: "bg-terracotta-100 dark:bg-terracotta-900/40",
      icon: "text-terracotta-600 dark:text-terracotta-400",
      text: "text-terracotta-800 dark:text-cream-50",
    },
    cream: {
      bg: "bg-cream-200 dark:bg-cream-800/40",
      icon: "text-cream-700 dark:text-cream-300",
      text: "text-cream-800 dark:text-cream-100",
    },
  };

  const c = colorClasses[props.color] || colorClasses.forest;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <props.icon class={`w-4 h-4 ${c.icon}`} />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{props.label}</p>
          <p class={`text-lg font-bold ${c.text} truncate`}>{props.value}</p>
        </div>
      </div>
    </div>
  );
}

function DivisionGroup(props: {
  divisionName: string;
  districts: DistrictWithDivision[];
  currentLocale: string;
  localCosts: Record<string, string>;
  selectedIds: Set<string>;
  editingIds: Set<string>;
  isSaving: boolean;
  onToggleSelect: (id: string) => void;
  onStartEditing: (id: string) => void;
  onCostChange: (id: string, val: string) => void;
  onSave: (id: string) => void;
  onBlur: (id: string) => void;
}) {
  const configuredCount = props.districts.filter(
    (d) => props.localCosts[d.district.id] !== undefined
  ).length;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
      {/* Division Header */}
      <div class="px-5 py-3 bg-cream-50 dark:bg-forest-900/50 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <GlobeAltIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {props.divisionName}
          </h3>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {configuredCount}/{props.districts.length} {props.districts.length === 1 ? "district" : "districts"}
        </span>
      </div>

      {/* District Rows */}
      <div class="divide-y divide-cream-100 dark:divide-forest-700/50">
        <For each={props.districts}>
          {(item) => {
            const district = item.district;
            const name = props.currentLocale === "bn" ? district.nameBn : district.nameEn;
            const nameEn = district.nameEn;
            const cost = props.localCosts[district.id];
            const isConfigured = cost !== undefined;
            const isSelected = props.selectedIds.has(district.id);
            const isEditing = props.editingIds.has(district.id);
            const isSavingThis = props.isSaving && isEditing;

            return (
              <div
                class={`flex items-center gap-3 px-5 py-3 transition-colors ${
                  isSelected
                    ? "bg-terracotta-50 dark:bg-terracotta-900/20"
                    : "hover:bg-cream-50 dark:hover:bg-forest-900/30"
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => props.onToggleSelect(district.id)}
                  class="w-4 h-4 rounded border-cream-300 dark:border-forest-600 text-terracotta-600 dark:text-terracotta-500 accent-terracotta-600 dark:accent-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30 cursor-pointer flex-shrink-0"
                />

                {/* District Name */}
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {name}
                  </p>
                  {name !== nameEn && (
                    <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {nameEn}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <Show when={isConfigured}>
                  <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-900/40 text-xs font-medium text-forest-700 dark:text-forest-400">
                    <CheckCircleIcon class="w-3 h-3" />
                    ৳{cost || "0"}
                  </span>
                </Show>

                {/* Cost Input */}
                <div class="flex items-center gap-2 w-36 sm:w-40">
                  <div class="relative flex-1">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="—"
                      value={cost ?? ""}
                      onInput={(e) => props.onCostChange(district.id, e.currentTarget.value)}
                      onFocus={() => props.onStartEditing(district.id)}
                      onBlur={() => props.onBlur(district.id)}
                      class={`w-full pl-6 pr-2 py-1.5 rounded-lg border text-sm transition-colors ${
                        isConfigured
                          ? "border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50"
                          : "border-dashed border-cream-300 dark:border-forest-500 bg-cream-50 dark:bg-forest-900/50 text-gray-500 dark:text-gray-400"
                      } focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 outline-none`}
                    />
                  </div>
                  <Show when={isEditing}>
                    <button
                      onClick={() => props.onSave(district.id)}
                      disabled={props.isSaving}
                      class="p-1.5 rounded-lg text-terracotta-600 dark:text-terracotta-400 hover:bg-terracotta-100 dark:hover:bg-terracotta-900/40 disabled:opacity-40 transition-colors"
                    >
                      {isSavingThis ? (
                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <CheckCircleIcon class="w-4 h-4" />
                      )}
                    </button>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
