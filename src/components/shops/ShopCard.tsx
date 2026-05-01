import type { PublicShop } from "~/lib/api/endpoints/public/shops.api";

interface ShopCardProps {
  shop: PublicShop;
}

export function ShopCard(props: ShopCardProps) {
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group h-full">
      {/* Banner */}
      <div class="h-40 bg-gradient-to-r from-green-400 to-blue-400 dark:from-forest-600 dark:to-sage-600 overflow-hidden">
        {props.shop.banner?.url ? (
          <img
            src={props.shop.banner.url}
            alt={props.shop.name}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div class="w-full h-full flex items-center justify-center text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div class="p-6">
        {/* Shop Name */}
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {props.shop.name}
        </h3>

        {/* Description */}
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {props.shop.description}
        </p>

        {/* Location */}
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {props.shop.city}, {props.shop.division}
        </div>

        {/* Business Hours */}
        {props.shop.businessHours && (
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {props.shop.businessHours}
          </div>
        )}

        {/* Logo */}
        {props.shop.logo?.url && (
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-forest-700">
            <img
              src={props.shop.logo.url}
              alt={`${props.shop.name} logo`}
              class="h-12 w-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
