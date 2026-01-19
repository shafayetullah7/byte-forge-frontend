import { ParentComponent } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import { Squares2x2Icon, ShoppingBagIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { useBusinessAccount } from "~/lib/context/business-account-context";

export const SellerLayout: ParentComponent = (props) => {
    const { t } = useI18n();
    const { businessAccount, isLoading } = useBusinessAccount();

    // Check if business account exists (not null and not undefined)
    const hasBusinessAccount = () => {
        const account = businessAccount();
        return account !== null && account !== undefined;
    };

    const sidebarConfig: SidebarConfig = {
        mode: "seller",
        brandColor: "terracotta",
        workspaceTitle: t("common.sellerWorkspace"),
        links: !isLoading() && hasBusinessAccount()
            ? [
                {
                    href: "/app/seller/shops",
                    icon: ShoppingBagIcon,
                    label: t("common.shops"),
                },
            ]
            : [
                {
                    href: "/app/seller/setup-business",
                    icon: Squares2x2Icon,
                    label: "Setup Business Account",
                },
            ],
    };

    return <DashboardLayout sidebarConfig={sidebarConfig}>{props.children}</DashboardLayout>;
};
