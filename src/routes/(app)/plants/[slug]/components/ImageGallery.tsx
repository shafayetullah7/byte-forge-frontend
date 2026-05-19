import { For, Show, createSignal, createMemo, createEffect, on, type Component } from "solid-js";
import type { PublicPlantMedia } from "~/lib/api/types/public/plants.types";
import { ChevronLeftIcon, ChevronRightIcon, ImageIcon } from "~/components/icons";

const ImageGallery: Component<{
  media: PublicPlantMedia[];
  plantName: string;
  mediaKey: string;
}> = (props) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);

  createEffect(
    on(
      () => props.mediaKey,
      () => {
        setCurrentIndex(0);
      }
    )
  );

  const images = createMemo(() => props.media, { equals: false });

  const currentImage = createMemo(() => images()[currentIndex()]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images().length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images().length - 1 ? 0 : prev + 1));
  };

  return (
    <div class="space-y-4">
      <div class="relative w-full aspect-square bg-cream-100 dark:bg-forest-900/50 rounded-2xl overflow-hidden">
        <Show
          when={currentImage()?.url}
          fallback={
            <div class="absolute inset-0 flex items-center justify-center">
              <ImageIcon class="w-24 h-24 text-gray-300 dark:text-gray-600" />
            </div>
          }
        >
          <img
            src={currentImage()!.url}
            alt={props.plantName}
            class="w-full h-full object-cover"
          />
        </Show>

        <Show when={images().length > 1}>
          <button
            onClick={goToPrev}
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-forest-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-forest-800 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeftIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={goToNext}
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-forest-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-forest-800 transition-colors"
            aria-label="Next image"
          >
            <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <div class="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs text-white font-medium">
            {currentIndex() + 1}/{images().length}
          </div>
        </Show>
      </div>

      <Show when={images().length > 1}>
        <div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
          <For each={images()}>
            {(media, index) => (
              <button
                onClick={() => setCurrentIndex(index())}
                class={`aspect-square rounded-xl border-2 overflow-hidden transition-all flex items-center justify-center ${
                  currentIndex() === index()
                    ? "border-forest-500 dark:border-forest-400 shadow-md ring-2 ring-forest-500/20"
                    : "border-cream-200 dark:border-forest-700 hover:border-forest-400 dark:hover:border-forest-500"
                }`}
                aria-label={`Go to image ${index() + 1}`}
              >
                {media.url ? (
                  <img src={media.url} alt={props.plantName} class="w-full h-full object-cover" />
                ) : (
                  <ImageIcon class="w-6 h-6 text-gray-400 dark:text-gray-500" />
                )}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default ImageGallery;
