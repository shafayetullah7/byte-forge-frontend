import { createSignal, createMemo, createEffect, For, Show, Suspense, onMount } from "solid-js";
import { A } from "@solidjs/router";
import {
  LeafIcon,
  SproutIcon,
  MagnifyingGlassIcon,
  FilterIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SunIcon,
  DropletIcon,
  CloudIcon,
  TrendingUpIcon,
  CubeIcon,
  TagIcon,
} from "~/components/icons";
import { Button } from "~/components/ui";

// ========================
// Static Data
// ========================

interface StaticPlant {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  commonNames: string;
  shortDescription: string;
  price: number;
  inventoryCount: number;
  category: string;
  tags: string[];
  careDifficulty: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  lightRequirement: "LOW" | "MEDIUM" | "BRIGHT_INDIRECT" | "DIRECT";
  wateringFrequency: "DAILY" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
  humidityLevel: "LOW" | "MEDIUM" | "HIGH";
  growthRate: "SLOW" | "MODERATE" | "FAST";
  matureHeight: string;
  matureSpread: string;
  origin: string;
  toxicityInfo: string;
  imageUrl: string;
  shopName: string;
  shopLogoUrl: string;
  shopSlug: string;
}

const STATIC_PLANTS: StaticPlant[] = [
  {
    id: "1",
    slug: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    commonNames: "Swiss Cheese Plant, Split-leaf Philodendron",
    shortDescription: "Iconic tropical plant with dramatic split leaves that create a stunning focal point in any room.",
    price: 850,
    inventoryCount: 12,
    category: "Tropical Plants",
    tags: ["Indoor", "Air Purifying", "Fast Growing"],
    careDifficulty: "BEGINNER",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "FAST",
    matureHeight: "6-8 ft",
    matureSpread: "3-5 ft",
    origin: "Central America",
    toxicityInfo: "Toxic to cats and dogs if ingested",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
    shopName: "Green Paradise",
    shopLogoUrl: "https://ui-avatars.com/api/?name=GP&background=16a34a&color=fff&size=80",
    shopSlug: "green-paradise",
  },
  {
    id: "2",
    slug: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    commonNames: "Fiddle-leaf Fig, Fiddle-leaf Rubber Plant",
    shortDescription: "Elegant statement plant with large, violin-shaped leaves that adds sophistication to any space.",
    price: 1200,
    inventoryCount: 5,
    category: "Trees & Shrubs",
    tags: ["Indoor", "Statement Plant"],
    careDifficulty: "EXPERT",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "MODERATE",
    matureHeight: "10-15 ft",
    matureSpread: "3-6 ft",
    origin: "Western Africa",
    toxicityInfo: "Mildly toxic to pets",
    imageUrl: "https://images.unsplash.com/photo-1617173944883-66a1d2437dd0?w=400&h=400&fit=crop",
    shopName: "Urban Jungle BD",
    shopLogoUrl: "https://ui-avatars.com/api/?name=UJ&background=0d9488&color=fff&size=80",
    shopSlug: "urban-jungle-bd",
  },
  {
    id: "3",
    slug: "snake-plant",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    commonNames: "Mother-in-Law's Tongue, Viper's Bowstring Hemp",
    shortDescription: "Nearly indestructible air-purifying plant that thrives on neglect and improves indoor air quality.",
    price: 350,
    inventoryCount: 25,
    category: "Succulents & Cacti",
    tags: ["Indoor", "Air Purifying", "Low Maintenance"],
    careDifficulty: "BEGINNER",
    lightRequirement: "LOW",
    wateringFrequency: "BI_WEEKLY",
    humidityLevel: "LOW",
    growthRate: "SLOW",
    matureHeight: "2-4 ft",
    matureSpread: "1-2 ft",
    origin: "West Africa",
    toxicityInfo: "Toxic to pets if chewed",
    imageUrl: "https://images.unsplash.com/photo-1599598424687-22d4339f1ca3?w=400&h=400&fit=crop",
    shopName: "The Plant Corner",
    shopLogoUrl: "https://ui-avatars.com/api/?name=PC&background=7c3aed&color=fff&size=80",
    shopSlug: "the-plant-corner",
  },
  {
    id: "4",
    slug: "pothos-golden",
    name: "Golden Pothos",
    scientificName: "Epipremnum aureum",
    commonNames: "Devil's Ivy, Money Plant",
    shortDescription: "Versatile trailing vine with heart-shaped variegated leaves, perfect for hanging baskets or shelves.",
    price: 250,
    inventoryCount: 30,
    category: "Trailing Plants",
    tags: ["Indoor", "Air Purifying", "Trailing"],
    careDifficulty: "BEGINNER",
    lightRequirement: "MEDIUM",
    wateringFrequency: "WEEKLY",
    humidityLevel: "LOW",
    growthRate: "FAST",
    matureHeight: "6-10 ft (trailing)",
    matureSpread: "2-3 ft",
    origin: "Southeast Asia",
    toxicityInfo: "Toxic to pets and humans if ingested",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-843db83f1e3d?w=400&h=400&fit=crop",
    shopName: "Leaf & Bloom",
    shopLogoUrl: "https://ui-avatars.com/api/?name=LB&background=ea580c&color=fff&size=80",
    shopSlug: "leaf-bloom",
  },
  {
    id: "5",
    slug: "peace-lily",
    name: "Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    commonNames: "White Sails, Peaceplant",
    shortDescription: "Elegant flowering plant with glossy leaves and distinctive white spathes that brightens shaded corners.",
    price: 450,
    inventoryCount: 18,
    category: "Flowering Plants",
    tags: ["Indoor", "Air Purifying", "Flowering"],
    careDifficulty: "BEGINNER",
    lightRequirement: "LOW",
    wateringFrequency: "WEEKLY",
    humidityLevel: "HIGH",
    growthRate: "MODERATE",
    matureHeight: "1-4 ft",
    matureSpread: "1-3 ft",
    origin: "Tropical Americas",
    toxicityInfo: "Toxic to cats and dogs",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
    shopName: "Flora & Fauna",
    shopLogoUrl: "https://ui-avatars.com/api/?name=FF&background=dc2626&color=fff&size=80",
    shopSlug: "flora-fauna",
  },
  {
    id: "6",
    slug: "rubber-plant",
    name: "Rubber Plant",
    scientificName: "Ficus elastica",
    commonNames: "Indian Rubber Tree, Rubber Fig",
    shortDescription: "Bold, glossy-leaved plant that makes a striking addition to bright rooms and offices.",
    price: 650,
    inventoryCount: 8,
    category: "Trees & Shrubs",
    tags: ["Indoor", "Air Purifying", "Statement Plant"],
    careDifficulty: "BEGINNER",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "FAST",
    matureHeight: "6-10 ft",
    matureSpread: "3-6 ft",
    origin: "Southeast Asia",
    toxicityInfo: "Latex sap may irritate skin",
    imageUrl: "https://images.unsplash.com/photo-1617173944883-66a1d2437dd0?w=400&h=400&fit=crop",
    shopName: "Green Paradise",
    shopLogoUrl: "https://ui-avatars.com/api/?name=GP&background=16a34a&color=fff&size=80",
    shopSlug: "green-paradise",
  },
  {
    id: "7",
    slug: "calathea-ornata",
    name: "Calathea Ornata",
    scientificName: "Goeppertia ornata",
    commonNames: "Pinstripe Plant, Prayer Plant",
    shortDescription: "Stunning foliage with delicate pink pinstripes on deep green leaves that fold up at night.",
    price: 550,
    inventoryCount: 3,
    category: "Tropical Plants",
    tags: ["Indoor", "Pet Friendly", "Decorative"],
    careDifficulty: "EXPERT",
    lightRequirement: "LOW",
    wateringFrequency: "WEEKLY",
    humidityLevel: "HIGH",
    growthRate: "MODERATE",
    matureHeight: "2-3 ft",
    matureSpread: "2-3 ft",
    origin: "South America",
    toxicityInfo: "Non-toxic to pets",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
    shopName: "The Plant Corner",
    shopLogoUrl: "https://ui-avatars.com/api/?name=PC&background=7c3aed&color=fff&size=80",
    shopSlug: "the-plant-corner",
  },
  {
    id: "8",
    slug: "aloe-vera",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    commonNames: "Medicinal Aloe, True Aloe",
    shortDescription: "Medicinal succulent with thick, fleshy leaves containing soothing gel for burns and skin care.",
    price: 200,
    inventoryCount: 40,
    category: "Succulents & Cacti",
    tags: ["Indoor", "Medicinal", "Low Maintenance"],
    careDifficulty: "BEGINNER",
    lightRequirement: "DIRECT",
    wateringFrequency: "BI_WEEKLY",
    humidityLevel: "LOW",
    growthRate: "MODERATE",
    matureHeight: "1-2 ft",
    matureSpread: "1-2 ft",
    origin: "Arabian Peninsula",
    toxicityInfo: "Toxic to pets if ingested",
    imageUrl: "https://images.unsplash.com/photo-1599598424687-22d4339f1ca3?w=400&h=400&fit=crop",
    shopName: "Urban Jungle BD",
    shopLogoUrl: "https://ui-avatars.com/api/?name=UJ&background=0d9488&color=fff&size=80",
    shopSlug: "urban-jungle-bd",
  },
  {
    id: "9",
    slug: "bird-of-paradise",
    name: "Bird of Paradise",
    scientificName: "Strelitzia reginae",
    commonNames: "Crane Flower, Wild Banana",
    shortDescription: "Tropical showstopper with banana-like leaves and exotic bird-shaped orange and blue flowers.",
    price: 950,
    inventoryCount: 6,
    category: "Flowering Plants",
    tags: ["Indoor", "Statement Plant", "Flowering"],
    careDifficulty: "INTERMEDIATE",
    lightRequirement: "DIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "MODERATE",
    matureHeight: "5-6 ft",
    matureSpread: "3-5 ft",
    origin: "South Africa",
    toxicityInfo: "Mildly toxic to pets",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
    shopName: "Leaf & Bloom",
    shopLogoUrl: "https://ui-avatars.com/api/?name=LB&background=ea580c&color=fff&size=80",
    shopSlug: "leaf-bloom",
  },
  {
    id: "10",
    slug: "string-of-pearls",
    name: "String of Pearls",
    scientificName: "Senecio rowleyanus",
    commonNames: "Pearl Plant, Bead Plant",
    shortDescription: "Unique trailing succulent with bead-like leaves cascading down from hanging containers.",
    price: 300,
    inventoryCount: 15,
    category: "Succulents & Cacti",
    tags: ["Indoor", "Trailing", "Succulent"],
    careDifficulty: "INTERMEDIATE",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "BI_WEEKLY",
    humidityLevel: "LOW",
    growthRate: "MODERATE",
    matureHeight: "Trailing 2-3 ft",
    matureSpread: "1-2 ft",
    origin: "Southwest Africa",
    toxicityInfo: "Toxic to cats, dogs, and humans",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-843db83f1e3d?w=400&h=400&fit=crop",
    shopName: "Flora & Fauna",
    shopLogoUrl: "https://ui-avatars.com/api/?name=FF&background=dc2626&color=fff&size=80",
    shopSlug: "flora-fauna",
  },
  {
    id: "11",
    slug: "zz-plant",
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    commonNames: "Eternity Plant, Arrowhead Plant",
    shortDescription: "Virtually indestructible plant with glossy, dark green leaves that thrives in low light conditions.",
    price: 400,
    inventoryCount: 22,
    category: "Tropical Plants",
    tags: ["Indoor", "Low Maintenance", "Air Purifying"],
    careDifficulty: "BEGINNER",
    lightRequirement: "LOW",
    wateringFrequency: "MONTHLY",
    humidityLevel: "LOW",
    growthRate: "SLOW",
    matureHeight: "2-3 ft",
    matureSpread: "2-3 ft",
    origin: "Eastern Africa",
    toxicityInfo: "Toxic if ingested",
    imageUrl: "https://images.unsplash.com/photo-1599598424687-22d4339f1ca3?w=400&h=400&fit=crop",
    shopName: "Green Paradise",
    shopLogoUrl: "https://ui-avatars.com/api/?name=GP&background=16a34a&color=fff&size=80",
    shopSlug: "green-paradise",
  },
  {
    id: "12",
    slug: "philodendron-heartleaf",
    name: "Heartleaf Philodendron",
    scientificName: "Philodendron hederaceum",
    commonNames: "Sweetheart Plant, Cowboy Plant",
    shortDescription: "Classic trailing plant with beautiful heart-shaped leaves, perfect for beginners and shelves.",
    price: 280,
    inventoryCount: 0,
    category: "Trailing Plants",
    tags: ["Indoor", "Trailing", "Air Purifying"],
    careDifficulty: "BEGINNER",
    lightRequirement: "MEDIUM",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "FAST",
    matureHeight: "Trailing 6-10 ft",
    matureSpread: "2-3 ft",
    origin: "Central America & Caribbean",
    toxicityInfo: "Toxic to pets if ingested",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-843db83f1e3d?w=400&h=400&fit=crop",
    shopName: "The Plant Corner",
    shopLogoUrl: "https://ui-avatars.com/api/?name=PC&background=7c3aed&color=fff&size=80",
    shopSlug: "the-plant-corner",
  },
  {
    id: "13",
    slug: "chinese-money-plant",
    name: "Chinese Money Plant",
    scientificName: "Pilea peperomioides",
    commonNames: "UFO Plant, Pancake Plant",
    shortDescription: "Charming plant with round, pancake-like leaves on slender stems that produces baby offsets.",
    price: 380,
    inventoryCount: 14,
    category: "Tropical Plants",
    tags: ["Indoor", "Pet Friendly", "Decorative"],
    careDifficulty: "INTERMEDIATE",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "FAST",
    matureHeight: "1-2 ft",
    matureSpread: "1-2 ft",
    origin: "Southern China",
    toxicityInfo: "Non-toxic to pets",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
    shopName: "Urban Jungle BD",
    shopLogoUrl: "https://ui-avatars.com/api/?name=UJ&background=0d9488&color=fff&size=80",
    shopSlug: "urban-jungle-bd",
  },
  {
    id: "14",
    slug: "english-ivy",
    name: "English Ivy",
    scientificName: "Hedera helix",
    commonNames: "Common Ivy, Branching Ivy",
    shortDescription: "Classic evergreen climber with lobed leaves, great for topiary, hanging baskets, or ground cover.",
    price: 220,
    inventoryCount: 20,
    category: "Trailing Plants",
    tags: ["Indoor", "Trailing", "Air Purifying"],
    careDifficulty: "INTERMEDIATE",
    lightRequirement: "MEDIUM",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "FAST",
    matureHeight: "Trailing 6-9 ft",
    matureSpread: "3-6 ft",
    origin: "Europe & Western Asia",
    toxicityInfo: "Toxic to pets and humans if ingested",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-843db83f1e3d?w=400&h=400&fit=crop",
    shopName: "Leaf & Bloom",
    shopLogoUrl: "https://ui-avatars.com/api/?name=LB&background=ea580c&color=fff&size=80",
    shopSlug: "leaf-bloom",
  },
  {
    id: "15",
    slug: "jade-plant",
    name: "Jade Plant",
    scientificName: "Crassula ovata",
    commonNames: "Money Plant, Lucky Plant, Dollar Plant",
    shortDescription: "Succulent tree-like plant with thick, glossy leaves believed to bring good luck and prosperity.",
    price: 320,
    inventoryCount: 17,
    category: "Succulents & Cacti",
    tags: ["Indoor", "Succulent", "Low Maintenance"],
    careDifficulty: "BEGINNER",
    lightRequirement: "DIRECT",
    wateringFrequency: "BI_WEEKLY",
    humidityLevel: "LOW",
    growthRate: "SLOW",
    matureHeight: "3-6 ft",
    matureSpread: "2-3 ft",
    origin: "South Africa & Mozambique",
    toxicityInfo: "Toxic to cats, dogs, and horses",
    imageUrl: "https://images.unsplash.com/photo-1599598424687-22d4339f1ca3?w=400&h=400&fit=crop",
    shopName: "Flora & Fauna",
    shopLogoUrl: "https://ui-avatars.com/api/?name=FF&background=dc2626&color=fff&size=80",
    shopSlug: "flora-fauna",
  },
  {
    id: "16",
    slug: "spider-plant",
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    commonNames: "Airplane Plant, Hen-and-Chickens",
    shortDescription: "Easy-care plant with arching striped leaves that produces adorable baby plantlets on long stems.",
    price: 180,
    inventoryCount: 35,
    category: "Trailing Plants",
    tags: ["Indoor", "Air Purifying", "Pet Friendly"],
    careDifficulty: "BEGINNER",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "MEDIUM",
    growthRate: "FAST",
    matureHeight: "1-1.5 ft",
    matureSpread: "1.5-2 ft",
    origin: "South Africa",
    toxicityInfo: "Non-toxic to pets",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-843db83f1e3d?w=400&h=400&fit=crop",
    shopName: "Green Paradise",
    shopLogoUrl: "https://ui-avatars.com/api/?name=GP&background=16a34a&color=fff&size=80",
    shopSlug: "green-paradise",
  },
  {
    id: "17",
    slug: "areca-palm",
    name: "Areca Palm",
    scientificName: "Dypsis lutescens",
    commonNames: "Butterfly Palm, Golden Cane Palm",
    shortDescription: "Graceful palm with feathery yellow-green fronds that adds tropical ambiance and purifies air.",
    price: 750,
    inventoryCount: 7,
    category: "Trees & Shrubs",
    tags: ["Indoor", "Air Purifying", "Pet Friendly"],
    careDifficulty: "INTERMEDIATE",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "HIGH",
    growthRate: "MODERATE",
    matureHeight: "6-8 ft",
    matureSpread: "3-6 ft",
    origin: "Madagascar",
    toxicityInfo: "Non-toxic to pets",
    imageUrl: "https://images.unsplash.com/photo-1617173944883-66a1d2437dd0?w=400&h=400&fit=crop",
    shopName: "The Plant Corner",
    shopLogoUrl: "https://ui-avatars.com/api/?name=PC&background=7c3aed&color=fff&size=80",
    shopSlug: "the-plant-corner",
  },
  {
    id: "18",
    slug: "string-of-hearts",
    name: "String of Hearts",
    scientificName: "Ceropegia woodii",
    commonNames: "Rosary Vine, Sweetheart Vine",
    shortDescription: "Delicate trailing vine with heart-shaped leaves speckled in silver, cascading beautifully.",
    price: 270,
    inventoryCount: 11,
    category: "Succulents & Cacti",
    tags: ["Indoor", "Trailing", "Succulent"],
    careDifficulty: "INTERMEDIATE",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "BI_WEEKLY",
    humidityLevel: "LOW",
    growthRate: "MODERATE",
    matureHeight: "Trailing 3-6 ft",
    matureSpread: "1-2 ft",
    origin: "Southern Africa",
    toxicityInfo: "Non-toxic to pets",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-843db83f1e3d?w=400&h=400&fit=crop",
    shopName: "Urban Jungle BD",
    shopLogoUrl: "https://ui-avatars.com/api/?name=UJ&background=0d9488&color=fff&size=80",
    shopSlug: "urban-jungle-bd",
  },
  {
    id: "19",
    slug: "dracaena-marginata",
    name: "Dragon Tree",
    scientificName: "Dracaena marginata",
    commonNames: "Madagascar Dragon Tree, Red-edged Dracaena",
    shortDescription: "Architectural plant with thin red-edged leaves atop slender, tree-like trunks.",
    price: 580,
    inventoryCount: 9,
    category: "Trees & Shrubs",
    tags: ["Indoor", "Air Purifying", "Statement Plant"],
    careDifficulty: "BEGINNER",
    lightRequirement: "MEDIUM",
    wateringFrequency: "WEEKLY",
    humidityLevel: "LOW",
    growthRate: "SLOW",
    matureHeight: "8-15 ft",
    matureSpread: "3-5 ft",
    origin: "Madagascar",
    toxicityInfo: "Toxic to dogs and cats",
    imageUrl: "https://images.unsplash.com/photo-1617173944883-66a1d2437dd0?w=400&h=400&fit=crop",
    shopName: "Leaf & Bloom",
    shopLogoUrl: "https://ui-avatars.com/api/?name=LB&background=ea580c&color=fff&size=80",
    shopSlug: "leaf-bloom",
  },
  {
    id: "20",
    slug: "anthurium",
    name: "Anthurium",
    scientificName: "Anthurium andraeanum",
    commonNames: "Flamingo Flower, Laceleaf",
    shortDescription: "Tropical beauty with waxy, heart-shaped flowers in vibrant red, pink, or white that bloom year-round.",
    price: 500,
    inventoryCount: 4,
    category: "Flowering Plants",
    tags: ["Indoor", "Flowering", "Tropical"],
    careDifficulty: "INTERMEDIATE",
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "HIGH",
    growthRate: "MODERATE",
    matureHeight: "1-1.5 ft",
    matureSpread: "1-2 ft",
    origin: "South America",
    toxicityInfo: "Toxic to pets and humans if ingested",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop",
    shopName: "Flora & Fauna",
    shopLogoUrl: "https://ui-avatars.com/api/?name=FF&background=dc2626&color=fff&size=80",
    shopSlug: "flora-fauna",
  },
];

