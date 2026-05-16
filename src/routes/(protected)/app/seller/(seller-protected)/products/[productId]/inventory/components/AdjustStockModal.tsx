import { createSignal, createMemo, Show } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import type { VariantInventoryDetail } from "~/lib/api/types/seller.types";

interface AdjustStockModalProps {
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
        setError(result.error?.message || "Failed to adjust stock. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to adjust stock. Please try again.");
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose} title="Adjust Stock" size="md">
      <div class="space-y-4">
        <div class="p-3 bg-gray-50 dark:bg-forest-900/30 rounded-lg border border-gray-200 dark:border-forest-700">
          <p class="text-sm font-medium text-forest-800 dark:text-cream-50">{props.variant?.variantName || "Unnamed Variant"}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            SKU: {props.variant?.sku || "—"} · Current stock: {props.variant?.quantity ?? 0}
          </p>
        </div>

        <div class="p-3 bg-cream-50 dark:bg-cream-900/20 rounded-lg border border-cream-200 dark:border-cream-800">
          <p class="text-xs text-cream-700 dark:text-cream-400">
            Use <strong>positive numbers</strong> to add stock, <strong>negative numbers</strong> to remove stock.
          </p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <Input
            label="Quantity Change"
            type="number"
            placeholder="e.g., 10 or -5"
            value={quantityChange()}
            onInput={(e) => setQuantityChange(e.currentTarget.value)}
            required
            error={isZero() && quantityChange() ? "Enter a non-zero value" : undefined}
          />

          <Show when={quantityChange()}>
            <div class={`p-2 rounded-lg text-sm font-medium ${
              isPositive()
                ? "bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400"
                : isNegative()
                  ? "bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-700 dark:text-terracotta-400"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            }`}>
              {isPositive() ? "+" : ""}{parsedChange()} units → New total: {(props.variant?.quantity ?? 0) + parsedChange()}
            </div>
          </Show>

          <Input
            label="Reference (optional)"
            type="text"
            placeholder="e.g., Inventory audit, Stock count"
            value={reference()}
            onInput={(e) => setReference(e.currentTarget.value)}
          />

          <Textarea
            label="Reason"
            placeholder="Explain why stock is being adjusted"
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isNegative() ? "destructive" : "primary"}
              loading={props.isSubmitting}
              disabled={!isFormValid() || props.isSubmitting}
            >
              {isNegative() ? "Remove" : "Add"} Stock
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
