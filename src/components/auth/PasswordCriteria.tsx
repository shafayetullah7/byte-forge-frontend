import { createMemo } from "solid-js";

interface PasswordCriteriaProps {
  password: () => string | undefined;
}

export function PasswordCriteria(props: PasswordCriteriaProps) {
  const criteria = createMemo(() => {
    const pass = props.password() || "";
    return [
      {
        id: "length",
        label: "At least 8 characters",
        isValid: pass.length >= 8,
      },
      {
        id: "uppercase",
        label: "One uppercase letter",
        isValid: /[A-Z]/.test(pass),
      },
      {
        id: "lowercase",
        label: "One lowercase letter",
        isValid: /[a-z]/.test(pass),
      },
      {
        id: "number",
        label: "One number",
        isValid: /[0-9]/.test(pass),
      },
      {
        id: "special",
        label: "One special character",
        isValid: /[^A-Za-z0-9]/.test(pass),
      },
    ];
  });

  return (
    <div class="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2 border border-gray-100 dark:border-gray-700">
      <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Password Requirements
      </p>
      <div class="grid grid-cols-1 gap-1.5">
        {criteria().map((item) => (
          <div class="flex items-center gap-2.5">
            <div
              class={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${item.isValid
                  ? "bg-sage-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400"
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
                <div class="w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </div>
            <span
              class={`text-xs transition-colors duration-200 ${item.isValid
                  ? "text-gray-700 dark:text-gray-200 font-medium"
                  : "text-gray-500 dark:text-gray-400"
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
