import { For, Show, createSignal, Suspense, ErrorBoundary, createMemo, createEffect } from "solid-js";
import { A, createAsync, useParams, action, useAction, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Title, Meta, Link } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { useI18n } from "~/i18n";
import type { PublicPlantVariant } from "~/lib/api/types/public/plants.types";
import {
  LeafIcon,
  SunIcon,
  DropletIcon,
  CloudIcon,
  ThermometerIcon,
  SproutIcon,
  RulerIcon,
  TagIcon,
  HeartIcon,
  ShareIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ScissorsIcon,
  BeakerIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  ClockIcon,
  GlobeAltIcon,
} from "~/components/icons";
import { Button } from "~/components/ui";
import { toaster } from "~/components/ui/Toast";
import { formatPrice, getDifficultyLabel, getDifficultyColor, lightLabel, wateringLabel } from "../constants";
import { getPublicPlantReviews } from "~/lib/api/endpoints/public/reviews.api";
import { getPlantBySlug } from "~/lib/public-plants/public-plant.service";
import { cartApi, invalidateAllCart } from "~/lib/api/endpoints/buyer/cart.api";
import HreflangLinks from "~/components/seo/HreflangLinks";
import { absoluteUrl, formatPageTitle } from "~/lib/seo/meta";
import {
  ImageGallery,
  CareBadge,
  VariantCard,
  VariantDetail,
  CareInstructionCard,
  DetailRow,
  Breadcrumb,
  ReviewsSection,
} from "./components";

export const route = {
  preload: ({ params }) => getPlantBySlug(params.slug as string),
} satisfies RouteDefinition;

const addToCartAction = action(async (data: { variantId: string; quantity: number }) => {
  "use server";
  try {
    await cartApi.add(data);
    return { success: true };
  } catch (error) {
    const apiError = error as any;
    return {
      success: false,
      error: { message: apiError.message || "Failed to add to cart" },
    };
  }
}, "add-to-cart-action");

