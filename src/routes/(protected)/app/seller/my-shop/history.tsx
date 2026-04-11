import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { getMyShop } from "~/lib/api/endpoints/seller-shop";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

// Placeholder data - replace with actual API call when endpoint is ready
const mockHistory = [
  {
    action: "submitted",
    previousStatus: "DRAFT",
    newStatus: "PENDING_VERIFICATION",
    createdAt: new Date("2026-04-01T10:30:00"),
    reason: null,
  },
  {
    action: "approved",
    previousStatus: "PENDING_VERIFICATION",
    newStatus: "APPROVED",
    createdAt: new Date("2026-04-02T14:00:00"),
    reason: null,
  },
  {
    action: "activated",
    previousStatus: "APPROVED",
    newStatus: "ACTIVE",
    createdAt: new Date("2026-04-02T15:00:00"),
    reason: null,
  },
];

const actionLabels: Record<string, string> = {
  submitted: "Submitted for Verification",
  approved: "Approved",
  rejected: "Rejected",
  activated: "Activated",
  deactivated: "Deactivated",
  suspended: "Suspended",
  deleted: "Deleted",
  submitted_for_review: "Submitted for Review",
};

const statusColors: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  DRAFT: "neutral",
  PENDING_VERIFICATION: "warning",
  APPROVED: "success",
  ACTIVE: "success",
  INACTIVE: "neutral",
  REJECTED: "danger",
  SUSPENDED: "danger",
  DELETED: "neutral",
};

export default function VerificationHistoryPage() {
  const shopData = createAsync(() => getMyShop());
  const history = mockHistory; // Replace with actual API call

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="verification history" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verification History
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Track all verification actions and status changes for your shop
            </p>
          </div>

          <Suspense fallback={<div class="h-96 bg-cream-100 dark:bg-forest-800 animate-pulse rounded-2xl" />}>
            <div class="space-y-6">
              {/* Current Status */}
              <Card title="Current Status">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {shopData()?.translations?.find(t => t.locale === "en")?.name || "Your Shop"}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {shopData()?.translations?.find(t => t.locale === "bn")?.name}
                    </p>
                  </div>
                  <Badge variant={(statusColors[shopData()?.status || "DRAFT"] as any) || "neutral"}>
                    {shopData()?.status || "DRAFT"}
                  </Badge>
                </div>
              </Card>

              {/* Timeline */}
              <Card title="Verification Timeline">
                <div class="space-y-6">
                  {history.map((item, index) => (
                    <div class="flex gap-4">
                      {/* Timeline Dot */}
                      <div class="flex flex-col items-center">
                        <div
                          class={`w-3 h-3 rounded-full ${
                            item.newStatus === "APPROVED" || item.newStatus === "ACTIVE"
                              ? "bg-green-500"
                              : item.newStatus === "REJECTED" || item.newStatus === "SUSPENDED"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        {index < history.length - 1 && (
                          <div class="w-px h-full bg-gray-200 dark:bg-forest-700 mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div class="flex-1 pb-4">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="font-medium text-gray-900 dark:text-gray-100">
                              {actionLabels[item.action] || item.action}
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.previousStatus} →{" "}
                              <span class="font-medium">{item.newStatus}</span>
                            </p>
                          </div>
                          <p class="text-xs text-gray-500">
                            {item.createdAt.toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {item.reason && (
                          <div class="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p class="text-sm text-amber-800 dark:text-amber-400">
                              {item.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Empty State */}
              {history.length === 0 && (
                <div class="text-center py-12">
                  <p class="text-gray-600 dark:text-gray-400">
                    No verification history available
                  </p>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
