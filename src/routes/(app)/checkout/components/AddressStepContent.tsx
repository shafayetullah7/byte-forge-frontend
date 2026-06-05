import type { Component } from "solid-js";
import { useI18n } from "~/i18n";
import type { Address } from "~/lib/api/types/address.types";
import { ChevronLeftIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { A } from "@solidjs/router";
import AddressSelector from "./AddressSelector";

interface AddressStepContentProps {
  addresses: Address[];
  selectedAddressId: string | null;
  canPlaceOrder: boolean;
  onSelectAddress: (id: string) => void;
  onContinue: () => void;
}

const AddressStepContent: Component<AddressStepContentProps> = (props) => {
  const { t } = useI18n();
  return (
    <div class="space-y-6">
      <AddressSelector
        addresses={props.addresses}
        selectedAddressId={props.selectedAddressId}
        onSelect={props.onSelectAddress}
      />

      <div class="flex justify-between items-center pt-4">
        <A
          href="/cart"
          class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 font-medium transition-colors"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          {t("checkout.backToCart")}
        </A>
        <Button
          variant="primary"
          size="lg"
          disabled={!props.canPlaceOrder}
          onClick={props.onContinue}
        >
          {t("checkout.continueToReview")}
        </Button>
      </div>
    </div>
  );
};

export default AddressStepContent;
