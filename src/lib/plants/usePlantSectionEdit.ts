import { createSignal, type Accessor } from "solid-js";
import { createStore } from "solid-js/store";
import { useAction, useSubmission } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { toaster } from "~/components/ui/Toast";
import { fromPlantDetailToForm, createEmptyForm } from "~/lib/types/plant-form";
import type { PlantFormState } from "~/lib/types/plant-form";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import {
  type PlantSectionId,
  type FormErrors,
  validateSection,
  cloneForm,
} from "./plant-section-edit";
import { savePlantSectionAction, invalidateAfterSectionSave } from "./plant-section-actions";

export function usePlantSectionEdit(
  plantId: string,
  plant: Accessor<PlantDetail | undefined>,
) {
  const { t } = useI18n();
  const [editingSectionId, setEditingSectionId] = createSignal<PlantSectionId | null>(null);
  const [hasDraft, setHasDraft] = createSignal(false);
  const [draftForm, setDraftForm] = createStore<PlantFormState>(createEmptyForm());
  const [errors, setErrors] = createSignal<FormErrors>({});

  const saveTrigger = useAction(savePlantSectionAction);
  const submission = useSubmission(savePlantSectionAction);

  const startEdit = (sectionId: PlantSectionId) => {
    const data = plant();
    if (!data) return;
    if (editingSectionId() && editingSectionId() !== sectionId) {
      cancelEdit();
    }
    setDraftForm(cloneForm(fromPlantDetailToForm(data)));
    setHasDraft(true);
    setEditingSectionId(sectionId);
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingSectionId(null);
    setHasDraft(false);
    setErrors({});
  };

  const isEditing = (sectionId: PlantSectionId) => editingSectionId() === sectionId;

  const save = async () => {
    const sectionId = editingSectionId();
    if (!sectionId || !hasDraft()) return;

    const validationErrors = validateSection(sectionId, draftForm, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toaster.error(t("seller.products.plantSection.validationFailed"));
      return;
    }

    const result = await saveTrigger({ plantId, sectionId, form: draftForm });
    if (result?.success) {
      invalidateAfterSectionSave(plantId, sectionId);
      cancelEdit();
      toaster.success(t("seller.products.plantSection.saved"));
    } else if (result?.success === false && result.error) {
      const apiErrors = result.error.validationErrors;
      if (apiErrors?.length) {
        const mapped: FormErrors = {};
        for (const e of apiErrors) mapped[e.field] = e.message;
        setErrors(mapped);
      }
      toaster.error(result.error.message || t("seller.products.plantSection.saveFailed"));
    }
  };

  const saveForm = async (sectionId: PlantSectionId, form: PlantFormState) => {
    const validationErrors = validateSection(sectionId, form, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toaster.error(t("seller.products.plantSection.validationFailed"));
      return false;
    }

    const result = await saveTrigger({ plantId, sectionId, form });
    if (result?.success) {
      invalidateAfterSectionSave(plantId, sectionId);
      toaster.success(t("seller.products.plantSection.saved"));
      return true;
    }

    if (result?.success === false && result.error) {
      const apiErrors = result.error.validationErrors;
      if (apiErrors?.length) {
        const mapped: FormErrors = {};
        for (const e of apiErrors) mapped[e.field] = e.message;
        setErrors(mapped);
      }
      toaster.error(result.error.message || t("seller.products.plantSection.saveFailed"));
    }
    return false;
  };

  return {
    editingSectionId,
    draftForm,
    setDraftForm,
    hasDraft,
    errors,
    setErrors,
    startEdit,
    cancelEdit,
    save,
    saveForm,
    isEditing,
    isSaving: () => submission.pending,
  };
}
