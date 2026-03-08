import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

export function Hero() {
    const { t } = useI18n();

    return (
        <div class="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
            {/* ... background remains same ... */}
            <div
                class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-200 dark:opacity-70 dark:brightness-[0.8]"
                style={{ "background-image": "url('/bg-2.webp')" }}
            >
                {/* Brand-tinted overlay for better text contrast */}
                <div class="absolute inset-0 bg-forest-900/30 dark:bg-forest-950/60 transition-colors duration-200"></div>
            </div>

            {/* Content Container - pt-16 accounts for overlapping Navbar layer */}
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-16">
                <h1 class="h1 text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {t("common.hero.title")}
                </h1>

                <p class="body-large text-cream-100 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    {t("common.hero.subtitle")}
                </p>

                {/* Buttons */}
                <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <LinkButton
                        href="/plants"
                        size="lg"
                        variant="primary"
                        class="w-full sm:w-auto"
                    >
                        {t("common.hero.shopNow")}
                    </LinkButton>
                    <LinkButton
                        href="/about"
                        variant="outline"
                        size="lg"
                        class="w-full sm:w-auto !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/60"
                    >
                        {t("common.hero.learnMore")}
                    </LinkButton>
                </div>

                {/* Social Proof / Stats */}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-10 w-full max-w-4xl animate-in fade-in duration-1000 delay-300">
                    <div class="text-center group">
                        <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">500+</div>
                        <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">Plant Species</div>
                    </div>
                    <div class="text-center group">
                        <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">10k+</div>
                        <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">Happy Customers</div>
                    </div>
                    <div class="text-center group">
                        <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">4.9/5</div>
                        <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">Average Rating</div>
                    </div>
                    <div class="text-center group">
                        <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">24/7</div>
                        <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">Support</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Optional but nice */}
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
                <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
                    <div class="w-1 h-3 bg-white/80 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
