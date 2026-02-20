import { useI18n } from "~/i18n";

export default function SocialLogin() {
  const { t } = useI18n();

  return (
    <div class="mt-8">
      {/* Divider */}
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-cream-200 dark:border-forest-800"></div>
        </div>
        <div class="relative flex justify-center text-[11px] uppercase tracking-[0.1em] font-bold">
          <span class="px-4 bg-white dark:bg-forest-900 text-forest-600/60 dark:text-cream-200/40">
            {t("auth.social.orContinueWith")}
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div class="grid grid-cols-3 gap-4">
        {/* Google */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 rounded-lg shadow-sm hover:shadow-md hover:bg-terracotta-50/30 dark:hover:bg-forest-700 hover:border-terracotta-200 dark:hover:border-forest-600 transition-all duration-300 group"
          title={`${t("common.create")} ${t("auth.social.google")}`}
        >
          <img
            src="/google-brands-solid-full.svg"
            alt="Google"
            class="w-5 h-5 transition-transform group-hover:scale-110"
          />
          <span class="text-sm font-semibold text-forest-800 dark:text-cream-100 hidden sm:inline">
            {t("auth.social.google")}
          </span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 rounded-lg shadow-sm hover:shadow-md hover:bg-terracotta-50/30 dark:hover:bg-forest-700 hover:border-terracotta-200 dark:hover:border-forest-600 transition-all duration-300 group"
          title={t("auth.social.facebook")}
        >
          <img
            src="/facebook-brands-solid-full.svg"
            alt="Facebook"
            class="w-5 h-5 transition-transform group-hover:scale-110"
          />
          <span class="text-sm font-semibold text-forest-800 dark:text-cream-100 hidden sm:inline">
            {t("auth.social.facebook")}
          </span>
        </button>

        {/* X (Twitter) */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 rounded-lg shadow-sm hover:shadow-md hover:bg-terracotta-50/30 dark:hover:bg-forest-700 hover:border-terracotta-200 dark:hover:border-forest-600 transition-all duration-300 group"
          title={t("auth.social.x")}
        >
          <img
            src="/x-twitter-brands-solid-full.svg"
            alt="X"
            class="w-5 h-5 dark:invert transition-transform group-hover:scale-110"
          />
          <span class="text-sm font-semibold text-forest-800 dark:text-cream-100 hidden sm:inline">
            {t("auth.social.x")}
          </span>
        </button>
      </div>
    </div>
  );
}
