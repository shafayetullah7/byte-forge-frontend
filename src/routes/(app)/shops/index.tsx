import { Button } from "~/components/ui";

export default function ShopsPage() {
  return (
    <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-5xl font-bold text-gradient-brand mb-4">Our Shops</h1>
        <p class="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Find plant shops near you
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder for shop cards */}
          <div class="bg-white dark:bg-forest-800 rounded-xl p-6 shadow-lg">
            <h3 class="text-xl font-semibold text-forest-700 dark:text-sage-300 mb-2">
              Shop Name
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              123 Green Street, Plant City
            </p>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Open: Mon-Sat 9AM-6PM
            </p>
            <Button variant="outline">Visit Shop</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
