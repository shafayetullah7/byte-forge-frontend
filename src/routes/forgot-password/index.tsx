import { A } from "@solidjs/router";
import AuthLayout from "~/components/layouts/AuthLayout";
import { Button, Input } from "~/components/ui";

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form class="space-y-6">
        {/* Email Field */}
        <Input label="Email" type="email" placeholder="you@example.com" />

        {/* Send Reset Link Button */}
        <Button variant="primary" class="w-full" type="submit">
          Send Reset Link
        </Button>

        {/* Back to Sign In Link */}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <A
            href="/login"
            class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
          >
            Back to Sign In
          </A>
        </p>
      </form>
    </AuthLayout>
  );
}
