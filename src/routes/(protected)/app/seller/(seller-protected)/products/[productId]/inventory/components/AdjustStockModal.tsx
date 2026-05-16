import { createSignal, createMemo, Show } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import type { VariantInventoryDetail } from "~/lib/api/types/seller.types";

interface AdjustStockModalProps {
  t: (key: string, ...args: any[]) => string;
  isOpen: boolean;
  onClose: () => void;
  variant: VariantInventoryDetail | null;
  onSubmit: (data: { quantityChange: number; reference: string; note: string }) => Promise<{ success: boolean; error?: { message: string } } | undefined>;
  isSubmitting: boolean;
}

export default function AdjustStockModal(props: AdjustStockModalProps) {
  const [quantityChange, setQuantityChange] = createSignal("");
  const [reference, setReference] = createSignal("");
  const [note, setNote] = createSignal("");
  const [error, setError] = createSignal("");

  const parsedChange = createMemo(() => {
    const val = parseInt(quantityChange(), 10);
    return isNaN(val) ? 0 : val;
  });

  const isPositive = createMemo(() => parsedChange() > 0);
  const isNegative = createMemo(() => parsedChange() < 0);
  const isZero = createMemo(() => parsedChange() === 0);

  const isFormValid = createMemo(() => !isZero());

  const resetForm = () => {
    setQuantityChange("");
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
        quantityChange: parsedChange(),
        reference: reference().trim(),
        note: note().trim(),
      });

      if (result && !result.success) {
        setError(result.error?.message || props.t("seller.products.inventoryDetail.adjustModal.failedMessage"));
      }
    } catch (err: any) {
      setError(err?.message || props.t("seller.products.inventoryDetail.adjustModal.failedMessage"));
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose} title={props.t("seller.products.inventoryDetail.adjustModal.title")} size="md">
      <div class="space-y-4">
        <div class="p-3 bg-gray-50 dark:bg-forest-900/30 rounded-lg border border-gray-200 dark:border-forest-700">
          <p class="text-sm font-medium text-forest-800 dark:text-cream-50">{props.variant?.variantName || props.t("seller.products.inventoryDetail.unnamedVariant")}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            SKU: {props.variant?.sku || "\u2014"} \u00b7 Current stock: {props.variant?.quantity ?? 0}
          </p>
        </div>

        <div class="p-3 bg-cream-50 dark:bg-cream-900/20 rounded-lg border border-cream-200 dark:border-cream-800">
          <p class="text-xs text-cream-700 dark:text-cream-400">
            {props.t("seller.products.inventoryDetail.adjustModal.hint")}
          </p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <Input
            label={props.t("seller.products.inventoryDetail.adjustModal.quantityChange")}
            type="number"
            placeholder={props.t("seller.products.inventoryDetail.adjustModal.quantityChangePlaceholder")}
            value={quantityChange()}
            onInput={(e) => setQuantityChange(e.currentTarget.value)}
            required
            error={isZero() && quantityChange() ? props.t("seller.products.inventoryDetail.adjustModal.nonZeroValue") : undefined}
          />

          <Show when={quantityChange()}>
            <div class={`p-2 rounded-lg text-sm font-medium ${
              isPositive()
                ? "bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400"
                : isNegative()
                  ? "bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-700 dark:text-terracotta-400"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            }`}>
              {isPositive() ? "+" : ""}{parsedChange()} units \u2192 New total: {(props.variant?.quantity ?? 0) + parsedChange()}
            </div>
          </Show>

          <Input
            label={props.t("seller.products.inventoryDetail.adjustModal.referenceOptional")}
            type="text"
            placeholder={props.t("seller.products.inventoryDetail.adjustModal.referencePlaceholder")}
            value={reference()}
            onInput={(e) => setReference(e.currentTarget.value)}
          />

          <Textarea
            label={props.t("seller.products.inventoryDetail.adjustModal.reason")}
            placeholder={props.t("seller.products.inventoryDetail.adjustModal.reasonPlaceholder")}
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
              variant={isNegative() ? "destructive" : "primary"}
              loading={props.isSubmitting}
              disabled={!isFormValid() || props.isSubmitting}
            >
              {isNegative() ? props.t("seller.products.inventoryDetail.adjustModal.removeButton") : props.t("seller.products.inventoryDetail.adjustModal.addButton")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
