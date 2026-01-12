import { A } from "@solidjs/router";
import AuthLayout from "~/components/layouts/AuthLayout";
import { Button, Input } from "~/components/ui";

export default function VerifyAccount() {
  return (
    <AuthLayout
      title="Verify Your Account"
      subtitle="We've sent a verification code to your email"
    >
      <form class="space-y-6">
        {/* Verification Code Field */}
        <Input
          label="Verification Code"
          type="text"
          placeholder="Enter 6-digit code"
          maxlength={6}
        />

        {/* Verify Button */}
        <Button variant="primary" class="w-full" type="submit">
          Verify Account
        </Button>

        {/* Resend Code Link */}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Didn't receive the code?{" "}
          <button
            type="button"
            class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
          >
            Resend Code
          </button>
        </p>

        {/* Back to Login */}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
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
