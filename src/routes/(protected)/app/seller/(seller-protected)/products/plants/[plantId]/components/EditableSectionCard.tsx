import { Show } from "solid-js";
import { PencilIcon } from "~/components/icons";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import { SectionCard } from "./SectionCard";

export function EditableSectionCard(props: {
  title: string;
  icon?: any;
  headerAction?: any;
  isEditing: boolean;
  isSaving?: boolean;
  canEdit?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: any;
}) {
  const { t } = useI18n();
  const canEdit = () => props.canEdit !== false;

  const editActions = () => (
    <Show
      when={props.isEditing}
      fallback={
        <Show when={canEdit()}>
          <button
            type="button"
            onClick={props.onEdit}
            class="inline-flex items-center gap-1.5 text-sm text-forest-600 dark:text-forest-400 hover:underline font-medium"
          >
            <PencilIcon class="w-3.5 h-3.5" />
            {t("seller.products.plantSection.edit")}
          </button>
        </Show>
      }
    >
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={props.onCancel}
          disabled={props.isSaving}
        >
          {t("seller.products.plantSection.cancel")}
        </Button>
        <Button
          variant="accent"
          size="sm"
          onClick={props.onSave}
          disabled={props.isSaving}
        >
          {props.isSaving ? t("seller.products.plantSection.saving") : t("seller.products.plantSection.save")}
        </Button>
      </div>
    </Show>
  );

  return (
    <SectionCard
      title={props.title}
      icon={props.icon}
      action={
        <div class="flex items-center gap-3">
          {props.headerAction}
          {editActions()}
        </div>
      }
    >
      {props.children}
    </SectionCard>
  );
}