const CATEGORIES = Array.from(new Set(STATIC_PLANTS.map((p) => p.category)));

// Category hierarchy for tree display
interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
}

const CATEGORY_TREE: CategoryNode[] = [
  {
    id: "tropical",
    name: "Tropical Plants",
    children: [],
  },
  {
    id: "trees-shrubs",
    name: "Trees & Shrubs",
    children: [],
  },
  {
    id: "succulents",
    name: "Succulents & Cacti",
    children: [],
  },
  {
    id: "trailing",
    name: "Trailing Plants",
    children: [],
  },
  {
    id: "flowering",
    name: "Flowering Plants",
    children: [],
  },
];

const CATEGORY_MAP: Record<string, CategoryNode[]> = {
  "tropical": [
    { id: "tropical-indoor", name: "Indoor Tropical", children: [] },
    { id: "tropical-outdoor", name: "Outdoor Tropical", children: [] },
  ],
  "trees-shrubs": [
    { id: "trees-indoor", name: "Indoor Trees", children: [] },
    { id: "trees-outdoor", name: "Outdoor Trees", children: [] },
  ],
  "succulents": [
    { id: "succulents-cacti", name: "Cacti", children: [] },
    { id: "succulents-other", name: "Other Succulents", children: [] },
  ],
  "trailing": [
    { id: "trailing-vines", name: "Vines", children: [] },
    { id: "trailing-cascading", name: "Cascading", children: [] },
  ],
  "flowering": [
    { id: "flowering-indoor", name: "Indoor Flowering", children: [] },
    { id: "flowering-outdoor", name: "Outdoor Flowering", children: [] },
  ],
};

