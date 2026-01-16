import { useNavigate, revalidate } from "@solidjs/router";
import { createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { verifySchema, type VerifyFormData } from "~/schemas/verify.schema";
import { authApi, ApiError } from "~/lib/api";
import { useSession } from "~/lib/auth";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const user = useSession();

  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [resendStatus, setResendStatus] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  // Timer State
  const [expiresAt, setExpiresAt] = createSignal<Date | null>(null);
  const [timeLeft, setTimeLeft] = createSignal<string>("");
  const [canResend, setCanResend] = createSignal(false);

  // Auto-redirect if verified (Error-Driven State Sync)
  createEffect(() => {
    if (user()?.emailVerified) {
      navigate("/", { replace: true });
    }
  });

  // Countdown Logic
  const updateTimer = () => {
    const expiry = expiresAt();
    if (!expiry) return;

    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft("Expired");
      setCanResend(true);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);

    // Allow resend if < 14 mins left (1 min cooldown from start) or if expired logic handled differently
    // Actually, user requested 60s cooldown.
  };

  // Cooldown Logic
  const [cooldown, setCooldown] = createSignal(0);

  createEffect(() => {
    if (cooldown() > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
      onCleanup(() => clearInterval(timer));
    }
  });

  createEffect(() => {
    if (expiresAt()) {
      const timer = setInterval(updateTimer, 1000);
      onCleanup(() => clearInterval(timer));
      updateTimer(); // Initial call
    }
  });

  const handleConflict = () => {
    // If we get a 409, it means we are already verified.
    // Trigger a revalidation of the session.
    // The createEffect above will catch 'user().emailVerified' and redirect.
    console.log("Conflict detected (Already Verified). Revalidating session...");
    revalidate("user-session");
  };

  const initVerification = async () => {
    setErrorMessage(null);
    setResendStatus("sending");
    try {
      const response = await authApi.sendVerificationEmail();
      if (response.success && response.data?.expiresAt) {
        setExpiresAt(new Date(response.data.expiresAt));
        setCooldown(60); // 60s cooldown
        setResendStatus("sent");
        setTimeout(() => setResendStatus(null), 5000);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          handleConflict();
          return;
        }
        setErrorMessage(error.message);
      }
      setResendStatus(null);
    }
  };

  onMount(() => {
    // Auto-trigger on mount
    if (user() && !user()?.emailVerified) {
      initVerification();
    }
  });

  const [verifyForm, { Form, Field }] = createForm<VerifyFormData>({
    validate: (values) => {
      const result = verifySchema.safeParse(values);
      if (result.success) {
        return {};
      }
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path.join(".")] = issue.message;
        }
      });
      return errors;
    },
  });

  const handleSubmit = async (values: VerifyFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await authApi.verifyEmail({
        otp: values.otp,
      });

      if (response.success) {
        // Successful verification
        // Revalidate session to ensure UI updates immediately
        revalidate("user-session");
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          handleConflict();
          return;
        }
        setErrorMessage(
          error.message || "Verification failed. Please check the code."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown() > 0) return;
    await initVerification();
  };

  return (
    <Form onSubmit={handleSubmit} class="space-y-6">
      {/* Error Message Display */}
      {errorMessage() && (
        <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
        </div>
      )}

      {/* Success/Info Message */}
      <div class="text-center space-y-2">
        {timeLeft() && (
          <p class="text-sm font-medium text-forest-600 dark:text-sage-400 bg-forest-50 dark:bg-forest-900/20 py-1 px-3 rounded-full inline-block">
            Code expires in {timeLeft()}
          </p>
        )}
        {resendStatus() === "sent" && (
          <p class="text-sm text-green-600 dark:text-green-400 animate-fade-in">
            New code sent!
          </p>
        )}
      </div>

      {/* Verification Code Field */}
      <Field name="otp">
        {(field, props) => (
          <div>
            <Input
              {...props}
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              maxlength={6}
              value={field.value || ""}
              required
              disabled={isSubmitting()}
              autocomplete="one-time-code"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {field.error}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Verify Button */}
      <Button
        variant="primary"
        class="w-full"
        type="submit"
        disabled={isSubmitting()}
      >
        {isSubmitting() ? "Verifying..." : "Verify Account"}
      </Button>

      {/* Resend Code Link */}
      <div class="text-center space-y-2">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={isSubmitting() || resendStatus() === "sending" || cooldown() > 0}
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {resendStatus() === "sending"
            ? "Sending..."
            : cooldown() > 0
              ? `Resend available in ${cooldown()}s`
              : "Resend Code"}
        </button>
      </div>

      {/* Back to Login */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
        {/* Logout Option */}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={async () => {
              const { performLogout } = await import("~/lib/auth");
              await performLogout();
              navigate("/login");
            }}
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Not you? Logout
          </button>
        </p>
      </p>
    </Form>
  );
}
