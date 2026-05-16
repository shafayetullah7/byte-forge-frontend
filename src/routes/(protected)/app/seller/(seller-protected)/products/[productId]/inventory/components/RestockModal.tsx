import { createSignal, createMemo, Show } from "solid-js";
import { Modal } from "~/components/ui/Modal";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import type { VariantInventoryDetail } from "~/lib/api/types/seller.types";

interface RestockModalProps {
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

      // If the action failed synchronously (not via server action), show error
      if (result && !result.success) {
        setError(result.error?.message || "Failed to restock. Please try again.");
      }
      // On success, parent will close modal via shouldCloseModal
    } catch (err: any) {
      setError(err?.message || "Failed to restock. Please try again.");
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose} title="Restock Variant" size="md">
      <Show when={props.variant}>
        {(v) => (
          <div class="space-y-4">
            <div class="p-3 bg-forest-50 dark:bg-forest-900/30 rounded-lg border border-forest-200 dark:border-forest-700">
              <p class="text-sm font-medium text-forest-800 dark:text-cream-50">{v().variantName || "Unnamed Variant"}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                SKU: {v().sku || "—"} · Current stock: {v().quantity}
              </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-4">
              <Input
                label="Quantity to Add"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity()}
                onInput={(e) => setQuantity(e.currentTarget.value)}
                required
                error={parsedQuantity() < 0 ? "Quantity must be positive" : undefined}
              />

              <Input
                label="Reference (optional)"
                type="text"
                placeholder="e.g., PO-2026-001, Batch #123"
                value={reference()}
                onInput={(e) => setReference(e.currentTarget.value)}
              />

              <Textarea
                label="Note (optional)"
                placeholder="e.g., New batch received from supplier"
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={props.isSubmitting}
                  disabled={!isFormValid() || props.isSubmitting}
                >
                  Restock (+{parsedQuantity()} units)
                </Button>
              </div>
            </form>
          </div>
        )}
      </Show>
    </Modal>
  );
}
