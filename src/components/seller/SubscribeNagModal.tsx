import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, createSignal } from "solid-js";
import Button from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { useI18n } from "~/i18n";
import type { SellerSubscription } from "~/lib/api/types/seller/subscription.types";
import { SHOP_STATUS, type ShopStatus } from "~/lib/api/types/seller.types";
import { SELLER_SUBSCRIPTION_PATH } from "~/lib/subscription/subscription-gate-ui";
import {
  dismissSubscriptionNagForSession,
  isSubscriptionNagDismissedForSession,
} from "~/lib/subscription/subscription-nag-dismiss";

export interface SubscribeNagModalProps {
  shopStatus: ShopStatus | null | undefined;
  subscription: SellerSubscription | undefined;
}

export function SubscribeNagModal(props: SubscribeNagModalProps) {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = createSignal(false);

  const shouldNag = createMemo(() => {
    const shop = props.shopStatus;
    const sub = props.subscription;
    if (!shop || !sub) return false;
    if (shop.status !== SHOP_STATUS.ACTIVE) return false;
    if (sub.active) return false;
    if (location.pathname.startsWith(SELLER_SUBSCRIPTION_PATH)) return false;
    if (isSubscriptionNagDismissedForSession()) return false;
    return true;
  });

  createEffect(() => {
    setIsOpen(shouldNag());
  });

  const handleClose = () => {
    dismissSubscriptionNagForSession();
    setIsOpen(false);
  };

  const handleSubscribe = () => {
    navigate(SELLER_SUBSCRIPTION_PATH);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen()}
      onClose={handleClose}
      title={t("seller.subscription.nag.title")}
      size="md"
    >
      <p class="text-sm text-gray-600 dark:text-gray-300">{t("seller.subscription.nag.body")}</p>
      <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button type="button" variant="ghost" onClick={handleClose}>
          {t("seller.subscription.nag.dismiss")}
        </Button>
        <Button type="button" variant="primary" onClick={handleSubscribe}>
          {t("seller.subscription.nag.cta")}
        </Button>
      </div>
    </Modal>
  );
}
