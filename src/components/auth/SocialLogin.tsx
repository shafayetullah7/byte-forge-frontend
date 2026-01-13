export default function SocialLogin() {
  return (
    <div class="mt-8">
      {/* Divider */}
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="px-4 bg-white dark:bg-forest-800 text-gray-500 dark:text-gray-400 font-medium tracking-wider">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div class="grid grid-cols-3 gap-3">
        {/* Google */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-forest-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-forest-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
          title="Continue with Google"
        >
          <img
            src="/google-brands-solid-full.svg"
            alt="Google"
            class="w-5 h-5"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            Google
          </span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-forest-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-forest-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
          title="Continue with Facebook"
        >
          <img
            src="/facebook-brands-solid-full.svg"
            alt="Facebook"
            class="w-5 h-5"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            Facebook
          </span>
        </button>

        {/* X (Twitter) */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-forest-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-forest-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
          title="Continue with X"
        >
          <img
            src="/x-twitter-brands-solid-full.svg"
            alt="X"
            class="w-5 h-5 dark:invert"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            X
          </span>
        </button>
      </div>
    </div>
  );
}
