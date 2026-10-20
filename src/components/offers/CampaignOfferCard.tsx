import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { ShopIcon, LeafIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import type { HomeCampaignItem } from "~/lib/public-shops/home-campaigns";
import { cloudinaryUrl } from "~/lib/media/cloudinary-url";

export function CampaignOfferCard(props: { item: HomeCampaignItem }) {
  const { t } = useI18n();
  const item = () => props.item;

  return (
    <A
      href={`/shops/${item().shopSlug}/campaigns/${item().campaign.slug}`}
      class="flat-card flat-card-hover overflow-hidden group block focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
    >
      <div class="relative h-40 overflow-hidden bg-cream-100 dark:bg-forest-900/50">
        <Show
          when={item().campaign.bannerUrl}
          fallback={
            <div class="w-full h-full flex items-center justify-center">
              <LeafIcon class="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
          }
        >
          <img
            src={cloudinaryUrl(item().campaign.bannerUrl, "card")}
            alt=""
            class="w-full h-full object-cover group-hover:scale-110 transition-standard duration-500"
            loading="lazy"
            decoding="async"
          />
        </Show>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <Show when={item().campaign.discountPercent}>
          {(percent) => (
            <div
              class="absolute top-3 left-3 bg-terracotta-500 text-white px-3 py-1.5 rounded-lg body-small font-bold shadow-sm"
            >
              {percent()}% {t("public.shops.detail.off")}
            </div>
          )}
        </Show>

        <div class="absolute bottom-3 left-3 right-3">
          <div class="flex items-center gap-1.5">
            <ShopIcon class="w-3.5 h-3.5 text-white/80" />
            <span class="body-small text-white font-medium truncate">{item().shopName}</span>
          </div>
        </div>
      </div>

      <div class="p-5">
        <h3 class="h6 mb-2 line-clamp-1">{item().campaign.title}</h3>
        <p class="body-small text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {item().campaign.description}
        </p>
        <p class="body-small text-gray-500 dark:text-gray-400">
          {t("landing.campaigns.endsOn", {
            date: new Date(item().campaign.endDate).toLocaleDateString(),
          })}
        </p>
      </div>
    </A>
  );
}