// Tag groups for filter display
interface TagGroup {
  name: string;
  tags: string[];
}

const TAG_GROUPS: TagGroup[] = [
  { name: "Location", tags: ["Indoor"] },
  { name: "Care", tags: ["Low Maintenance", "Air Purifying", "Medicinal"] },
  { name: "Growth", tags: ["Fast Growing", "Trailing", "Succulent"] },
  { name: "Features", tags: ["Pet Friendly", "Decorative", "Statement Plant", "Flowering", "Tropical"] },
];

const ALL_TAGS = Array.from(new Set(STATIC_PLANTS.flatMap((p) => p.tags)));

// ========================
// Helpers
// ========================

function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

function getInventoryLabel(count: number): string {
  if (count === 0) return "Out of Stock";
  if (count <= 5) return `Only ${count} left`;
  if (count <= 20) return `${count} in stock`;
  return "In Stock";
}

function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case "BEGINNER": return "Easy";
    case "INTERMEDIATE": return "Medium";
    case "EXPERT": return "Advanced";
    default: return "";
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

function FilterSection(props: {
  categoryId: () => string;
  setCategoryId: (v: string) => void;
  selectedTags: () => string[];
  toggleTag: (t: string) => void;
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

  const setCat = (v: string) => { props.setCategoryId(v); props.setCurrentPage(1); };
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

      {/* Category */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div class="space-y-0.5">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={props.categoryId() === ""}
              onChange={() => setCat("")}
              class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">All Categories</span>
          </label>
          <For each={CATEGORY_TREE}>
            {(node) => {
              const children = CATEGORY_MAP[node.id] || [];
              return (
                <div>
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={node.id}
                      checked={props.categoryId() === node.id}
                      onChange={() => setCat(node.id)}
                      class="w-4 h-4 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
                    />
                    <span class="text-sm font-medium text-gray-800 dark:text-cream-100 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{node.name}</span>
                  </label>
                  <For each={children}>
                    {(child) => (
                      <label class="flex items-center gap-2 cursor-pointer group pl-4">
                        <input
                          type="radio"
                          name="category"
                          value={child.id}
                          checked={props.categoryId() === child.id}
                          onChange={() => setCat(child.id)}
                          class="w-3.5 h-3.5 rounded-full border-gray-300 text-forest-600 focus:ring-forest-500"
                        />
                        <span class="text-sm text-gray-600 dark:text-gray-400 group-hover:text-forest-700 dark:group-hover:text-forest-300 transition-colors">{child.name}</span>
                      </label>
                    )}
                  </For>
                </div>
              );
            }}
          </For>
        </div>
      </div>

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

      {/* Tags */}
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div class="space-y-2.5">
          <For each={TAG_GROUPS}>
            {(group) => (
              <div>
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  {group.name}
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <For each={group.tags}>
                    {(tag) => {
                      const isSelected = props.selectedTags().includes(tag);
                      return (
                        <button
                          onClick={() => props.toggleTag(tag)}
                          class={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-forest-500 text-white"
                              : "bg-cream-100 text-cream-800 dark:bg-forest-700 dark:text-gray-300 hover:bg-cream-200 dark:hover:bg-forest-600"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

// ========================
// Plant Card
// ========================

function PlantCard(props: { plant: StaticPlant }) {
  const plant = props.plant;
  const inStock = plant.inventoryCount > 0;

  const lightLabel = (light: string) => {
    switch (light) {
      case "LOW": return "Low";
      case "MEDIUM": return "Medium";
      case "BRIGHT_INDIRECT": return "Bright";
      case "DIRECT": return "Direct";
      default: return light;
    }
  };

  const wateringLabel = (freq: string) => {
    switch (freq) {
      case "DAILY": return "Daily";
      case "WEEKLY": return "Weekly";
      case "BI_WEEKLY": return "Bi-weekly";
      case "MONTHLY": return "Monthly";
      default: return freq;
    }
  };

  return (
    <A
      href={`/plants/${plant.id}`}
      class="group block bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden hover:shadow-lg hover:border-forest-300 dark:hover:border-forest-600 transition-all duration-300"
    >
      {/* Image - 4:3 portrait */}
      <div class="relative aspect-[4/3] bg-cream-100 dark:bg-forest-900/50 overflow-hidden">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "";
          }}
        />

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
          <Show when={plant.inventoryCount > 0 && plant.inventoryCount <= 5}>
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-cream-500/90 backdrop-blur-sm text-xs font-semibold text-cream-900">
              Only {plant.inventoryCount} left
            </span>
          </Show>
        </div>

        {/* Care Difficulty */}
        <div class="absolute top-3 right-3">
          <span class={`inline-flex items-center px-2.5 py-1 rounded-lg backdrop-blur-sm text-xs font-semibold ${
            plant.careDifficulty === "BEGINNER"
              ? "bg-forest-500/90 text-white"
              : plant.careDifficulty === "INTERMEDIATE"
                ? "bg-sage-500/90 text-white"
                : "bg-terracotta-500/90 text-white"
          }`}>
            {getDifficultyLabel(plant.careDifficulty)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div class="p-4">
        {/* Name & Scientific Name */}
        <div class="mb-2">
          <h3 class="font-semibold text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-forest-300 transition-colors">
            {plant.name}
          </h3>
          <p class="text-xs italic text-gray-400 dark:text-gray-500 mt-0.5 truncate">
            {plant.scientificName}
          </p>
        </div>

        {/* Shop Info */}
        <A
          href={`/shops/${plant.shopSlug}`}
          class="inline-flex items-center gap-2 mb-3 px-2 py-1 rounded-lg hover:bg-cream-50 dark:hover:bg-forest-700/50 transition-colors group/shop"
        >
          <img
            src={plant.shopLogoUrl}
            alt={plant.shopName}
            class="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200 dark:ring-forest-600"
          />
          <span class="text-xs text-gray-500 dark:text-gray-400 group-hover/shop:text-forest-600 dark:group-hover/shop:text-forest-300 transition-colors">
            {plant.shopName}
          </span>
        </A>

        {/* Tags - compact, max 3 */}
        <Show when={plant.tags.length > 0}>
          <div class="flex flex-wrap gap-1.5 mb-3">
            <For each={plant.tags.slice(0, 3)}>
              {(tag) => (
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-cream-100/80 text-cream-700 dark:bg-forest-700/60 dark:text-gray-300">
                  {tag}
                </span>
              )}
            </For>
          </div>
        </Show>

        {/* Care Info - Clean labels */}
        <div class="flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`Light: ${plant.lightRequirement}`}>
            <SunIcon class="w-3.5 h-3.5 text-amber-500" />
            {lightLabel(plant.lightRequirement)}
          </span>
          <span class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400" title={`Watering: ${plant.wateringFrequency}`}>
            <DropletIcon class="w-3.5 h-3.5 text-blue-500" />
            {wateringLabel(plant.wateringFrequency)}
          </span>
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

export default function PlantsPage() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [categoryId, setCategoryId] = createSignal("");
  const [selectedTags, setSelectedTags] = createSignal<string[]>([]);
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

  const SORT_OPTIONS = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "inventory", label: "Availability" },
    { value: "difficulty", label: "Care Level" },
  ];

  // Debounce search - client only
  let debounceTimer: ReturnType<typeof setTimeout>;
  createEffect(() => {
    const query = searchQuery();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setDebouncedSearch(query);
      setCurrentPage(1);
    }, 300);
  });

  const toggleTag = (tag: string) => {
    const current = selectedTags();
    if (current.includes(tag)) {
      setSelectedTags(current.filter((t) => t !== tag));
    } else {
      setSelectedTags([...current, tag]);
    }
    setCurrentPage(1);
  };

  // Filtered & sorted plants
  const filteredPlants = createMemo(() => {
    let result = [...STATIC_PLANTS];

    const search = debouncedSearch().toLowerCase().trim();
    const cat = categoryId();
    const tags = selectedTags();
    const difficulty = careDifficulty();
    const light = lightRequirement();
    const watering = wateringFrequency();
    const humidity = humidityLevel();
    const growth = growthRate();
    const minP = minPrice() ? parseFloat(minPrice()) : undefined;
    const maxP = maxPrice() ? parseFloat(maxPrice()) : undefined;
    const stock = inStockOnly();

    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.scientificName.toLowerCase().includes(search) ||
          p.commonNames.toLowerCase().includes(search) ||
          p.shortDescription.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (cat) result = result.filter((p) => p.category === cat);
    if (tags.length > 0) result = result.filter((p) => tags.every((t) => p.tags.includes(t)));
    if (difficulty) result = result.filter((p) => p.careDifficulty === difficulty);
    if (light) result = result.filter((p) => p.lightRequirement === light);
    if (watering) result = result.filter((p) => p.wateringFrequency === watering);
    if (humidity) result = result.filter((p) => p.humidityLevel === humidity);
    if (growth) result = result.filter((p) => p.growthRate === growth);
    if (minP !== undefined) result = result.filter((p) => p.price >= minP);
    if (maxP !== undefined) result = result.filter((p) => p.price <= maxP);
    if (stock) result = result.filter((p) => p.inventoryCount > 0);

    const sort = sortBy();
    const order = sortOrder();
    const multiplier = order === "asc" ? 1 : -1;

    result.sort((a, b) => {
      switch (sort) {
        case "name": return multiplier * a.name.localeCompare(b.name);
        case "price": return multiplier * (a.price - b.price);
        case "inventory": return multiplier * (b.inventoryCount - a.inventoryCount);
        case "difficulty": {
          const diffOrder = { BEGINNER: 1, INTERMEDIATE: 2, EXPERT: 3 };
          return multiplier * (diffOrder[a.careDifficulty] - diffOrder[b.careDifficulty]);
        }
        default: return 0;
      }
    });

    return result;
  });

  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(filteredPlants().length / ITEMS_PER_PAGE))
  );

  const paginatedPlants = createMemo(() => {
    const start = (currentPage() - 1) * ITEMS_PER_PAGE;
    return filteredPlants().slice(start, start + ITEMS_PER_PAGE);
  });

  const hasActiveFilters = createMemo(
    () =>
      !!debouncedSearch() ||
      !!categoryId() ||
      selectedTags().length > 0 ||
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
    if (categoryId()) count++;
    count += selectedTags().length;
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
    setCategoryId("");
    setSelectedTags([]);
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

        {/* Sidebar - fixed on desktop so it never scrolls */}
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
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
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
                  {paginatedPlants().length}
                </span>{" "}
                of{" "}
                <span class="font-semibold text-forest-800 dark:text-cream-50">
                  {filteredPlants().length}
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
                <Show when={categoryId()}>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                    {categoryId()}
                    <button onClick={() => setCategoryId("")} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                      <XIcon class="w-3 h-3" />
                    </button>
                  </span>
                </Show>
                <For each={selectedTags()}>
                  {(tag) => (
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border border-forest-200 dark:border-forest-700">
                      {tag}
                      <button onClick={() => toggleTag(tag)} class="ml-0.5 p-0.5 rounded-full hover:bg-forest-200 dark:hover:bg-forest-700 transition-colors">
                        <XIcon class="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </For>
              </div>
            </Show>

            {/* Plant Grid */}
            <Show
              when={paginatedPlants().length > 0}
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
                <For each={paginatedPlants()}>
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
          </div>
        </main>
      </div>
    </div>
  );
}
