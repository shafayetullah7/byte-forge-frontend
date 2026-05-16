import { StarIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

const testimonials = [
  {
    name: "Fatima Rahman",
    role: "Plant Enthusiast, Dhaka",
    text: "ByteForge made it so easy to find rare Monstera varieties. The care guides helped me keep my plants thriving. Best plant marketplace in Bangladesh!",
    rating: 5,
    avatar: "FR",
    avatarColor: "bg-forest-500",
  },
  {
    name: "Rahim Uddin",
    role: "Shop Owner, Sylhet",
    text: "I've tripled my nursery sales since joining ByteForge. The seller tools are powerful yet simple. My shop reaches customers I could never access before.",
    rating: 5,
    avatar: "RU",
    avatarColor: "bg-terracotta-500",
  },
  {
    name: "Nadia Akter",
    role: "Interior Designer, Chittagong",
    text: "The bilingual support is amazing — my clients can browse in Bengali. The quality of plants delivered is consistently excellent. Highly recommended!",
    rating: 5,
    avatar: "NA",
    avatarColor: "bg-sage-500",
  },
];

export function Testimonials() {
  const { t } = useI18n();

  return (
    <section class="py-24 px-4 bg-white dark:bg-forest-900/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
            {t("landing.testimonials.label")}
          </span>
          <h2 class="h2 mt-3 mb-4">{t("landing.testimonials.title")}</h2>
          <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.testimonials.description")}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div class="flat-card flat-card-hover p-8 flex flex-col">
              {/* Stars */}
              <div class="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map(() => (
                  <StarIcon class="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p class="body-base text-gray-700 dark:text-gray-300 leading-relaxed flex-grow mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div class="flex items-center gap-3 pt-6 border-t border-cream-200 dark:border-forest-700">
                <div class={`w-12 h-12 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-white font-bold body-small flex-shrink-0`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div class="h6 mb-0">{testimonial.name}</div>
                  <div class="body-small text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
