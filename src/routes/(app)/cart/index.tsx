import { A } from "@solidjs/router";
import { useCart } from "~/lib/context/cart-context";
import { Button } from "~/components/ui/Button";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="cart" />
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Shopping Cart
          </h1>

          {isLoading ? (
            <div class="bg-white dark:bg-forest-800 rounded-2xl p-8 shadow-lg animate-pulse">
              <div class="h-32 bg-gray-200 dark:bg-forest-700 rounded-xl"></div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div class="bg-white dark:bg-forest-800 rounded-2xl p-12 text-center shadow-lg">
              <div class="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Your cart is empty
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Add some plants to get started!
              </p>
              <A href="/plants">
                <Button variant="primary" size="lg">
                  Browse Plants
                </Button>
              </A>
            </div>
          ) : (
            <div class="space-y-6">
              {/* Cart Items */}
              <div class="bg-white dark:bg-forest-800 rounded-2xl shadow-lg overflow-hidden">
                <div class="divide-y divide-gray-100 dark:divide-forest-700">
                  {cart.items.map((item) => (
                    <div class="p-6 flex gap-6">
                      {/* Product Image Placeholder */}
                      <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>

                      {/* Product Info */}
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {item.plant.name}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Shop: {item.shop?.slug || 'Unknown'}
                        </p>

                        {/* Quantity Controls */}
                        <div class="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span class="w-12 text-center text-gray-900 dark:text-gray-100">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            class="ml-auto"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 shadow-lg">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Total Items
                  </span>
                  <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {cart.totalItems}
                  </span>
                </div>

                <div class="border-t border-gray-200 dark:border-forest-700 pt-4">
                  <A href="/checkout">
                    <Button variant="primary" size="lg" class="w-full">
                      Proceed to Checkout
                    </Button>
                  </A>
                </div>

                <div class="mt-4 text-center">
                  <A href="/plants" class="text-green-600 dark:text-sage-400 hover:underline text-sm">
                    Continue Shopping
                  </A>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SafeErrorBoundary>
  );
}
