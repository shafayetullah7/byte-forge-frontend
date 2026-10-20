import type { Component } from "solid-js";
import {
  CubeIcon,
  FolderIcon,
  LeafIcon,
  SparklesIcon,
  SproutIcon,
  SunIcon,
} from "~/components/icons";

type IconComponent = Component<{ class?: string }>;

function normalizeCategorySlug(slug: string): string {
  return slug.toLowerCase().replace(/_/g, "-");
}

function HomeOutlineIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.75"
      stroke="currentColor"
      class={props.class}
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function TreesOutlineIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.75"
      stroke="currentColor"
      class={props.class}
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3v2m-4 4l-1.5 1.5M16 7l1.5 1.5M8 21h8M10 21v-4h4v4M7 13c0-2.5 2-4.5 5-4.5s5 2 5 4.5c0 1.5-1 2.5-2.5 3H9.5C8 15.5 7 14.5 7 13z"
      />
    </svg>
  );
}

function AppleOutlineIcon(props: { class?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.75"
      stroke="currentColor"
      class={props.class}
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4c-1.5 0-3 1-3.5 2.5C8 8.5 8.5 10 10 11c-2 .5-4 2-4 5a6 6 0 0012 0c0-3-2-4.5-4-5 1.5-1 .5-2.5.5-4.5-.5-1.5-2-2.5-3.5-2.5z"
      />
      <path stroke-linecap="round" d="M12 4V2.5" />
    </svg>
  );
}

const SLUG_ICON_RULES: { test: (slug: string) => boolean; icon: IconComponent }[] = [
  { test: (s) => s.includes("indoor") || s.includes("house"), icon: HomeOutlineIcon },
  { test: (s) => s.includes("balcony") || s.includes("patio"), icon: SunIcon },
  { test: (s) => s.includes("seasonal"), icon: SunIcon },
  { test: (s) => s.includes("exotic") || s.includes("rare"), icon: SparklesIcon },
  { test: (s) => s.includes("succulent") || s.includes("cactus"), icon: SproutIcon },
  { test: (s) => s.includes("outdoor") || s.includes("garden"), icon: TreesOutlineIcon },
  { test: (s) => s.includes("easy") || s.includes("beginner") || s.includes("low-maintenance"), icon: LeafIcon },
  { test: (s) => s.includes("flower") || s.includes("bloom"), icon: SparklesIcon },
  { test: (s) => s.includes("fruit") || s.includes("herb") || s.includes("vegetable"), icon: AppleOutlineIcon },
  { test: (s) => s.includes("seed") || s.includes("sapling"), icon: SproutIcon },
  { test: (s) => s.includes("pot") || s.includes("planter") || s.includes("soil") || s.includes("fertil"), icon: CubeIcon },
];

/** Decorative icon for a taxonomy slug; falls back to folder. */
export function getCategoryIcon(slug: string): IconComponent {
  const normalized = normalizeCategorySlug(slug);
  return SLUG_ICON_RULES.find((rule) => rule.test(normalized))?.icon ?? FolderIcon;
}
