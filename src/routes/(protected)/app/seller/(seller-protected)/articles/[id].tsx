import { createSignal, Show, createEffect, createMemo } from "solid-js";
import { A, useNavigate, useParams, createAsync, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { useI18n } from "~/i18n";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { ConfirmDialog } from "~/components/ui/ConfirmDialog";
import { toaster } from "~/components/ui/Toast";
import { FieldGroup } from "~/components/ui/FieldGroup";
import { BilingualSectionIntro } from "~/components/seller/forms/BilingualSectionIntro";
import { BilingualLocaleColumn } from "~/components/seller/forms/BilingualLocaleColumn";
import { ContentModerationBanner } from "~/components/seller/forms/ContentModerationBanner";
import { getSellerArticle } from "~/lib/api/endpoints/seller/articles.api";
import {
  archiveArticleAction,
  createArticleAction,
  deleteArticleAction,
  submitArticleAction,
  updateArticleAction,
} from "~/lib/api/endpoints/seller/articles.actions";
import type { SellerArticleTranslations } from "~/lib/api/types/seller/articles.types";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import { getShop } from "~/lib/context/shop-context";
import {
  articleLocaleComplete,
  isArticleSubmitReady,
  isContentArchivable,
  isContentDeletable,
  isContentEditable,
  isContentSubmittable,
  validateArticleDraft,
  validateArticleSubmit,
  type ValidationMessages,
} from "~/lib/seller/content-form-validation";

export const route = {
  preload: ({ params }) => (params.id === "new" ? null : getSellerArticle(params.id as string)),
} satisfies RouteDefinition;

const emptyTranslations = (): SellerArticleTranslations => ({
  en: { title: "", excerpt: "", body: "" },
  bn: { title: "", excerpt: "", body: "" },
});

export default function SellerArticleEditorPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = () => params.id === "new";

  const articleQuery = createAsync(
    () => (isNew() ? Promise.resolve(null) : getSellerArticle(params.id)),
    { deferStream: true },
  );

  const shopQuery = createAsync(() => getShop(), { deferStream: true });

  const [category, setCategory] = createSignal("");
  const [readMinutes, setReadMinutes] = createSignal("5");
  const [translations, setTranslations] = createSignal<SellerArticleTranslations>(emptyTranslations());
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [coverImageId, setCoverImageId] = createSignal<string | null>(null);
  const [pendingAction, setPendingAction] = createSignal<"archive" | "delete" | null>(null);

  const coverUpload = useImageUpload({
    folder: "articles",
    onSuccess: (id) => setCoverImageId(id),
    onClear: () => setCoverImageId(null),
  });

  createEffect(() => {
    const data = articleQuery()?.data;
    if (!data) return;
    setCategory(data.category ?? "");
    setReadMinutes(String(data.readMinutes ?? 5));
    setTranslations(data.translations);
    if (data.coverImage) {
      setCoverImageId(data.coverImage.id);
      coverUpload.seed(data.coverImage.id, data.coverImage.url);
    }
  });

  const createTrigger = useAction(createArticleAction);
  const updateTrigger = useAction(updateArticleAction);
  const submitTrigger = useAction(submitArticleAction);
  const archiveTrigger = useAction(archiveArticleAction);
  const deleteTrigger = useAction(deleteArticleAction);
  const createSubmission = useSubmission(createArticleAction);
  const updateSubmission = useSubmission(updateArticleAction);
  const submitSubmission = useSubmission(submitArticleAction);
  const archiveSubmission = useSubmission(archiveArticleAction);
  const deleteSubmission = useSubmission(deleteArticleAction);
  const saveSubmission = () => (isNew() ? createSubmission : updateSubmission);

  const moderationStatus = () => articleQuery()?.data?.moderationStatus;
  const editable = () => isNew() || (moderationStatus() ? isContentEditable(moderationStatus()!) : false);
  const canSubmit = () => moderationStatus() && isContentSubmittable(moderationStatus()!);
  const canArchive = () => moderationStatus() && isContentArchivable(moderationStatus()!);
  const canDelete = () => moderationStatus() && isContentDeletable(moderationStatus()!);
  const fieldsDisabled = () => !editable();
  const storefrontUrl = () => {
    const shop = shopQuery();
    const data = articleQuery()?.data;
    if (!shop?.slug || !data?.slug || data.moderationStatus !== "APPROVED") return null;
    return `/shops/${shop.slug}/articles/${data.slug}`;
  };

  const validationMessages = (): ValidationMessages => ({
    enTitleRequired: t("seller.articles.validation.enTitleRequired"),
    bnTitleRequired: t("seller.articles.validation.bnTitleRequired"),
    enExcerptRequired: t("seller.articles.validation.enExcerptRequired"),
    bnExcerptRequired: t("seller.articles.validation.bnExcerptRequired"),
    enBodyRequired: t("seller.articles.validation.enBodyRequired"),
    bnBodyRequired: t("seller.articles.validation.bnBodyRequired"),
  });

  const formState = () => ({ translations: translations() });

  const updateTranslation = (
    locale: "en" | "bn",
    field: "title" | "excerpt" | "body",
    value: string,
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const buildPayload = () => ({
    category: category() || null,
    readMinutes: Number(readMinutes()) || 5,
    coverImageId: coverImageId(),
    translations: translations(),
  });

  const handleSave = async () => {
    const draftErrors = validateArticleDraft(formState(), validationMessages());
    setErrors(draftErrors);
    if (Object.keys(draftErrors).length > 0) return;

    const payload = buildPayload();
    const result = isNew()
      ? await createTrigger(payload)
      : await updateTrigger({ id: params.id, payload });
    if (result?.success) {
      toaster.success(t("seller.articles.saved"));
      if (isNew() && result.id) navigate(`/app/seller/articles/${result.id}`);
    } else {
      toaster.error(result?.error?.message ?? t("common.error"));
    }
  };

  const handleSubmit = async () => {
    if (isNew()) return;
    const submitErrors = validateArticleSubmit(formState(), validationMessages());
    setErrors(submitErrors);
    if (Object.keys(submitErrors).length > 0) {
      toaster.error(t("seller.articles.submitRequirements"));
      return;
    }

    const saveResult = await updateTrigger({ id: params.id, payload: buildPayload() });
    if (!saveResult?.success) {
      toaster.error(saveResult?.error?.message ?? t("common.error"));
      return;
    }

    const result = await submitTrigger(params.id);
    if (result?.success) toaster.success(t("seller.articles.submitted"));
    else toaster.error(result?.error?.message ?? t("common.error"));
  };

  const handleLifecycleConfirm = async () => {
    const action = pendingAction();
    if (!action || isNew()) return;
    const result =
      action === "archive"
        ? await archiveTrigger(params.id)
        : await deleteTrigger(params.id);
    if (result?.success) {
      toaster.success(action === "archive" ? t("seller.articles.archived") : t("seller.articles.deleted"));
      setPendingAction(null);
      if (action === "delete") navigate("/app/seller/articles");
    } else {
      toaster.error(result?.error?.message ?? t("common.error"));
    }
  };

  const submitReady = createMemo(() => isArticleSubmitReady(formState()));

  const moderationLabels = () => ({
    draft: t("seller.articles.moderation.draft"),
    pending: t("seller.articles.moderation.pending"),
    approved: t("seller.articles.moderation.approved"),
    rejected: t("seller.articles.moderation.rejected"),
    archived: t("seller.articles.moderation.archived"),
    draftHint: t("seller.articles.moderation.draftHint"),
    pendingHint: t("seller.articles.moderation.pendingHint"),
    approvedHint: t("seller.articles.moderation.approvedHint"),
    archivedHint: t("seller.articles.moderation.archivedHint"),
    rejectedHint: t("seller.articles.moderation.rejectedHint"),
  });

  const renderLocaleFields = (locale: "en" | "bn") => {
    const isBn = locale === "bn";
    const tr = () => translations()[locale];
    return (
      <>
        <FieldGroup
          label={t("seller.articles.fields.title")}
          requirement={locale === "en" ? "required" : "requiredForReview"}
          hint={t("seller.articles.fields.titleHint")}
          error={errors()[`${locale}.title`]}
        >
          <Input
            value={tr().title}
            placeholder={
              isBn
                ? t("seller.articles.fields.titlePlaceholderBn")
                : t("seller.articles.fields.titlePlaceholder")
            }
            onInput={(e) => updateTranslation(locale, "title", e.currentTarget.value)}
            error={errors()[`${locale}.title`]}
            dir={isBn ? "auto" : undefined}
            disabled={fieldsDisabled()}
          />
        </FieldGroup>
        <FieldGroup
          label={t("seller.articles.fields.excerpt")}
          requirement="requiredForReview"
          hint={t("seller.articles.fields.excerptHint")}
          error={errors()[`${locale}.excerpt`]}
        >
          <Textarea
            value={tr().excerpt ?? ""}
            placeholder={
              isBn
                ? t("seller.articles.fields.excerptPlaceholderBn")
                : t("seller.articles.fields.excerptPlaceholder")
            }
            onInput={(e) => updateTranslation(locale, "excerpt", e.currentTarget.value)}
            rows={2}
            error={errors()[`${locale}.excerpt`]}
            dir={isBn ? "auto" : undefined}
            disabled={fieldsDisabled()}
          />
        </FieldGroup>
        <FieldGroup
          label={t("seller.articles.fields.body")}
          requirement="requiredForReview"
          hint={t("seller.articles.fields.bodyHint")}
          error={errors()[`${locale}.body`]}
        >
          <Textarea
            value={tr().body ?? ""}
            placeholder={
              isBn
                ? t("seller.articles.fields.bodyPlaceholderBn")
                : t("seller.articles.fields.bodyPlaceholder")
            }
            onInput={(e) => updateTranslation(locale, "body", e.currentTarget.value)}
            rows={8}
            error={errors()[`${locale}.body`]}
            dir={isBn ? "auto" : undefined}
            disabled={fieldsDisabled()}
          />
        </FieldGroup>
      </>
    );
  };

  return (
    <div class="p-6 max-w-4xl space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
          {isNew() ? t("seller.articles.create") : t("seller.articles.editTitle")}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{t("seller.articles.pageDescription")}</p>
        <Show when={!isNew() && articleQuery()?.data}>
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
        title={t("seller.articles.bilingual.introTitle")}
        description={t("seller.articles.bilingual.introDescription")}
      />

      <Card
        title={t("seller.articles.sections.customerContent.title")}
        description={t("seller.articles.sections.customerContent.description")}
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BilingualLocaleColumn
            locale="en"
            title={t("seller.shop.englishLabel")}
            subtitle={t("seller.shop.englishColumnHeader")}
            isComplete={articleLocaleComplete("en", translations(), true)}
          >
            {renderLocaleFields("en")}
          </BilingualLocaleColumn>

          <BilingualLocaleColumn
            locale="bn"
            title={t("seller.shop.bengaliLabel")}
            subtitle={t("seller.shop.bengaliColumnHeader")}
            isComplete={articleLocaleComplete("bn", translations(), true)}
          >
            {renderLocaleFields("bn")}
          </BilingualLocaleColumn>
        </div>
      </Card>

      <Card
        title={t("seller.articles.sections.settings.title")}
        description={t("seller.articles.sections.settings.description")}
      >
        <div class="space-y-6">
          <div class="grid sm:grid-cols-2 gap-4">
            <FieldGroup
              label={t("seller.articles.fields.category")}
              requirement="optional"
              hint={t("seller.articles.fields.categoryHint")}
            >
              <Input
                value={category()}
                onInput={(e) => setCategory(e.currentTarget.value)}
                disabled={fieldsDisabled()}
              />
            </FieldGroup>
            <FieldGroup
              label={t("seller.articles.fields.readMinutes")}
              requirement="optional"
              hint={t("seller.articles.fields.readMinutesHint")}
            >
              <Input
                type="number"
                min={1}
                max={999}
                value={readMinutes()}
                onInput={(e) => setReadMinutes(e.currentTarget.value)}
                disabled={fieldsDisabled()}
              />
            </FieldGroup>
          </div>

          <FieldGroup
            label={t("seller.articles.fields.cover")}
            requirement="optional"
            hint={t("seller.articles.fields.coverHint")}
          >
            <ImageUpload
              preview={coverUpload.preview()}
              isUploading={coverUpload.isUploading()}
              isDeleting={coverUpload.isDeleting()}
              onFileSelect={coverUpload.upload}
              onDelete={coverUpload.deleteMedia}
              label={t("seller.articles.fields.cover")}
              disabled={fieldsDisabled()}
            />
          </FieldGroup>
        </div>
      </Card>

      <div class="space-y-3">
        <Show when={canSubmit()}>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {t("seller.articles.submitRequirements")}
          </p>
        </Show>
        <div class="flex flex-wrap gap-3">
          <Show when={editable()}>
            <Button onClick={handleSave} disabled={saveSubmission().pending}>
              {t("seller.articles.save")}
            </Button>
          </Show>
          <Show when={canSubmit()}>
            <Button
              variant="outline"
              onClick={handleSubmit}
              disabled={submitSubmission.pending || !submitReady()}
            >
              {t("seller.articles.submit")}
            </Button>
          </Show>
          <Show when={storefrontUrl()}>
            {(url) => (
              <A href={url()}>
                <Button variant="outline" type="button">
                  {t("seller.articles.viewOnStorefront")}
                </Button>
              </A>
            )}
          </Show>
          <Show when={canArchive()}>
            <Button
              variant="outline"
              onClick={() => setPendingAction("archive")}
              disabled={archiveSubmission.pending}
            >
              {t("seller.articles.archive")}
            </Button>
          </Show>
          <Show when={canDelete()}>
            <Button
              variant="destructive"
              onClick={() => setPendingAction("delete")}
              disabled={deleteSubmission.pending}
            >
              {t("seller.articles.delete")}
            </Button>
          </Show>
        </div>
      </div>

      <Show when={pendingAction()}>
        {(action) => (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setPendingAction(null)}
            onConfirm={handleLifecycleConfirm}
            closeOnConfirm={false}
            title={
              action() === "archive"
                ? t("seller.articles.confirmArchiveTitle")
                : t("seller.articles.confirmDeleteTitle")
            }
            description={
              action() === "archive"
                ? t("seller.articles.confirmArchiveDescription")
                : t("seller.articles.confirmDeleteDescription")
            }
            confirmLabel={
              action() === "archive" ? t("seller.articles.archive") : t("seller.articles.delete")
            }
            variant="danger"
            loading={archiveSubmission.pending || deleteSubmission.pending}
          />
        )}
      </Show>
    </div>
  );
}
