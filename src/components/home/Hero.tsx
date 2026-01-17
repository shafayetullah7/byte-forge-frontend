import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { Button } from "~/components/ui";

export function Hero() {
    const { t } = useI18n();

    return (
        <div class="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ "background-image": "url('/hero-bg.png')" }}
            >
                <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Content Card with Glassmorphism */}
            <div class="relative z-10 max-w-4xl mx-4 p-8 md:p-12 text-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
                    ByteForge
                    <span class="block mt-2 text-2xl md:text-4xl font-light text-white/90">
                        {t("common.hero.title")}
                    </span>
                </h1>

                <p class="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                    {t("common.hero.subtitle")}
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <A href="/plants">
                        <Button
                            size="lg"
                            class="bg-forest-500 hover:bg-forest-600 text-white font-semibold px-8 py-4 text-lg border-none shadow-lg shadow-forest-500/30 hover:shadow-forest-500/50 hover:-translate-y-1 transition-all duration-300"
                        >
                            {t("common.hero.shopNow")}
                        </Button>
                    </A>
                    <A href="/about">
                        <Button
                            variant="outline"
                            size="lg"
                            class="border-white/40 text-white hover:bg-white/15 hover:border-white/60 font-semibold px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
                        >
                            {t("common.hero.learnMore")}
                        </Button>
                    </A>
                </div>
            </div>

            {/* Scroll indicator */}
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
}
