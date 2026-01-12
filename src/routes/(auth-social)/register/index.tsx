import { A } from "@solidjs/router";
import AuthLayout from "~/components/layouts/AuthLayout";
import { Button, Input } from "~/components/ui";

export default function Register() {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join ByteForge and start your gardening journey"
    >
      <form class="space-y-6">
        {/* Name Fields */}
        <div class="grid grid-cols-2 gap-4">
          <Input label="First Name" type="text" placeholder="John" />
          <Input label="Last Name" type="text" placeholder="Doe" />
        </div>

        {/* Email Field */}
        <Input label="Email" type="email" placeholder="you@example.com" />

        {/* Password Field */}
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        {/* Confirm Password Field */}
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
        />

        {/* Terms & Conditions */}
        <label class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            class="mt-0.5 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
          />
          <span>
            I accept the{" "}
            <a
              href="#"
              class="text-forest-600 dark:text-sage-400 hover:underline"
            >
              terms and conditions
            </a>
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
    </AuthLayout>
  );
}
