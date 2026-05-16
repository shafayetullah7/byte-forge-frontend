import { createSignal, createMemo, Show } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import type { VariantInventoryDetail } from "~/lib/api/types/seller.types";

interface MarkDamagedModalProps {
  t: (key: string, ...args: any[]) => string;
  isOpen: boolean;
  onClose: () => void;
  variant: VariantInventoryDetail | null;
  onSubmit: (data: { quantity: number; note: string }) => Promise<{ success: boolean; error?: { message: string } } | undefined>;
  isSubmitting: boolean;
}

export default function MarkDamagedModal(props: MarkDamagedModalProps) {
  const [quantity, setQuantity] = createSignal("");
  const [note, setNote] = createSignal("");
  const [error, setError] = createSignal("");

  const parsedQuantity = createMemo(() => {
    const val = parseInt(quantity(), 10);
    return isNaN(val) ? 0 : val;
  });

  const currentStock = createMemo(() => props.variant?.quantity ?? 0);
  const availableQuantity = createMemo(() => props.variant?.availableQuantity ?? 0);

  const isFormValid = createMemo(() =>
    parsedQuantity() > 0 && parsedQuantity() <= availableQuantity()
  );

  const resetForm = () => {
    setQuantity("");
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
        note: note().trim(),
      });

      if (result && !result.success) {
        setError(result.error?.message || props.t("seller.products.inventoryDetail.damagedModal.failedMessage"));
      }
    } catch (err: any) {
      setError(err?.message || props.t("seller.products.inventoryDetail.damagedModal.failedMessage"));
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose} title={props.t("seller.products.inventoryDetail.damagedModal.title")} size="md">
      <div class="space-y-4">
        <div class="p-3 bg-terracotta-50 dark:bg-terracotta-900/20 rounded-lg border border-terracotta-200 dark:border-terracotta-800">
          <p class="text-sm font-medium text-terracotta-800 dark:text-terracotta-300">
            {props.variant?.variantName || props.t("seller.products.inventoryDetail.unnamedVariant")}
          </p>
          <p class="text-xs text-terracotta-600 dark:text-terracotta-400 mt-0.5">
            SKU: {props.variant?.sku || "\u2014"} \u00b7 Available: {availableQuantity()} \u00b7 Reserved: {props.variant?.reservedQuantity ?? 0}
          </p>
        </div>

        <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p class="text-xs text-amber-700 dark:text-amber-400">
            {props.t("seller.products.inventoryDetail.damagedModal.warning")}
          </p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <Input
            label={props.t("seller.products.inventoryDetail.damagedModal.damagedQuantity")}
            type="number"
            min="1"
            max={availableQuantity()}
            placeholder={props.t("seller.products.inventoryDetail.damagedModal.maxQuantity", availableQuantity())}
            value={quantity()}
            onInput={(e) => setQuantity(e.currentTarget.value)}
            required
            error={
              parsedQuantity() > availableQuantity()
                ? props.t("seller.products.inventoryDetail.damagedModal.exceedsAvailableStock", availableQuantity())
                : parsedQuantity() < 0
                  ? props.t("seller.products.inventoryDetail.damagedModal.quantityMustBePositive")
                  : undefined
            }
          />

          <Show when={quantity() && isFormValid()}>
            <div class="p-2 rounded-lg bg-terracotta-50 dark:bg-terracotta-900/20 text-sm text-terracotta-700 dark:text-terracotta-400 font-medium">
              {parsedQuantity()} units marked damaged \u2192 Remaining: {currentStock() - parsedQuantity()}
            </div>
          </Show>

          <Textarea
            label={props.t("seller.products.inventoryDetail.damagedModal.reason")}
            placeholder={props.t("seller.products.inventoryDetail.damagedModal.reasonPlaceholder")}
            value={note()}
            onInput={(e) => setNote(e.currentTarget.value)}
            rows={3}
            required
          />

          <Show when={error()}>
            {(err) => (
              <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-700 dark:text-red-400">{err()}</p>
              </div>
            )}
          </Show>

          <div class="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={props.isSubmitting}>
              {props.t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              loading={props.isSubmitting}
              disabled={!isFormValid() || props.isSubmitting}
            >
              {props.t("seller.products.inventoryDetail.damagedModal.markDamagedButton")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
