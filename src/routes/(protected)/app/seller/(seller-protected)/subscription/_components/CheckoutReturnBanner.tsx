import { createEffect, on } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { toaster } from "~/components/ui/Toast";
import { invalidateSellerSubscription } from "~/lib/api/endpoints/seller/subscription.api";

function readCheckoutParam(value: string | string[] | undefined): string | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function CheckoutReturnBanner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  createEffect(
    on(
      () => readCheckoutParam(searchParams.checkout),
      (checkout) => {
        if (!checkout) return;

        if (checkout === "success") {
          invalidateSellerSubscription();
          toaster.success(t("seller.subscription.checkout.success"));
        } else if (checkout === "cancel") {
          toaster.add(t("seller.subscription.checkout.cancel"), "info");
        }

        navigate("/app/seller/subscription", { replace: true });
      },
    ),
  );

  return null;
}
