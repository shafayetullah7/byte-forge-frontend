import type { Component } from "solid-js";
import type { PublicShopTrustMetrics } from "~/lib/types/public/shops.types";
import { KpiCard } from "./KpiCard";

export const ShopTrustSnapshot: Component<{
  metrics: PublicShopTrustMetrics;
  labels: Record<string, string>;
}> = (props) => {
  const m = () => props.metrics;
  const l = () => props.labels;
  const yearsActive = () => {
    const since = new Date(m().memberSince);
    const years = Math.max(1, Math.floor((Date.now() - since.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));
    return years;
  };

  return (
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      <KpiCard label={l().products} value={m().totalProducts} />
      <KpiCard label={l().orders} value={m().completedOrders.toLocaleString()} />
      <KpiCard label={l().rating} value={m().averageRating.toFixed(1)} suffix={`/ 5`} />
      <KpiCard label={l().reviews} value={m().reviewCount.toLocaleString()} />
      <KpiCard label={l().followers} value={m().followerCount.toLocaleString()} />
      <KpiCard label={l().deliverySuccess} value={`${m().deliverySuccessRate}%`} />
      <KpiCard label={l().responseRate} value={`${m().responseRate}%`} />
      <KpiCard label={l().campaigns} value={m().campaignsRun} />
      <KpiCard label={l().campaignParticipants} value={m().campaignParticipants.toLocaleString()} />
      <KpiCard label={l().articles} value={m().blogCount} />
      <KpiCard label={l().shopAge} value={yearsActive()} suffix={l().years} />
      <KpiCard label={l().satisfaction} value={m().buyerSatisfactionScore.toFixed(1)} suffix="/ 5" />
    </div>
  );
};
