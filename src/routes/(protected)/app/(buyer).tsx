import { ParentComponent } from "solid-js";
import { TopbarLayout } from "~/components/layout/dashboard/TopbarLayout";
import { BuyerLayout } from "~/components/layout/dashboard/BuyerLayout";

const BuyerRouteLayout: ParentComponent = (props) => {
    return (
        <TopbarLayout>
            <BuyerLayout>{props.children}</BuyerLayout>
        </TopbarLayout>
    );
};

export default BuyerRouteLayout;
