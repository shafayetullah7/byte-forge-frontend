import { Component } from "solid-js";

const Settings: Component = () => {
    return (
        <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
            <div class="bg-white dark:bg-forest-800 shadow rounded-lg p-6 border border-gray-200 dark:border-forest-700">
                <p class="text-gray-600 dark:text-gray-300">
                    Settings configuration will appear here.
                </p>
            </div>
        </div>
    );
};

export default Settings;
