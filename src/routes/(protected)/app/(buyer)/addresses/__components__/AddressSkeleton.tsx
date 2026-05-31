import { Component } from "solid-js";

const AddressSkeleton: Component = () => {
    return (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map(() => (
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                            <div class="w-20 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                    <div class="space-y-2 mb-5">
                        <div class="w-32 h-5 rounded bg-gray-200 dark:bg-gray-700" />
                        <div class="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                        <div class="w-40 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                        <div class="w-36 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div class="h-10 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
            ))}
        </div>
    );
};

export default AddressSkeleton;
