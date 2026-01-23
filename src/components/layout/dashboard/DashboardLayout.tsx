import { Component, JSX, createSignal } from "solid-js";
import { Sidebar, SidebarConfig } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
    children: JSX.Element;
    sidebarConfig: SidebarConfig;
}

export const DashboardLayout: Component<DashboardLayoutProps> = (props) => {
    const [sidebarOpen, setSidebarOpen] = createSignal(false);

    return (
        <div class="h-screen flex overflow-hidden bg-gray-50 dark:bg-forest-900">
            <Sidebar
                isOpen={sidebarOpen()}
                onClose={() => setSidebarOpen(false)}
                config={props.sidebarConfig}
            />

            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    <div class="max-w-7xl mx-auto w-full">{props.children}</div>
                </main>
            </div>
        </div>
    );
};
