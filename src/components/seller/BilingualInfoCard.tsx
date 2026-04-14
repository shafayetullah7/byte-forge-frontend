interface TranslationData {
  name: string | null | undefined;
  description: string | null | undefined;
  businessHours: string | null | undefined;
}

interface BilingualInfoCardProps {
  enData: TranslationData;
  bnData: TranslationData;
}

export default function BilingualInfoCard(props: BilingualInfoCardProps) {
  const hasEnglish = props.enData.name || props.enData.description;
  const hasBengali = props.bnData.name || props.bnData.description;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Card Header */}
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
            Shop Information
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Bilingual content for your customers
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English */}
        <div class="space-y-5">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🇬🇧</span>
            <h4 class="font-bold text-gray-900 dark:text-gray-100">
              English
            </h4>
            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              Primary
            </span>
          </div>

          {hasEnglish ? (
            <div class="space-y-4">
              {/* Name */}
              <div class="group">
                <div class="flex items-center gap-2 mb-1.5">
                  <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Shop Name
                  </label>
                </div>
                <p class="text-gray-900 dark:text-gray-100 font-semibold text-lg pl-6">
                  {props.enData.name || "—"}
                </p>
              </div>

              {/* Description */}
              <div class="group">
                <div class="flex items-center gap-2 mb-1.5">
                  <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Description
                  </label>
                </div>
                <p class="text-gray-700 dark:text-gray-300 pl-6 leading-relaxed">
                  {props.enData.description || "—"}
                </p>
              </div>

              {/* Business Hours */}
              <div class="group">
                <div class="flex items-center gap-2 mb-1.5">
                  <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Business Hours
                  </label>
                </div>
                <p class="text-gray-700 dark:text-gray-300 pl-6 font-medium">
                  {props.enData.businessHours || "—"}
                </p>
              </div>
            </div>
          ) : (
            <div class="text-center py-10 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500 dark:text-gray-400 font-medium">No English content yet</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Add your shop details in English</p>
            </div>
          )}
        </div>

        {/* Bengali */}
        <div class="space-y-5">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🇧🇩</span>
            <h4 class="font-bold text-gray-900 dark:text-gray-100">
              Bengali (বাংলা)
            </h4>
            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-400">
              Required
            </span>
          </div>

          {hasBengali ? (
            <div class="space-y-4">
              {/* Name */}
              <div class="group">
                <div class="flex items-center gap-2 mb-1.5">
                  <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    দোকানের নাম
                  </label>
                </div>
                <p class="text-gray-900 dark:text-gray-100 font-semibold text-lg pl-6" dir="auto">
                  {props.bnData.name || "—"}
                </p>
              </div>

              {/* Description */}
              <div class="group">
                <div class="flex items-center gap-2 mb-1.5">
                  <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    বিবরণ
                  </label>
                </div>
                <p class="text-gray-700 dark:text-gray-300 pl-6 leading-relaxed" dir="auto">
                  {props.bnData.description || "—"}
                </p>
              </div>

              {/* Business Hours */}
              <div class="group">
                <div class="flex items-center gap-2 mb-1.5">
                  <svg class="w-4 h-4 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    ব্যবসার সময়
                  </label>
                </div>
                <p class="text-gray-700 dark:text-gray-300 pl-6 font-medium" dir="auto">
                  {props.bnData.businessHours || "—"}
                </p>
              </div>
            </div>
          ) : (
            <div class="text-center py-10 px-4 border-2 border-dashed border-terracotta-200 dark:border-terracotta-800 rounded-xl bg-terracotta-50 dark:bg-terracotta-900/20">
              <svg class="w-12 h-12 mx-auto mb-3 text-terracotta-400 dark:text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-terracotta-700 dark:text-terracotta-400 font-medium">কোন বাংলা তথ্য নেই</p>
              <p class="text-terracotta-600 dark:text-terracotta-500 text-sm mt-1">আপনার দোকানের বিবরণ বাংলায় যোগ করুন</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
