import { createSignal, createContext, useContext, JSX, Component, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useSession } from "~/lib/auth";

export type UserRole = "buyer" | "seller";

interface RoleContextType {
    role: () => UserRole;
    isSeller: () => boolean;
    isBuyer: () => boolean;
    toggleRole: () => void;
    setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType>();

export const RoleProvider: Component<{ children: JSX.Element }> = (props) => {
    const [role, setRoleSignal] = createSignal<UserRole>("buyer");
    const user = useSession();
    const navigate = useNavigate(); // Added useNavigate hook

    // Load role from localStorage on mount
    onMount(() => {
        const savedRole = localStorage.getItem("byteforge_role") as UserRole;
        if (savedRole && (savedRole === "buyer" || savedRole === "seller")) {
            setRoleSignal(savedRole);
        }
    });

    const setRole = (newRole: UserRole) => {
        setRoleSignal(newRole);
        localStorage.setItem("byteforge_role", newRole);

        // Optional: Redirect or refresh data based on role change
        // For now we rely on reactive components to update
    };

    const toggleRole = () => {
        const newRole = role() === "buyer" ? "seller" : "buyer"; // Determine new role
        setRole(newRole); // Update role and localStorage

        // Navigate to appropriate route based on the new role
        if (newRole === "seller") {
            navigate("/app/seller/shops");
        } else {
            navigate("/app");
        }
    };

    const isSeller = () => role() === "seller";
    const isBuyer = () => role() === "buyer";

    return (
        <RoleContext.Provider value={{ role, isSeller, isBuyer, toggleRole, setRole }}>
            {props.children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
};
