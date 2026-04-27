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
            <div class="h-screen overflow-hidden flex flex-col bg-gray-50 dark:bg-forest-900">
                <TopbarContent />
                <div class="flex-1 flex overflow-hidden">
                    {props.children}
                </div>
            </div>
        </LayoutProvider>
    );
};