export default function PlantDetailPage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const plant = createAsync(() => getPlantBySlug(params.slug));
  const reviewData = createAsync(() => getPublicPlantReviews(params.slug));
  const [selectedVariant, setSelectedVariant] = createSignal<string | undefined>(undefined);
  const [quantity, setQuantity] = createSignal(1);

  const addToCartTrigger = useAction(addToCartAction);
  const addToCartSubmission = useSubmission(addToCartAction);

  createEffect(() => {
    if (addToCartSubmission.result?.success === true) {
      toaster.success(t("public.plants.detail.addedToCart"));
      invalidateAllCart();
    } else if (addToCartSubmission.result?.success === false) {
      toaster.error(addToCartSubmission.result.error?.message ?? t("common.error"));
    }
  });

  const selectedVariantData = createMemo<PublicPlantVariant | null>(() => {
    const p = plant();
    if (!p) return null;
    const fallbackId = p.variants.find((v) => v.isBase)?.id ?? p.variants[0]?.id;
    const baseId = selectedVariant() || fallbackId;
    return p.variants.find((v) => v.id === baseId) || null;
  });

  const displayMedia = createMemo(() => {
    const variant = selectedVariantData();
    if (variant && variant.media.length > 0) return variant.media;
    return plant()?.media ?? [];
  });

  const mediaKey = createMemo(() => {
    const variant = selectedVariantData();
    if (variant && variant.media.length > 0) {
      return `variant-${variant.id}`;
    }
    return "plant-base";
  });

  const careBadges = createMemo(() => {
    const p = plant();
    if (!p) return [];
    return [
      {
        icon: SparklesIcon,
        title: t("public.plants.detail.careDifficulty"),
        value: getDifficultyLabel(p.careDifficulty, t) || "—",
        color: "text-white",
        bgColor: getDifficultyColor(p.careDifficulty) || "bg-gray-500",
      },
      {
        icon: SunIcon,
        title: t("public.plants.detail.light"),
        value: lightLabel(p.lightRequirement, t) || "—",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
      },
      {
        icon: DropletIcon,
        title: t("public.plants.detail.watering"),
        value: wateringLabel(p.wateringFrequency, t) || "—",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        icon: CloudIcon,
        title: t("public.plants.detail.humidity"),
        value: p.humidityLevel ? t(`public.plants.humidityOptions.${p.humidityLevel.toLowerCase()}`) : "—",
        color: "text-sky-600 dark:text-sky-400",
        bgColor: "bg-sky-100 dark:bg-sky-900/30",
      },
    ];
  });

  const formattedDate = createMemo(() => {
    const p = plant();
    if (!p) return "";
    return new Date(p.updatedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  });

  const plantPrice = createMemo(() => selectedVariantData()?.price ?? plant()?.price ?? "0");

  const pageTitle = createMemo(() => {
    const p = plant();
    if (!p) return formatPageTitle(t("public.plants.detail.pageTitle"));
    return formatPageTitle(p.seo?.metaTitle || p.name);
  });

  const pageDescription = createMemo(() => {
    const p = plant();
    if (!p) return t("public.plants.detail.metaDescription");
    return p.seo?.metaDescription || p.shortDescription || p.description || t("public.plants.detail.metaDescription");
  });

  const primaryImage = createMemo(() => {
    const p = plant();
    if (!p) return undefined;
    return displayMedia()[0]?.url || p.thumbnail?.url || undefined;
  });

  const productJsonLd = createMemo(() => {
    const p = plant();
    if (!p) return null;

    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: pageDescription(),
      image: primaryImage(),
      offers: {
        "@type": "Offer",
        price: plantPrice(),
        priceCurrency: "BDT",
        availability: p.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: absoluteUrl(`/plants/${p.slug}`),
      },
    };

    const summary = reviewData()?.summary;
    if (summary && summary.total > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: summary.average,
        reviewCount: summary.total,
      };
    }

    return JSON.stringify(schema);
  });

  const breadcrumbJsonLd = createMemo(() => {
    const p = plant();
    if (!p) return null;

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("common.home"),
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("common.plants"),
          item: absoluteUrl("/plants"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: p.name,
          item: absoluteUrl(`/plants/${p.slug}`),
        },
      ],
    });
  });

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center p-6">
          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md w-full text-center">
            <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <LeafIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
              {t("public.plants.error.title")}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {error?.message || t("public.plants.error.message")}
            </p>
            <Button onClick={() => window.location.reload()} variant="primary">
              {t("public.plants.error.retry")}
            </Button>
          </div>
        </div>
      )}
    >
      <Suspense fallback={
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center">
          <div class="flex items-center gap-3">
            <svg class="animate-spin w-6 h-6 text-forest-600 dark:text-forest-400" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="text-lg font-medium text-forest-700 dark:text-forest-300">{t("public.plants.grid.loading")}</span>
          </div>
        </div>
      }>
        <Show when={plant()}>
          {(plant) => (
            <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
              <Title>{pageTitle()}</Title>
              <Meta name="description" content={pageDescription()} />
              <Meta property="og:title" content={pageTitle()} />
              <Meta property="og:description" content={pageDescription()} />
              <Meta property="og:type" content="product" />
              <Show when={primaryImage()}>
                <Meta property="og:image" content={primaryImage()!} />
              </Show>
              <Link rel="canonical" href={absoluteUrl(`/plants/${plant().slug}`)} />
              <HreflangLinks path={`/plants/${plant().slug}`} />
              <Show when={productJsonLd()}>
                <script type="application/ld+json">{productJsonLd()}</script>
              </Show>
              <Show when={breadcrumbJsonLd()}>
                <script type="application/ld+json">{breadcrumbJsonLd()}</script>
              </Show>

              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumb plantName={plant().name} />

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <div>
                    <ImageGallery media={displayMedia()} plantName={plant().name} mediaKey={mediaKey()} />

                    <div class="mt-6">
                      <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        {t("public.plants.detail.careAtAGlance")}
                      </h3>
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <For each={careBadges()}>
                          {(badge) => (
                            <CareBadge {...badge} />
                          )}
                        </For>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-6">
                    <div>
                      <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                          <h1 class="text-3xl font-bold text-forest-800 dark:text-cream-50 mb-1">
                            {plant().name}
                          </h1>
                          <Show when={plant().scientificName}>
                            {(name) => (
                              <p class="text-sm italic text-gray-400 dark:text-gray-500">
                                {name()}
                              </p>
                            )}
                          </Show>
                        </div>
                        <div class="flex items-center gap-2">
                          <button class="p-2.5 rounded-xl border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-800 transition-colors" aria-label="Share">
                            <ShareIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </button>
                          <button class="p-2.5 rounded-xl border border-cream-200 dark:border-forest-700 hover:bg-cream-50 dark:hover:bg-forest-800 transition-colors" aria-label="Add to wishlist">
                            <HeartIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <Show when={plant().shop}>
                        {(shop) => (
                          <A
                            href={`/shops/${shop().slug}`}
                            class="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg hover:bg-cream-50 dark:hover:bg-forest-800 transition-colors"
                          >
                            <Show when={shop().logo}>
                              {(logo) => (
                                <img
                                  src={logo().url}
                                  alt={shop().name}
                                  class="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                            </Show>
                            <span class="text-sm text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                              {shop().name}
                            </span>
                            {shop().isVerified && (
                              <CheckBadgeIcon class="w-4 h-4 text-forest-500" />
                            )}
                          </A>
                        )}
                      </Show>
                    </div>

                    <div class="flex items-end gap-4">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{t("public.plants.detail.price")}</p>
                        <p class="text-3xl font-bold text-forest-800 dark:text-cream-50">
                          {formatPrice(plantPrice())}
                        </p>
                      </div>
                      <div class="pb-1">
                        <span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                          plant().inStock
                            ? "bg-forest-100 dark:bg-forest-900/40 text-forest-700 dark:text-forest-300"
                            : "bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300"
                        }`}>
                          <span class={`w-2 h-2 rounded-full ${plant().inStock ? "bg-forest-500" : "bg-terracotta-500"}`} />
                          {plant().inStock
                            ? t("public.plants.inventory.inStockShort")
                            : t("public.plants.inventory.outOfStock")}
                        </span>
                      </div>
                    </div>

                    <Show when={plant().shortDescription}>
                      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {plant().shortDescription}
                      </p>
                    </Show>

                    <Show when={plant().variants.length > 0}>
                      <div>
                        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                          {t("public.plants.detail.selectVariant")}
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <For each={plant().variants}>
                            {(variant) => (
                              <VariantCard
                                variant={variant}
                                isSelected={selectedVariantData()?.id === variant.id}
                                onSelect={() => setSelectedVariant(variant.id)}
                              />
                            )}
                          </For>
                        </div>
                        <Show when={selectedVariantData()}>
                          {(variant) => (
                            <div class="mt-3">
                              <VariantDetail variant={variant()} />
                            </div>
                          )}
                        </Show>
                      </div>
                    </Show>

                    <div class="flex items-center gap-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                      <div class="flex items-center border border-cream-200 dark:border-forest-700 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span class="px-4 py-3 text-sm font-semibold text-forest-800 dark:text-cream-50 min-w-[3rem] text-center">
                          {quantity()}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(selectedVariantData()?.inventoryCount ?? 1, q + 1))}
                          class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <Button
                        variant="primary"
                        size="lg"
                        class="flex-1"
                        disabled={!plant().inStock || addToCartSubmission.pending}
                        onClick={() => {
                          const variantId = selectedVariantData()?.id;
                          if (!variantId) return;
                          addToCartTrigger({ variantId, quantity: quantity() });
                        }}
                      >
                        {addToCartSubmission.pending
                          ? t("public.plants.detail.adding")
                          : plant().inStock
                            ? t("public.plants.detail.addToCart")
                            : t("public.plants.inventory.outOfStock")}
                      </Button>
                    </div>

                    <Show when={plant().tags.length > 0}>
                      <div class="pt-4 border-t border-cream-200 dark:border-forest-700">
                        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                          {t("public.plants.detail.tags")}
                        </h3>
                        <div class="flex flex-wrap gap-2">
                          <For each={plant().tags}>
                            {(tag) => (
                              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 dark:bg-forest-700/60 text-cream-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                <TagIcon class="w-3 h-3" />
                                {tag.name}
                              </span>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div class="lg:col-span-2 space-y-8">
                    <Show when={plant().description}>
                      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6">
                        <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-4">
                          {t("public.plants.detail.description")}
                        </h2>
                        <div class="prose prose-sm dark:prose-invert max-w-none">
                          <For each={plant().description!.split("\n")}>
                            {(paragraph) => (
                              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
                                {paragraph}
                              </p>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>

                    <Show when={plant().careInstructions}>
                      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6">
                        <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-6">
                          {t("public.plants.detail.careInstructions")}
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CareInstructionCard
                            icon={SunIcon}
                            title={t("public.plants.detail.lightCare")}
                            description={plant().careInstructions!.lightInstructions}
                            iconColor="text-cream-600 dark:text-cream-400"
                            bgColor="bg-cream-50 dark:bg-forest-900/30"
                          />
                          <CareInstructionCard
                            icon={DropletIcon}
                            title={t("public.plants.detail.wateringGuide")}
                            description={plant().careInstructions!.wateringInstructions}
                            iconColor="text-blue-600 dark:text-blue-400"
                            bgColor="bg-blue-50 dark:bg-blue-900/20"
                          />
                          <CareInstructionCard
                            icon={CloudIcon}
                            title={t("public.plants.detail.humidityCare")}
                            description={plant().careInstructions!.humidityInstructions}
                            iconColor="text-sky-600 dark:text-sky-400"
                            bgColor="bg-sky-50 dark:bg-sky-900/20"
                          />
                          <CareInstructionCard
                            icon={BeakerIcon}
                            title={t("public.plants.detail.fertilizerSchedule")}
                            description={plant().careInstructions!.fertilizerSchedule}
                            iconColor="text-sage-600 dark:text-sage-400"
                            bgColor="bg-sage-50 dark:bg-sage-900/20"
                          />
                          <CareInstructionCard
                            icon={SproutIcon}
                            title={t("public.plants.detail.repotting")}
                            description={plant().careInstructions!.repottingFrequency}
                            iconColor="text-forest-600 dark:text-forest-400"
                            bgColor="bg-forest-50 dark:bg-forest-900/20"
                          />
                          <CareInstructionCard
                            icon={ScissorsIcon}
                            title={t("public.plants.detail.pruning")}
                            description={plant().careInstructions!.pruningNotes}
                            iconColor="text-purple-600 dark:text-purple-400"
                            bgColor="bg-purple-50 dark:bg-purple-900/20"
                          />
                          <CareInstructionCard
                            icon={ExclamationCircleIcon}
                            title={t("public.plants.detail.commonProblems")}
                            description={plant().careInstructions!.commonProblems}
                            iconColor="text-red-600 dark:text-red-400"
                            bgColor="bg-red-50 dark:bg-red-900/20"
                          />
                          <CareInstructionCard
                            icon={CalendarIcon}
                            title={t("public.plants.detail.seasonalCare")}
                            description={plant().careInstructions!.seasonalCare}
                            iconColor="text-amber-600 dark:text-amber-400"
                            bgColor="bg-amber-50 dark:bg-amber-900/20"
                          />
                        </div>
                      </div>
                    </Show>
                  </div>

                  <div class="space-y-6">
                    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6">
                      <h2 class="text-xl font-bold text-forest-800 dark:text-cream-50 mb-4">
                        {t("public.plants.detail.plantDetails")}
                      </h2>
                      <div class="space-y-0">
                        <DetailRow icon={GlobeAltIcon} label={t("public.plants.detail.origin")} value={plant().origin} />
                        <DetailRow icon={SproutIcon} label={t("public.plants.detail.growthRate")} value={plant().growthRate ? t(`public.plants.growthOptions.${plant().growthRate!.toLowerCase()}`) : null} />
                        <DetailRow icon={RulerIcon} label={t("public.plants.detail.matureHeight")} value={plant().matureHeight} />
                        <DetailRow icon={RulerIcon} label={t("public.plants.detail.matureSpread")} value={plant().matureSpread} />
                        <DetailRow icon={ThermometerIcon} label={t("public.plants.detail.temperature")} value={plant().temperatureRange} />
                        <DetailRow icon={BeakerIcon} label={t("public.plants.detail.soilType")} value={plant().soilType} />
                        <DetailRow icon={LeafIcon} label={t("public.plants.detail.commonNames")} value={plant().commonNames} valueClass="text-gray-600 dark:text-gray-300" />
                      </div>
                    </div>

                    <Show when={plant().toxicityInfo}>
                      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                        <div class="flex items-start gap-3">
                          <ExclamationCircleIcon class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 class="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                              {t("public.plants.detail.toxicityWarning")}
                            </h3>
                            <p class="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                              {plant().toxicityInfo}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Show>

                    <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6">
                      <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <ClockIcon class="w-3.5 h-3.5" />
                        <span>
                          {t("public.plants.detail.lastUpdated")}:{" "}
                          {formattedDate()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <ReviewsSection
                  summary={reviewData()?.summary}
                  reviews={
                    reviewData()?.reviews.map((review) => ({
                      id: review.id,
                      author: review.customerName,
                      rating: review.rating,
                      date: review.createdAt,
                      title: review.title ?? t("public.plants.detail.verifiedPurchaseReview"),
                      content: review.comment ?? "",
                      verified: review.isVerifiedPurchase,
                    })) ?? []
                  }
                />

              </div>
            </div>
          )}
        </Show>

        <Show when={plant() !== undefined && !plant()}>
          <HttpStatusCode code={404} />
          <Title>{formatPageTitle(t("public.plants.detail.notFoundTitle"))}</Title>
          <Meta name="robots" content="noindex, nofollow" />
          <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center px-4">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                {t("public.plants.detail.notFoundTitle")}
              </h1>
              <p class="text-gray-500 dark:text-gray-400 mt-2">
                {t("public.plants.detail.notFoundDescription")}
              </p>
              <A href="/plants" class="inline-block mt-4 text-forest-600 hover:underline">
                {t("common.plants")}
              </A>
            </div>
          </div>
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
}
