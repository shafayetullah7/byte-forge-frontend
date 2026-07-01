import { A, createAsync, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { createMemo, createSignal, For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import { getSellerArticles } from "~/lib/api/endpoints/seller/articles.api";
import { getShop } from "~/lib/context/shop-context";
import Button from "~/components/ui/Button";
import { Select } from "~/components/ui/Select";
import { ModerationStatusBadge } from "~/components/seller/forms/ModerationStatusBadge";
import {
  archiveArticleAction,
  deleteArticleAction,
} from "~/lib/api/endpoints/seller/articles.actions";
import { ConfirmDialog } from "~/components/ui/ConfirmDialog";
import { toaster } from "~/components/ui/Toast";
import {
  isContentArchivable,
  isContentDeletable,
} from "~/lib/seller/content-form-validation";

export const route = {
  preload: () => Promise.all([getSellerArticles({ page: 1, limit: 20 }), getShop()]),
} satisfies RouteDefinition;

const STATUS_FILTERS = ["", "DRAFT", "PENDING", "APPROVED", "REJECTED", "ARCHIVED"] as const;

function moderationLabel(t: (key: string) => string, status: string) {
  const key = status.toLowerCase() as "draft" | "pending" | "approved" | "rejected" | "archived";
  return t(`seller.articles.moderation.${key}`);
}

export default function SellerArticlesPage() {
  const { t } = useI18n();
  const [page, setPage] = createSignal(1);
  const [statusFilter, setStatusFilter] = createSignal("");
  const [pendingAction, setPendingAction] = createSignal<{
    id: string;
    type: "archive" | "delete";
  } | null>(null);

  const articles = createAsync(
    () =>
      getSellerArticles({
        page: page(),
        limit: 20,
        moderationStatus: statusFilter() || undefined,
      }),
    { deferStream: true },
  );

  const shop = createAsync(() => getShop(), { deferStream: true });

  const archiveTrigger = useAction(archiveArticleAction);
  const deleteTrigger = useAction(deleteArticleAction);
  const archiveSubmission = useSubmission(archiveArticleAction);
  const deleteSubmission = useSubmission(deleteArticleAction);

  const meta = () => articles()?.meta;
  const totalPages = () => meta()?.pages ?? 1;

  const statusOptions = createMemo(() =>
    STATUS_FILTERS.map((value) => ({
      value,
      label: value ? moderationLabel(t, value) : t("seller.articles.filterAll"),
    })),
  );

  const handleLifecycleConfirm = async () => {
    const pending = pendingAction();
    if (!pending) return;
    const result =
      pending.type === "archive"
        ? await archiveTrigger(pending.id)
        : await deleteTrigger(pending.id);
    if (result?.success) {
      toaster.success(
        pending.type === "archive"
          ? t("seller.articles.archived")
          : t("seller.articles.deleted"),
      );
      setPendingAction(null);
    } else {
      toaster.error(result?.error?.message ?? t("common.error"));
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
            {t("seller.articles.title")}
          </h1>
          <p class="text-sm text-gray-500">{t("seller.articles.subtitle")}</p>
        </div>
        <A href="/app/seller/articles/new">
          <Button>{t("seller.articles.create")}</Button>
        </A>
      </div>

      <div class="max-w-xs">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("seller.articles.filterStatus")}
        </label>
        <Select
          options={statusOptions()}
          value={statusFilter()}
          onChange={(e) => handleStatusChange(e.currentTarget.value)}
        />
      </div>

      <Show
        when={articles()?.data}
        fallback={<div class="h-40 bg-cream-200 dark:bg-forest-800 rounded-xl animate-pulse" />}
      >
        {(items) => (
          <Show
            when={items().length > 0}
            fallback={
              <div class="rounded-xl border border-dashed border-cream-300 dark:border-forest-600 p-8 text-center">
                <p class="text-gray-600 dark:text-gray-400 mb-4">{t("seller.articles.emptyList")}</p>
                <A href="/app/seller/articles/new">
                  <Button>{t("seller.articles.create")}</Button>
                </A>
              </div>
            }
          >
            <div class="rounded-xl border border-cream-200 dark:border-forest-700 overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-cream-50 dark:bg-forest-900/50 text-left">
                  <tr>
                    <th class="px-4 py-3">{t("seller.articles.table.title")}</th>
                    <th class="px-4 py-3">{t("seller.articles.table.category")}</th>
                    <th class="px-4 py-3">{t("seller.articles.table.status")}</th>
                    <th class="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  <For each={items()}>
                    {(item) => (
                      <tr class="border-t border-cream-200 dark:border-forest-700">
                        <td class="px-4 py-3 font-medium">{item.title}</td>
                        <td class="px-4 py-3 text-gray-500">{item.category ?? "—"}</td>
                        <td class="px-4 py-3">
                          <ModerationStatusBadge
                            status={item.moderationStatus}
                            label={moderationLabel(t, item.moderationStatus)}
                          />
                        </td>
                        <td class="px-4 py-3 text-right space-x-3">
                          <A
                            href={`/app/seller/articles/${item.id}`}
                            class="text-forest-600 hover:underline"
                          >
                            {t("seller.articles.edit")}
                          </A>
                          <Show when={item.moderationStatus === "APPROVED" && shop()?.slug}>
                            <A
                              href={`/shops/${shop()!.slug}/articles/${item.slug}`}
                              class="text-forest-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("seller.articles.viewOnStorefront")}
                            </A>
                          </Show>
                          <Show when={isContentArchivable(item.moderationStatus)}>
                            <button
                              type="button"
                              class="text-gray-600 hover:underline"
                              onClick={() =>
                                setPendingAction({ id: item.id, type: "archive" })
                              }
                            >
                              {t("seller.articles.archive")}
                            </button>
                          </Show>
                          <Show when={isContentDeletable(item.moderationStatus)}>
                            <button
                              type="button"
                              class="text-terracotta-600 hover:underline"
                              onClick={() =>
                                setPendingAction({ id: item.id, type: "delete" })
                              }
                            >
                              {t("seller.articles.delete")}
                            </button>
                          </Show>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>

            <Show when={totalPages() > 1}>
              <div class="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page() <= 1}
                  onClick={() => setPage(page() - 1)}
                >
                  {t("common.previous")}
                </Button>
                <span class="text-sm text-gray-500">
                  {page()} / {totalPages()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page() >= totalPages()}
                  onClick={() => setPage(page() + 1)}
                >
                  {t("common.next")}
                </Button>
              </div>
            </Show>
          </Show>
        )}
      </Show>

      <Show when={pendingAction()}>
        {(pending) => (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setPendingAction(null)}
            onConfirm={handleLifecycleConfirm}
            closeOnConfirm={false}
            title={
              pending().type === "archive"
                ? t("seller.articles.confirmArchiveTitle")
                : t("seller.articles.confirmDeleteTitle")
            }
            description={
              pending().type === "archive"
                ? t("seller.articles.confirmArchiveDescription")
                : t("seller.articles.confirmDeleteDescription")
            }
            confirmLabel={
              pending().type === "archive"
                ? t("seller.articles.archive")
                : t("seller.articles.delete")
            }
            variant="danger"
            loading={archiveSubmission.pending || deleteSubmission.pending}
          />
        )}
      </Show>
    </div>
  );
}
