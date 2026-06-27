import { Show, type JSX } from "solid-js";
import type { PlantSectionId } from "~/lib/plants/plant-section-edit";
import type { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { EditableSectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/EditableSectionCard";
import { PlantSectionFieldEditor } from "../../components/PlantSectionFieldEditor";

type SectionEdit = ReturnType<typeof usePlantSectionEdit>;

export function PlantEditableSection(props: {
  sectionId: PlantSectionId;
  title: string;
  icon?: JSX.Element;
  plantId: string;
  sectionEdit: SectionEdit;
  view: JSX.Element;
  knownPlantTags?: () => { id: string; name: string }[];
  originalSlug?: string;
}) {
  const { sectionEdit } = props;

  return (
    <EditableSectionCard
      title={props.title}
      icon={props.icon}
      isEditing={sectionEdit.isEditing(props.sectionId)}
      isSaving={sectionEdit.isSaving()}
      onEdit={() => sectionEdit.startEdit(props.sectionId)}
      onCancel={sectionEdit.cancelEdit}
      onSave={sectionEdit.save}
    >
      <Show
        when={sectionEdit.isEditing(props.sectionId)}
        fallback={props.view}
      >
        <PlantSectionFieldEditor
          sectionId={props.sectionId}
          form={sectionEdit.draftForm}
          setForm={sectionEdit.setDraftForm}
          errors={sectionEdit.errors()}
          plantId={props.plantId}
          originalSlug={props.originalSlug}
          knownPlantTags={props.knownPlantTags}
        />
      </Show>
    </EditableSectionCard>
  );
}
