export default function SellerDashboard() {
    return (
        <div class="p-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Seller Dashboard
            </h1>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Sales</h3>
                    <p class="text-3xl font-bold text-terracotta-600 dark:text-terracotta-400">$0.00</p>
                </div>
                <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Shops</h3>
                    <p class="text-3xl font-bold text-terracotta-600 dark:text-terracotta-400">0</p>
                </div>
                <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pending Orders</h3>
                    <p class="text-3xl font-bold text-terracotta-600 dark:text-terracotta-400">0</p>
                </div>
            </div>
        </div>
    );
}
