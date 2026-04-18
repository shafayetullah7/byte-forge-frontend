import { createAsync, action, useAction, useSubmission } from "@solidjs/router";
import { Suspense, createSignal, createEffect, Show } from "solid-js";
import Card from "~/components/ui/Card";
import Badge from "~/components/ui/Badge";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { VerificationDocumentUploader } from "~/components/seller/VerificationDocumentUploader";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";

interface UpdateVerificationDto {
  tradeLicenseNumber?: string;
  tinNumber?: string;
  tradeLicenseDocumentId?: string;
  tinDocumentId?: string;
  utilityBillDocumentId?: string;
}

const submitVerificationAction = action(async (data: UpdateVerificationDto) => {
  "use server";
  try {
    await sellerShopApi.updateVerification(data);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Failed to submit verification documents",
        statusCode: error.statusCode,
        validationErrors: error.response?.validationErrors || error.validationErrors,
      },
    };
  }
}, "submit-verification");

export default function VerificationStatusPage() {
  const { t } = useI18n();
  const verificationData = createAsync(() => sellerShopApi.getVerificationStatus());
  const shopData = createAsync(() => sellerShopApi.getMyShop());
  const submitTrigger = useAction(submitVerificationAction);
  const submission = useSubmission(submitVerificationAction);

  const [showUploader, setShowUploader] = createSignal(false);

  createEffect(() => {
    const verification = verificationData();
    if (verification && (verification.status === "PENDING" || verification.status === "REJECTED")) {
      setShowUploader(true);
    } else if (verification && verification.status === "APPROVED") {
      setShowUploader(false);
    }
  });

  createEffect(() => {
    if (submission.result?.success === true && !submission.pending) {
      toaster.success(t("seller.shop.verification.submittedSuccessfully"));
      verificationData.refetch();
    } else if (submission.result?.success === false && submission.result?.error) {
      const errorData = submission.result.error;
      if (errorData.validationErrors && errorData.validationErrors.length > 0) {
        const errorMsg = errorData.validationErrors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join("\n");
        toaster.error(errorMsg);
      } else {
        toaster.error(errorData.message || t("seller.shop.verification.submissionFailed"));
      }
    }
  });

  const handleVerificationSubmit = async (data: UpdateVerificationDto) => {
    const result = await submitTrigger(data);
    return result;
  };

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="verification status" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-4xl mx-auto px-4">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("seller.shop.verification.pageTitle")}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {t("seller.shop.verification.pageSubtitle")}
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
                      {t("seller.shop.verification.noInformation")}
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

              const canSubmit = verification.status === "PENDING" || verification.status === "REJECTED";

              return (
                <div class="space-y-6">
                  <Card title={t("seller.shop.verification.currentStatus")}>
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {shop.translations?.find(t => t.locale === "en")?.name || t("seller.shop.myShop.noShopYet.title")}
                      </h3>
                      <Badge variant={statusColors[verification.status] || "default"}>
                        {verification.status}
                      </Badge>
                    </div>

                    {verification.rejectionReason && (
                      <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <h4 class="font-semibold text-red-800 dark:text-red-400 mb-2">
                          {t("seller.shop.verification.rejectionReason")}
                        </h4>
                        <p class="text-red-700 dark:text-red-300">
                          {verification.rejectionReason}
                        </p>
                      </div>
                    )}

                    {verification.verifiedAt && (
                      <div class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 class="font-semibold text-green-800 dark:text-green-400 mb-2">
                          {t("seller.shop.verification.verifiedAt")}
                        </h4>
                        <p class="text-green-700 dark:text-green-300">
                          {new Date(verification.verifiedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </Card>

                  <Show when={canSubmit && showUploader()}>
                    <Card title={t("seller.shop.verification.submitDocuments")}>
                      <Show when={!submission.pending} fallback={
                        <div class="py-12 flex flex-col items-center justify-center">
                          <svg class="animate-spin h-10 w-10 text-forest-500 mb-4" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <p class="text-gray-600 dark:text-gray-400">
                            {t("seller.shop.verification.submitting")}
                          </p>
                        </div>
                      }>
                        <VerificationDocumentUploader
                          initialData={{
                            tradeLicenseNumber: verification.tradeLicenseNumber,
                            tinNumber: verification.tinNumber,
                            tradeLicenseDocumentId: verification.tradeLicenseDocumentId,
                            tinDocumentId: verification.tinDocumentId,
                            utilityBillDocumentId: verification.utilityBillDocumentId,
                          }}
                          onSubmit={handleVerificationSubmit}
                          isLoading={submission.pending}
                        />
                      </Show>
                    </Card>
                  </Show>

                  <Card title={t("seller.shop.verification.timeline")}>
                    <div class="space-y-4">
                      <div class="flex gap-4">
                        <div class="flex flex-col items-center">
                          <div class="w-3 h-3 rounded-full bg-green-500" />
                          <div class="w-px h-full bg-gray-200 dark:bg-forest-700 mt-2" />
                        </div>
                        <div class="flex-1 pb-4">
                          <p class="font-medium text-gray-900 dark:text-gray-100">
                            {t("seller.shop.verification.submitted")}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(verification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {verification.updatedAt !== verification.createdAt && (
                        <div class="flex gap-4">
                          <div class="flex flex-col items-center">
                            <div class="w-3 h-3 rounded-full bg-blue-500" />
                          </div>
                          <div class="flex-1">
                            <p class="font-medium text-gray-900 dark:text-gray-100">
                              {t("seller.shop.verification.lastUpdated")}
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(verification.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {verification.verifiedAt && (
                        <div class="flex gap-4">
                          <div class="flex flex-col items-center">
                            <div class="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div class="flex-1">
                            <p class="font-medium text-gray-900 dark:text-gray-100">
                              {t("seller.shop.verification.verified")}
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(verification.verifiedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card title={t("seller.shop.verification.nextSteps")}>
                    <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      {verification.status === "PENDING" && (
                        <p>
                          {t("seller.shop.verification.pendingMessage")}
                        </p>
                      )}
                      {verification.status === "APPROVED" && (
                        <p>
                          {t("seller.shop.verification.approvedMessage")}
                        </p>
                      )}
                      {verification.status === "REJECTED" && (
                        <p>
                          {t("seller.shop.verification.rejectedMessage")}
                        </p>
                      )}
                      {verification.status === "SUSPENDED" && (
                        <p>
                          {t("seller.shop.verification.suspendedMessage")}
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
