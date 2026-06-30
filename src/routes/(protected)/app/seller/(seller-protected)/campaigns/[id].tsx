import { createSignal, Show, createEffect } from "solid-js";
import { useNavigate, useParams, createAsync, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { useI18n } from "~/i18n";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import { toaster } from "~/components/ui/Toast";
import { getSellerCampaign } from "~/lib/api/endpoints/seller/campaigns.api";
import {
  createCampaignAction,
  submitCampaignAction,
  updateCampaignAction,
} from "~/lib/api/endpoints/seller/campaigns.actions";
import type { SellerCampaignTranslations } from "~/lib/api/types/seller/campaigns.types";

export const route = {
  preload: ({ params }) => (params.id === "new" ? null : getSellerCampaign(params.id as string)),
} satisfies RouteDefinition;

const emptyTranslations = (): SellerCampaignTranslations => ({
  en: { title: "", description: "" },
  bn: { title: "", description: "" },
});

export default function SellerCampaignEditorPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = () => params.id === "new";

  const campaignQuery = createAsync(
    () => (isNew() ? Promise.resolve(null) : getSellerCampaign(params.id)),
    { deferStream: true },
  );

  const [localeTab, setLocaleTab] = createSignal<"en" | "bn">("en");
  const [type, setType] = createSignal("DISCOUNT");
  const [discountPercent, setDiscountPercent] = createSignal("");
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");
  const [translations, setTranslations] = createSignal<SellerCampaignTranslations>(emptyTranslations());

  createEffect(() => {
    const data = campaignQuery()?.data;
    if (!data) return;
    setType(data.type);
    setDiscountPercent(data.discountPercent != null ? String(data.discountPercent) : "");
    setStartDate(data.startDate.slice(0, 10));
    setEndDate(data.endDate.slice(0, 10));
    setTranslations(data.translations);
  });

  const createTrigger = useAction(createCampaignAction);
  const updateTrigger = useAction(updateCampaignAction);
  const submitTrigger = useAction(submitCampaignAction);
  const createSubmission = useSubmission(createCampaignAction);
  const updateSubmission = useSubmission(updateCampaignAction);
  const submitSubmission = useSubmission(submitCampaignAction);
  const saveSubmission = () => (isNew() ? createSubmission : updateSubmission);

  const buildPayload = () => ({
    type: type(),
    discountPercent: discountPercent() ? Number(discountPercent()) : null,
    startDate: new Date(startDate()).toISOString(),
    endDate: new Date(endDate()).toISOString(),
    translations: translations(),
  });

  const handleSave = async () => {
    const payload = buildPayload();
    const result = isNew()
      ? await createTrigger(payload)
      : await updateTrigger({ id: params.id, payload });
    if (result?.success) {
      toaster.success(t("seller.campaigns.saved"));
      if (isNew() && result.id) navigate(`/app/seller/campaigns/${result.id}`);
    } else {
      toaster.error(result?.error?.message ?? t("common.error"));
    }
  };

  const handleSubmit = async () => {
    if (isNew()) return;
    const result = await submitTrigger(params.id);
    if (result?.success) toaster.success(t("seller.campaigns.submitted"));
    else toaster.error(result?.error?.message ?? t("common.error"));
  };

  const activeTranslation = () => translations()[localeTab()];

  const updateTranslation = (field: "title" | "description", value: string) => {
    const tab = localeTab();
    setTranslations((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value },
    }));
  };

  return (
    <div class="p-6 max-w-3xl space-y-6">
      <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
        {isNew() ? t("seller.campaigns.create") : t("seller.campaigns.editTitle")}
      </h1>

      <div class="flex gap-2">
        <button
          type="button"
          class={`px-3 py-1.5 rounded-lg text-sm ${localeTab() === "en" ? "bg-forest-600 text-white" : "bg-cream-100 dark:bg-forest-800"}`}
          onClick={() => setLocaleTab("en")}
        >
          EN
        </button>
        <button
          type="button"
          class={`px-3 py-1.5 rounded-lg text-sm ${localeTab() === "bn" ? "bg-forest-600 text-white" : "bg-cream-100 dark:bg-forest-800"}`}
          onClick={() => setLocaleTab("bn")}
        >
          BN
        </button>
      </div>

      <Input
        label={t("seller.campaigns.fields.title")}
        value={activeTranslation().title}
        onInput={(e) => updateTranslation("title", e.currentTarget.value)}
      />
      <Textarea
        label={t("seller.campaigns.fields.description")}
        value={activeTranslation().description ?? ""}
        onInput={(e) => updateTranslation("description", e.currentTarget.value)}
        rows={4}
      />

      <div class="grid sm:grid-cols-2 gap-4">
        <Input label={t("seller.campaigns.fields.type")} value={type()} onInput={(e) => setType(e.currentTarget.value)} />
        <Input
          label={t("seller.campaigns.fields.discount")}
          type="number"
          value={discountPercent()}
          onInput={(e) => setDiscountPercent(e.currentTarget.value)}
        />
        <Input label={t("seller.campaigns.fields.startDate")} type="date" value={startDate()} onInput={(e) => setStartDate(e.currentTarget.value)} />
        <Input label={t("seller.campaigns.fields.endDate")} type="date" value={endDate()} onInput={(e) => setEndDate(e.currentTarget.value)} />
      </div>

      <div class="flex gap-3">
        <Button onClick={handleSave} disabled={saveSubmission().pending}>
          {t("seller.campaigns.save")}
        </Button>
        <Show when={!isNew()}>
          <Button variant="outline" onClick={handleSubmit} disabled={submitSubmission.pending}>
            {t("seller.campaigns.submit")}
          </Button>
        </Show>
      </div>
    </div>
  );
}
