export default function AboutPage() {
  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-5xl font-bold text-gradient-brand mb-6">
          About ByteForge
        </h1>

        <div class="bg-white dark:bg-forest-800 rounded-xl p-8 shadow-lg space-y-6">
          <section>
            <h2 class="text-2xl font-semibold text-forest-700 dark:text-sage-300 mb-3">
              Our Mission
            </h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              ByteForge is dedicated to bringing nature into every home. We
              believe that plants not only beautify spaces but also improve
              well-being and air quality.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-forest-700 dark:text-sage-300 mb-3">
              What We Do
            </h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              We connect plant enthusiasts with local shops and provide a
              platform for discovering, learning about, and purchasing plants.
              Our marketplace makes it easy to find the perfect green companion
              for your space.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-forest-700 dark:text-sage-300 mb-3">
              Our Values
            </h2>
            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Sustainability and eco-friendly practices</li>
              <li>Supporting local plant shops and growers</li>
              <li>Education and community building</li>
              <li>Quality and customer satisfaction</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
