import { createAsync, A } from "@solidjs/router";
import { Suspense, createMemo } from "solid-js";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Badge from "~/components/ui/Badge";
import { sellerShopApi } from "~/lib/api/endpoints/seller-shop.api";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export default function MyShopPage() {
  const shopData = createAsync(() => sellerShopApi.getMyShop());
  const verificationData = createAsync(() => sellerShopApi.getVerificationStatus());

  const statusConfig = createMemo(() => {
    const status = verificationData()?.status || shopData()?.status;
    
    const configs: Record<string, { color: "default" | "forest" | "sage" | "terracotta" | "cream"; label: string; description: string }> = {
      DRAFT: {
        color: "default",
        label: "Draft",
        description: "Shop not yet submitted for verification",
      },
      PENDING_VERIFICATION: {
        color: "sage",
        label: "Pending Verification",
        description: "Submitted for admin review",
      },
      APPROVED: {
        color: "forest",
        label: "Approved",
        description: "Ready to activate",
      },
      ACTIVE: {
        color: "forest",
        label: "Active",
        description: "Live and visible to customers",
      },
      REJECTED: {
        color: "terracotta",
        label: "Rejected",
        description: verificationData()?.rejectionReason || "Needs changes",
      },
      SUSPENDED: {
        color: "terracotta",
        label: "Suspended",
        description: "Contact admin for assistance",
      },
    };

    return configs[status || "DRAFT"];
  });

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="my shop" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                My Shop
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Manage your shop information and view verification status
              </p>
            </div>
            <div class="flex gap-3">
              <A href="/seller/my-shop/edit">
                <Button variant="outline" size="md">
                  Edit Shop
                </Button>
              </A>
              <A href="/seller/my-shop/verification">
                <Button variant="outline" size="md">
                  Verification Status
                </Button>
              </A>
            </div>
          </div>

          <Suspense fallback={<div class="h-96 bg-cream-100 dark:bg-forest-800 animate-pulse rounded-2xl" />}>
            {(() => {
              const shop = shopData();
              const verification = verificationData();

              if (!shop) {
                return (
                  <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center shadow-lg">
                    <div class="text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Shop Yet
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                      Create your first shop to start selling
                    </p>
                    <A href="/seller/setup-shop">
                      <Button variant="primary" size="lg">
                        Create Shop
                      </Button>
                    </A>
                  </div>
                );
              }

              return (
                <div class="space-y-6">
                  {/* Status Card */}
                  <Card title="Shop Status">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {shop.translations?.find(t => t.locale === "en")?.name || "Unnamed Shop"}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {shop.translations?.find(t => t.locale === "bn")?.name}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">
                          Slug: {shop.slug}
                        </p>
                      </div>
                      <Badge variant={statusConfig().color}>
                        {statusConfig().label}
                      </Badge>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      {statusConfig().description}
                    </p>
                  </Card>

                  {/* Shop Info */}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* English Info */}
                    <Card title="English (EN)">
                      <div class="space-y-3">
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">
                            Shop Name
                          </label>
                          <p class="text-gray-900 dark:text-gray-100">
                            {shop.translations?.find(t => t.locale === "en")?.name}
                          </p>
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">
                            Description
                          </label>
                          <p class="text-gray-700 dark:text-gray-300">
                            {shop.translations?.find(t => t.locale === "en")?.description}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Bengali Info */}
                    <Card title="Bengali (BN)">
                      <div class="space-y-3">
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">
                            Shop Name
                          </label>
                          <p class="text-gray-900 dark:text-gray-100">
                            {shop.translations?.find(t => t.locale === "bn")?.name}
                          </p>
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-500 uppercase">
                            Description
                          </label>
                          <p class="text-gray-700 dark:text-gray-300">
                            {shop.translations?.find(t => t.locale === "bn")?.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Address & Contact */}
                  <Card title="Address & Contact">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Address
                        </h4>
                        <p class="text-gray-700 dark:text-gray-300">
                          {shop.address}
                        </p>
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Created
                        </h4>
                        <p class="text-gray-700 dark:text-gray-300">
                          {new Date(shop.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card title="Quick Actions">
                    <div class="flex flex-wrap gap-3">
                      <A href="/seller/my-shop/edit">
                        <Button variant="outline" size="md">
                          Edit Shop Info
                        </Button>
                      </A>
                      <A href="/seller/my-shop/verification">
                        <Button variant="outline" size="md">
                          View Verification
                        </Button>
                      </A>
                      {shop.status === "APPROVED" && (
                        <Button variant="primary" size="md">
                          Activate Shop
                        </Button>
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
