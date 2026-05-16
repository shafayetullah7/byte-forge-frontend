import { createSignal } from "solid-js";
import { EnvelopeIcon, SparklesIcon } from "~/components/icons";
import { Button } from "~/components/ui";
import { useI18n } from "~/i18n";

const benefits = [
  "New plant arrivals from verified nurseries",
  "Exclusive deals & flash sale alerts",
  "Seasonal care tips in English & Bengali",
  "Seller spotlights & success stories",
];

export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = createSignal("");
  const [submitted, setSubmitted] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (email()) {
      setSubmitted(true);
      // In production, this would POST to a newsletter API
    }
  };

  return (
    <section class="py-24 px-4 bg-white dark:bg-forest-900/50">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div class="flex items-center gap-2 mb-4">
              <SparklesIcon class="w-6 h-6 text-terracotta-500" />
              <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
                {t("landing.newsletter.label")}
              </span>
            </div>
            <h2 class="h2 mb-4">{t("landing.newsletter.title")}</h2>
            <p class="body-large text-gray-600 dark:text-gray-400 mb-8">
              {t("landing.newsletter.description")}
            </p>

            <div class="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-sage-600 dark:text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="body-base text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div class="flat-card p-10 bg-gradient-to-br from-forest-600 to-forest-800 dark:from-forest-700 dark:to-forest-900 border-0">
            {submitted() ? (
              <div class="text-center text-white">
                <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="h3 text-white mb-2">{t("landing.newsletter.success")}</h3>
                <p class="body-base text-cream-200">{t("landing.newsletter.successDesc")}</p>
              </div>
            ) : (
              <>
                <div class="flex items-center gap-3 mb-6">
                  <EnvelopeIcon class="w-6 h-6 text-sage-300" />
                  <h3 class="h3 text-white mb-0">{t("landing.newsletter.formTitle")}</h3>
                </div>

                <form onSubmit={handleSubmit} class="space-y-4">
                  <input
                    type="email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    placeholder={t("landing.newsletter.placeholder")}
                    required
                    class="w-full px-5 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none body-base transition-standard"
                  />
                  <Button
                    type="submit"
                    class="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold body-base px-8 py-4 rounded-xl transition-standard"
                  >
                    {t("landing.newsletter.subscribe")}
                  </Button>
                </form>

                <p class="body-small text-cream-300 text-center mt-4">
                  {t("landing.newsletter.privacy")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
