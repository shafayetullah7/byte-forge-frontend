import { A } from "@solidjs/router";
import type { ShopMedia } from "~/lib/api/endpoints/seller-shop.api";

interface ShopHeaderProps {
  logo: ShopMedia | null;
  banner: ShopMedia | null;
  slug: string;
  onEdit?: () => void;
}

export default function ShopHeader(props: ShopHeaderProps) {
  const copyUrl = () => {
    const url = `${window.location.origin}/shop/${props.slug}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div class="mb-8">
      {/* Banner with Gradient Overlay */}
      <div class="relative h-56 md:h-72 rounded-2xl overflow-hidden mb-8 group">
        {props.banner ? (
          <>
            <img
              src={props.banner.url}
              alt="Shop Banner"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div class="absolute inset-0 bg-gradient-to-br from-terracotta-500 via-terracotta-600 to-forest-700">
            <div class="absolute inset-0 opacity-10">
              <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div class="flex items-center justify-center h-full">
              <div class="text-center px-4">
                <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-white/90 text-lg font-medium">Add Your Shop Banner</p>
                <p class="text-white/70 text-sm mt-1">Showcase your brand to customers</p>
              </div>
            </div>
          </div>
        )}

        {/* Floating Edit Button */}
        <button 
          onClick={props.onEdit}
          class="absolute top-4 right-4 px-4 py-2 bg-white/90 dark:bg-forest-900/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-forest-800 transition-all shadow-lg hover:shadow-xl"
        >
          <svg class="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Banner
        </button>
      </div>

      {/* Logo and Info */}
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 relative z-10">
        <div class="flex items-end gap-5">
          {/* Logo with Ring */}
          <div class="relative">
            <div class="w-28 h-28 rounded-2xl overflow-hidden bg-white dark:bg-forest-800 shadow-xl border-4 border-white dark:border-forest-700">
              {props.logo ? (
                <img
                  src={props.logo.url}
                  alt="Shop Logo"
                  class="w-full h-full object-cover"
                />
              ) : (
                <div class="flex items-center justify-center h-full bg-gradient-to-br from-terracotta-100 to-forest-100 dark:from-terracotta-900/30 dark:to-forest-900/30">
                  <svg class="w-12 h-12 text-terracotta-500 dark:text-terracotta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>
            <button 
              onClick={props.onEdit}
              class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-lg flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732a1.5 1.5 0 013.536 0z" />
              </svg>
            </button>
          </div>

          <div class="pb-2">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span class="font-mono truncate max-w-[200px] sm:max-w-md">byteforge.com/shop/{props.slug}</span>
              <button 
                onClick={copyUrl} 
                class="p-1.5 hover:text-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 rounded-lg transition-all" 
                title="Copy URL"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
