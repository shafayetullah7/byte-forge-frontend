import { Component, JSX, Show, createSignal } from "solid-js";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useSession } from "~/lib/auth";

export const DashboardLayout: Component<{ children: JSX.Element }> = (props) => {
    const [sidebarOpen, setSidebarOpen] = createSignal(false);

    return (
        <div class="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Sidebar - Hidden on mobile, controlled by toggle */}
            <Sidebar
                isOpen={sidebarOpen()}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Wrapper */}
            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Scrollable Main Content */}
                <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    <div class="max-w-7xl mx-auto w-full">
                        {props.children}
                    </div>
                </main>
            </div>
        </div>
    );
};
