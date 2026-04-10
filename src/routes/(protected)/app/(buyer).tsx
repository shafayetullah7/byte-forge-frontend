import { ParentComponent } from "solid-js";
import { BuyerLayout } from "~/components/layout/dashboard/BuyerLayout";

const BuyerRouteLayout: ParentComponent = (props) => {
    return <BuyerLayout>{props.children}</BuyerLayout>;
};

export default BuyerRouteLayout;
