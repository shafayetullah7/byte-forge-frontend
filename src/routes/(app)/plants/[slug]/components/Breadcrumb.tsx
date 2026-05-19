import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { ChevronRightIcon } from "~/components/icons";

function Breadcrumb(props: { plantName: string }) {
  const { t } = useI18n();

  return (
    <nav class="flex items-center gap-2 text-sm mb-6">
      <A href="/" class="text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
        {t("common.home")}
      </A>
      <ChevronRightIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" />
      <A href="/plants" class="text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
        {t("common.plants")}
      </A>
      <ChevronRightIcon class="w-4 h-4 text-gray-400 dark:text-gray-500" />
      <span class="text-forest-800 dark:text-cream-50 font-medium truncate">
        {props.plantName}
      </span>
    </nav>
  );
}

export default Breadcrumb;
