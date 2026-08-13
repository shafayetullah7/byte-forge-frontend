import { createSignal, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import Card from "~/components/ui/Card";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import { redeemSubscriptionCouponAction } from "~/lib/api/endpoints/seller/subscription.actions";
import { toaster } from "~/components/ui/Toast";
import { translateSubscriptionError } from "./subscription-error-messages";

export interface CouponRedeemFormProps {
  disabled?: boolean;
  onRedeemed?: () => void;
}

export function CouponRedeemForm(props: CouponRedeemFormProps) {
  const { t } = useI18n();
  const redeemAction = useAction(redeemSubscriptionCouponAction);

  const [code, setCode] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (props.disabled) return;

    const trimmed = code().trim().toUpperCase();
    if (!trimmed) {
      setError(t("seller.subscription.coupon.codeRequired"));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await redeemAction({ code: trimmed });
      if (result?.success) {
        setCode("");
        toaster.success(t("seller.subscription.coupon.redeemed"));
        props.onRedeemed?.();
        return;
      }
      setError(translateSubscriptionError(t, result?.error?.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title={t("seller.subscription.coupon.title")} description={t("seller.subscription.coupon.subtitle")}>
      <Show when={props.disabled}>
        <p class="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-xl px-4 py-3">
          {t("seller.subscription.coupon.alreadyActive")}
        </p>
      </Show>

      <form onSubmit={handleSubmit} class="space-y-4">
        <Input
          label={t("seller.subscription.coupon.codeLabel")}
          placeholder={t("seller.subscription.coupon.codePlaceholder")}
          value={code()}
          disabled={props.disabled || submitting()}
          maxLength={64}
          onInput={(event) => {
            setCode(event.currentTarget.value.toUpperCase());
            setError(null);
          }}
          error={error() ?? undefined}
        />

        <Button
          type="submit"
          variant="primary"
          class="w-full sm:w-auto"
          loading={submitting()}
          disabled={props.disabled}
        >
          {t("seller.subscription.coupon.redeem")}
        </Button>
      </form>
    </Card>
  );
}
