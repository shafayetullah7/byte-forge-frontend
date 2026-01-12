import { Fa } from "solid-fa";
import {
  faGoogle,
  faFacebook,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

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
          <Fa
            icon={faGoogle}
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            Google
          </span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#0C63D4] border-2 border-[#1877F2] hover:border-[#0C63D4] rounded-lg transition-all duration-200"
          title="Continue with Facebook"
        >
          <Fa icon={faFacebook} class="w-5 h-5 text-white" />
          <span class="text-sm font-medium text-white hidden sm:inline">
            Facebook
          </span>
        </button>

        {/* X (Twitter) */}
        <button
          type="button"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-gray-900 border-2 border-black hover:border-gray-900 rounded-lg transition-all duration-200"
          title="Continue with X"
        >
          <Fa icon={faXTwitter} class="w-5 h-5 text-white" />
          <span class="text-sm font-medium text-white hidden sm:inline">X</span>
        </button>
      </div>
    </div>
  );
}
