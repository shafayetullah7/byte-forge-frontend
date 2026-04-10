import { createMemo } from "solid-js";
import { useI18n } from "~/i18n";

interface PasswordCriteriaProps {
  password: () => string | undefined;
}

export function PasswordCriteria(props: PasswordCriteriaProps) {
  const { t } = useI18n();

  const criteria = createMemo(() => {
    const pass = props.password() || "";
    return [
      {
        id: "length",
        label: t("auth.passwordCriteria.length"),
        isValid: pass.length >= 8,
      },
      {
        id: "uppercase",
        label: t("auth.passwordCriteria.uppercase"),
        isValid: /[A-Z]/.test(pass),
      },
      {
        id: "lowercase",
        label: t("auth.passwordCriteria.lowercase"),
        isValid: /[a-z]/.test(pass),
      },
      {
        id: "number",
        label: t("auth.passwordCriteria.number"),
        isValid: /[0-9]/.test(pass),
      },
      {
        id: "special",
        label: t("auth.passwordCriteria.special"),
        isValid: /[^A-Za-z0-9]/.test(pass),
      },
    ];
  });

  return (
    <div class="mt-4 bg-gray-50 dark:bg-forest-900/50 rounded-lg p-3 space-y-2 border border-gray-100 dark:border-forest-800 transition-colors">
      <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 px-0.5">
        {t("auth.passwordCriteria.title")}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {criteria().map((item) => (
          <div class="flex items-center gap-2 group">
            <div
              class={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${item.isValid
                ? "bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400 scale-110"
                : "bg-gray-100 dark:bg-forest-800 text-gray-400"
                }`}
            >
              {item.isValid ? (
                <svg
                  class="w-2.5 h-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <div class="w-1 h-1 rounded-full bg-current opacity-40" />
              )}
            </div>
            <span
              class={`text-[11px] transition-colors duration-200 ${item.isValid
                ? "text-forest-700 dark:text-cream-100 font-medium"
                : "text-gray-500 dark:text-gray-500"
                }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
