import { SunIcon, DropletIcon, MoonIcon, TrendingUpIcon, CubeIcon, ScissorsIcon, ExclamationCircleIcon, CalendarIcon } from "~/components/icons";
import { SectionCard } from "../components/SectionCard";
import { MOCK_PLANT } from "../mock-data";

export default function CareGuideRoute() {
  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SectionCard title="Care Guide (English)" icon={<SunIcon class="w-4 h-4 text-gray-400" />}>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><SunIcon class="w-4 h-4 text-gray-400" />Light Instructions</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.lightInstructions}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><DropletIcon class="w-4 h-4 text-gray-400" />Watering Instructions</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.wateringInstructions}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><MoonIcon class="w-4 h-4 text-gray-400" />Humidity Instructions</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.humidityInstructions}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><TrendingUpIcon class="w-4 h-4 text-gray-400" />Fertilizer Schedule</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.fertilizerSchedule}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><CubeIcon class="w-4 h-4 text-gray-400" />Repotting Frequency</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.repottingFrequency}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><ScissorsIcon class="w-4 h-4 text-gray-400" />Pruning Notes</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.pruningNotes}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><ExclamationCircleIcon class="w-4 h-4 text-gray-400" />Common Problems</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.commonProblems}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><CalendarIcon class="w-4 h-4 text-gray-400" />Seasonal Care</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.en.seasonalCare}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="যত্নের নির্দেশিকা (বাংলা)" icon={<SunIcon class="w-4 h-4 text-gray-400" />}>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><SunIcon class="w-4 h-4 text-gray-400" />আলোর নির্দেশনা</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.lightInstructions}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><DropletIcon class="w-4 h-4 text-gray-400" />পানির নির্দেশনা</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.wateringInstructions}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><MoonIcon class="w-4 h-4 text-gray-400" />আর্দ্রতার নির্দেশনা</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.humidityInstructions}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><TrendingUpIcon class="w-4 h-4 text-gray-400" />সারের সময়সূচী</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.fertilizerSchedule}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><CubeIcon class="w-4 h-4 text-gray-400" />পুনরায় পোট করার সময়সূচী</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.repottingFrequency}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><ScissorsIcon class="w-4 h-4 text-gray-400" />ছাঁটাইয়ের নোট</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.pruningNotes}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><ExclamationCircleIcon class="w-4 h-4 text-gray-400" />সাধারণ সমস্যা</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.commonProblems}</p>
          </div>
          <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><CalendarIcon class="w-4 h-4 text-gray-400" />মৌসুমি যত্ন</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{MOCK_PLANT.careGuide.bn.seasonalCare}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
