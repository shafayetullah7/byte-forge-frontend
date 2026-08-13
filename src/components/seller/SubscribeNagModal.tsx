import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, createSignal, on } from "solid-js";
import Button from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { useI18n } from "~/i18n";
import type { SellerSubscription } from "~/lib/api/types/seller/subscription.types";
import { SHOP_STATUS, type ShopStatus } from "~/lib/api/types/seller.types";

const SUBSCRIPTION_PATH = "/app/seller/subscription";

export interface SubscribeNagModalProps {
  shopStatus: ShopStatus | null | undefined;
  subscription: SellerSubscription | undefined;
}

export function SubscribeNagModal(props: SubscribeNagModalProps) {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [suppressedPath, setSuppressedPath] = createSignal<string | null>(null);
  const [isOpen, setIsOpen] = createSignal(false);

  const shouldNag = createMemo(() => {
    const shop = props.shopStatus;
    const sub = props.subscription;
    if (!shop || !sub) return false;
    if (shop.status !== SHOP_STATUS.ACTIVE) return false;
    if (sub.active) return false;
    if (location.pathname.startsWith(SUBSCRIPTION_PATH)) return false;
    if (suppressedPath() === location.pathname) return false;
    return true;
  });

  createEffect(() => {
    setIsOpen(shouldNag());
  });

  createEffect(
    on(
      () => location.pathname,
      () => {
        setSuppressedPath(null);
      },
    ),
  );

  const handleClose = () => {
    setSuppressedPath(location.pathname);
    setIsOpen(false);
  };

  const handleSubscribe = () => {
    navigate(SUBSCRIPTION_PATH);
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
