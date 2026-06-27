import { Show, createSignal } from "solid-js";
import { ArchiveIcon, SunIcon, TrashIcon } from "~/components/icons";
import Input from "~/components/ui/Input";
import { ConfirmDialog } from "~/components/ui/ConfirmDialog";
import { useI18n } from "~/i18n";
import { PRODUCT_STATUS } from "~/lib/api/types/seller.types";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import type { PlantLifecycleAction } from "../../hooks/usePlantLifecycleActions";
import { usePlantLifecycleActions } from "../../hooks/usePlantLifecycleActions";

export function PlantQuickActionsPanel(props: {
  plant: PlantDetail;
  enName: string;
}) {
  const { t } = useI18n();
  const lifecycle = usePlantLifecycleActions();
  const [pendingAction, setPendingAction] = createSignal<PlantLifecycleAction | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = createSignal("");

  const closeDialog = () => {
    setPendingAction(null);
    setDeleteConfirmText("");
  };

  const handleConfirm = async () => {
    const action = pendingAction();
    if (!action) return;

    let success = false;
    if (action === "publish") {
      success = await lifecycle.publish(props.plant.id);
    } else if (action === "archive") {
      success = await lifecycle.archive(props.plant.id);
    } else if (action === "delete") {
      success = await lifecycle.remove(props.plant.id);
    }

    if (success) {
      closeDialog();
    }
  };

  const dialogCopy = () => {
    const action = pendingAction();
    if (action === "publish") {
      return {
        title: t("seller.products.plantOverview.confirmPublishTitle"),
        description: t("seller.products.plantOverview.confirmPublishDescription"),
        confirmLabel: t("seller.products.plantOverview.publishPlant"),
        variant: "default" as const,
      };
    }
    if (action === "archive") {
      return {
        title: t("seller.products.plantOverview.confirmArchiveTitle"),
        description: t("seller.products.plantOverview.confirmArchiveDescription"),
        confirmLabel: t("seller.products.plantOverview.archivePlant"),
        variant: "danger" as const,
      };
    }
    if (action === "delete") {
      return {
        title: t("seller.products.plantOverview.confirmDeleteTitle"),
        description: t("seller.products.plantOverview.confirmDeleteDescription", {
          name: props.enName,
        }),
        confirmLabel: t("seller.products.plantOverview.deletePlant"),
        variant: "danger" as const,
      };
    }
    return null;
  };

  const copy = () => dialogCopy();

  return (
    <>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
        <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700">
          <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
            {t("seller.products.plantOverview.quickActions")}
          </h3>
        </div>
        <div class="p-4 space-y-1">
          <Show when={props.plant.status !== PRODUCT_STATUS.ACTIVE}>
            <button
              type="button"
              disabled={lifecycle.loading()}
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              onClick={() => setPendingAction("publish")}
            >
              <SunIcon class="w-4 h-4" />
              {t("seller.products.plantOverview.publishPlant")}
            </button>
          </Show>
          <Show when={props.plant.status === PRODUCT_STATUS.ACTIVE}>
            <button
              type="button"
              disabled={lifecycle.loading()}
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
              onClick={() => setPendingAction("archive")}
            >
              <ArchiveIcon class="w-4 h-4" />
              {t("seller.products.plantOverview.archivePlant")}
            </button>
          </Show>
          <button
            type="button"
            disabled={lifecycle.loading()}
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-terracotta-600 dark:text-terracotta-400 disabled:opacity-50"
            onClick={() => setPendingAction("delete")}
          >
            <TrashIcon class="w-4 h-4" />
            {t("seller.products.plantOverview.deletePlant")}
          </button>
        </div>
      </div>

      <Show when={copy()}>
        {(dialog) => (
          <ConfirmDialog
            isOpen={pendingAction() !== null}
            onClose={closeDialog}
            onConfirm={handleConfirm}
            title={dialog().title}
            description={dialog().description}
            confirmLabel={dialog().confirmLabel}
            cancelLabel={t("common.cancel")}
            variant={dialog().variant}
            loading={lifecycle.loading()}
            closeOnConfirm={false}
            confirmDisabled={
              pendingAction() === "delete" && deleteConfirmText() !== props.enName
            }
          >
            <Show when={pendingAction() === "delete"}>
              <div class="w-full mb-4 text-left">
                <Input
                  label={t("seller.products.plantOverview.deleteConfirmLabel")}
                  value={deleteConfirmText()}
                  onInput={(e) => setDeleteConfirmText(e.currentTarget.value)}
                  placeholder={props.enName}
                />
              </div>
            </Show>
          </ConfirmDialog>
        )}
      </Show>
    </>
  );
}
