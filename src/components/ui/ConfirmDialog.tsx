import { JSX, Show } from "solid-js";
import { Modal } from "./Modal";
import { ExclamationCircleIcon, SpinnerIcon } from "~/components/icons";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  confirmDisabled?: boolean;
  loading?: boolean;
  closeOnConfirm?: boolean;
  children?: JSX.Element;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const isDanger = props.variant === "danger";
  const closeOnConfirm = () => props.closeOnConfirm !== false;

  const handleConfirm = () => {
    props.onConfirm();
    if (closeOnConfirm()) {
      props.onClose();
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      size="sm"
    >
      <div class="flex flex-col items-center text-center">
        <div class={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          isDanger ? "bg-red-100 dark:bg-red-900/30" : "bg-gray-100 dark:bg-forest-700"
        }`}>
          <ExclamationCircleIcon class={`w-6 h-6 ${
            isDanger ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
          }`} />
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {props.description}
        </p>

        {props.children}

        <div class="flex w-full gap-3">
          <button
            type="button"
            onClick={props.onClose}
            disabled={props.loading}
            class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-700 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {props.cancelLabel || "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={props.confirmDisabled || props.loading}
            class={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-forest-600 hover:bg-forest-700"
            }`}
          >
            <Show when={props.loading}>
              <SpinnerIcon class="w-4 h-4 animate-spin" />
            </Show>
            {props.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
