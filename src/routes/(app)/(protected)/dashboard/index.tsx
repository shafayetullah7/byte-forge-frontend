import { Component } from "solid-js";
import { useSession } from "~/lib/auth";

const Dashboard: Component = () => {
    const user = useSession();

    return (
        <div class="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full text-center space-y-8">
                <div>
                    <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Dashboard
                    </h2>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Welcome back, <span class="font-semibold text-forest-600 dark:text-sage-400">{user()?.userName}</span>!
                    </p>
                    <div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <p class="text-gray-500 dark:text-gray-300">
                            This is a protected area. You can only see this if you are logged in and verified.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
