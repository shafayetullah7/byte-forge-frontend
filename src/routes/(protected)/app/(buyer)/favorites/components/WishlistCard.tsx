import { Component, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { HeartIcon, LeafIcon } from "~/components/icons";
import type { WishlistItem } from "~/lib/api/endpoints/buyer/wishlist.api";
import { formatPrice } from "~/routes/(app)/plants/constants";

export interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (variantId: string) => void;
  removing: boolean;
}

const WishlistCard: Component<WishlistCardProps> = (props) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const productHref = () =>
    props.item.product ? `/plants/${props.item.product.slug}` : null;

  const cardClass =
    "group flex flex-col bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 overflow-hidden hover:shadow-lg hover:border-forest-300 dark:hover:border-forest-600 transition-all duration-300";

  const cardBody = () => (
    <>
      <div class="relative aspect-[4/3] bg-cream-100 dark:bg-forest-900/50 overflow-hidden">
        <Show
          when={props.item.product?.thumbnail}
          fallback={
            <div class="w-full h-full flex items-center justify-center">
              <LeafIcon class="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
          }
        >
          {(thumbnail) => (
            <img
              src={thumbnail().url}
              alt={props.item.product?.name ?? ""}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}
        </Show>

        <Show when={props.item.variant}>
          {(variant) => (
            <div class="absolute bottom-3 left-3">
              <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/95 dark:bg-forest-900/95 backdrop-blur-sm shadow-sm text-sm font-bold text-forest-800 dark:text-cream-50">
                {formatPrice(variant().price)}
              </span>
            </div>
          )}
        </Show>

        <button
          type="button"
          class="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-forest-900/90 backdrop-blur-sm text-gray-500 hover:text-terracotta-600 dark:hover:text-terracotta-400 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all disabled:opacity-50 z-10"
          aria-label={t("buyer.favorites.remove")}
          disabled={props.removing}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const variantId = props.item.variant?.id;
            if (variantId) props.onRemove(variantId);
          }}
        >
          <HeartIcon class="w-5 h-5 fill-current" />
        </button>
      </div>

      <div class="flex flex-col flex-1 p-4">
        <Show when={props.item.shop}>
          {(shop) => (
            <span
              role="link"
              tabIndex={0}
              class="inline-flex items-center gap-2 text-xs text-forest-600 dark:text-forest-400 hover:underline mb-2 w-fit cursor-pointer relative z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/shops/${shop().slug}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/shops/${shop().slug}`);
                }
              }}
            >
              <Show
                when={shop().logo}
                fallback={
                  <span class="w-5 h-5 rounded-full bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center shrink-0 ring-1 ring-cream-200 dark:ring-forest-600">
                    <LeafIcon class="w-3 h-3 text-forest-500 dark:text-forest-400" />
                  </span>
                }
              >
                {(logo) => (
                  <img
                    src={logo().url}
                    alt=""
                    class="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-cream-200 dark:ring-forest-600"
                  />
                )}
              </Show>
              <span class="truncate">{shop().name}</span>
            </span>
          )}
        </Show>

        <Show when={props.item.product}>
          {(product) => (
            <p class="font-semibold text-forest-800 dark:text-cream-50 group-hover:text-forest-600 dark:group-hover:text-forest-300 transition-colors line-clamp-2">
              {product().name}
            </p>
          )}
        </Show>
      </div>
    </>
  );

  return (
    <Show
      when={productHref()}
      fallback={<article class={cardClass}>{cardBody()}</article>}
    >
      {(href) => (
        <A href={href()} class={cardClass}>
          {cardBody()}
        </A>
      )}
    </Show>
  );
};

export default WishlistCard;
