import { Button } from "~/components/ui";

export default function PlantsPage() {
  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-5xl font-bold text-gradient-brand mb-4">Our Plants</h1>
        <p class="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Discover our collection of beautiful plants
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for plant cards */}
          <div class="bg-white dark:bg-forest-800 rounded-xl p-6 shadow-lg">
            <div class="h-48 bg-gray-200 dark:bg-forest-700 rounded-lg mb-4"></div>
            <h3 class="text-xl font-semibold text-forest-700 dark:text-sage-300 mb-2">
              Plant Name
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Beautiful plant description
            </p>
            <Button variant="primary">View Details</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
