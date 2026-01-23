import { ParentComponent } from "solid-js";
import { SellerLayout } from "~/components/layout/dashboard/SellerLayout";

const SellerRouteLayout: ParentComponent = (props) => {
    return <SellerLayout>{props.children}</SellerLayout>;
};

export default SellerRouteLayout;
