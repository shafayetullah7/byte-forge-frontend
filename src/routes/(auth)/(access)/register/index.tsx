import { A } from "@solidjs/router";
import { Button, Input } from "~/components/ui";

export default function Register() {
  return (
    <form class="space-y-6">
      {/* Name Field */}
      <Input label="Full Name" type="text" placeholder="John Doe" />

      {/* Email Field */}
      <Input label="Email" type="email" placeholder="you@example.com" />

      {/* Password Field */}
      <Input label="Password" type="password" placeholder="Create a password" />

      {/* Confirm Password Field */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
      />

      {/* Terms and Conditions */}
      <label class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          class="mt-0.5 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
        />
        <span>
          I agree to the{" "}
          <A
            href="/terms"
            class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
          >
            Terms of Service
          </A>{" "}
          and{" "}
          <A
            href="/privacy"
            class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
          >
            Privacy Policy
          </A>
        </span>
      </label>

      {/* Create Account Button */}
      <Button variant="primary" class="w-full" type="submit">
        Create Account
      </Button>

      {/* Sign In Link */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <A
          href="/login"
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
        >
          Sign in
        </A>
      </p>
    </form>
  );
}
