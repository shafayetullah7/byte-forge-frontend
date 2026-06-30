import { createSignal, Show, createEffect } from "solid-js";
import { useNavigate, useParams, createAsync, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { useI18n } from "~/i18n";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import { toaster } from "~/components/ui/Toast";
import { getSellerArticle } from "~/lib/api/endpoints/seller/articles.api";
import {
  createArticleAction,
  submitArticleAction,
  updateArticleAction,
} from "~/lib/api/endpoints/seller/articles.actions";
import type { SellerArticleTranslations } from "~/lib/api/types/seller/articles.types";

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

  const [localeTab, setLocaleTab] = createSignal<"en" | "bn">("en");
  const [category, setCategory] = createSignal("");
  const [readMinutes, setReadMinutes] = createSignal("5");
  const [translations, setTranslations] = createSignal<SellerArticleTranslations>(emptyTranslations());

  createEffect(() => {
    const data = articleQuery()?.data;
    if (!data) return;
    setCategory(data.category ?? "");
    setReadMinutes(String(data.readMinutes ?? 5));
    setTranslations(data.translations);
  });

  const createTrigger = useAction(createArticleAction);
  const updateTrigger = useAction(updateArticleAction);
  const submitTrigger = useAction(submitArticleAction);
  const createSubmission = useSubmission(createArticleAction);
  const updateSubmission = useSubmission(updateArticleAction);
  const submitSubmission = useSubmission(submitArticleAction);
  const saveSubmission = () => (isNew() ? createSubmission : updateSubmission);

  const buildPayload = () => ({
    category: category() || null,
    readMinutes: Number(readMinutes()) || 5,
    translations: translations(),
  });

  const handleSave = async () => {
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
    const result = await submitTrigger(params.id);
    if (result?.success) toaster.success(t("seller.articles.submitted"));
    else toaster.error(result?.error?.message ?? t("common.error"));
  };

  const activeTranslation = () => translations()[localeTab()];

  const updateTranslation = (field: "title" | "excerpt" | "body", value: string) => {
    const tab = localeTab();
    setTranslations((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value },
    }));
  };

  return (
    <div class="p-6 max-w-3xl space-y-6">
      <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
        {isNew() ? t("seller.articles.create") : t("seller.articles.editTitle")}
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
        label={t("seller.articles.fields.title")}
        value={activeTranslation().title}
        onInput={(e) => updateTranslation("title", e.currentTarget.value)}
      />
      <Textarea
        label={t("seller.articles.fields.excerpt")}
        value={activeTranslation().excerpt ?? ""}
        onInput={(e) => updateTranslation("excerpt", e.currentTarget.value)}
        rows={2}
      />
      <Textarea
        label={t("seller.articles.fields.body")}
        value={activeTranslation().body ?? ""}
        onInput={(e) => updateTranslation("body", e.currentTarget.value)}
        rows={8}
      />

      <div class="grid sm:grid-cols-2 gap-4">
        <Input label={t("seller.articles.fields.category")} value={category()} onInput={(e) => setCategory(e.currentTarget.value)} />
        <Input
          label={t("seller.articles.fields.readMinutes")}
          type="number"
          value={readMinutes()}
          onInput={(e) => setReadMinutes(e.currentTarget.value)}
        />
      </div>

      <div class="flex gap-3">
        <Button onClick={handleSave} disabled={saveSubmission().pending}>
          {t("seller.articles.save")}
        </Button>
        <Show when={!isNew()}>
          <Button variant="outline" onClick={handleSubmit} disabled={submitSubmission.pending}>
            {t("seller.articles.submit")}
          </Button>
        </Show>
      </div>
    </div>
  );
}
