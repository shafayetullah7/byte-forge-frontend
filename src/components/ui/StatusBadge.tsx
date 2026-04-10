import { Component, mergeProps } from "solid-js";
import { useI18n } from "~/i18n";

export type StatusType =
    | "pending"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "active"
    | "inactive"
    | "verified";

interface StatusBadgeProps {
    status: StatusType;
    label?: string; // Optional override
    class?: string;
}

export const StatusBadge: Component<StatusBadgeProps> = (inputProps) => {
    const props = mergeProps({ class: "" }, inputProps);
    const { t } = useI18n();

    const getStatusStyles = (status: StatusType) => {
        switch (status) {
            case "delivered":
            case "active":
            case "verified":
                // Success/Good -> Sage
                return "bg-sage-100 text-sage-800 dark:bg-sage-900/40 dark:text-sage-300 border-sage-200 dark:border-sage-800";
            case "shipped":
                // In Progress/Brand -> Forest
                return "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 border-forest-200 dark:border-forest-800";
            case "pending":
                // Waiting -> Cream/Amber (Cream is subtle, Amber is alert. Use Cream/Terracotta-light logic or distinct Amber for visibility)
                // Guide says Cream-200, but standard pending is usually yellow. Let's use Cream for "Idle" and Amber for "Pending".
                return "bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300 border-cream-300 dark:border-cream-700";
            case "cancelled":
            case "inactive":
                // Error/Stop -> Red (Standard)
                return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-forest-800 dark:text-gray-300 border-gray-200 dark:border-forest-700";
        }
    };

    const getLabel = () => {
        if (props.label) return props.label;

        // Try to find translation, fallback to capitalized status
        try {
            // Common status keys
            if (props.status === "verified") return t("buyer.profile.status.verified");
            if (props.status === "active") return t("buyer.profile.status.active");

            // Order status
            return t(`buyer.dashboard.orderStatus.${props.status}`);
        } catch {
            return props.status.charAt(0).toUpperCase() + props.status.slice(1);
        }
    };

    return (
        <span
            class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(props.status)} ${props.class}`}
        >
            <span class={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusStyles(props.status).replace('bg-', 'bg-current opacity-50 ')
                }`}></span>
            {getLabel()}
        </span>
    );
};
