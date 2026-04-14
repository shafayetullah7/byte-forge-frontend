import { ParentComponent } from "solid-js";
import { Topbar } from "./Topbar";
import { LayoutProvider, useLayout } from "./LayoutContext";

const TopbarContent: ParentComponent = (props) => {
    const { toggleSidebar } = useLayout();
    
    return (
        <Topbar onMenuClick={toggleSidebar} />
    );
};

export const TopbarLayout: ParentComponent = (props) => {
    return (
        <LayoutProvider>
            <div class="min-h-screen bg-gray-50 dark:bg-forest-900">
                <TopbarContent />
                <main class="w-full">
                    {props.children}
                </main>
            </div>
        </LayoutProvider>
    );
};
