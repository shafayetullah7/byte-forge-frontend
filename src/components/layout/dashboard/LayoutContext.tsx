import { createContext, createSignal, useContext, ParentComponent } from "solid-js";

interface LayoutContextType {
    sidebarOpen: () => boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType>();

export const LayoutProvider: ParentComponent = (props) => {
    const [sidebarOpen, setSidebarOpen] = createSignal(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen());

    return (
        <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
            {props.children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within LayoutProvider");
    }
    return context;
};
