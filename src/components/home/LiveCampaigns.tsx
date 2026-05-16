import { A } from "@solidjs/router";
import { createSignal, onCleanup, onMount } from "solid-js";
import { SparklesIcon, TagIcon, ClockIcon, ShopIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

const campaigns = [
  {
    id: 1,
    shopName: "Green Haven Nursery",
    shopSlug: "green-haven",
    title: "Monsoon Special — 30% Off",
    description: "Get 30% off on all indoor plants. Limited stock available!",
    discount: "30% OFF",
    type: "flash",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b30b77?w=500&h=300&fit=crop",
    endsIn: "2d 14h 30m",
    code: "MONSOON30",
  },
  {
    id: 2,
    shopName: "Sylhet Plant House",
    shopSlug: "sylhet-plant-house",
    title: "Rare Plant Week",
    description: "Exclusive collection of rare Philodendrons and Monsteras",
    discount: "NEW ARRIVAL",
    type: "collection",
    image: "https://images.unsplash.com/photo-1463320726281-696a4859787d?w=500&h=300&fit=crop",
    endsIn: "5d 0h 0m",
    code: null,
  },
  {
    id: 3,
    shopName: "Chittagong Cacti Co.",
    shopSlug: "ctg-cacti",
    title: "Succulents Buy 2 Get 1 Free",
    description: "Mix and match any succulents — pay for 2, get 3rd free",
    discount: "B2G1 FREE",
    type: "deal",
    image: "https://images.unsplash.com/photo-1509423350716-97f936044a00?w=500&h=300&fit=crop",
    endsIn: "1d 8h 15m",
    code: "B2G1SUCC",
  },
  {
    id: 4,
    shopName: "Dhaka Garden Center",
    shopSlug: "dhaka-garden",
    title: "Free Delivery on Orders Over ৳1000",
    description: "Free nationwide shipping on all orders above ৳1000",
    discount: "FREE DELIVERY",
    type: "shipping",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop",
    endsIn: "Ongoing",
    code: null,
  },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  flash: { bg: "bg-terracotta-500", text: "text-white" },
  collection: { bg: "bg-forest-500", text: "text-white" },
  deal: { bg: "bg-sage-500", text: "text-white" },
  shipping: { bg: "bg-cream-500", text: "text-forest-900" },
};

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = createSignal(endTime);

  onMount(() => {
    const interval = setInterval(() => {
      // Static for now — in production this would calculate from a real end date
      setTimeLeft(endTime);
    }, 60000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="flex items-center gap-1.5">
      <ClockIcon class="w-3.5 h-3.5 text-gray-400" />
      <span class="body-small text-gray-500 dark:text-gray-400 font-mono">{timeLeft()}</span>
    </div>
  );
}

export function LiveCampaigns() {
  const { t } = useI18n();

  return (
    <section class="py-20 px-4 bg-cream-50 dark:bg-forest-950">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <SparklesIcon class="w-5 h-5 text-terracotta-500" />
              <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
                {t("landing.campaigns.label")}
              </span>
            </div>
            <h2 class="h2 mb-0">{t("landing.campaigns.title")}</h2>
          </div>
          <A
            href="/shops"
            class="body-small text-forest-600 dark:text-forest-400 font-semibold hover:underline mt-4 sm:mt-0"
          >
            {t("landing.campaigns.viewAll")} →
          </A>
        </div>

        {/* Campaign Cards */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {campaigns.map((campaign) => {
            const colors = typeColors[campaign.type];

            return (
              <div class="flat-card flat-card-hover overflow-hidden group">
                {/* Image */}
                <div class="relative h-40 overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    class="w-full h-full object-cover group-hover:scale-110 transition-standard duration-500"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Discount Badge */}
                  <div class={`absolute top-3 left-3 ${colors.bg} ${colors.text} px-3 py-1.5 rounded-lg body-small font-bold shadow-sm`}>
                    {campaign.discount}
                  </div>

                  {/* Shop Name */}
                  <div class="absolute bottom-3 left-3 right-3">
                    <div class="flex items-center gap-1.5">
                      <ShopIcon class="w-3.5 h-3.5 text-white/80" />
                      <span class="body-small text-white font-medium truncate">{campaign.shopName}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div class="p-5">
                  <h3 class="h6 mb-2 line-clamp-1">{campaign.title}</h3>
                  <p class="body-small text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  <div class="flex items-center justify-between">
                    <CountdownTimer endTime={campaign.endsIn} />

                    {campaign.code && (
                      <div class="flex items-center gap-1.5">
                        <TagIcon class="w-3.5 h-3.5 text-gray-400" />
                        <span class="body-small font-mono font-bold text-forest-600 dark:text-forest-400 bg-forest-50 dark:bg-forest-800 px-2 py-0.5 rounded">
                          {campaign.code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
