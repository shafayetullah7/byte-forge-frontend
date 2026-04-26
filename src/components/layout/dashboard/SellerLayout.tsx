import { ParentComponent, createMemo } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import {
    Squares2x2Icon,
    ShoppingBagIcon,
    CubeIcon,
    PlusIcon,
    FolderIcon,
    ClipboardListIcon,
    ClockIcon,
    CheckCircleIcon,
    DollarSignIcon,
    BankIcon,
    CogIcon,
    BoltIcon,
} from "~/components/icons";
import { useI18n } from "~/i18n";

export const SellerLayout: ParentComponent = (props) => {
    const { t, locale } = useI18n();

    const sidebarConfig = createMemo<SidebarConfig>(() => ({
        mode: "seller",
        brandColor: "terracotta",
        links: [
            // Dashboard and Overview
            {
                href: "/app/seller",
                icon: Squares2x2Icon,
                label: t("common.dashboard"),
            },
            // Shop Management
            {
                href: "/app/seller/my-shop",
                icon: ShoppingBagIcon,
                label: t("seller.myShop"),
            },
            {
                href: "/app/seller/verification",
                icon: BoltIcon,
                label: "Verification",
            },
            {
                href: "/app/seller/my-shop/history",
                icon: ClockIcon,
                label: t("seller.history"),
            },
            // Products
            {
                href: "/app/seller/products",
                icon: CubeIcon,
                label: t("seller.products.allProducts"),
            },
            {
                href: "/app/seller/products/new",
                icon: PlusIcon,
                label: t("seller.products.addProduct"),
            },
            {
                href: "/app/seller/products/categories",
                icon: FolderIcon,
                label: t("seller.products.categories"),
            },
            // Orders
            {
                href: "/app/seller/orders",
                icon: ClipboardListIcon,
                label: t("seller.orders.allOrders"),
            },
            {
                href: "/app/seller/orders?status=pending",
                icon: ClockIcon,
                label: t("seller.orders.pending"),
            },
            {
                href: "/app/seller/orders?status=delivered",
                icon: CheckCircleIcon,
                label: t("seller.orders.delivered"),
            },
            // Financial
            {
                href: "/app/seller/earnings",
                icon: DollarSignIcon,
                label: t("seller.earnings.balance"),
            },
            {
                href: "/app/seller/earnings/payouts",
                icon: BankIcon,
                label: t("seller.earnings.payouts"),
            },
            // Settings
            {
                href: "/app/seller/settings",
                icon: CogIcon,
                label: t("seller.settings.shopSettings"),
            },
        ],
    }));

    return <DashboardLayout sidebarConfig={sidebarConfig()}>{props.children}</DashboardLayout>;
};
