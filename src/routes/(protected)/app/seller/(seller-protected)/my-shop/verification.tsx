import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";
import Card from "~/components/ui/Card";
import Badge from "~/components/ui/Badge";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export default function VerificationStatusPage() {
  const verificationData = createAsync(() => sellerShopApi.getVerificationStatus());
  const shopData = createAsync(() => sellerShopApi.getMyShop());

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="verification status" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verification Status
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Track your shop's verification progress
            </p>
          </div>

          <Suspense fallback={<div class="h-96 bg-cream-100 dark:bg-forest-800 animate-pulse rounded-2xl" />}>
            {(() => {
              const verification = verificationData();
              const shop = shopData();

              if (!verification || !shop) {
                return (
                  <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center shadow-lg">
                    <p class="text-gray-600 dark:text-gray-400">
                      No verification information available
                    </p>
                  </div>
                );
              }

              const statusColors: Record<string, "default" | "forest" | "sage" | "terracotta" | "cream"> = {
                PENDING: "sage",
                APPROVED: "forest",
                REJECTED: "terracotta",
                SUSPENDED: "terracotta",
              };

              return (
                <div class="space-y-6">
                  {/* Current Status */}
                  <Card title="Current Status">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {shop.translations?.find(t => t.locale === "en")?.name || "Your Shop"}
                      </h3>
                      <Badge variant={statusColors[verification.status] || "default"}>
                        {verification.status}
                      </Badge>
                    </div>

                    {verification.rejectionReason && (
                      <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <h4 class="font-semibold text-red-800 dark:text-red-400 mb-2">
                          Rejection Reason
                        </h4>
                        <p class="text-red-700 dark:text-red-300">
                          {verification.rejectionReason}
                        </p>
                      </div>
                    )}

                    {verification.verifiedAt && (
                      <div class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 class="font-semibold text-green-800 dark:text-green-400 mb-2">
                          Verified At
                        </h4>
                        <p class="text-green-700 dark:text-green-300">
                          {new Date(verification.verifiedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </Card>

                  {/* Timeline */}
                  <Card title="Verification Timeline">
                    <div class="space-y-4">
                      {/* Submitted */}
                      <div class="flex gap-4">
                        <div class="flex flex-col items-center">
                          <div class="w-3 h-3 rounded-full bg-green-500" />
                          <div class="w-px h-full bg-gray-200 dark:bg-forest-700 mt-2" />
                        </div>
                        <div class="flex-1 pb-4">
                          <p class="font-medium text-gray-900 dark:text-gray-100">
                            Shop Submitted
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(verification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Updated */}
                      {verification.updatedAt !== verification.createdAt && (
                        <div class="flex gap-4">
                          <div class="flex flex-col items-center">
                            <div class="w-3 h-3 rounded-full bg-blue-500" />
                          </div>
                          <div class="flex-1">
                            <p class="font-medium text-gray-900 dark:text-gray-100">
                              Last Updated
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(verification.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Verified */}
                      {verification.verifiedAt && (
                        <div class="flex gap-4">
                          <div class="flex flex-col items-center">
                            <div class="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div class="flex-1">
                            <p class="font-medium text-gray-900 dark:text-gray-100">
                              Verified
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(verification.verifiedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Next Steps */}
                  <Card title="Next Steps">
                    <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      {verification.status === "PENDING" && (
                        <p>
                          Your shop is under review. Admin will review within 48 hours.
                          You'll be notified once the review is complete.
                        </p>
                      )}
                      {verification.status === "APPROVED" && (
                        <p>
                          Congratulations! Your shop has been approved. You can now activate
                          it to make it visible to customers.
                        </p>
                      )}
                      {verification.status === "REJECTED" && (
                        <p>
                          Your shop was rejected. Please review the rejection reason above,
                          make the necessary changes, and resubmit for verification.
                        </p>
                      )}
                      {verification.status === "SUSPENDED" && (
                        <p>
                          Your shop has been suspended. Please contact admin for assistance
                          and to resolve the suspension.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })()}
          </Suspense>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
