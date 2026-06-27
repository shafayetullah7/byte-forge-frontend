import type { JSX } from "solid-js";
import {
  SunIcon,
  DropletIcon,
  CloudIcon,
  BeakerIcon,
  SproutIcon,
  ScissorsIcon,
  ExclamationCircleIcon,
  CalendarIcon,
} from "~/components/icons";

export type CareInstructionKey =
  | "lightInstructions"
  | "wateringInstructions"
  | "humidityInstructions"
  | "fertilizerSchedule"
  | "repottingFrequency"
  | "pruningNotes"
  | "commonProblems"
  | "seasonalCare";

export interface CareInstructionItemConfig {
  field: CareInstructionKey;
  icon: JSX.Element;
  iconColor: string;
  bgColor: string;
  titleEnKey: string;
  titleBnKey: string;
}

export const CARE_INSTRUCTION_ITEMS: CareInstructionItemConfig[] = [
  {
    field: "lightInstructions",
    icon: <SunIcon class="w-5 h-5" />,
    iconColor: "text-cream-600 dark:text-cream-400",
    bgColor: "bg-cream-50 dark:bg-forest-900/30",
    titleEnKey: "seller.products.plantOverview.lightCare",
    titleBnKey: "seller.products.plantOverview.lightCareBn",
  },
  {
    field: "wateringInstructions",
    icon: <DropletIcon class="w-5 h-5" />,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    titleEnKey: "seller.products.plantOverview.wateringGuide",
    titleBnKey: "seller.products.plantOverview.wateringGuideBn",
  },
  {
    field: "humidityInstructions",
    icon: <CloudIcon class="w-5 h-5" />,
    iconColor: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
    titleEnKey: "seller.products.plantOverview.humidityCare",
    titleBnKey: "seller.products.plantOverview.humidityCareBn",
  },
  {
    field: "fertilizerSchedule",
    icon: <BeakerIcon class="w-5 h-5" />,
    iconColor: "text-sage-600 dark:text-sage-400",
    bgColor: "bg-sage-50 dark:bg-sage-900/20",
    titleEnKey: "seller.products.plantOverview.fertilizerSchedule",
    titleBnKey: "seller.products.plantOverview.fertilizerScheduleBn",
  },
  {
    field: "repottingFrequency",
    icon: <SproutIcon class="w-5 h-5" />,
    iconColor: "text-forest-600 dark:text-forest-400",
    bgColor: "bg-forest-50 dark:bg-forest-900/20",
    titleEnKey: "seller.products.plantOverview.repotting",
    titleBnKey: "seller.products.plantOverview.repottingBn",
  },
  {
    field: "pruningNotes",
    icon: <ScissorsIcon class="w-5 h-5" />,
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    titleEnKey: "seller.products.plantOverview.pruning",
    titleBnKey: "seller.products.plantOverview.pruningBn",
  },
  {
    field: "commonProblems",
    icon: <ExclamationCircleIcon class="w-5 h-5" />,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    titleEnKey: "seller.products.plantOverview.commonProblems",
    titleBnKey: "seller.products.plantOverview.commonProblemsBn",
  },
  {
    field: "seasonalCare",
    icon: <CalendarIcon class="w-5 h-5" />,
    iconColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    titleEnKey: "seller.products.plantOverview.seasonalCare",
    titleBnKey: "seller.products.plantOverview.seasonalCareBn",
  },
];
