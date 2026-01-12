import { A } from "@solidjs/router";
import AuthLayout from "~/components/layouts/AuthLayout";
import { Button, Input } from "~/components/ui";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your ByteForge account"
    >
      <form class="space-y-6">
        {/* Email Field */}
        <Input label="Email" type="email" placeholder="you@example.com" />

        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        {/* Remember Me & Forgot Password */}
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              class="rounded border-gray-300 text-forest-600 focus:ring-forest-500"
            />
            Remember me
          </label>
          <A
            href="/forgot-password"
            class="text-sm text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300"
          >
            Forgot password?
          </A>
        </div>

        {/* Sign In Button */}
        <Button variant="primary" class="w-full" type="submit">
          Sign In
        </Button>

        {/* Sign Up Link */}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <A
            href="/register"
            class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
          >
            Create one now
          </A>
        </p>
      </form>
    </AuthLayout>
  );
}
