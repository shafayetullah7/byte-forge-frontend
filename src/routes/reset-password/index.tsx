import AuthLayout from "~/components/layouts/AuthLayout";
import { Button, Input } from "~/components/ui";

export default function ResetPassword() {
  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <form class="space-y-6">
        {/* New Password Field */}
        <div>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        {/* Confirm New Password Field */}
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
        />

        {/* Reset Password Button */}
        <Button variant="primary" class="w-full" type="submit">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
