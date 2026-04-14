import { ParentComponent } from "solid-js";
import { TopbarLayout } from "~/components/layout/dashboard/TopbarLayout";

const SellerRouteLayout: ParentComponent = (props) => {
    return (
        <TopbarLayout>
            {props.children}
        </TopbarLayout>
    );
};

export default SellerRouteLayout;
