import { Meta } from "@solidjs/meta";
import { Navigate, useParams } from "@solidjs/router";

/** Phase C — gated; redirect direct URL visits to shop overview. */
export default function ShopCampaignsPage() {
  const params = useParams<{ slug: string }>();
  return (
    <>
      <Meta name="robots" content="noindex, nofollow" />
      <Navigate href={`/shops/${params.slug}`} />
    </>
  );
}
