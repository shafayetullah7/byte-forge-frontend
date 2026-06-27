import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import { useNavigate } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { toaster } from "~/components/ui/Toast";
import { PRODUCT_STATUS } from "~/lib/api/types/seller.types";
import {
  deletePlantAction,
  updatePlantStatusAction,
} from "~/lib/plants/plant-lifecycle.actions";

export type PlantLifecycleAction = "publish" | "archive" | "delete";

export function usePlantLifecycleActions() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const updateStatusTrigger = useAction(updatePlantStatusAction);
  const deletePlantTrigger = useAction(deletePlantAction);
  const [loading, setLoading] = createSignal(false);

  const publish = async (plantId: string) => {
    setLoading(true);
    try {
      const result = await updateStatusTrigger({
        plantId,
        status: PRODUCT_STATUS.ACTIVE,
      });
      if (result?.success === true) {
        toaster.success(t("seller.products.plantOverview.publishSuccess"));
        return true;
      }
      toaster.error(result?.error?.message ?? t("seller.products.plantOverview.publishFailed"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const archive = async (plantId: string) => {
    setLoading(true);
    try {
      const result = await updateStatusTrigger({
        plantId,
        status: PRODUCT_STATUS.ARCHIVED,
      });
      if (result?.success === true) {
        toaster.success(t("seller.products.plantOverview.archiveSuccess"));
        return true;
      }
      toaster.error(result?.error?.message ?? t("seller.products.plantOverview.archiveFailed"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (plantId: string) => {
    setLoading(true);
    try {
      const result = await deletePlantTrigger({ plantId });
      if (result?.success === true) {
        toaster.success(t("seller.products.plantOverview.deleteSuccess"));
        navigate("/app/seller/products/plants");
        return true;
      }
      toaster.error(result?.error?.message ?? t("seller.products.plantOverview.deleteFailed"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    publish,
    archive,
    remove,
  };
}
