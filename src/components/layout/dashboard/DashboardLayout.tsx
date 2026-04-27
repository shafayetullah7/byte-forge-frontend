import { Component, JSX } from "solid-js";
import { Sidebar, SidebarConfig } from "./Sidebar";
import { useLayout } from "./LayoutContext";

interface DashboardLayoutProps {
    children: JSX.Element;
    sidebarConfig: SidebarConfig;
}

export const DashboardLayout: Component<DashboardLayoutProps> = (props) => {
    const { sidebarOpen, setSidebarOpen } = useLayout();

    return (
        <div class="flex flex-1 overflow-hidden">
            <Sidebar
                isOpen={sidebarOpen()}
                onClose={() => setSidebarOpen(false)}
                config={props.sidebarConfig}
            />

            <main class="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div class="max-w-screen-2xl mx-auto w-full">{props.children}</div>
            </main>
        </div>
    );
};
