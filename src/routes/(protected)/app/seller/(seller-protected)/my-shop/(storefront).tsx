import { createAsync, A, type RouteDefinition, useAction } from "@solidjs/router";
import { createSignal, Show, For, Suspense } from "solid-js";
import { useI18n } from "~/i18n";
import { toaster } from "~/components/ui/Toast";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { EditableSectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/EditableSectionCard";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import { getSellerStorefront } from "~/lib/api/endpoints/seller/storefront.api";
import { getShop } from "~/lib/context/shop-context";
import {
  replaceValuePointsAction,
  replaceWhyChooseUsAction,
  updateStorefrontProfileAction,
} from "./storefront.actions";
import {
  PairedListEditor,
  fromPairedRows,
  toPairedRows,
  type PairedListRow,
} from "~/components/seller/storefront/PairedListEditor";
import type { SellerStorefrontData } from "~/lib/shop/storefront.types";

export const route = {
  preload: () => Promise.all([getSellerStorefront(), getShop()]),
} satisfies RouteDefinition;

type SectionId = "profile" | "whyChooseUs" | "valuePoints" | null;

export default function StorefrontPage() {
  const { t, locale } = useI18n();
  const storefrontQuery = createAsync(() => getSellerStorefront(), { deferStream: true });
  const shopQuery = createAsync(() => getShop(), { deferStream: true });
  const updateProfileTrigger = useAction(updateStorefrontProfileAction);
  const replaceWhyTrigger = useAction(replaceWhyChooseUsAction);
  const replaceValuesTrigger = useAction(replaceValuePointsAction);

  const [editingSection, setEditingSection] = createSignal<SectionId>(null);
  const [isSaving, setIsSaving] = createSignal(false);

  const [profileDraft, setProfileDraft] = createSignal<SellerStorefrontData["profile"]["translations"] | null>(null);
  const [whyDraft, setWhyDraft] = createSignal<PairedListRow[]>([]);
  const [valuesDraft, setValuesDraft] = createSignal<PairedListRow[]>([]);

  const data = () => storefrontQuery()?.data;

  const startEdit = (section: SectionId) => {
    const current = data();
    if (!current) return;
    if (section === "profile") {
      setProfileDraft(JSON.parse(JSON.stringify(current.profile.translations)));
    }
    if (section === "whyChooseUs") {
      setWhyDraft(toPairedRows(current.whyChooseUs));
    }
    if (section === "valuePoints") {
      setValuesDraft(toPairedRows(current.valuePoints));
    }
    setEditingSection(section);
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setProfileDraft(null);
  };

  const saveProfile = async () => {
    const draft = profileDraft();
    if (!draft) return;
    setIsSaving(true);
    try {
      const result = await updateProfileTrigger({ translations: draft });
      if (result?.success === true) {
        toaster.success(t("seller.shop.storefront.profileSaved"));
        cancelEdit();
      } else {
        toaster.error(result?.error?.message ?? t("seller.shop.storefront.saveFailed"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveWhyChooseUs = async () => {
    setIsSaving(true);
    try {
      const result = await replaceWhyTrigger(fromPairedRows(whyDraft()));
      if (result?.success === true) {
        toaster.success(t("seller.shop.storefront.whyChooseUsSaved"));
        cancelEdit();
      } else {
        toaster.error(result?.error?.message ?? t("seller.shop.storefront.saveFailed"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveValuePoints = async () => {
    setIsSaving(true);
    try {
      const result = await replaceValuesTrigger(fromPairedRows(valuesDraft()));
      if (result?.success === true) {
        toaster.success(t("seller.shop.storefront.valuesSaved"));
        cancelEdit();
      } else {
        toaster.error(result?.error?.message ?? t("seller.shop.storefront.saveFailed"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfileField = (
    lang: "en" | "bn",
    field: keyof SellerStorefrontData["profile"]["translations"]["en"],
    value: string,
  ) => {
    const draft = profileDraft();
    if (!draft) return;
    setProfileDraft({
      ...draft,
      [lang]: { ...draft[lang], [field]: value },
    });
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="storefront" />
      )}
    >
      <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t("seller.shop.storefront.title")}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("seller.shop.storefront.subtitle")}
            </p>
          </div>
          <Show when={shopQuery()?.slug}>
            {(slug) => (
              <A
                href={`/shops/${slug()}`}
                target="_blank"
                class="text-sm text-forest-600 dark:text-forest-400 hover:underline"
              >
                {t("seller.shop.storefront.previewPublic")} →
              </A>
            )}
          </Show>
        </div>

        <Suspense fallback={<div class="h-40 rounded-2xl bg-cream-200 dark:bg-forest-800 animate-pulse" />}>
          <Show when={data()}>
            {(storefront) => (
              <div class="space-y-6">
                <EditableSectionCard
                  title={t("seller.shop.storefront.sections.taglineStory")}
                  isEditing={editingSection() === "profile"}
                  isSaving={isSaving()}
                  onEdit={() => startEdit("profile")}
                  onCancel={cancelEdit}
                  onSave={saveProfile}
                >
                  <Show
                    when={editingSection() === "profile" && profileDraft()}
                    fallback={
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <p class="font-semibold mb-2">{t("seller.shop.myShop.shopInfo.english")}</p>
                          <p class="text-gray-600 dark:text-gray-400">{storefront().profile.translations.en.tagline || "—"}</p>
                          <p class="mt-3 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{storefront().profile.translations.en.about || "—"}</p>
                        </div>
                        <div>
                          <p class="font-semibold mb-2">{t("seller.shop.myShop.shopInfo.bengali")}</p>
                          <p class="text-gray-600 dark:text-gray-400">{storefront().profile.translations.bn.tagline || "—"}</p>
                          <p class="mt-3 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{storefront().profile.translations.bn.about || "—"}</p>
                        </div>
                      </div>
                    }
                  >
                    {(draft) => (
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(["en", "bn"] as const).map((lang) => (
                          <div class="space-y-3">
                            <p class="font-semibold text-sm">
                              {lang === "en"
                                ? t("seller.shop.myShop.shopInfo.english")
                                : t("seller.shop.myShop.shopInfo.bengali")}
                            </p>
                            <Input
                              label={t("seller.shop.myShop.shopInfo.tagline")}
                              value={draft()[lang].tagline}
                              onInput={(e) => updateProfileField(lang, "tagline", e.currentTarget.value)}
                            />
                            <Textarea
                              label={t("seller.shop.myShop.shopInfo.about")}
                              value={draft()[lang].about}
                              onInput={(e) => updateProfileField(lang, "about", e.currentTarget.value)}
                              rows={3}
                            />
                            <Textarea
                              label={t("seller.shop.myShop.shopInfo.sellerStory")}
                              value={draft()[lang].sellerStory}
                              onInput={(e) => updateProfileField(lang, "sellerStory", e.currentTarget.value)}
                              rows={3}
                            />
                            <Textarea
                              label={t("seller.shop.myShop.shopInfo.brandMission")}
                              value={draft()[lang].brandMission}
                              onInput={(e) => updateProfileField(lang, "brandMission", e.currentTarget.value)}
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </Show>
                </EditableSectionCard>

                <EditableSectionCard
                  title={t("seller.shop.myShop.shopInfo.whyChooseUs")}
                  isEditing={editingSection() === "whyChooseUs"}
                  isSaving={isSaving()}
                  onEdit={() => startEdit("whyChooseUs")}
                  onCancel={cancelEdit}
                  onSave={saveWhyChooseUs}
                >
                  <Show
                    when={editingSection() === "whyChooseUs"}
                    fallback={
                      <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <For each={storefront().whyChooseUs}>
                          {(item) => (
                            <li>
                              {locale() === "bn" ? item.translations.bn.text : item.translations.en.text}
                            </li>
                          )}
                        </For>
                      </ul>
                    }
                  >
                    <PairedListEditor rows={whyDraft()} onChange={setWhyDraft} />
                  </Show>
                </EditableSectionCard>

                <EditableSectionCard
                  title={t("seller.shop.myShop.shopInfo.values")}
                  isEditing={editingSection() === "valuePoints"}
                  isSaving={isSaving()}
                  onEdit={() => startEdit("valuePoints")}
                  onCancel={cancelEdit}
                  onSave={saveValuePoints}
                >
                  <Show
                    when={editingSection() === "valuePoints"}
                    fallback={
                      <div class="flex flex-wrap gap-2">
                        <For each={storefront().valuePoints}>
                          {(item) => (
                            <span class="px-3 py-1 rounded-full text-xs bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-cream-100">
                              {locale() === "bn" ? item.translations.bn.text : item.translations.en.text}
                            </span>
                          )}
                        </For>
                      </div>
                    }
                  >
                    <PairedListEditor rows={valuesDraft()} onChange={setValuesDraft} />
                  </Show>
                </EditableSectionCard>

                <EditableSectionCard
                  title={t("seller.shop.myShop.shopInfo.categoriesServed")}
                  isEditing={false}
                  canEdit={false}
                  onEdit={() => {}}
                  onCancel={() => {}}
                  onSave={() => {}}
                  headerAction={
                    <A href="/app/seller/products/plants" class="text-sm text-forest-600 hover:underline">
                      {t("seller.shop.storefront.manageProducts")}
                    </A>
                  }
                >
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {t("seller.shop.storefront.categoriesHint")}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <For each={storefront().categoriesServed.preview}>
                      {(category) => (
                        <span class="px-3 py-1 rounded-full text-xs bg-cream-200 dark:bg-forest-700 text-forest-800 dark:text-cream-100">
                          {category}
                        </span>
                      )}
                    </For>
                  </div>
                </EditableSectionCard>
              </div>
            )}
          </Show>
        </Suspense>
      </div>
    </SafeErrorBoundary>
  );
}
