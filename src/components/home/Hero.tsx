import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { Button } from "~/components/ui";

export function Hero() {
    const { t } = useI18n();

    return (
        <div class="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ "background-image": "url('/bg-2.webp')" }}
            >
                {/* Subtle overlay to ensure text contrast without killing the vibe */}
                <div class="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content Container */}
            <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Tagline / Welcome Text */}
                {/* <span class="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium tracking-wider mb-6 border border-white/30 uppercase">
                    Welcome to GreenHaven
                </span> */}

                {/* Main Heading */}
                <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
                    {t("common.hero.title")}
                </h1>

                {/* Subtitle */}
                <p class="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                    {t("common.hero.subtitle")}
                </p>

                {/* Buttons */}
                <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
                    <A href="/plants" class="w-full sm:w-auto">
                        <Button
                            size="lg"
                            class="w-full font-semibold px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {t("common.hero.shopNow")}
                        </Button>
                    </A>
                    <A href="/about" class="w-full sm:w-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            class="w-full font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-none"
                        >
                            {t("common.hero.learnMore")}
                        </Button>
                    </A>
                </div>

                {/* Social Proof / Stats */}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/20 pt-8 w-full max-w-4xl">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-white mb-1">500+</div>
                        <div class="text-sm text-gray-200 font-medium">Plant Species</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-white mb-1">10k+</div>
                        <div class="text-sm text-gray-200 font-medium">Happy Customers</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-white mb-1">4.9/5</div>
                        <div class="text-sm text-gray-200 font-medium">Average Rating</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-white mb-1">24/7</div>
                        <div class="text-sm text-gray-200 font-medium">Expert Support</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Optional but nice */}
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
                    <div class="w-1 h-3 bg-white/80 rounded-full animate-scroll"></div>
                </div>
            </div>
        </div>
    );
}
