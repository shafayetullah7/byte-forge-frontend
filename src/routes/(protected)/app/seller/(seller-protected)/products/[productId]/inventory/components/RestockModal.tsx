import { createSignal, createMemo, Show } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import type { VariantInventoryDetail } from "~/lib/api/types/seller.types";

interface RestockModalProps {
  t: (key: string, ...args: any[]) => string;
  isOpen: boolean;
  onClose: () => void;
  variant: VariantInventoryDetail | null;
  onSubmit: (data: { quantity: number; reference: string; note: string }) => Promise<{ success: boolean; error?: { message: string } } | undefined>;
  isSubmitting: boolean;
}

export default function RestockModal(props: RestockModalProps) {
  const [quantity, setQuantity] = createSignal("");
  const [reference, setReference] = createSignal("");
  const [note, setNote] = createSignal("");
  const [error, setError] = createSignal("");

  const parsedQuantity = createMemo(() => {
    const val = parseInt(quantity(), 10);
    return isNaN(val) ? 0 : val;
  });

  const isFormValid = createMemo(() => parsedQuantity() > 0);

  const resetForm = () => {
    setQuantity("");
    setReference("");
    setNote("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    props.onClose();
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!isFormValid() || props.isSubmitting) return;

    setError("");

    try {
      const result = await props.onSubmit({
        quantity: parsedQuantity(),
        reference: reference().trim(),
        note: note().trim(),
      });

      if (result && !result.success) {
        setError(result.error?.message || props.t("seller.products.inventoryDetail.restockModal.failedMessage"));
      }
    } catch (err: any) {
      setError(err?.message || props.t("seller.products.inventoryDetail.restockModal.failedMessage"));
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose} title={props.t("seller.products.inventoryDetail.restockModal.title")} size="md">
      <Show when={props.variant}>
        {(v) => (
          <div class="space-y-4">
            <div class="p-3 bg-forest-50 dark:bg-forest-900/30 rounded-lg border border-forest-200 dark:border-forest-700">
              <p class="text-sm font-medium text-forest-800 dark:text-cream-50">{v().variantName || props.t("seller.products.inventoryDetail.unnamedVariant")}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                SKU: {v().sku || "\u2014"} \u00b7 Current stock: {v().quantity}
              </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-4">
              <Input
                label={props.t("seller.products.inventoryDetail.restockModal.quantityToAdd")}
                type="number"
                min="1"
                placeholder={props.t("seller.products.inventoryDetail.restockModal.enterQuantity")}
                value={quantity()}
                onInput={(e) => setQuantity(e.currentTarget.value)}
                required
                error={parsedQuantity() < 0 ? props.t("seller.products.inventoryDetail.restockModal.quantityMustBePositive") : undefined}
              />

              <Input
                label={props.t("seller.products.inventoryDetail.restockModal.referenceOptional")}
                type="text"
                placeholder={props.t("seller.products.inventoryDetail.restockModal.referencePlaceholder")}
                value={reference()}
                onInput={(e) => setReference(e.currentTarget.value)}
              />

              <Textarea
                label={props.t("seller.products.inventoryDetail.restockModal.noteOptional")}
                placeholder={props.t("seller.products.inventoryDetail.restockModal.notePlaceholder")}
                value={note()}
                onInput={(e) => setNote(e.currentTarget.value)}
                rows={3}
              />

              <Show when={error()}>
                {(err) => (
                  <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-700 dark:text-red-400">{err()}</p>
                  </div>
                )}
              </Show>

              <div class="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={props.isSubmitting}
                >
                  {props.t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={props.isSubmitting}
                  disabled={!isFormValid() || props.isSubmitting}
                >
                  {props.t("seller.products.inventoryDetail.restockModal.restockButton", parsedQuantity())}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Show>
    </Modal>
  );
}
