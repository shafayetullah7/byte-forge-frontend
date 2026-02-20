import ColorSwatch from "./components/ColorSwatch";

export default function Colors() {
  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="mb-16">
          <h1 class="text-5xl font-bold text-forest-700 dark:text-sage-300 mb-4">
            ByteForge Color Palette
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Nature-inspired colors for the plant e-commerce platform
          </p>
        </div>

        {/* Forest Green */}
        <section class="mb-16">
          <div class="mb-6">
            <h2 class="text-3xl font-semibold text-forest-600 dark:text-forest-400 mb-2">
              Forest Green
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Primary Brand Color
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ColorSwatch color="forest-50" hex="#f0f7f2" />
            <ColorSwatch color="forest-100" hex="#d9ebe0" />
            <ColorSwatch color="forest-200" hex="#b3d7c1" />
            <ColorSwatch color="forest-300" hex="#8cc3a2" />
            <ColorSwatch color="forest-400" hex="#66af83" />
            <ColorSwatch color="forest-500" hex="#2d5f3f" textLight />
            <ColorSwatch color="forest-600" hex="#1e4029" textLight />
            <ColorSwatch color="forest-700" hex="#183320" textLight />
            <ColorSwatch color="forest-800" hex="#122618" textLight />
            <ColorSwatch color="forest-900" hex="#0f2515" textLight />
          </div>
        </section>

        {/* Sage Green */}
        <section class="mb-16">
          <div class="mb-6">
            <h2 class="text-3xl font-semibold text-sage-600 dark:text-sage-400 mb-2">
              Sage Green
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Accent Color</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ColorSwatch color="sage-50" hex="#f5f8f4" />
            <ColorSwatch color="sage-100" hex="#e8f0e5" />
            <ColorSwatch color="sage-200" hex="#d1e1cb" />
            <ColorSwatch color="sage-300" hex="#a8c5a0" />
            <ColorSwatch color="sage-400" hex="#7fa876" />
            <ColorSwatch color="sage-500" hex="#5d8554" textLight />
            <ColorSwatch color="sage-600" hex="#4a6a43" textLight />
            <ColorSwatch color="sage-700" hex="#3a5335" textLight />
            <ColorSwatch color="sage-800" hex="#2d4129" textLight />
            <ColorSwatch color="sage-900" hex="#1f2d1c" textLight />
          </div>
        </section>

        {/* Terracotta */}
        <section class="mb-16">
          <div class="mb-6">
            <h2 class="text-3xl font-semibold text-terracotta-600 dark:text-terracotta-400 mb-2">
              Terracotta
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Call-to-Action Color
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ColorSwatch color="terracotta-50" hex="#fef5f2" />
            <ColorSwatch color="terracotta-100" hex="#fde8e0" />
            <ColorSwatch color="terracotta-200" hex="#fbd1c1" />
            <ColorSwatch color="terracotta-300" hex="#f7b49a" />
            <ColorSwatch color="terracotta-400" hex="#e8967d" />
            <ColorSwatch color="terracotta-500" hex="#d97556" textLight />
            <ColorSwatch color="terracotta-600" hex="#b85a3d" textLight />
            <ColorSwatch color="terracotta-700" hex="#954731" textLight />
            <ColorSwatch color="terracotta-800" hex="#733829" textLight />
            <ColorSwatch color="terracotta-900" hex="#5c2d21" textLight />
          </div>
        </section>

        {/* Cream */}
        <section class="mb-20">
          <div class="mb-6">
            <h2 class="text-3xl font-semibold text-cream-500 dark:text-cream-400 mb-2">
              Cream
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Background Color
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ColorSwatch color="cream-50" hex="#fdfbf7" />
            <ColorSwatch color="cream-100" hex="#f5f1e8" />
            <ColorSwatch color="cream-200" hex="#e8dfc9" />
            <ColorSwatch color="cream-300" hex="#d9c9a8" />
            <ColorSwatch color="cream-400" hex="#c9b387" />
            <ColorSwatch color="cream-500" hex="#b89d66" />
          </div>
        </section>

        {/* Component Examples */}
        <section class="mb-16 pt-12 border-t-2 border-gray-200 dark:border-gray-700">
          <div class="mb-8">
            <h2 class="text-3xl font-semibold text-forest-600 dark:text-forest-400 mb-2">
              Component Examples
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Real-world usage of the color palette
            </p>
          </div>

          <div class="space-y-10">
            {/* Buttons */}
            <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-semibold text-forest-700 dark:text-sage-300 mb-4">
                Buttons
              </h3>
              <div class="flex flex-wrap gap-4">
                <button class="px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg font-semibold transition-colors shadow-sm">
                  Primary CTA
                </button>
                <button class="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold transition-colors shadow-sm">
                  Secondary
                </button>
                <button class="px-6 py-3 bg-transparent border-2 border-forest-600 text-forest-600 hover:bg-forest-50 dark:border-sage-400 dark:text-sage-400 dark:hover:bg-forest-800 rounded-lg font-semibold transition-colors">
                  Outline
                </button>
                <button class="px-6 py-3 bg-sage-100 hover:bg-sage-200 text-sage-700 dark:text-sage-300 dark:bg-sage-800 dark:hover:bg-sage-700 rounded-lg font-semibold transition-colors">
                  Subtle
                </button>
              </div>
            </div>

            {/* Cards */}
            <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-semibold text-forest-700 dark:text-sage-300 mb-4">
                Cards
              </h3>
              <div class="grid md:grid-cols-3 gap-6">
                <div class="p-6 bg-cream-50 dark:bg-forest-900 border-2 border-sage-200 dark:border-sage-700 rounded-lg hover:border-sage-300 dark:hover:border-sage-600 transition-colors">
                  <h4 class="text-lg font-semibold text-forest-700 dark:text-sage-300 mb-2">
                    Default Card
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Card with border styling
                  </p>
                </div>
                <div class="p-6 bg-cream-100 dark:bg-forest-900 rounded-lg shadow-sm">
                  <h4 class="text-lg font-semibold text-forest-700 dark:text-sage-300 mb-2">
                    Cream Card
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Soft background variant
                  </p>
                </div>
                <div class="p-6 bg-sage-50 dark:bg-sage-900 rounded-lg shadow-sm">
                  <h4 class="text-lg font-semibold text-forest-700 dark:text-sage-300 mb-2">
                    Sage Card
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Accent background variant
                  </p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-semibold text-forest-700 dark:text-sage-300 mb-4">
                Badges
              </h3>
              <div class="flex flex-wrap gap-3">
                <span class="px-4 py-2 bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-100 rounded-full text-sm font-medium">
                  Forest
                </span>
                <span class="px-4 py-2 bg-sage-100 text-sage-700 dark:bg-sage-700 dark:text-sage-100 rounded-full text-sm font-medium">
                  Sage
                </span>
                <span class="px-4 py-2 bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-700 dark:text-terracotta-100 rounded-full text-sm font-medium">
                  Terracotta
                </span>
                <span class="px-4 py-2 bg-cream-200 text-cream-600 dark:bg-cream-600 dark:text-cream-100 rounded-full text-sm font-medium">
                  Cream
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
