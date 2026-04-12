import { JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal(props: ModalProps) {
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div
            class={`relative w-full ${sizeClasses[props.size || "md"]} mx-4 bg-white dark:bg-forest-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200`}
          >
            {/* Header */}
            <Show when={props.title}>
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-forest-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {props.title}
                </h2>
                <button
                  onClick={props.onClose}
                  class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </Show>

            {/* Close button (if no title) */}
            <Show when={!props.title}>
              <button
                onClick={props.onClose}
                class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </Show>

            {/* Content */}
            <div class="p-6">{props.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
