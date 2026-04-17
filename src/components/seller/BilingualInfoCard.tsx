import { useI18n } from "~/i18n";

interface TranslationData {
  name: string | null | undefined;
  description: string | null | undefined;
  businessHours: string | null | undefined;
}

interface BilingualInfoCardProps {
  enData: TranslationData;
  bnData: TranslationData;
  onEdit?: () => void;
}

interface LanguageSectionProps {
  title: string;
  badge: string;
  badgeColor: "gray" | "terracotta";
  hasContent: boolean;
  emptyMessage: string;
  emptyHint: string;
  name: string | null | undefined;
  description: string | null | undefined;
  businessHours: string | null | undefined;
  isBengali?: boolean;
}

function LanguageSection(props: LanguageSectionProps) {
  const { t } = useI18n();
  
  const badgeColors = {
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    terracotta: "bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/30 dark:text-terracotta-300",
  };

  return (
    <div class="flex-1">
      {/* Language Header */}
      <div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700/50">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 text-white text-sm font-bold">
          {props.isBengali ? "বা" : "EN"}
        </div>
        <h4 class="font-bold text-gray-900 dark:text-gray-100">
          {props.title}
        </h4>
        <span class={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColors[props.badgeColor]}`}>
          {props.badge}
        </span>
      </div>

      {props.hasContent ? (
        <div class="space-y-5">
          {/* Name */}
          {props.name && (
            <div class="group">
              <label class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {props.isBengali ? t("seller.shop.myShop.shopInformation.bnShopName") : t("seller.shop.myShop.shopInformation.shopName")}
              </label>
              <p class="text-gray-900 dark:text-gray-100 font-semibold text-base pl-6 leading-tight">
                {props.name}
              </p>
            </div>
          )}

          {/* Description */}
          {props.description && (
            <div class="group">
              <label class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {props.isBengali ? t("seller.shop.myShop.shopInformation.bnDescription") : t("seller.shop.myShop.shopInformation.description")}
              </label>
              <p class="text-gray-700 dark:text-gray-300 pl-6 leading-relaxed text-sm">
                {props.description}
              </p>
            </div>
          )}

          {/* Business Hours */}
          {props.businessHours && (
            <div class="group">
              <label class="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {props.isBengali ? t("seller.shop.myShop.shopInformation.bnBusinessHours") : t("seller.shop.myShop.shopInformation.businessHours")}
              </label>
              <p class="text-gray-700 dark:text-gray-300 pl-6 font-medium text-sm">
                {props.businessHours}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
          <div class="w-14 h-14 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg class="w-7 h-7 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400 font-medium text-sm text-center">
            {props.emptyMessage}
          </p>
          <p class="text-gray-400 dark:text-gray-500 text-xs mt-1 text-center">
            {props.emptyHint}
          </p>
        </div>
      )}
    </div>
  );
}

export default function BilingualInfoCard(props: BilingualInfoCardProps) {
  const { t } = useI18n();
  const hasEnglish = props.enData.name || props.enData.description;
  const hasBengali = props.bnData.name || props.bnData.description;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Card Header */}
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center shadow-md shadow-terracotta-500/20">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
              {t("seller.shop.myShop.shopInformation.title")}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {t("seller.shop.myShop.shopInformation.subtitle")}
            </p>
          </div>
        </div>
        <button 
          onClick={props.onEdit}
          class="p-2 text-gray-400 hover:text-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 rounded-lg transition-all" 
          title={t("common.edit")}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* Language Sections */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* English Section */}
        <LanguageSection
          title={t("seller.shop.myShop.shopInformation.english")}
          badge={t("seller.shop.myShop.shopInformation.primary")}
          badgeColor="gray"
          hasContent={hasEnglish}
          emptyMessage={t("seller.shop.myShop.shopInformation.noEnglishContent")}
          emptyHint={t("seller.shop.myShop.shopInformation.noEnglishContentHint")}
          name={props.enData.name}
          description={props.enData.description}
          businessHours={props.enData.businessHours}
        />

        {/* Bengali Section */}
        <LanguageSection
          title={t("seller.shop.myShop.shopInformation.bengali")}
          badge={t("seller.shop.myShop.shopInformation.required")}
          badgeColor="terracotta"
          hasContent={hasBengali}
          emptyMessage={t("seller.shop.myShop.shopInformation.noBengaliContent")}
          emptyHint={t("seller.shop.myShop.shopInformation.noBengaliContentHint")}
          name={props.bnData.name}
          description={props.bnData.description}
          businessHours={props.bnData.businessHours}
          isBengali
        />
      </div>
    </div>
  );
}
