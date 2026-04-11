import { useParams, A } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Button } from "~/components/ui/Button";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

// Placeholder data - replace with actual API call
const mockProducts = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    nameBn: "মনস্টেরা ডেলিসিওসা",
    basePrice: "1500",
    slug: "monstera-deliciosa",
    images: [{ url: "/placeholder.jpg", isPrimary: true }],
  },
  {
    id: "2",
    name: "Snake Plant",
    nameBn: "স্নেক প্ল্যান্ট",
    basePrice: "800",
    slug: "snake-plant",
    images: [{ url: "/placeholder.jpg", isPrimary: true }],
  },
];

export default function ShopProductsPage() {
  const params = useParams();
  const products = mockProducts; // Replace with actual API call

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="shop products" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div class="mb-8">
            <A href={`/shops/${params.shop_id}`} class="text-green-600 dark:text-sage-400 hover:underline mb-4 block">
              ← Back to Shop
            </A>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Shop Products
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Browse all products from this shop
            </p>
          </div>

          <Suspense fallback={<div class="h-96 bg-cream-100 dark:bg-forest-800 animate-pulse rounded-2xl" />}>
            {/* Products Grid */}
            {products.length === 0 ? (
              <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center">
                <p class="text-gray-600 dark:text-gray-400">
                  No products available from this shop yet
                </p>
              </div>
            ) : (
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <A href={`/plants/${product.slug}`}>
                    <div class="bg-white dark:bg-forest-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      {/* Product Image */}
                      <div class="h-48 bg-gradient-to-br from-green-400 to-blue-400 dark:from-forest-600 dark:to-sage-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>

                      {/* Product Info */}
                      <div class="p-4">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {product.name}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {product.nameBn}
                        </p>
                        <div class="flex items-center justify-between">
                          <p class="text-xl font-bold text-green-600 dark:text-sage-400">
                            ৳{product.basePrice}
                          </p>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </A>
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
