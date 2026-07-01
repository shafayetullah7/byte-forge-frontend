import { createSignal, Show, createEffect, createMemo } from "solid-js";
import { useNavigate, useParams, createAsync, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { useI18n } from "~/i18n";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { Select } from "~/components/ui/Select";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { toaster } from "~/components/ui/Toast";
import { FieldGroup } from "~/components/seller/forms/FieldGroup";
import { BilingualSectionIntro } from "~/components/seller/forms/BilingualSectionIntro";
import { BilingualLocaleColumn } from "~/components/seller/forms/BilingualLocaleColumn";
import { ContentModerationBanner } from "~/components/seller/forms/ContentModerationBanner";
import { CampaignProductPicker } from "~/components/seller/forms/CampaignProductPicker";
import { getSellerCampaign } from "~/lib/api/endpoints/seller/campaigns.api";
import { getProducts } from "~/lib/api/endpoints/seller/products.api";
import {
  createCampaignAction,
  submitCampaignAction,
  updateCampaignAction,
} from "~/lib/api/endpoints/seller/campaigns.actions";
import type { SellerCampaignTranslations } from "~/lib/api/types/seller/campaigns.types";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import {
  campaignLocaleComplete,
  isCampaignSubmitReady,
  validateCampaignDraft,
  validateCampaignSubmit,
  type ValidationMessages,
} from "~/lib/seller/content-form-validation";

export const route = {
  preload: ({ params }) => (params.id === "new" ? null : getSellerCampaign(params.id as string)),
} satisfies RouteDefinition;

const CAMPAIGN_TYPES = [
  "DISCOUNT",
  "BUNDLE",
  "FLASH_SALE",
  "SEASONAL",
  "FREE_SHIPPING",
] as const;

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

  const productsQuery = createAsync(
    () => getProducts({ status: "ACTIVE", limit: 50 }),
    { deferStream: true },
  );

  const [type, setType] = createSignal("DISCOUNT");
  const [discountPercent, setDiscountPercent] = createSignal("");
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");
  const [productIds, setProductIds] = createSignal<string[]>([]);
  const [translations, setTranslations] = createSignal<SellerCampaignTranslations>(emptyTranslations());
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [bannerId, setBannerId] = createSignal<string | null>(null);

  const bannerUpload = useImageUpload({
    folder: "campaigns",
    onSuccess: (id) => setBannerId(id),
    onClear: () => setBannerId(null),
  });

  createEffect(() => {
    const data = campaignQuery()?.data;
    if (!data) return;
    setType(data.type);
    setDiscountPercent(data.discountPercent != null ? String(data.discountPercent) : "");
    setStartDate(data.startDate.slice(0, 10));
    setEndDate(data.endDate.slice(0, 10));
    setTranslations(data.translations);
    setProductIds(data.productIds ?? []);
    if (data.banner) {
      setBannerId(data.banner.id);
      bannerUpload.seed(data.banner.id, data.banner.url);
    }
  });

  const createTrigger = useAction(createCampaignAction);
  const updateTrigger = useAction(updateCampaignAction);
  const submitTrigger = useAction(submitCampaignAction);
  const createSubmission = useSubmission(createCampaignAction);
  const updateSubmission = useSubmission(updateCampaignAction);
  const submitSubmission = useSubmission(submitCampaignAction);
  const saveSubmission = () => (isNew() ? createSubmission : updateSubmission);

  const validationMessages = (): ValidationMessages => ({
    enTitleRequired: t("seller.campaigns.validation.enTitleRequired"),
    bnTitleRequired: t("seller.campaigns.validation.bnTitleRequired"),
    startDateRequired: t("seller.campaigns.validation.startDateRequired"),
    endDateRequired: t("seller.campaigns.validation.endDateRequired"),
    endAfterStart: t("seller.campaigns.validation.endAfterStart"),
  });

  const formState = () => ({
    translations: translations(),
    startDate: startDate(),
    endDate: endDate(),
  });

  const typeOptions = () =>
    CAMPAIGN_TYPES.map((value) => ({
      value,
      label: t(`seller.campaigns.types.${value}`),
    }));

  const TYPE_DESC_KEYS: Record<string, string> = {
    DISCOUNT: "seller.campaigns.types.DISCOUNT_DESC",
    BUNDLE: "seller.campaigns.types.BUNDLE_DESC",
    FLASH_SALE: "seller.campaigns.types.FLASH_SALE_DESC",
    SEASONAL: "seller.campaigns.types.SEASONAL_DESC",
    FREE_SHIPPING: "seller.campaigns.types.FREE_SHIPPING_DESC",
  };

  const typeHint = () => {
    const descKey = TYPE_DESC_KEYS[type()];
    return `${t("seller.campaigns.fields.typeHint")} ${descKey ? t(descKey) : ""}`.trim();
  };

  const updateTranslation = (
    locale: "en" | "bn",
    field: "title" | "description",
    value: string,
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const buildPayload = () => ({
    type: type(),
    bannerId: bannerId(),
    discountPercent: type() === "DISCOUNT" && discountPercent() ? Number(discountPercent()) : null,
    startDate: new Date(startDate()).toISOString(),
    endDate: new Date(endDate()).toISOString(),
    productIds: productIds(),
    translations: translations(),
  });

  const handleSave = async () => {
    const draftErrors = validateCampaignDraft(formState(), validationMessages());
    setErrors(draftErrors);
    if (Object.keys(draftErrors).length > 0) return;

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
    const submitErrors = validateCampaignSubmit(formState(), validationMessages());
    setErrors(submitErrors);
    if (Object.keys(submitErrors).length > 0) {
      toaster.error(t("seller.campaigns.submitRequirements"));
      return;
    }

    const saveResult = await updateTrigger({ id: params.id, payload: buildPayload() });
    if (!saveResult?.success) {
      toaster.error(saveResult?.error?.message ?? t("common.error"));
      return;
    }

    const result = await submitTrigger(params.id);
    if (result?.success) toaster.success(t("seller.campaigns.submitted"));
    else toaster.error(result?.error?.message ?? t("common.error"));
  };

  const submitReady = createMemo(() => isCampaignSubmitReady(formState()));

  const moderationLabels = () => ({
    draft: t("seller.campaigns.moderation.draft"),
    pending: t("seller.campaigns.moderation.pending"),
    approved: t("seller.campaigns.moderation.approved"),
    rejected: t("seller.campaigns.moderation.rejected"),
    archived: t("seller.campaigns.moderation.archived"),
    draftHint: t("seller.campaigns.moderation.draftHint"),
    rejectedHint: t("seller.campaigns.moderation.rejectedHint"),
  });

  return (
    <div class="p-6 max-w-4xl space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
          {isNew() ? t("seller.campaigns.create") : t("seller.campaigns.editTitle")}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{t("seller.campaigns.pageDescription")}</p>
        <Show when={!isNew() && campaignQuery()?.data}>
          {(data) => (
            <ContentModerationBanner
              moderationStatus={data().moderationStatus}
              rejectedReason={data().rejectedReason}
              moderationLabels={moderationLabels()}
            />
          )}
        </Show>
      </div>

      <BilingualSectionIntro
        title={t("seller.campaigns.bilingual.introTitle")}
        description={t("seller.campaigns.bilingual.introDescription")}
      />

      <Card
        title={t("seller.campaigns.sections.customerContent.title")}
        description={t("seller.campaigns.sections.customerContent.description")}
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BilingualLocaleColumn
            locale="en"
            title={t("seller.shop.englishLabel")}
            subtitle={t("seller.shop.englishColumnHeader")}
            isComplete={campaignLocaleComplete("en", translations())}
          >
            <FieldGroup
              label={t("seller.campaigns.fields.title")}
              required
              hint={t("seller.campaigns.fields.titleHint")}
              error={errors()["en.title"]}
            >
              <Input
                value={translations().en.title}
                placeholder={t("seller.campaigns.fields.titlePlaceholder")}
                onInput={(e) => updateTranslation("en", "title", e.currentTarget.value)}
                error={errors()["en.title"]}
              />
            </FieldGroup>
            <FieldGroup
              label={t("seller.campaigns.fields.description")}
              hint={t("seller.campaigns.fields.descriptionHint")}
            >
              <Textarea
                value={translations().en.description ?? ""}
                placeholder={t("seller.campaigns.fields.descriptionPlaceholder")}
                onInput={(e) => updateTranslation("en", "description", e.currentTarget.value)}
                rows={4}
              />
            </FieldGroup>
          </BilingualLocaleColumn>

          <BilingualLocaleColumn
            locale="bn"
            title={t("seller.shop.bengaliLabel")}
            subtitle={t("seller.shop.bengaliColumnHeader")}
            isComplete={campaignLocaleComplete("bn", translations())}
          >
            <FieldGroup
              label={t("seller.campaigns.fields.title")}
              required
              hint={t("seller.campaigns.fields.titleHint")}
              error={errors()["bn.title"]}
            >
              <Input
                value={translations().bn.title}
                placeholder={t("seller.campaigns.fields.titlePlaceholderBn")}
                onInput={(e) => updateTranslation("bn", "title", e.currentTarget.value)}
                error={errors()["bn.title"]}
                dir="auto"
              />
            </FieldGroup>
            <FieldGroup
              label={t("seller.campaigns.fields.description")}
              hint={t("seller.campaigns.fields.descriptionHint")}
            >
              <Textarea
                value={translations().bn.description ?? ""}
                placeholder={t("seller.campaigns.fields.descriptionPlaceholderBn")}
                onInput={(e) => updateTranslation("bn", "description", e.currentTarget.value)}
                rows={4}
                dir="auto"
              />
            </FieldGroup>
          </BilingualLocaleColumn>
        </div>
      </Card>

      <Card
        title={t("seller.campaigns.sections.settings.title")}
        description={t("seller.campaigns.sections.settings.description")}
      >
        <div class="space-y-6">
          <FieldGroup label={t("seller.campaigns.fields.type")} required hint={typeHint()}>
            <Select
              options={typeOptions()}
              value={type()}
              onChange={(e) => setType(e.currentTarget.value)}
            />
          </FieldGroup>

          <Show when={type() === "DISCOUNT"}>
            <FieldGroup
              label={t("seller.campaigns.fields.discount")}
              hint={t("seller.campaigns.fields.discountHint")}
            >
              <Input
                type="number"
                min={0}
                max={100}
                value={discountPercent()}
                onInput={(e) => setDiscountPercent(e.currentTarget.value)}
              />
            </FieldGroup>
          </Show>

          <div class="grid sm:grid-cols-2 gap-4">
            <FieldGroup
              label={t("seller.campaigns.fields.startDate")}
              required
              hint={t("seller.campaigns.fields.startDateHint")}
              error={errors().startDate}
            >
              <Input
                type="date"
                value={startDate()}
                onInput={(e) => setStartDate(e.currentTarget.value)}
                error={errors().startDate}
              />
            </FieldGroup>
            <FieldGroup
              label={t("seller.campaigns.fields.endDate")}
              required
              hint={t("seller.campaigns.fields.endDateHint")}
              error={errors().endDate}
            >
              <Input
                type="date"
                value={endDate()}
                onInput={(e) => setEndDate(e.currentTarget.value)}
                error={errors().endDate}
              />
            </FieldGroup>
          </div>

          <FieldGroup label={t("seller.campaigns.fields.banner")} hint={t("seller.campaigns.fields.bannerHint")}>
            <ImageUpload
              preview={bannerUpload.preview()}
              isUploading={bannerUpload.isUploading()}
              isDeleting={bannerUpload.isDeleting()}
              onFileSelect={bannerUpload.upload}
              onDelete={bannerUpload.deleteMedia}
              label={t("seller.campaigns.fields.banner")}
            />
          </FieldGroup>

          <Show when={productsQuery()?.data}>
            <CampaignProductPicker
              products={productsQuery()!.data}
              selectedIds={productIds()}
              onChange={setProductIds}
              label={t("seller.campaigns.fields.products.label")}
              hint={t("seller.campaigns.fields.productsHint")}
            />
          </Show>
        </div>
      </Card>

      <div class="space-y-3">
        <Show when={!isNew()}>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {t("seller.campaigns.submitRequirements")}
          </p>
        </Show>
        <div class="flex flex-wrap gap-3">
          <Button onClick={handleSave} disabled={saveSubmission().pending}>
            {t("seller.campaigns.save")}
          </Button>
          <Show when={!isNew()}>
            <Button
              variant="outline"
              onClick={handleSubmit}
              disabled={submitSubmission.pending || !submitReady()}
            >
              {t("seller.campaigns.submit")}
            </Button>
          </Show>
        </div>
      </div>
    </div>
  );
}
