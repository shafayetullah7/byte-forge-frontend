import { createEffect, Show } from "solid-js";
import {
  A,
  useParams,
  useSearchParams,
  useNavigate,
  createAsync,
  useAction,
  useSubmission,
  type RouteSectionProps,
  type RouteDefinition,
} from "@solidjs/router";
import { Title, Meta, Link } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { useI18n } from "~/i18n";
import { getShopBySlug } from "~/lib/public-shops/public-shop.service";
import type { PublicShopDetailSection } from "~/lib/types/public/shops.types";
import { ShopHero, ShopDetailNav } from "~/components/shops/public";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { config } from "~/lib/config";
import HreflangLinks from "~/components/seo/HreflangLinks";
import { absoluteUrl, formatPageTitle } from "~/lib/seo/meta";
import { toggleShopFollowAction } from "~/lib/api/endpoints/buyer/shop-follow.actions";
import { toaster } from "~/components/ui/Toast";
import { useSession } from "~/lib/auth/session";

const TAB_TO_SECTION: Record<string, PublicShopDetailSection> = {
  overview: "",
  products: "products",
  reviews: "reviews",
  campaigns: "campaigns",
  articles: "articles",
};

export const route = {
  preload: ({ params }) => getShopBySlug(params.slug as string),
} satisfies RouteDefinition;

export default function ShopDetailLayout(props: RouteSectionProps) {
  const params = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const slug = () => params.slug;

  const shop = createAsync(() => getShopBySlug(slug()), { deferStream: true });
  const session = useSession();

  const followTrigger = useAction(toggleShopFollowAction);
  const followSubmission = useSubmission(toggleShopFollowAction);

  createEffect(() => {
    const result = followSubmission.result;
    if (!result) return;
    if (result.success) {
      toaster.success(
        result.following ? t("public.shops.detail.followSuccess") : t("public.shops.detail.unfollowSuccess"),
      );
    } else if (result.error?.message) {
      toaster.error(result.error.message);
    }
  });

  const handleFollow = () => {
    const current = shop();
    if (!current || !config.followEnabled) return;
    if (!session()) {
      const returnTo = encodeURIComponent(`/shops/${slug()}`);
      navigate(`/login?returnTo=${returnTo}`);
      return;
    }
    followTrigger({ slug: slug(), follow: !current.isFollowedByViewer });
  };

  const handleShare = async () => {
    const url = absoluteUrl(`/shops/${slug()}`);
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: shop()?.name, url });
    } else if (typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(url);
      toaster.success(t("public.shops.detail.linkCopied"));
    }
  };

  createEffect(() => {
    const tab = searchParams.tab;
    if (!tab || typeof tab !== "string") return;
    const section = TAB_TO_SECTION[tab];
    if (section === undefined) return;
    const target = section === "" ? `/shops/${slug()}` : `/shops/${slug()}/${section}`;
    navigate(target, { replace: true });
  });

  const sections = (): Array<{ path: PublicShopDetailSection; label: string }> => {
    const base: Array<{ path: PublicShopDetailSection; label: string }> = [
      { path: "" as const, label: t("public.shops.detail.tabs.overview") },
      { path: "products" as const, label: t("public.shops.detail.tabs.products") },
      { path: "reviews" as const, label: t("public.shops.detail.tabs.reviews") },
    ];
    if (config.campaignsEnabled) {
      base.push({ path: "campaigns" as const, label: t("public.shops.detail.tabs.campaigns") });
    }
    if (config.articlesEnabled) {
      base.push({ path: "articles" as const, label: t("public.shops.detail.tabs.articles") });
    }
    return base;
  };

  const heroLabels = () => ({
    verified: t("public.shops.directory.verified"),
    active: t("public.shops.directory.active"),
    follow: t("public.shops.detail.follow"),
    share: t("public.shops.detail.share"),
    followSoon: t("public.shops.detail.followSoon"),
    following: t("public.shops.detail.following"),
    memberSince: t("public.shops.detail.memberSince"),
    products: t("public.shops.detail.productsKpi"),
    orders: t("public.shops.detail.ordersKpi"),
    rating: t("public.shops.detail.ratingKpi"),
    reviews: t("public.shops.detail.reviewsKpi"),
    followers: t("public.shops.detail.followersKpi"),
    deliverySuccess: t("public.shops.detail.deliverySuccess"),
    responseRate: t("public.shops.detail.responseRate"),
    campaigns: t("public.shops.detail.campaignsKpi"),
    campaignParticipants: t("public.shops.detail.campaignParticipantsKpi"),
    articles: t("public.shops.detail.articlesKpi"),
    shopAge: t("public.shops.detail.shopAge"),
    years: t("public.shops.detail.years"),
    satisfaction: t("public.shops.detail.satisfactionKpi"),
  });

  return (
    <SafeErrorBoundary
      fallback={(err, reset) => (
        <InlineErrorFallback error={err} reset={reset} label="shop detail" />
      )}
    >
      <Show
        when={shop() !== undefined && shop()}
        fallback={
          <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
            <div class="h-64 bg-cream-200 dark:bg-forest-800 animate-pulse" />
            <div class="max-w-7xl mx-auto px-4 py-8 space-y-4">
              <div class="h-8 w-64 bg-cream-200 dark:bg-forest-800 rounded animate-pulse" />
              <div class="h-32 bg-cream-200 dark:bg-forest-800 rounded animate-pulse" />
            </div>
          </div>
        }
      >
        {(shopData) => (
          <>
            <Title>{formatPageTitle(shopData().name)}</Title>
            <Meta name="description" content={shopData().tagline || shopData().description || ""} />
            <Meta property="og:title" content={formatPageTitle(shopData().name)} />
            <Meta property="og:description" content={shopData().tagline || shopData().description || ""} />
            <Link rel="canonical" href={absoluteUrl(`/shops/${slug()}`)} />
            <HreflangLinks path={`/shops/${slug()}`} />
            <Show when={shopData().banner?.url}>
              <Meta property="og:image" content={shopData().banner!.url} />
            </Show>

            <div class="min-h-screen bg-cream-50 dark:bg-forest-900 pb-16">
              <div class="max-w-7xl mx-auto px-4 pt-4">
                <A
                  href="/shops"
                  class="inline-flex items-center text-sm text-forest-600 dark:text-forest-400 hover:underline"
                >
                  ← {t("public.shops.directory.backToShops")}
                </A>
              </div>

              <ShopHero
                shop={shopData()}
                labels={heroLabels()}
                followEnabled={config.followEnabled}
                isFollowing={shopData().isFollowedByViewer ?? false}
                isFollowPending={followSubmission.pending}
                onFollow={handleFollow}
                onShare={handleShare}
              />
              <ShopDetailNav slug={slug()} sections={sections()} />

              <div class="max-w-7xl mx-auto px-4 py-8">
                {props.children}
              </div>
            </div>
          </>
        )}
      </Show>

      <Show when={shop() !== undefined && !shop()}>
        <HttpStatusCode code={404} />
        <Meta name="robots" content="noindex, nofollow" />
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center px-4">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
              {t("public.shops.directory.notFound")}
            </h1>
            <p class="text-gray-500 mt-2">{t("public.shops.directory.notFoundDescription")}</p>
            <A href="/shops" class="inline-block mt-4 text-forest-600 hover:underline">
              {t("public.shops.directory.backToShops")}
            </A>
          </div>
        </div>
      </Show>
    </SafeErrorBoundary>
  );
}
