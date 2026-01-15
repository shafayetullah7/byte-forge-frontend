import { createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { For, Show } from "solid-js";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Global Store for Toasts
const [toasts, setToasts] = createSignal<Toast[]>([]);

export const toaster = {
  add: (message: string, type: ToastType = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        toaster.dismiss(id);
      }, duration);
    }
  },
  success: (message: string, duration = 3000) =>
    toaster.add(message, "success", duration),
  error: (message: string, duration = 4000) =>
    toaster.add(message, "error", duration),
  dismiss: (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  },
};

export function Toaster() {
  return (
    <Portal>
      <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <For each={toasts()}>
          {(toast) => (
            <div
              class="pointer-events-auto min-w-[300px] max-w-sm rounded-lg shadow-lg border p-4 transition-all duration-300 animate-in slide-in-from-right-full fade-in"
              classList={{
                "bg-white border-forest-200 text-forest-800 dark:bg-forest-900 dark:border-forest-700 dark:text-forest-100":
                  toast.type === "success",
                "bg-white border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-100":
                  toast.type === "error",
                "bg-white border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-100":
                  toast.type === "info",
              }}
            >
              <div class="flex items-start gap-3">
                <Show when={toast.type === "success"}>
                  <svg
                    class="w-5 h-5 text-forest-600 dark:text-forest-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </Show>
                <Show when={toast.type === "error"}>
                  <svg
                    class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Show>

                <p class="text-sm font-medium flex-1">{toast.message}</p>

                <button
                  onClick={() => toaster.dismiss(toast.id)}
                  class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
    </Portal>
  );
}
