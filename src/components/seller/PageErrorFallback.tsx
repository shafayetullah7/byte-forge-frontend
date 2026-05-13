import { A } from "@solidjs/router";

export function PageErrorFallback(props: { error: Error; title?: string; backHref?: string; backLabel?: string }) {
  return (
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md w-full">
        <div class="flex items-center gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600 dark:text-red-400 flex-shrink-0">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 class="text-lg font-semibold text-red-900 dark:text-red-300">{props.title || "Failed to Load"}</h2>
        </div>
        <p class="text-sm text-red-700 dark:text-red-400 mb-4">{props.error?.toString() || "An unexpected error occurred."}</p>
        <div class="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            class="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            Retry
          </button>
          {props.backHref && (
            <A
              href={props.backHref}
              class="flex-1 px-4 py-2 bg-white dark:bg-forest-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-forest-700 transition-colors text-center"
            >
              {props.backLabel || "Go Back"}
            </A>
          )}
        </div>
      </div>
    </div>
  );
}
