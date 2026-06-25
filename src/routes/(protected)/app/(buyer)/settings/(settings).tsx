import { Component } from "solid-js";
import { Title } from "@solidjs/meta";
import { useI18n } from "~/i18n";
import { formatPageTitle } from "~/lib/seo/meta";

const Settings: Component = () => {
  const { t } = useI18n();

  return (
    <>
      <Title>{formatPageTitle(t("common.settings"))}</Title>
      <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t("common.settings")}
        </h2>
        <div class="bg-white dark:bg-forest-800 shadow rounded-lg p-6 border border-gray-200 dark:border-forest-700">
          <p class="text-gray-600 dark:text-gray-300">
            {t("buyer.settings.placeholder")}
          </p>
        </div>
      </div>
    </>
  );
};

export default Settings;
